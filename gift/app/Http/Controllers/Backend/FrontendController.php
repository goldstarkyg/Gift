<?php

namespace App\Http\Controllers\Backend;


use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

use App\Modules\Functions;
use View;

use Redirect;
use Response;
use DB;

class FrontendController extends Controller
{
    private $request;

    public function __construct(Request $request)
    {
        $this->request = $request;
    }

    public function index(Request $request)
    {
        $prod = $request->get('prod', 0);
        $app_config = array();
        $app_config['site_url'] = Functions::getSiteURL();
        $app_config['client_ip'] = Functions::get_client_ip();
        if( config('app.debug') == false || $prod == 1 )
            return view('backend.index_prod', compact('app_config'));
        else
            return view('backend.index', compact('app_config'));
    }
}
