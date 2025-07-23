<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Client\PluginMetricsController;
use App\Http\Controllers\Api\Client\PluginAlertsController;

Route::group(['prefix' => 'client', 'middleware' => ['client-api']], function () {
    Route::get('servers/{server}/plugin-metrics', [PluginMetricsController::class, 'index']);
    Route::post('servers/{server}/plugin-metrics', [PluginMetricsController::class, 'store']);
    Route::get('servers/{server}/plugin-alerts', [PluginAlertsController::class, 'index']);
    Route::post('servers/{server}/plugin-alerts', [PluginAlertsController::class, 'store']);
});