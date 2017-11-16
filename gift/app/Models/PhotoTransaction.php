<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use DB;

class PhotoTransaction extends Model
{
    protected 	$guarded = [];
    protected 	$table = 'photo_transaction';
    public 		$timestamps = false;
    

    public static function saveTransaction($photo_id, $user_id, $action, $detail) {
        date_default_timezone_set(config('app.timezone'));
        $cur_time = date("Y-m-d H:i:s");

        $trans = DB::table('photo_transaction')
            ->insert(
                ['photo_id' => $photo_id, 'user_id'=> $user_id , 'action' => $action, 'detail' => $detail, 'created_at' =>$cur_time]
            );
    }
}