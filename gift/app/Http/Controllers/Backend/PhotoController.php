<?php

namespace App\Http\Controllers\Backend;

use App\Models\CommonUser;
use App\Models\User;
use App\Models\PhotoComment;
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
    

    //Photo list
    public function getPhotoList(Request $request) {

        $page = $request->get('page', 0);
        $pageSize = $request->get('pagesize', 20);
        $skip = $page;
        $orderby = $request->get('field', 'id');
        $sort = $request->get('sort', 'asc');
        $searchtext = $request->get('searchtext', '');


        if($pageSize < 0 )
            $pageSize = 20;

        $ret = array();

        $query = DB::table('photo as ph')            
            ->join('common_users as cu', 'cu.id', '=', 'ph.user_id');
        
        if($searchtext !='') {
            $where = sprintf("(ph.title_ like '%%%s%%' or
								cu.first_name like '%%%s%%' or
								cu.last_name like '%%%s%%' or			
								cu.username like '%%%s%%')",
                $searchtext, $searchtext,$searchtext,$searchtext);
            $query->whereRaw($where);
        }

        $data_query = clone $query;

        $data_list = $data_query
            ->orderBy($orderby, $sort)
            ->select(DB::raw('ph.*, cu.first_name, cu.last_name, cu.email'))
            ->skip($skip)->take($pageSize)
            ->get();

        for($i = 0 ; $i < count($data_list) ; $i++) {                        
            $photo_id = $data_list[$i]->id;
            $data_list[$i]->likes_count = $this->likescount($photo_id);
            $data_list[$i]->comment_count = $this->commentCount($photo_id);
            $data_list[$i]->comment_list = $this->commentList($photo_id);
        }            

        $count_query = clone $query;
        $totalcount = $count_query->count();

        $ret['datalist'] = $data_list;
        $ret['totalcount'] = $totalcount;

        return Response::json($ret);
    }

    //get likese count with photo
    public function likesCount($photo_id) {
         $query = DB::table('photo_likes')
            ->where('photo_id', $photo_id);
         return $query->count();   
    }

    //get comment count with photo
    public function commentCount($photo_id) {
         $query = DB::table('photo_comment')
            ->where('photo_id', $photo_id);
         return $query->count();   
    }

    //get comment list with photo
    public function commentList($photo_id) {
         $data = DB::table('photo_comment as pc')
            ->join('common_users as cu', 'cu.id', '=', 'pc.user_id')
            ->where('photo_id', $photo_id)
            ->select(DB::raw('pc.*, cu.first_name, cu.last_name, cu.email'))            
            ->get();

        return $data;
    }

    //forever  delete photo
    public function removePhoto(Request $request) {
        $id = $request->get('id', 0);
        $photo = Photo::find($id);

        $photo = $request->get('photo','');
        if($photo != '') {
            if(file_exists(public_path().$photo)) unlink(public_path().$photo);
        } // delete image file
        
        if(!empty($photo)) {
            DB::table('photo')
                 ->where('id', $id)
                ->delete();
            DB::table('photo_comment')
                 ->where('photo_id', $id)
                ->delete();
           DB::table('photo_likes')
                 ->where('photo_id', $id)
                ->delete();
        }

        $ret = array();
        $ret['code'] = '200';
        return Response::json($ret);
    }

    //remove comment 
    public function removeComment(Request $request) {
        $id = $request->get('comment_id', 0);
        $photo_id = $request->get('photo_id' , 0) ;
        $comment = PhotoComment::find($id);

        if(!empty($comment)) {
            $comment->delete();            
        }
        $comment_list = $this->commentList($photo_id);

        $comment_count = count($comment_list);
        $ret = array();
        $ret['code'] = '200';
        $ret['comment_list'] = $comment_list;
        $rest['comment_count'] = $comment_count;
        return Response::json($ret);   
    }

}
