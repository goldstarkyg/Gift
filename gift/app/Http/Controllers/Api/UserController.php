<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use App\Models\CommonUserTransaction;
use App\Models\CommonUser;

use App\Modules\Functions;
use App\Modules\UUID;

use Illuminate\Http\Request;
use App\Http\Requests;
use Illuminate\Support\Facades\Config;


use App\Http\Controllers\Controller;
use DB;
use Response;
use Redis;

class UserController extends Controller
{
    function login(Request $request)
    {
        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $email = $request->get('email', '');
        $password = md5($request->get('password', ''));

        $ret = array();
        $user = DB::table('common_users as cu')
            ->where('email', $email)
            ->where('password', $password)
            ->select(DB::raw('cu.*'))
            ->first();

        $message = 'The email or password is incorrect.';
        if( empty($user) || $user->password != $password ) // not correct username and password
        {
            $ret['code'] = '401';
            $ret['message'] = $message;
            return Response::json($ret);
        }

        $message = 'You are deleted. Please contact system administrator.';
        if( $user->deleted == 1 ) // user account is disabled.
        {
            $ret['code'] = '402';
            $ret['message'] = $message;
            return Response::json($ret);
        }

        $message = 'Your status is inactive. Please contact system administrator.';
        if( $user->active_status == 0 ) // user account is disabled.
        {
            $ret['code'] = '403';
            $ret['message'] = $message;
            return Response::json($ret);
        }

        $message = 'You are locked. Please contact system administrator.';
        if( $user->lock == 'Yes' ) // user account is disabled.
        {
            $ret['code'] = '404';
            $ret['message'] = $message;
            return Response::json($ret);
        }

        $save_user = $this->updateTokenFCM($user->id, $cur_time);

        // save login transaction
        $info = array();
        $this->saveLoginTransaction($user->id, $info);
        $user->access_token = $save_user->access_token;

        $ret['code'] = '200';
        $ret['user'] = $user;
        $ret['message'] = 'Login successfuly!';
        return Response::json($ret);
    }

    //update token
    function updateTokenFCM($user_id, $cur_time)
    {
        $last_login = CommonUserTransaction::where('user_id', $user_id)
            ->where('action', 'login')
            ->orderBy('created_at', 'desc')
            ->first();

        $last_login_time = 0;
        if( !empty($last_login) )
            $last_login_time = strtotime($last_login->created_at);

        $diff = strtotime($cur_time) - $last_login_time;

        $save_user = CommonUser::find($user_id);

        if( $diff > 3600 * 24 ) // 1 day - expire date
        {
            // if expired, generate new token
            $uuid = new UUID();
            $access_token = $uuid->uuid;
            $save_user->access_token = $access_token;
        }       

        $save_user->save();

        return $save_user;
    }

    //save transaction
    function saveLoginTransaction($user_id, $detail) {
        $detail['client_ip'] = Functions::get_client_ip();
        CommonUserTransaction::saveTransaction($user_id,'login', json_encode($detail)); //transaction
    }

    //sign up
    function signup(Request $request) {
        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $input = $request->except('picture','password','lock', 'deleted', 'active_status');

        $password = md5($request->get('password',''));
        $input['password'] = $password;

        if ($file = $request->file('picture')) {
            $extension = $file->getClientOriginalExtension() ?: 'png';
            $folderName = '/photopage/img/user/';
            $destinationPath = public_path() . $folderName;
            $safeName = str_random(10) . '.' . $extension;
            $file->move($destinationPath, $safeName);
            $input['picture'] = '/photopage/img/user/'.$safeName;
        }

        DB::table('common_users')->insert($input);
        $max_id = DB::table('common_users')->max('id');
        $save_user = $this->updateTokenFCM($max_id, $cur_time);

        $inform = array();
        $inform['client_ip'] = Functions::get_client_ip();
        CommonUserTransaction::saveTransaction($max_id,'signup', json_encode($inform)); //transaction
        $user = CommonUser::find($max_id);

        $ret['code'] = '200';
        $ret['user'] = $user;
        $ret['message'] = 'Thank you for your getting in touch!';
        return Response::json($ret);
    }

    //request active with telephone or email  after sign up
    function active(Request $request) {
        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $active_status = $request->get('active_status','0');
        $id = $request->get('id','0');

        $user = CommonUser::find($id);
        $user->update(['active_status' => $active_status]);

        $inform = array();
        $inform['client_ip'] = Functions::get_client_ip();        
        CommonUserTransaction::saveTransaction($id,'active', json_encode($inform)); //transaction
        
        $ret['code'] = '200';
        $ret['user'] = $user;
        $ret['message'] = 'The activate status was registered successfully!';
        return Response::json($ret);
    }
}
