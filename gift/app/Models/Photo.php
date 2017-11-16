<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Config;
use DB;
use Redis;

class Photo extends Model
{
    protected 	$guarded = [];
    protected 	$table = 'photo';
    public 		$timestamps = false;
}