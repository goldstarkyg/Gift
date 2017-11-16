<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use DB;
use Redis;

class User extends Model
{
    protected 	$guarded = [];
    protected 	$table = 'users';
    public 		$timestamps = false;
}