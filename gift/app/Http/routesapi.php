<?php
/**
 * Created by PhpStorm.
 * User: Gold Starkyg
 * Date: 11/10/2017
 * Time: 12:28 AM
 */
Route::post('/api/signin', array('uses'=>'Api\UserController@login'));
Route::post('/api/signup', array('uses'=>'Api\UserController@signup'));
Route::post('/api/active', array('uses'=>'Api\UserController@active'));

Route::group(['prefix' => 'api/', 'middleware' => ['api_mobile_group']],  function () {
	//photo
	Route::any('/photo/addphoto', 'Api\PhotoController@addPhoto');
	Route::any('/photo/addlikes', 'Api\PhotoController@addLikes');
	Route::any('/photo/addcomment', 'Api\PhotoController@addComment');

});