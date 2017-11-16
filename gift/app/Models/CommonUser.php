<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use DB;
use Redis;

class CommonUser extends Model
{
    protected 	$guarded = [];
    protected 	$table = 'common_users';
    public 		$timestamps = false;
}