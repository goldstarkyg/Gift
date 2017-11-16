<?php

namespace App\Http\Middleware;


use Closure;

use App\Models\CommonUser;
use Response;
use App\Http\Requests;

class MobileAuthMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        $auth_info = $request->get('access_token');
        //$auth_info = base64_decode($auth_info);

        $auth_array = explode(':', $auth_info);
        if( count($auth_array) != 2 )
        {
            return response('You need to login again. token is not correct.', 401);
        }
        $user_id = $auth_array[0];
        $access_token = $auth_array[1];

        $auth = CommonUser::find($user_id);
        if( empty($auth) || $auth->access_token != $access_token )
        {
            return response('You need to login again.', 401);
        }
        
        $request->attributes->add(['auth_id' => $user_id]);// change from user_id to login_id
        $request->attributes->add(['auth_info' => $auth_info]);
        $request->attributes->add(['source' => 1]);

        return $next($request);
    }
}
