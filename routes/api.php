<?php


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('projects', 'ProjectController@index');
Route::get('projects/completed', 'ProjectController@showCompleted');
Route::get('projects/active', 'ProjectController@showActive');
Route::get('projects/clearCompeleted/{id}', 'ProjectController@clearCompeleted');
Route::post('projects', 'ProjectController@store');
Route::get('projects/{id}', 'ProjectController@show');
Route::put('projects/{project}', 'ProjectController@markAsCompleted');
