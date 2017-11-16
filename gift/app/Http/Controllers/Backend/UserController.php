<?php

namespace App\Http\Controllers\Backend;

use App\Models\CommonUser;
use App\Models\User;
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
    //login
    function login(Request $request)
    {

        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $username = $request->get('email', '');
        $password = md5($request->get('password', ''));

        $ret = array();

        $user = DB::table('users')
            ->where('email', $username)
            ->where('password', $password)
            ->select(DB::raw('*'))
            ->first();

        $message = 'The username or password you entered is incorrect.';
        if( empty($user) || $user->password != $password ) // not correct username and password
        {

            $ret['code'] = '401';
            $ret['message'] = $message;
            return Response::json($ret);
        }

        $save_user = $this->updateToken($user->id);
        $ret['code'] = '200';
        $ret['user'] = $save_user;
        return Response::json($ret);
    }

    //update token
    function updateToken($user_id)
    {
        $save_user = User::find($user_id);
        $uuid = new UUID();
        $access_token = $uuid->uuid;
        $access_token = 'SuperAdmin';
        $save_user->access_token = $access_token;
        $save_user->save();

        return $save_user;
    }

    //common user list
    public function getUserList(Request $request) {

        $page = $request->get('page', 0);
        $pageSize = $request->get('pagesize', 20);
        $skip = $page;
        $orderby = $request->get('field', 'id');
        $sort = $request->get('sort', 'asc');
        $searchtext = $request->get('searchtext', '');
        $cond = $request->get('cond', '');

        if($pageSize < 0 )
            $pageSize = 20;

        $ret = array();

        $query = DB::table('common_users as cu');
        if($cond == '')  $query->where('deleted',0);
        if($cond == 'deleted')  $query->where('deleted',1);

        if($searchtext !='') {
            $where = sprintf(" (cg.guest_name like '%%%s%%' or
								cu.first_name like '%%%s%%' or
								cu.last_name like '%%%s%%' or			
								cr.room like '%%%s%%')",
                $searchtext, $searchtext,$searchtext,$searchtext);
            $query->whereRaw($where);
        }

        $data_query = clone $query;

        $data_list = $data_query
            ->orderBy($orderby, $sort)
            ->select(DB::raw('cu.*'))
            ->skip($skip)->take($pageSize)
            ->get();

        $count_query = clone $query;
        $totalcount = $count_query->count();

        $ret['datalist'] = $data_list;
        $ret['totalcount'] = $totalcount;

        return Response::json($ret);
    }

    //virtual delete with deleted option
    public function deleteUser(Request $request) {
        $id = $request->get('id', 0);
        $user = CommonUser::find($id);
        $ret = array();
        if(!empty($user)) {
            $user->update(['deleted' => '1']);
            $ret['code'] = '200';
        }
        return Response::json($ret);
    }

    //resume  deleted user
    public function resumeUser(Request $request) {
        $id = $request->get('id', 0);
        $user = CommonUser::find($id);
        $ret = array();
        if(!empty($user)) {
            $user->update(['deleted' => '0']);
            $ret['code'] = '200';
        }
        return Response::json($ret);
    }

    //forever  delete user
    public function removeUser(Request $request) {
        $id = $request->get('id', 0);
        $user = CommonUser::find($id);
        $picture = $request->get('picture','');
        if($picture != '') {
            if(file_exists(public_path().$picture)) unlink(public_path().$picture);
        } // delete image file
        $ret = array();
        if(!empty($user)) {
            $user->delete();
            $ret['code'] = '200';
        }
        return Response::json($ret);
    }

    public function activeUser(Request $request) {
        $id = $request->get('id', 0);
        $active_status = $request->get('active_status', '0');
        $user = CommonUser::find($id);
        $ret = array();
        if(!empty($user)) {
            $user->update(['active_status' => $active_status]);
            $ret['code'] = '200';
        }
        return Response::json($ret);
    }

    public function lockUser(Request $request) {
        $id = $request->get('id', 0);
        $lock = $request->get('lock', 'Yes');

        $user = CommonUser::find($id);
        $ret = array();
        if(!empty($user)) {
            $user->update(['lock' => $lock]);
            $ret['code'] = '200';
        }
        return Response::json($ret);
    }
}
