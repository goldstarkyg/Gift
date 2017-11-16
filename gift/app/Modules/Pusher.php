<?php

namespace App\Modules;

use ElephantIO\Client;
use ElephantIO\Engine\SocketIO\Version1X;


class Pusher {

	private $client;
	public function __construct($address='')
	{
		if( empty($address) )
			$address = config('app.liveserver_url');

		$this->client = new Client(new Version1X($address));
		$this->client->initialize();
	}

	public function sendMessage($event, $data){
		$this->client->emit($event, $data);
	}

	public function close()
	{
		$this->client->close();
	}

}