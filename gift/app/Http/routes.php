<?php
/**
 * Created by PhpStorm.
 * User: Gold  Starkyg
 * Date: 11/10/2017
 * Time: 12:29 AM
 */
Route::post('/frontend/sign', array('uses'=>'Frontend\UserController@login'));
Route::post('/frontend/signup', array('uses'=>'Frontend\UserController@signup'));

Route::get('/', function () {
    return Redirect::to('/' . config('app.frontend_url'));
});

Route::group(['middleware' => ['web']],  function () {
    Route::get('/' . config('app.frontend_url'), 'Frontend\FrontendController@index');
});

Route::group(['prefix' => 'frontend/', 'middleware' => ['api_auth_group']],  function () {
    Route::any('/user/list', 'Frontend\UserController@getUserList');
    Route::any('/user/delete', 'Frontend\UserController@deleteUser');
    Route::any('user/active', 'Frontend\UserController@activeUser');
    Route::any('user/lock', 'Frontend\UserController@lockUser');
    Route::any('user/resume', 'Frontend\UserController@resumeUser');
    Route::any('user/remove', 'Frontend\UserController@removeUser');

    //photo
    Route::any('/photo/list', 'Frontend\PhotoController@getPhotoList');
    Route::any('/photo/remove', 'Frontend\PhotoController@removePhoto');
    Route::any('/photo/removecomment', 'Frontend\PhotoController@removeComment');

});

