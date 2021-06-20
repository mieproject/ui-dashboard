<?php

namespace MieProject\Settings\Models;

use Illuminate\Support\Collection;
use Illuminate\Database\Eloquent\Model;


class Setting extends Model
{
    protected $guarded = [];

    /**
     * Add a settings value
     *
     * @param $key
     * @param $val
     * @param string $type
     * @return bool
     */
    public static function add($key, $val, $type = 'string')
    {
        if (is_array($val)) {
            $langs = $val;
            if (is_array($langs)) {
                foreach ($langs as $lang => $value) {
                    if (self::has($key, $lang)) {
                        self::set($key, $value, $type, $lang);
                        unset($langs[$lang]);
                    }
                }
            }
            if (is_array($langs)) {
                $create = [];
                foreach ($langs as $lang => $value) {
                    $create[] = ['name' => $key, 'val' => $value, 'type' => $type, 'language' => $lang];
                }
                return self::insert($create) ? $val : false;
            }
        }


        if (self::has($key)) {
            return self::set($key, $val, $type);
        }

        return self::create(['name' => $key, 'val' => $val, 'type' => $type]) ? $val : false;
    }

    /**
     * Get a settings value
     *
     * @param $key
     * @param null $lang
     * @param null $default
     * @return bool|int|mixed
     */
    public static function get($key, $lang = null, $default = null)
    {

        $setting = false;
        if ($lang == null) $lang= app()->getLocale();
        if (self::has($key, $lang)) {
            $setting = self::getAllSettings()->where('name', $key)->where('language', $lang)->first();
        }elseif (self::has($key)){
            $setting = self::getAllSettings()->where('name', $key)->first();
        }
        if ($setting) return self::castValue($setting->val, $setting->type);

        return self::getDefaultValue($key, $default, $lang);
    }

    /**
     * Set a value for setting
     *
     * @param $key
     * @param $val
     * @param string $type
     * @param null $lang
     * @return bool
     */
    public static function set($key, $val, $type = 'string', $lang = null)
    {
        if ($setting = self::getAllSettings()->where('name', $key)->where('language', $lang)->first()) {
            return $setting->update([
                'name' => $key,
                'val' => $val,
                'type' => $type,
                'language' => $lang,
            ]) ? $val : false;
        }

        return self::add($key, $val, $type);
    }

    /**
     * Remove a setting
     *
     * @param $key
     * @param null $lang
     * @return bool
     */
    public static function remove($key, $lang = null)
    {
        if (self::has($key)) {
            return self::whereName($key)->where('language', $lang)->delete();
        }

        return false;
    }

    /**
     * Check if setting exists
     *
     * @param $key
     * @param null $lang
     * @return bool
     */
    public static function has($key, $lang = null): bool
    {
        return (boolean)self::getAllSettings()
            ->where('name', $key)
            ->where('language', $lang)
            ->count();
    }

    /**
     * Get the validation rules for setting fields
     *
     * @return array
     */
    public static function getValidationRules()
    {
        $return = [];
        $rules = self::getDefinedSettingFields()
            ->reject(function ($val) {
                return is_null($val);
            });


        foreach ($rules as $key => $rule){
            $return[$rule['name'] .(is_array($rule['label'])?'.*':'' ) ] = $rule['rules'];
            $return[$rule['name']] = $rule['rules'];
        }


        return $return;
    }

    /**
     * Get the data type of a setting
     *
     * @param $field
     * @return mixed
     */
    public static function getDataType($field)
    {
        $type = self::getDefinedSettingFields()
            ->pluck('data', 'name')
            ->get($field);

        return is_null($type) ? 'string' : $type;
    }

    /**
     * Get default value for a setting
     *
     * @param $field
     * @return mixed
     */
    public static function getDefaultValueForField($field, $lang = null)
    {
        if ($lang == null) $lang = app()->getLocale();

        $DefinedSetting = self::getDefinedSettingFields()
            ->pluck('value', 'name');
//        ->get($field);
        $DefinedSetting = $DefinedSetting->map(function ($item, $key) use ($lang) {
            return is_array($item) ? $item[$lang] : $item;
        })->get($field);

        return $DefinedSetting;
    }

    /**
     * Get default value from config if no value passed
     *
     * @param $key
     * @param $default
     * @param null $lang
     * @return mixed
     */
    private static function getDefaultValue($key, $default, $lang = null)
    {
        return is_null($default) ? self::getDefaultValueForField($key, $lang) : $default;
    }

    /**
     * Get all the settings fields from config
     *
     * @return Collection
     */
    private static function getDefinedSettingFields()
    {

        return collect(config('setting_fields'))->pluck('elements')->flatten(1);
    }

    /**
     * caste value into respective type
     *
     * @param $val
     * @param $castTo
     * @return bool|int
     */
    private static function castValue($val, $castTo)
    {
        switch ($castTo) {
            case 'int':
            case 'integer':
                return intval($val);
                break;
            case 'json':
                return (explode(',', $val));
                break;

            case 'bool':
            case 'boolean':
                return boolval($val);
                break;

            default:
                return $val;
        }
    }

    /**
     * Get all the settings
     *
     * @return mixed
     */
    public static function getAllSettings()
    {
        return self::all();
    }
}
