<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use DB;
use Redis;

class PhotoComment extends Model
{
    protected 	$guarded = [];
    protected 	$table = 'photo_comment';
    public 		$timestamps = false;
}