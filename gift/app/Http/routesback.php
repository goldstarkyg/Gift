<?php
/**
 * Created by PhpStorm.
 * User: Gold  Starkyg
 * Date: 11/10/2017
 * Time: 12:29 AM
 */
Route::post('/backend/sign', array('uses'=>'Backend\UserController@login'));

Route::get('/', function () {
    return Redirect::to('/' . config('app.backend_url'));
});

Route::group(['middleware' => ['web']],  function () {
    Route::get('/' . config('app.backend_url'), 'Backend\FrontendController@index');
});

Route::group(['prefix' => 'backend/', 'middleware' => ['api_auth_group']],  function () {
    Route::any('/user/list', 'Backend\UserController@getUserList');
    Route::any('/user/delete', 'Backend\UserController@deleteUser');
    Route::any('user/active', 'Backend\UserController@activeUser');
    Route::any('user/lock', 'Backend\UserController@lockUser');
    Route::any('user/resume', 'Backend\UserController@resumeUser');
    Route::any('user/remove', 'Backend\UserController@removeUser');

    //photo
    Route::any('/photo/list', 'Backend\PhotoController@getPhotoList');
    Route::any('/photo/remove', 'Backend\PhotoController@removePhoto');
    Route::any('/photo/removecomment', 'Backend\PhotoController@removeComment');
    
});

