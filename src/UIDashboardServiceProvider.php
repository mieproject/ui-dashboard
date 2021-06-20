<?php

namespace MieProject\UIDashboard;

use Illuminate\Support\ServiceProvider;

class UIDashboardServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        require_once __DIR__ . '/helpers.php';

        $this->commands([
            InstallCommand::class,
        ]);

        $this->publishes([
            __DIR__.'/config/uidashboard.php' => config_path('uidashboard.php'),
        ]);
        $this->mergeConfigFrom(
            __DIR__.'/config/uidashboard.php' , 'uidashboard'
        );

        $this->loadViewsFrom(__DIR__.'/views', 'mie-ui');
        $this->loadRoutesFrom(__DIR__."/routes/web.php");
        $this->loadMigrationsFrom(__DIR__.'/migrations');

    }

    /**
     * Get the services provided by the provider.
     *
     * @return array
     */
    public function provides(): array
    {
        return [InstallCommand::class];
    }
}
