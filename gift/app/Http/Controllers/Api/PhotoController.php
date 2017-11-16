<?php

namespace App\Http\Controllers\Api;

use App\Models\PhotoTransaction;
use App\Models\Photo;
use App\Modules\Functions;
use App\Modules\UUID;

use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\Config;


use App\Http\Controllers\Controller;
use DB;
use Response;
use Redis;

class PhotoController extends Controller
{
   
    //add photo
    function addPhoto(Request $request) {
        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $input = $request->except('photo','access_token');
        $auth_id = $request->get('auth_id','0');
        $input['user_id'] = $auth_id;

        if ($file = $request->file('photo')) {
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $folderName = '/photopage/img/photo/';
            $destinationPath = public_path() . $folderName;
            $safeName = str_random(10) . '.' . $extension;
            $file->move($destinationPath, $safeName);
            $input['photo'] = '/photopage/img/photo/'.$safeName;
        }

        DB::table('photo')->insert($input);        
        $photo_id = DB::table('photo')->max('id');

        $inform = array();
        $inform['client_ip'] = Functions::get_client_ip();
        PhotoTransaction::saveTransaction($photo_id, $auth_id,'addphoto', json_encode($inform)); //transaction
        $photo = Photo::find($photo_id);

        $ret['code'] = '200';
        $ret['user'] = $photo;
        $ret['message'] = 'The photo was saved successfully.';
        return Response::json($ret);
    }

    //add likes
    function addLikes(Request $request) {
        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $photo_id = $request->get('photo_id','0');
        $user_id = $request->get('auth_id','0');

        $input = array();
        $input['photo_id'] = $photo_id;
        $input['user_id'] = $user_id;

        $query = DB::table('photo_likes')
            ->where('photo_id', $photo_id)
            ->where('user_id', $user_id);

        $likes_query = clone $query;
        $likes = $likes_query
            ->select(DB::raw('*'))
            ->first(); 

        if(empty($likes)) {
            $likes = DB::table('photo_likes')->insert($input);
        }
        else {
            $likes_delete = clone $query;
            $delete = $likes_delete->delete();                
        }
        
        $likes_count = $query = DB::table('photo_likes')->where('photo_id', $photo_id)->count();

        $ret = array();
        $ret['code'] = '200';
        $ret['likes_count'] = $likes_count;
        $ret['message'] = 'Likes count was updated!';
        return Response::json($ret);
    }

    //add comment
    function addComment(Request $request) {
        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $photo_id = $request->get('photo_id','0');
        $user_id = $request->get('auth_id','0');
        $photo_comment = $request->get('photo_comment','');

        $input = array();
        $input['photo_id'] = $photo_id;
        $input['photo_comment'] = $photo_comment;
        $input['user_id'] = $user_id;

        DB::table('photo_comment')->insert($input);

        $comment_count = $query = DB::table('photo_comment')->where('photo_id', $photo_id)->count();
        
        $ret['code'] = '200';
        $ret['comment_count'] = $comment_count;
        $ret['message'] = 'Comment was saved successfully!';
        return Response::json($ret);
    }

}
