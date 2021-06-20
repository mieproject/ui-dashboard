<?php

namespace MieProject\UIDashboard;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Str;
use Symfony\Component\Process\Process;

class InstallCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ui-dashboard:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Install the Dashboard resources';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {

        // NPM Packages...
        $this->updateNodePackages(function ($packages) {
            return [
                    "cross-env" =>"^5.1",
                    "jquery" =>"^3.2",
                    "mixin-loader" =>"^2.0.3",
                    "popper.js" =>"^1.12",
                    "resolve-url-loader" =>"^2.3.1",
                    "rtlcss" =>"^2.4.1",
                    "sass" =>"^1.15.2",
                    "sass-loader" =>"^7.1.0",
                    "vue-template-compiler" =>"^2.6.11",
                    "compass" =>"^0.1.1",
                    "firebase" =>"^8.2.2",
                    "sass-mixins" =>"^0.13.0",
                    "@popperjs/core"=> "^2.9.2",
                    "bootstrap"=> "^5.0.1",
                ] + $packages;
        });


        // Resources...
        (new Filesystem)->ensureDirectoryExists(base_path('resources'));
        (new Filesystem)->copyDirectory(__DIR__.'/resources', resource_path());

        // Controllers...
//        (new Filesystem)->ensureDirectoryExists(app_path('Http/Controllers/Auth'));
//        (new Filesystem)->copyDirectory(__DIR__.'/../../stubs/default/App/Http/Controllers/Auth', app_path('Http/Controllers/Auth'));

        // Requests...
//        (new Filesystem)->ensureDirectoryExists(app_path('Http/Requests/Auth'));
//        (new Filesystem)->copyDirectory(__DIR__.'/../../stubs/default/App/Http/Requests/Auth', app_path('Http/Requests/Auth'));

        // NPM Requirements...
        copy(__DIR__.'/stubs/webpack.mix.js', base_path('webpack.mix.js'));
//        copy(__DIR__.'/stubs/pa', app_path('webpack.mix.js'));



        // "Dashboard" Route...
//        $this->replaceInFile('/home', '/dashboard', resource_path('views/welcome.blade.php'));
//        $this->replaceInFile('Home', 'Dashboard', resource_path('views/welcome.blade.php'));
//        $this->replaceInFile('/home', '/dashboard', app_path('Providers/RouteServiceProvider.php'));


        $this->info('MIE UI Dashboard scaffolding installed successfully.');
        $this->comment('Please execute the "npm install && npm run dev" command to build your assets.');
    }


    /**
     * Installs the given Composer Packages into the application.
     *
     * @param  mixed  $packages
     * @return void
     */
    protected function requireComposerPackages($packages)
    {
        $composer = $this->option('composer');

        if ($composer !== 'global') {
            $command = ['php', $composer, 'require'];
        }

        $command = array_merge(
            $command ?? ['composer', 'require'],
            is_array($packages) ? $packages : func_get_args()
        );

        (new Process($command, base_path(), ['COMPOSER_MEMORY_LIMIT' => '-1']))
            ->setTimeout(null)
            ->run(function ($type, $output) {
                $this->output->write($output);
            });
    }

    /**
     * Update the "package.json" file.
     *
     * @param  callable  $callback
     * @param  bool  $dev
     * @return void
     */
    protected static function updateNodePackages(callable $callback, $dev = true)
    {
        if (! file_exists(base_path('package.json'))) {
            return;
        }

        $configurationKey = $dev ? 'devDependencies' : 'dependencies';

        $packages = json_decode(file_get_contents(base_path('package.json')), true);

        $packages[$configurationKey] = $callback(
            array_key_exists($configurationKey, $packages) ? $packages[$configurationKey] : [],
            $configurationKey
        );

        ksort($packages[$configurationKey]);

        file_put_contents(
            base_path('package.json'),
            json_encode($packages, JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT).PHP_EOL
        );
    }

    /**
     * Delete the "node_modules" directory and remove the associated lock files.
     *
     * @return void
     */
    protected static function flushNodeModules()
    {
        tap(new Filesystem, function ($files) {
            $files->deleteDirectory(base_path('node_modules'));

            $files->delete(base_path('yarn.lock'));
            $files->delete(base_path('package-lock.json'));
        });
    }

    /**
     * Replace a given string within a given file.
     *
     * @param  string  $search
     * @param  string  $replace
     * @param  string  $path
     * @return void
     */
    protected function replaceInFile($search, $replace, $path)
    {
        file_put_contents($path, str_replace($search, $replace, file_get_contents($path)));
    }
}
