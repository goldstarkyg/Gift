'use strict';

app.controller('ChatController', function($scope, $http, $interval, $stateParams, $window, $timeout, toaster, AuthService, TranslateService, socket) {
    var MESSAGE_TITLE = 'Chat Page';


  $scope.current_session = {};

  $scope.current_session.id = 0;
  $scope.current_session.status = 'Waiting';

	$scope.content_height = 'height: ' + ($window.innerHeight - 135) + 'px; overflow-y: auto';

	$scope.messages = [];

  $scope.init = function() {
    requestChat();
    getLanguageList();
    $scope.pause = null;
  }

  $scope.logResize = function () {
        console.log('element resized');
    };

  var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  console.log(iOS);

  $scope.chat_height_style = {'height': '90% !important'};    
  if( iOS == false )
    $scope.chat_height_style = {};

  function requestChat() {
    var profile = AuthService.GetCredentials();

    var request = {};

    request.property_id = profile.property_id;
    request.guest_id = profile.guest_id;
    request.guest_name = profile.guest_name;
    request.room_id = profile.room_id;
    request.language = profile.language;

      $http({
          method: 'POST',
          url: '/guest/requestchat',
          data: request,
          headers: {'Content-Type': 'application/json; charset=utf-8'}
      }).then(function(response) {
        $scope.current_session = response.data;
        getChatHistory();
      }).catch(function(response) {
          toaster.pop('error', MESSAGE_TITLE, 'Failed to get Chat History.');
      })
      .finally(function() {

        });
  }

  function getChatHistory() {
    	var profile = AuthService.GetCredentials();

	    $scope.messages = [];

	    var request = {};

      request.session_id = $scope.current_session.id;

      if( request.session_id < 1 )
        return;

        $http({
            method: 'POST',
            url: '/guest/chathistory',
            data: request,
            headers: {'Content-Type': 'application/json; charset=utf-8'}
        }).then(function(response) {
            $scope.messages = response.data;
        }).catch(function(response) {
            toaster.pop('error', MESSAGE_TITLE, 'Failed to get Chat History.');
        })
        .finally(function() {

        });
	}

  function getLanguageList() {
    var profile = AuthService.GetCredentials();
    $scope.lang_code = profile.language;
    $http.get('/list/languagelist')
        .then(function(response) {
            $scope.language_list = response.data;
        });
  }

	$scope.onSendMessage = function(message) {
    if( !message )
      return;

		var profile = AuthService.GetCredentials();
	    var msg = {};

      msg.session_id = $scope.current_session.id;
	    msg.guest_name = profile.guest_name;
	    msg.guest_id = profile.guest_id;
      msg.agent_id = $scope.current_session.agent_id;
	    msg.property_id = profile.property_id;
      msg.room = profile.room;

	    msg.text = message;
	    msg.created_at = moment().format('YYYY-MM-DD HH:mm:ss');
	    msg.direction = 1;  // outgoing
      msg.language = $scope.lang_code;

      if( $scope.lang_code != 'en')
      {
          TranslateService.translate(msg.text, $scope.lang_code, 'en')
          .then(function(response) {
              var data = response.data.data;
              msg.text_trans = data.translations[0].translatedText;
          }).catch(function(response) {               
          })
          .finally(function() {              
              $scope.messages.push(msg);        
              socket.emit('guest_msg', msg);
          });    
      }
      else
      {
        msg.text_trans = '';
        $scope.messages.push(msg);   
        socket.emit('guest_msg', msg);
      }

	    $scope.message_content = '';
  	}

    $scope.onChangeChat = function(message) {
      console.log('input is changed');
      
      if( !$scope.pause )
      {
        console.log('typing is started'); 

        sendTypingEvent(0);
      }

      $timeout.cancel($scope.pause);
      $scope.pause = $timeout(function() {        
        console.log('typing is ended');   
        $scope.pause = null;

        sendTypingEvent(1);
      }, 6000);
    }

    function sendTypingEvent(typing_flag) {
      var profile = AuthService.GetCredentials();

      var msg = {};

      msg.session_id = $scope.current_session.id;
      msg.guest_id = profile.guest_id;
      msg.agent_id = $scope.current_session.agent_id;
      msg.property_id = profile.property_id;
      msg.typing_flag = typing_flag;  // type end

      socket.emit('guest_typing', msg);
    }

  	$scope.$on('agent_message', function(event, args){
  		var message = args;
  		message.direction = 0; // incoming

      if( $scope.lang_code != 'en' && message.trans && !message.text_trans )  // not translated
      {
          TranslateService.translate(message.text, 'en', $scope.lang_code)
          .then(function(response) {
              var data = response.data.data;
              message.text_trans = data.translations[0].translatedText;
          }).catch(function(response) {               
          })
          .finally(function() {              
              $scope.messages.push(message);        
          });    
      }
      else
        $scope.messages.push(message);   

      $scope.current_session.typing_flag = 1;  
    });

    $scope.$on('agent_typing', function(event, args){
        var message = args;
        $scope.current_session.typing_flag = message.typing_flag;
    });

    $scope.$on('guest_message', function(event, args){
  		var message = args;
		  $scope.messages.push(message);        
    });

    $scope.$on('agent_chat_event', function(event, args){
      var message = args;
      if( message.sub_type == 'accept_chat' )
      {
        $scope.current_session = message.data;
        getChatHistory();
      }

      if( message.sub_type == 'end_chat' )
      {
        $scope.current_session = message.data;
        getChatHistory();
      }
      if( message.sub_type == 'logout_chat' )
        $scope.current_session = message.data;
    });

});