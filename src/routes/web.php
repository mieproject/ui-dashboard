<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

use Illuminate\Support\Facades\Route;
use MieProject\UIDashboard\Controllers\LanguageController;
use MieProject\UIDashboard\Controllers\PageController;

Route::group(['namespace' => 'MieProject\UIDashboard\Controllers','as'=>'admin.','middleware'=>'web'], function() {
    Route::get('/tst', [PageController::class, 'blankPage']);

    Route::get('/page-blank', [PageController::class, 'blankPage']);
    Route::get('/page-collapse', [PageController::class, 'collapsePage']);

    // locale route
    Route::get('lang/{locale}', [LanguageController::class, 'swap']);
});
