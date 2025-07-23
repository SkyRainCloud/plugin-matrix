<?php
namespace App\Providers;

use Illuminate\Support\Facades\Route;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;

class PluginMetricsRouteProvider extends ServiceProvider
{
    public function boot()
    {
        parent::boot();
    }

    public function map()
    {
        Route::middleware(['api', 'client-api'])
            ->prefix('api/client')
            ->group(function () {
                Route::get('servers/{server}/plugin-metrics', 'App\Http\Controllers\Api\Client\PluginMetricsController@index');
                Route::post('servers/{server}/plugin-metrics', 'App\Http\Controllers\Api\Client\PluginMetricsController@store');
                Route::get('servers/{server}/plugin-alerts', 'App\Http\Controllers\Api\Client\PluginAlertsController@index');
                Route::post('servers/{server}/plugin-alerts', 'App\Http\Controllers\Api\Client\PluginAlertsController@store');
            });
    }
}