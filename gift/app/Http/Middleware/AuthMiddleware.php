<?php

namespace App\Http\Middleware;


use Closure;

use App\Models\User;
use Response;
use App\Http\Requests;

class AuthMiddleware
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
        $auth_info = $request->header('Authorization');
        $auth_info = base64_decode(substr($auth_info, strlen('Basic ')));

        $auth_array = explode(':', $auth_info);
        if( count($auth_array) != 2 )
        {
            return response('You need to login again. header is not correct', 401);
        }
        $user_id = $auth_array[0];
        $access_token = $auth_array[1];

        if( $user_id == 0 && $access_token == config('app.super_access_token') )
        {
            $request->attributes->add(['user_id' => $user_id]);
            $request->attributes->add(['auth_info' => $auth_info]);

            return $next($request);
        }
        
        $auth = User::find($user_id);
        if( $user_id > 0 && (empty($auth) || $auth->access_token != $access_token) )
        {
            return response('You have been logged out due to another session being opened with the same user.', 401);
        }

        $request->attributes->add(['user_id' => $user_id]);
        $request->attributes->add(['auth_info' => $auth_info]);
        $request->attributes->add(['source' => 0]);

        return $next($request);
    }
}
