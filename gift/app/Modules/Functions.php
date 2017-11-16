<?php

namespace App\Modules;

use LaravelFCM\Message\OptionsBuilder;
use LaravelFCM\Message\PayloadDataBuilder;
use LaravelFCM\Message\PayloadNotificationBuilder;
use FCM;
use Redis;
use DateTime;
use DateInterval;
use DB;
use App\Models\IVR\IVRAgentStatusHistory;
use App\Models\IVR\IVRCallHistory;
use App\Models\Common\PropertySetting;
use App\Models\Common\SystemNotification;
use Illuminate\Support\Facades\Config;

class Functions
{
	//Functions that do not interact with DB
	//------------------------------------------------------------------------------
	//Retrieve a list of all .php files in models/languages
	static function getLanguageFiles()
	{
		$directory = "models/languages/";
		$languages = glob($directory . "*.php");
		
		//print each file name
		return $languages;
	}

	//Retrieve a list of all .css files in models/site-templates
	static function getTemplateFiles()
	{
		$directory = "models/site-templates/";
		$languages = glob($directory . "*.css");
		
		//print each file name
		return $languages;
	}

	//Retrieve a list of all .php files in root files folder
	static function getPageFiles()
	{
		$directory = "";
		$pages = glob($directory . "*.php");
		
		//print each file name
		foreach ($pages as $page)
		{
			$row[$page] = $page;
		}
		
		return $row;
	}

	//Destroys a session as part of logout
	static function destroySession($name)
	{
		if (isset($_SESSION[$name]))
		{
			$_SESSION[$name] = NULL;
			unset($_SESSION[$name]);
		}
	}

	//Generate a unique code
	static function getUniqueCode($length = "")
	{
		$code = md5(uniqid(rand(), true));
		if ($length !== "")
		{
			return substr($code, 0, $length);
		}
		else
		{
			return $code;
		}
	}

	static function getRandomString($chars = 8)
	{
		$letters = 'abcefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';

		return substr(str_shuffle($letters), 0, $chars);
	}
	
	static function generateVerifyCode( )
	{
		return Functions::getRandomString(6);
	}

	//Generate an activation key
	static function generateActivationToken($gen = null)
	{
		//do
		//{
		//	$gen = md5(uniqid(mt_rand(), false));
		//}
		//while (validateActivationToken($gen));
		
		$gen = md5(uniqid(mt_rand(), true));

		return $gen;
	}

	//@ Thanks to - http://phpsec.org
	static function generateHash($plainText, $salt = null)
	{
		if ($salt === null)
		{
			$salt = substr(md5(uniqid(rand(), true)), 0, 25);
		}
		else
		{
			$salt = substr($salt, 0, 25);
		}

		$aaa = sha1($salt . $plainText);
		return $salt . sha1($salt . $plainText);
	}

	//Checks if an email is valid
	static function isValidEmail($email)
	{
	//    if (filter_var($email, FILTER_VALIDATE_EMAIL))
	//    {
	//        return true;
	//    }
	//    else
	//    {
	//        return false;
	//    }

		if (preg_match('|^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$|i', $email))
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	//Checks if an contact no is valid
	static function isValidContactNo($contactno)
	{
		return true;
	}

	//Inputs language strings from selected language.
	static function GetMessage($key, $markers = NULL)
	{
		require_once("Lang_En.php");
		
		if( $markers === NULL )
		{
			$str = $lang[$key];
		}
		else
		{
			//Replace any dyamic markers
			$str = $lang[$key];
			$iteration = 1;
			foreach ($markers as $marker)
			{
				$str = str_replace("%m" . $iteration . "%", $marker, $str);
				$iteration++;
			}
		}
		
		//Ensure we have something to return
		if ($str === "")
		{
			return ("No language key found");
		}
		else
		{
			return $str;
		}
	}

	//Checks if a string is within a min and max length
	static function minMaxRange($min, $max, $what)
	{
		if (strlen(trim($what)) < $min)
		{
			return true;
		}
		else if (strlen(trim($what)) > $max)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	//Checks if a string is within a min length
	static function minRange($min, $what)
	{
		if (strlen(trim($what)) < $min)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	//Checks if a string is within a max length
	static function maxRange($max, $what)
	{
		if (strlen(trim($what)) > $max)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	//Replaces hooks with specified text
	static function replaceDefaultHook($str)
	{
		global $default_hooks, $default_replace;
		return (str_replace($default_hooks, $default_replace, $str));
	}

	//Displays error and success messages
	static function alertNotificationMessages($errors, $successes = null)
	{
		//Error block
		if (count($errors) > 0)
		{
			echo "<div class='notification-e'>
							 <img id='close_notification_f7c717ded4d80bebcb6f777f80e6840f7b48' class='cm-notification-close hand' src='/css/images/icons/icon_close.gif' width='13' height='13' border='0' alt='Close' title='Close'>
							 <div class='notification-header-e'>Error</div>
							 <div>";
			foreach ($errors as $error)
			{
					echo $error . "&nbsp;&nbsp;&nbsp;";
			}
			
			echo "</div></div>";
		}
//Success block
		if (count($successes) > 0)
		{
			echo "<div class='notification-n'>
							 <img id='close_notification_f7c717ded4d80bebcb6f777f80e6840f7b48' class='cm-notification-close hand' src='/css/images/icons/icon_close.gif' width='13' height='13' border='0' alt='Close' title='Close'>
							 <div class='notification-header-n'>Success</div>
							 <div>";
			foreach ($successes as $success)
			{
					echo $success;
			}
			echo "</div></div>";
		}
	}
	
	static function alertErrorMessageByID($str_msg_id, $arrParams = null)
	{
		Functions::alertNotificationMessages(array(Functions::GetMessage($str_msg_id, $arrParams)));
	}
	
	static function alertErrorMessage($str_message)
	{
		Functions::alertNotificationMessages(array($str_message));
	}
	
	static function alertSuccessMessage($str_message)
	{
		Functions::alertNotificationMessages(null, array($str_message));
	}

	//Completely sanitizes text
	static function sanitize($str)
	{
		return strtolower(strip_tags(trim(($str))));
	}

	static function getParameter($param, $default_value = "")
	{
		if (isset($_REQUEST[$param]) && $_REQUEST[$param] !== NULL)
		{
			if(is_array($_REQUEST[$param]))
				return $_REQUEST[$param];
			else
				return trim($_REQUEST[$param]);
		}

		return $default_value;
	}


	// Update a user's secure key
	static function updateSecureKey($email, $securekey)
	{
		global $mysqli, $db_table_prefix;
		$stmt = $mysqli->prepare("UPDATE " . $db_table_prefix . "users
				SET
				secure_key = ?
				WHERE
				email = ?");
		$stmt->bind_param("ss", $securekey, $email);
		$result = $stmt->execute();
		$stmt->close();
		return $result;
	}

	//Check if activation token exists in DB
	static function validateActivationToken($token, $lostpass = NULL)
	{
		global $mysqli, $db_table_prefix;
		if ($lostpass === NULL)
		{
			$stmt = $mysqli->prepare("SELECT active
					FROM " . $db_table_prefix . "users
					WHERE active = 0
					AND
					activation_token = ?
					LIMIT 1");
		}
		else
		{
			$stmt = $mysqli->prepare("SELECT active
					FROM " . $db_table_prefix . "users
					WHERE active = 1
					AND
					activation_token = ?
					AND
					lost_password_request = 1
					LIMIT 1");
		}
		
		$stmt->bind_param("s", $token);
		$stmt->execute();
		$stmt->store_result();
		$num_returns = $stmt->num_rows;
		$stmt->close();

		if ($num_returns > 0)
		{
			return true;
		}
		else
		{
			return false;
		}
	}

	// Push functions
	// Google GCM
	static function push2Android($push_keys, $msg, $push_type = "Common")
	{
		$ret = true;

		$apiKey = "AIzaSyCfJ_4O6jIVOZwUF_x-M6tVU5EBvyHvqwQ";
		$headers = array(
				'Authorization: key=' . $apiKey,
				'Content-Type: application/json'
		);

		$arr = array();
		$arr['data'] = array();
		$arr['data']['msg'] = urlencode($msg);
		$arr['data']['type'] = $push_type;
		$arr['registration_ids'] = array();

		$total = sizeof($push_keys);
		$count = (int) ($total / 500);
		$remain = $total % 500;
		if ($remain !== 0)
		{
				$count = $count + 1;
		}

		if ($total > 0)
		{
			for ($i = 0; $i < $count; $i++)
			{
				$registrationIDs = array();
				$k = 0;
				if (($i === ($count - 1)) && $remain != 0)
				{
					for ($j = $i * 500; $j < $i * 500 + $remain; $j++)
					{
						$registrationIDs[$k] = $push_keys[$j];
						$k ++;
					}
				}
				else
				{
					for ($j = $i * 500; $j < ($i + 1) * 500; $j++)
					{
						$registrationIDs[$k] = $push_keys[$j];
						$k ++;
					}
				}

				$arr['registration_ids'] = $registrationIDs;
				$ch = curl_init();
				curl_setopt($ch, CURLOPT_URL, 'http://android.googleapis.com/gcm/send');
				curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
				curl_setopt($ch, CURLOPT_POST, true);
				curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
				curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
				curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($arr));

				// Execute post
				$reponse = curl_exec($ch);

				// Close connection
				curl_close($ch);

				// Get message from GCM server
				//$obj = json_decode($reponse, true);
				//var_dump($registrationIDs);

				sleep(1);
			}
		}
		else
		{
			$ret = false;
		}

		return $ret;
	}

	// iphone APNS
	static function push2IPhone($tokens, $msg, $push_type = "Common", $badge = 0)
	{
		$ret = true;
	
		//$apnsCert = 'D:\xampp\htdocs\smartaxa\models\masix_apns_for_dev.pem';
		//$apnsCert = '/var/www/html/ws/img/first/test/models/masix_apns_for_dev.pem';
		$apnsCert = '/home/axasmart/public_html/models/axaapns.pem';
	
		$passphrase = 'kgsiospush'; //carepetpush2014';
		$payload['aps'] = array('alert' => $msg, 'badge' => $badge, 'sound' => 'default', 'type' => $push_type);
		$message = json_encode($payload);
	
		$index = 0;
		$remain = 0;
		$apns = NULL;
		foreach ($tokens as $token)
		{
			$remain = $index % 500;
	
			if ($remain === 0)
			{
				if ($apns)
				{
					// Close connection
					fclose($apns);
					sleep(1);
				}
	
				// Create stream context
				$streamContext = stream_context_create();
				stream_context_set_option($streamContext, 'ssl', 'local_cert', $apnsCert); //ssl
				stream_context_set_option($streamContext, 'ssl', 'passphrase', $passphrase);
	
				$apns = stream_socket_client('ssl://gateway.push.apple.com:2195', $error, $errorString, 100, STREAM_CLIENT_CONNECT, $streamContext);
				if (!$apns)
				{
					return false;
				}
			}
	
			// Send push
			//$apnsMessage = chr ( 0 ) . chr ( 0 ) . chr ( 32 ) . pack ( 'H*', str_replace ( ' ', '', $token ) ) . chr ( 0 ) . chr ( strlen ( $message ) ) . $message;
			$apnsMessage = chr(0) . pack("n", 32) . pack('H*', str_replace(' ', '', $token)) . pack("n", strlen($message)) . $message;
			//$apnsMessage = chr(0) . pack("n", 32) . pack('H*', trim($token)) . pack("n", strlen($message)) . $message;
			$writeResult = fwrite($apns, $apnsMessage);
	
			$index ++;
	
	//            echo $apnsMessage . "<br>";
	//            echo sizeof($apnsMessage) . "<br>";
	//            echo $writeResult . "<br>";
		}
	
		if ($apns)
		{
			// Close connection
			fclose($apns);
		}
	
		return $ret;
	}

	static function smartaxaLog($username, $action, $content, $result)
	{
		$logClass = new SysLogs(0, $username);
		$logClass->addSysLog($action, $content, $result);
	}

	// Return timestamp from date string (2014-03-16 17:30:30)
	static function getSecondTime($date)
	{
		$yy = substr($date, 0, 4);
		$mm = substr($date, 5, 2);
		$dd = substr($date, 8, 2);
		$hh = substr($date, 11, 2);
		$ii = substr($date, 14, 2);
		$ss = substr($date, 17, 2);

		$sec_date = mktime($hh, $ii, $ss, $mm, $dd, $yy);
		return $sec_date;
	}

	static function fetchGroupsforAgent($category)
	{
		$groupModel = new Role();
		$param = array(
				"chat_writable"=>1
		);
		$groups = $groupModel->fetchGroupsforAgent($category, $param);
		return $groups;
	}

	static function json_decode($content, $assoc = false)
	{
		require_once 'JSON.php';
		if ($assoc)
		{
			$json = new Services_JSON(SERVICES_JSON_LOOSE_TYPE);
		}
		else
		{
			$json = new Services_JSON;
		}

		return $json->decode($content);
	}

	static function json_encode($content)
	{
		require_once 'JSON.php';
		$json = new Services_JSON;

		return $json->encode($content);
	}

	static function url(){
		return sprintf(
				"%s://%s%s",
				isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
				$_SERVER['SERVER_NAME'],
				$_SERVER['REQUEST_URI']
		);
	}

	static function homeurl(){
		return sprintf(
				"%s://%s:%s",
				isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http',
				$_SERVER['SERVER_NAME'],
				$_SERVER['SERVER_PORT']
		);
	}

	static function sendPushMessageToDevice($token, $title, $body, $payload) {
		$notification = array();
		$notification['title'] = $title;
		$notification['body'] = $body;
		$notification['icon'] = 'new';
		$notification['sound'] = 'notify';

		$message = array();

		$payload['body'] = $body;
		$message['data'] = $payload;
		// $message['notification'] = $notification;
		$message['priority'] = 'high';
		$message['to'] = $token;

		$ch = curl_init();

		curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'Content-Type: application/json',
				'Authorization: key=AIzaSyB7G8JIjQ46OiEkkXzTvAEL13qbs1Ay8Yk'
		));

		curl_setopt($ch, CURLOPT_URL, 'https://fcm.googleapis.com/fcm/send');
		curl_setopt($ch, CURLOPT_POST,1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($message));
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

		$result=curl_exec ($ch);
		curl_close ($ch);

		return $result;
	}

	static function sendPushMessgeToDeviceWithRedisNodejs($user, $title, $body, $payload) {
		if( empty($user) )
			return;

		$user_info = DB::table('common_users as cu')
			->join('common_department as cd', 'cu.dept_id', '=', 'cd.id')
			->where('cu.id', $user->id)
			->select(DB::raw('cd.property_id'))
			->first();

		if( empty($user_info) )
			return;

		$rules = PropertySetting::getNotificationSetting($user_info->property_id);

		$payload['push_confirm_with_sms'] = $rules['push_confirm_with_sms'];
		$payload['push_confirm_duration'] = $rules['push_confirm_duration'];
		
		$push_message = array();
		$push_message['type'] = 'push';
		$push_message['to'] = $user;
		$push_message['subject'] = $title;
		$push_message['body'] = $body;
		$push_message['payload'] = $payload;

		// save notification for Mobile
		$notification = new SystemNotification();

		$notification->user_id = $user->id;
		$notification->type = config('constants.MOBILE_PUSH_NOTIFY');
		$notification->property_id = $user_info->property_id;
		$notification->content = $body;
		$notification->notification_id = 0;
		if( !empty($payload) )
			$notification->payload = json_encode($payload);

		$notification->unread_flag = 1;

		$notification->save();

		// Functions::sendPushMessageToDevice('/topics/user_3', $title, $body, $payload);
		
		Redis::publish('notify', json_encode($push_message));
	}

	static function convertToHoursMins($time, $format = '%02d:%02d') {
		if ($time < 1) {
			return;
		}
		$hours = floor($time / 60);
		$minutes = ($time % 60);
		return sprintf($format, $hours, $minutes);
	}

	static function generatePDF($title, $content, $filename) {
		require('html2pdf.class.php');
		require('_class/exception.class.php');
		require('_class/locale.class.php');
		require('_class/myPdf.class.php');
		require('_class/parsingHtml.class.php');
		require('_class/parsingCss.class.php');

		try {
			$html2pdf = new \HTML2PDF('L', 'A4', 'en', true, 'UTF-8', array(10, 10, 10, 10));
			$html2pdf->pdf->SetTitle($title);
			$html2pdf->WriteHTML($content);
			$html2pdf->Output($filename);
		}
		catch (HTML2PDF_exception $e) {
			echo $e;
			exit;
		}
	}

	static function downloadPDF($title, $content, $filename) {
		require('html2pdf.class.php');
		require('_class/exception.class.php');
		require('_class/locale.class.php');
		require('_class/myPdf.class.php');
		require('_class/parsingHtml.class.php');
		require('_class/parsingCss.class.php');

		try {
			$output_path = base_path() . '\public\reports\\' . $filename;

			$html2pdf = new \HTML2PDF('L', 'A4', 'en', true, 'UTF-8', array(10, 10, 10, 10));
			$html2pdf->pdf->SetTitle($title);
			$html2pdf->WriteHTML($content);
			$pdf = $html2pdf->Output('', 'S');
			$html2pdf->Output($output_path, 'F');
		}
		catch (HTML2PDF_exception $e) {
			echo $e;
			exit;
		}

		return response($pdf)
				->header('Content-Type', 'application/pdf')
				->header('Content-Length', strlen($pdf))
				->header('Content-Disposition', 'attachment; filename="'.$filename.'"');
	}

	static function downloadFile($filepath) {
		$filesize = filesize($filepath);
		$path_parts = pathinfo($filepath);
		$filename = $path_parts['basename'];
		$extension = $path_parts['extension'];

		header("Pragma: public");
		header("Expires: 0");
		header("Content-Type: application/octet-stream");
		header("Content-Disposition: attachment; filename=\"$filename\"");
		header("Content-Transfer-Encoding: binary");
		header("Content-Length: $filesize");

		ob_clean();
		flush();
		readfile($filepath);
	}

	static function getSiteURL() {
		$http = 'http://';
		if( isset($_SERVER['HTTPS'] ) )
		$http = 'https://';

		$port = $_SERVER['SERVER_PORT'];
		$siteurl = $http . $_SERVER['SERVER_NAME'] . ':' . $port . '/';

		return $siteurl;
	}

	static function getSiteIP() {
		return $_SERVER['SERVER_NAME'];
	}

	static function isSuperAgent() {
		if( empty($_SERVER['HTTP_USER_AGENT']) )
			return true;
		
		$agent = $_SERVER['HTTP_USER_AGENT'];

		if (strpos($agent, 'Super Agent') !== false) {
		    return true;
		}
		return false;
	}

	static function isLinux() {
		if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
		    return false;
		} else {
		    return true;
		}
	}

	/* get start data*/
	static function getStartTime($cutDateTime, $day) {
		$date = new DateTime($cutDateTime);
		$date->sub(new DateInterval('P' . $day . 'D'));
		$cur_date = $date->format('Y-m-d H:i:s');
		return $cur_date;
	}

	static function getMailSetting($property_id, $prefix) {
		$smtp = array();

		$smtp['smtp_server'] = 'send.one.com';
		$smtp['smtp_port'] = '465';
		$smtp['smtp_user'] = 'reports@myhotlync.com';
		$smtp['smtp_password'] = 'Hotlync_2@16';
		$smtp['smtp_sender'] = 'jyyblue1987@outlook.com';
		$smtp['smtp_auth'] = '1';
		$smtp['smtp_tls'] = 'ssl';

		foreach($smtp as $key => $value)
		{
			$data = DB::table('property_setting as ps')
					->where('ps.property_id', $property_id)
					->where('ps.settings_key', $prefix . $key)
					->select(DB::raw('ps.value'))
					->first();

			if( empty($data) )
				continue;

			$smtp[$key] = $data->value;
		}

		return $smtp;
	}


	static function saveAgentStatusHistory($agent) {
		$prev_history = IVRAgentStatusHistory::orderBy('id', 'desc')
				->where('user_id', $agent->user_id)
				->first();

		if( !empty($prev_history) )
		{
			$prev_history->duration = strtotime($agent->created_at) - strtotime($prev_history->created_at);
			$prev_history->save();
		}

		$agent_history = new IVRAgentStatusHistory();
		$agent_history->user_id = $agent->user_id;
		$agent_history->status = $agent->status;
		$agent_history->extension = $agent->extension;
		$agent_history->ticket_id = $agent->ticket_id;
		$agent_history->created_at = $agent->created_at;
		$agent_history->duration = 0;

		$agent_history->save();
	}

	static function fixAgentStatusDuration() {
		$datalist = IVRAgentStatusHistory::all();

		foreach($datalist as $key => $row) {
			$prev_history = IVRAgentStatusHistory::orderBy('id', 'desc')
					->where('user_id', $row->user_id)
					->where('id', '<', $row->id)
					->first();

			if( !empty($prev_history) )
			{
				$prev_history->duration = strtotime($row->created_at) - strtotime($prev_history->created_at);
				$prev_history->save();
			}

			if( $key == count($row) - 1)
			{
				$row->duration = 0;
				$row->save();
			}
		}
	}

	static function saveCallHistory($ticket) {
		$call_history = new IVRCallHistory();
		$call_history->ticket_id = $ticket->id;
		$call_history->status = $ticket->dial_status;

		date_default_timezone_set(config('app.timezone'));
		$cur_time = date("Y-m-d H:i:s");

		$call_history->created_at = $cur_time;
		
		
		$call_history->save();
	}

	static function getHHMMSSFormatFromSecond($second) {
		$t = round($second);
		return sprintf('%02d:%02d:%02d', ($t/3600),($t/60%60), $t%60);
	}

	static function getHHMMFormatFromSecond($second) {
		$t = round($second);
		return sprintf('%02d:%02d:%02d', ($t/3600),($t/60%60));
	}

	public static function assignExtension(&$model) {
		if( $model->status != 'Logout' )
		{
			$user = DB::table('common_users as cu')
					->join('common_department as cd', 'cu.dept_id', '=', 'cd.id')
					->where('cu.id', $model->user_id)
					->select(DB::raw('cu.*, cd.property_id'))
					->first();

			if( !empty($user) )
			{
				$list = DB::table('call_center_extension as ce')
						->where('ce.property_id', $user->property_id)
						->whereRaw('NOT EXISTS (
						SELECT  NULL
						FROM    ivr_agent_status_log AS asl
						JOIN common_users as cu ON asl.user_id = cu.id
						JOIN common_department as cd ON cu.dept_id = cd.id
						WHERE ce.extension = asl.extension
						and asl.status != \'Log out\'
						and cd.property_id = ' . $user->property_id . '
						and asl.user_id != ' . $model->user_id . '
					)')
						->select(DB::raw('ce.extension'))
						->get();

				$extension_valid = false;
				foreach($list as $row)
				{
					if( $row->extension == $model->extension )
					{
						$extension_valid = true;
						break;
					}
				}

				if( $extension_valid == false )
				{
					$message = array();

					$message['type'] = 'extension_invalid';
					$message['user_id'] = $model->user_id;

					if( count($list) > 0 ) {
						$message['data'] = $model->extension . ' extension is not valid, so new extension ' . $list[0]->extension . ' is assigned automatically';
						$model->extension = $list[0]->extension;
					}
					else
						$message['data'] = $model->extension . ' extension is not valid';

					$message['extension'] = $model->extension;

					Redis::publish('notify', json_encode($message));
				}
			}
		}
	}

	public static function getTimeRange($value, $default) {
		if( empty($default) )
			$default = ['00:00:00', '23:59:00'];
		if( empty($value) )
			return $default;

		$ret = $default;

		sscanf($value,"%02s:%02s - %02s:%02s", $st_hr, $st_mi, $en_hr, $en_mi);

		$ret[0] = $st_hr . ":" . $st_mi . ":00";
		$ret[1] = $en_hr . ":" . $en_mi . ":00";

		return $ret;
	}

	public static function addMinute($start_time, $minute) {
		$time = new DateTime($start_time);
		$time->add(new DateInterval('PT' . $minute . 'M'));

		$stamp = $time->format('H:i:s');
		return $stamp;
	}

	public static function sortTimeInterval($intervals) {
		// $intervals = [
		// 	['08:40:00', '08:50:00'],
		// 	['08:20:00', '08:30:00'],
		// 	['11:20:00', '11:45:00'],
		// 	['08:30:00', '08:40:00'],
		// 	['10:00:00', '10:20:00'],
		// 	['10:20:59', '10:35:00'],
		// 	['08:10:00', '08:20:00'],
		// 	['08:00:00', '08:10:00']			
		// ];

		// sort time interval
		$start_times = array();
		foreach($intervals as $row) {
			$start_times[] = strtotime($row[0]);
		}

		array_multisort($start_times, SORT_ASC, $intervals);

		// merge
		if( count($intervals) < 2 )
			return $intervals;

		$new_interval = [];
		$new_interval[] = [$intervals[0][0], $intervals[0][1]];
		for($i = 1; $i < count($intervals); $i++)
		{
			$index = count($new_interval) - 1;
			$start_time = max($new_interval[$index][0], $intervals[$i][0]);
			$end_time = min($new_interval[$index][1], $intervals[$i][1]);

			$gap = strtotime($end_time) - strtotime($start_time);
			if( $gap > -70 )	// less than 1 min
			{
				// merge				
				$new_interval[$index][1] = $intervals[$i][1];				
			}
			else
			{
				$new_interval[] = $intervals[$i];	
			}
		}

		return $new_interval;
	}

	public static function calcTotalTime($intervals) {
		$total = 0;

		foreach($intervals as $row)
		{
			$gap = strtotime($row[1]) - strtotime($row[0]);
			$total += $gap;
		}

		return $total;
	}

	public static function rearrangeTimeIntervalWithCurrentTime($intervals, $cur_time) {
		// $intervals = [
		// 	['08:40:00', '08:50:00'],
		// 	['08:20:00', '08:30:00'],
		// 	['11:20:00', '11:45:00'],
		// 	['08:30:00', '08:40:00'],
		// 	['10:00:00', '10:20:00'],
		// 	['10:20:59', '10:35:00'],
		// 	['08:10:00', '08:20:00'],
		// 	['21:00:00', '21:10:00']			
		// ];

		// split time range with current time

		$new_intervals = [];

		$time = strtotime($cur_time);
		$time = date("H:i", strtotime('+10 minutes', $time));
		$cur_time = substr($time, 0, -1) . '0';

		foreach($intervals as $row) {
			if( $row[0] <= $cur_time && $cur_time < $row[1] )
			{
				$new_intervals[] = [$cur_time, $row[1]];		
			}
			else
			{
				if($row[0] > $cur_time )
					$new_intervals[] = [$row[0], $row[1]];	
			}			
			
		}	

		foreach($intervals as $row)
		{
			if( $row[0] <= $cur_time && $cur_time < $row[1] )
			{
				$new_intervals[] = [$row[0], $cur_time];		
			}
			else
			{
				if( $row[0] <= $cur_time )
					$new_intervals[] = [$row[0], $row[1]];	
			}
		}

		return $new_intervals;
	}

	public static function calcDurationForMinute($start, $duration)
	{
		$start_time = strtotime($start);     
		$end_time = $start_time + $duration;
		$end_time = ceil($end_time/60)*60;

		$max_time = $end_time - $start_time;

		return $max_time;
	}

	public static function get_client_ip() {
	    $ipaddress = '';
	    if (getenv('HTTP_CLIENT_IP'))
	        $ipaddress = getenv('HTTP_CLIENT_IP');
	    else if(getenv('HTTP_X_FORWARDED_FOR'))
	        $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
	    else if(getenv('HTTP_X_FORWARDED'))
	        $ipaddress = getenv('HTTP_X_FORWARDED');
	    else if(getenv('HTTP_FORWARDED_FOR'))
	        $ipaddress = getenv('HTTP_FORWARDED_FOR');
	    else if(getenv('HTTP_FORWARDED'))
	       $ipaddress = getenv('HTTP_FORWARDED');
	    else if(getenv('REMOTE_ADDR'))
	        $ipaddress = getenv('REMOTE_ADDR');
	    else
	        $ipaddress = 'UNKNOWN';
	    
	    return $ipaddress;
	}

	static function isRegularExpression($string) {		
	    set_error_handler(function() {}, E_WARNING);
	    $isRegularExpression = preg_match($string, "") !== FALSE;
	    restore_error_handler();
	    return $isRegularExpression;
	}
}