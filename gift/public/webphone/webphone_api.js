/** 
* Mizu Webphone Java Script API.
* You can control the webphone using the API functions below.
*/

var webphone_api = (function ()
{

/** 
* Configuration settings can be specified below.
* You can also set the parameters at runtime by using the setparameter() function.
* The serveraddress parameter is mandatory! If sipusername/sippassword is not set, then the user will have to enter them. Other parameters are optional.
*/
var parameters = {
                    //serveraddress: '', // your VoIP server IP address, domain name or SRV DNS record
                    //sipusername: '', // preconfigured SIP account username.
                    //sippassword: '', // preconfigured SIP account password                    
					//other parameters are optional. See the documentation for the complete parameter list of available settings.
                    loglevel: 5,
                 };

/** 
* Call this function once and pass a callback, to receive important events, which should be displayed for the user and/or parsed to perform other actions after your software custom logic.
* For the included softphone these are already handled, so no need to use this, except if you need some extra custom actions or functionality which depends on the notifications.
*/

/*
Example: call getEvents() function passing a callback

webphone_api.getEvents( function (event)
{
    // For example the following status means that there is an incoming call ringing from 2222 on the first line:
    // STATUS,1,Ringing,2222,1111,2,Katie,[callid]
    // parameters are separated by comma (,)
    // the sixth parameter (2) means it is an incoming call. (For outgoing call this is set to 1)
    // You can find more detailed explanation about events in the documentation "Notifications" section.
    
    // example for detecting incoming and outgoing calls:
    
    var evtarray = event.split(',');
    
    if (evtarray[0] === 'STATUS' && evtarray[2] === 'Ringing')
    {
        if (evtarray[5] === '1')
        {
            // means it is an outgoing call
            // ...
        }
        else if (evtarray[5] === '2')
        {
            // means it is an icoming call
            // ...
        }
    }
});
*/

function getEvents (callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.evcb = callback;
}

/** Returns global status. The possible returned texts are the same like for notifications: getEvenets
 * This is NOT a callback, you have to call it every time you want to receive the status. */
function getStatus ()  // string
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        return "STATUS,-1,Initializing";
    else
        return plhandler.GetStatus();
}

/** Call this function once, passing a callback.
 * The passed callback function will be called when all the modules of the webphone are loaded in the page.
 * All the initialization of the webphone should be done here.
 * (no parameters) */
function onLoaded(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.loadedcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called when the webphone is initializing.
 * (no parameters) */
function onStart(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.startcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on registered (connected) to VoIP server.
 * (no parameters) */
function onRegistered(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.registeredcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on unregistered (disconnected) from VoIP server.
 * (no parameters) */
function onUnRegistered(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.unregisteredcb = callback;
}

/** Call this function once, passing a callback.
 * The passed callback function will be called on every call state change.
 * --PARAMETERS --
 * status: can have following values: callSetup, callRinging, callConnected, callDisconnected
 * direction: 1 (outgoing), 2 (incoming)
 * peername: is the other party username
 * peerdisplayname: is the other party display name if any*/
function onCallStateChange(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.callstatechangecb = callback;
}
/** Call this function once, passing a callback.
 * The passed callback function will be called when chat message is received.
 * --PARAMETERS --
 * from: username, phone number or sip URI of the sender
 * msg: the content of the text message */
function onChat(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.chatcb = callback;
    // place your code here
}

/** Call this function once, passing a callback.
 * The passed callback function will be called each call. You will receive a CDR (call detail record).
 * --PARAMETERS --
 * caller: the caller party username
 * called: called party username
 * connecttime: milliseconds elapsed between call initiation and call connect
 * duration: milliseconds elapsed between call connect and hangup (0 for not connected calls. Divide by 1000 to obtain seconds.)
*/
function onCdr(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.cdrcb = callback;
}

/**
* Optionally you can "start" the phone, before making any other action. 
* In some circumstances the initialization procedure might take a few seconds (depending on usable engines) so you can prepare the webphone with this method
* to avoid any delay when the user really needs to use by pressing the call button for example. 
* If the serveraddress/sipusername/sippassword is already set and auto register is not disabled, then the webphone will also register (connect) to the SIP server upon start.
* If start is not called, then the webphone will initialize itself the first time when you call some other function such as register or call.
* The webphone parameter should be set before you call this method (preset in the js file or by using the setparameter function).
*/
function start ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Start', [parameters]);
    else
        plhandler.Start(parameters);
}

/** Optionally you can "register". This will "connect" to the SIP server if not already connected by the start method */
function register ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Register', [parameters]);
    else
        plhandler.Register(parameters);
}

/** Initiate call to a number, sip username or SIP URI.*/
function call (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Call', [number]);
    else
        plhandler.Call(number);
}

/** Initiate video call to a number, sip username or SIP URI.*/
function videocall (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('VideoCall', [number]);
    else
        plhandler.VideoCall(number);
}

/** Disconnect current call(s).*/
function hangup ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Hangup', []);
    else
        plhandler.Hangup();
}

/** Connect incoming call*/
function accept ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Accept', []);
    else
        plhandler.Accept();
}

/** Disconnect incoming call.*/
function reject ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Reject', []);
    else
        plhandler.Reject();
}

/** Ignore incoming call.*/
function ignore ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Ignore', []);
    else
        plhandler.Ignore();
}

/**
 * Returns a String list of available call functions, sepparated by comma, based on what functions are supported by the current VoIP engine
 * Possible values: conference,transfer,mute,hold,chat
 *                  or ERROR, if webphone is not yet started
*/
function getavailablecallfunc ()
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
    {
        webphone_api.Log('ERROR, webphone_api: getavailablecallfunc plhandler is not defined');
        return 'ERROR, webphone is not yet started';
    }
    else
    {
        return plhandler.GetAvailableCallfunc();
    }
}

/** 
* Forward incoming call to number
*/
function forward (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Forward', [number]);
    else
        plhandler.Forward(number);
}

/** 
* Add people to conference.
* If number is empty than will mix the currently running calls (if there is more than one call)
* Otherwise it will call the new number (usually a phone number or a SIP user name) and once connected will join with the current session.
*/
function conference (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Conference', [number]);
    else
        plhandler.Conference(number);
}

/** 
* Transfer current call to number which is usually a phone number or a SIP username. (Will use the REFER method after SIP standards).
* You can set the mode of the transfer with the “transfertype” parameter.
*/
function transfer (number)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Transfer', [number]);
    else
        plhandler.Transfer(number);
}

/** 
* Send DTMF message by SIP INFO or RFC2833 method (depending on the "dtmfmode" parameter).
* Please note that the dtmf parameter is a string. This means that multiple dtmf characters can be passed at once
* and the webphone will streamline them properly. Use the space character to insert delays between the digits.
* The dtmf messages are sent with the protocol specified with the “dtmfmode” parameter.
* Example:	API_Dtmf(-2," 12 345 #");
*/
function dtmf (dtmf)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Dtmf', [dtmf]);
    else
        plhandler.Dtmf(dtmf);
}

/** 
*  Mute current call. The direction can have the following values:
*   0:  mute both
*	1:  mute out (speakers)
*	2:  mute in (microphone) (Default)
*/
function mute (mute, direction)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('MuteEx', [mute, direction]);
    else
        return plhandler.MuteEx(mute, direction);
}

/** Will return true if the call is muted, otherwise false */
function ismuted ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsMuted();
    else
        return false;
}

/** 
* Set state to "true" to put the calll on hold
* or "false" to unhold the call
*/
function hold (state)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('Hold', [state]);
    else
        return plhandler.Hold(state);
}

/** Will return true if the call is on hold, otherwise false */
function isonhold ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsOnHold();
    else
        return false;
}

/** 
* Send a chat message. (SIP MESSAGE method after RFC 3428)
* Number can be a phone number or SIP username/extension number.
*/
function sendchat (number, msg)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('SendChat', [number, msg]);
    else
        plhandler.SendChat(number, msg);
}

/** 
* Send a SMS message.
* Number can be a PSTN or mobile phone number.
* from is optional
*/
function sendsms (number, msg, from)
{
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('SendSms', [number, msg, from]);
    else
        plhandler.SendSms(number, msg, from);
}

/** Start/stop voice record */
function voicerecord (bool, url)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.Voicerecord(bool, url);
}

/** Open audio device selector dialog (built-in user interface).*/
function audiodevice ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.AudioDevice();
}

/** Call this function and pass a callback, to receive a list of all available audio devices.
 * For the dev parameter pass 0 for recording device names list or 1 for the playback or ringer devices */
function getaudiodevicelist (dev, callback)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetAudioDeviceList(dev, callback);
}

/** Call this function and pass a callback, to receive the currently set audio device.
 * For the dev parameter pass 0 for recording device or 1 for the playback or ringer device */
function getaudiodevice (dev, callback)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetAudioDevice(dev, callback);
}

/** Select an audio device. The devicename should be a valid audio device name (you can list them with the API_GetAudioDeviceList call)
 * For the dev parameter pass 0 for recording device or 1 for the playback or ringer device
 * The "immediate" parameter can have the following values (!!! only for Java and Native Service engines):
-0: default
-1: next call only
-2: immediately for active calls
 */
function setaudiodevice (dev, devicename, immediate)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetAudioDevice(dev, devicename, immediate);
}

/** 
* Set volume (0-100%) for the selected device. Default value is 50% -> means no change
* The dev parameter can have the following values:
*  0 for the recording (microphone) audio device
*  1 for the playback (speaker) audio device
*  2 for the ringback (speaker) audio device
*/
function setvolume(dev, volume)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetVolume(dev, volume);
}

/**
* Call this function, passing a callback
* Return the volume (0-100%) for the selected device.
* The dev parameter can have the following values:
*  0 for the recording (microphone) audio device
*  1 for the playback (speaker) audio device
*  2 for the ringback (speaker) audio device
 */
function getvolume(dev, callback)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetVolume(dev, callback);
}

/** Any additional parameters must be set before start/register/call is called*/
function setparameter (param, value)
{
    if (typeof (param) === 'undefined' || param === null || typeof (value) === 'undefined') { return false; }
    parameters[param] = value;
    
    if (typeof (plhandler) === 'undefined' || plhandler === null)
        api_helper.AddToQueue('SetParameter', [param, value]);
    else
        plhandler.SetParameter(param, value);
}

/** Will return value of a parameter if exists, otherwise will return empty string*/
function getparameter (param)  // string
{
    if (typeof (param) === 'undefined' || param === null) { return ''; }
    
    var value = parameters[param];
    
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
    {
        return plhandler.GetParameter(param);
    }else
    {
        var err_msg = 'ERROR, Webphone settings not loaded just yet';
        if (console)
        {
            if (console.error) { console.error(err_msg); }
            else if (console.log) { (console.log(err_msg)); }
        }
    }
    
    if (typeof (value) === 'undefined' || value === null) { return ''; }
    
    return value;
}

/** Will set the current channel. (Use only if you present line selection for the users. Otherwise you don’t have to take care about the lines).
 *  Currently available only for Java and Service plugin */
function setline (line)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetLine(line);
}

/** Will return the current active line number. This should be the line which you have set previously except after incoming and outgoing calls (the webphone will automatically switch the active line to a new free line for these if the current active line is already occupied by a call).
 *  Currently available only for Java and Service plugin */
function getline () //int
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
    {
        return plhandler.GetLine();
    }
    return -1;
}

/** Return true if the webphone is registered ("connected") to the SIP server.*/
function isregistered () // boolean
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsRegistered();
    else
        return false;
}

/** Return true if the user is in call, false otherwise*/
function isincall () // boolean
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsInCall();
    else
        return false;
}

/** Unregister SIP account from VoIP server*/
function unregister ()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.Unregister();
};

/** 
* Will receive presence information as events: PRESENCE, status,username,displayname,email (displayname and email can be empty)
* Userlist: list of sip account username separated by comma
*/
function checkpresence (userlist)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.CheckPresence(userlist);
}

/** Function call to change the user online status with one of the followings strings: Online, Away, DND, Invisible, Offline (case sensitive) */
function setpresencestatus(statustring)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetPresenceStatus (statustring);
}

/** Check if communication channel is encrypted: -1=unknown, 0=no, 1=partially, 2=yes, 3=always*/
function isencrypted()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.IsEncrypted ();
    else
        return -1;
}
/** Set a custom sip header (a line in the SIP signaling) that will be sent with all messages.
 * Can be used for various integration purposes (for example for sending the http session id).
 * You can also set this with applet parameter (customsipheader).*/
function setsipheader(header)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.SetSipHeader(header);
    else
        webphone_api.Log('ERROR, webphone_api: setsipheader plhandler is not defined');
}

/** Call this function passing a callback.
 * The passed callback function will be called with one parameter, which will be the string value of the requested sip header.*/
function getsipheader(header, callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.GetSipHeader(header, callback);
    else
        webphone_api.Log('ERROR, webphone_api: getsipheader plhandler is not defined');
}

/** Delete stored data (from cookie and localstorage): settings, contacts, callhistory, messages
 *  level: 1=just settings file, 2=delete everything: settings, contacts, callhistory, messages */
function delsettings(level)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.delsettings(level);
    else
        webphone_api.Log('ERROR, webphone_api: delsettings plhandler is not defined');
}

/** Returns the currently used engine: "java", "webrtc", "ns", "app", "flash", "p2p", "nativedial". Can return empty string if engine selection is in progress*/
function getenginename()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.Getenginename();
    else
        webphone_api.Log('ERROR, webphone_api: getenginename plhandler is not defined');
}

/** Call this function once, passing a callback.
 * The passed callback function will receive all the logs in real time.
 * --PARAMETERS --
 * logmessage: one log message
 */
function onLog(callback)
{
    if ( !callback || typeof (callback) !== 'function' ) { return; }
    webphone_api.logcb = callback;
}

/** Returns a string containing all the logs of the webphone*/
function getlogs()
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        return plhandler.getlogs();
    else
        webphone_api.Log('ERROR, webphone_api: getlogs plhandler is not defined');
}

/** If engine is Java or Service plugin, then you can access the full java API as described in the JVoIP SDK documentation: http://www.mizu-voip.com/Software/JVoIP_Doc.pdf
 * --PARAMETERS --
 * name: name of the function
 * jargs: array of arguments passed to the called function; Must be an array, if API function has parameters. If API function has no parameters, then it can be an empty array, null, or omitted altogether
 * ex: API function: API_Call(number)   can be called like this:   webphone_api.jvoip('API_Call',  [number]); */
function jvoip(name, jargs)
{
    if (typeof (plhandler) !== 'undefined' && plhandler !== null)
        plhandler.Jvoip(name, jargs);
    else
        webphone_api.Log('ERROR, webphone_api: jvoip plhandler is not defined');
}

//***************** public API END *********************


var wphone = {
    getEvents: getEvents,
    getStatus: getStatus,
    onRegistered: onRegistered,
    onUnRegistered: onUnRegistered,
    onLoaded: onLoaded,
    onStart: onStart,
    onCallStateChange: onCallStateChange,
    onChat: onChat,
    onCdr: onCdr,
    start: start,
    register: register,
    call: call,
    videocall: videocall,
    hangup: hangup,
    accept: accept,
    reject: reject,
    ignore: ignore,
    getavailablecallfunc: getavailablecallfunc,
    forward: forward,
    conference: conference,
    transfer: transfer,
    dtmf: dtmf,
    mute: mute,
    ismuted: ismuted,
    hold: hold,
    isonhold: isonhold,
    sendchat: sendchat,
    sendsms: sendsms,
    voicerecord: voicerecord,
    audiodevice: audiodevice,
    getaudiodevicelist: getaudiodevicelist,
    getaudiodevice: getaudiodevice,
    setaudiodevice: setaudiodevice,
    setvolume: setvolume,
    getvolume: getvolume,
    setparameter: setparameter,
    getparameter: getparameter,
    isregistered: isregistered,
    isincall: isincall,
    unregister: unregister,
    
    setline: setline,
    getline: getline,
    checkpresence: checkpresence,
    setpresencestatus: setpresencestatus,
    isencrypted: isencrypted,
    setsipheader: setsipheader,
    getsipheader: getsipheader,
    delsettings: delsettings,
    getenginename: getenginename,
    getlogs: getlogs,
    onLog: onLog,
    jvoip: jvoip,
    parameters: parameters,
    evcb: null,
    loadedcb: null,
    startcb: null,
    registeredcb: null,
    unregisteredcb: null,
    callstatechangecb: null,
    chatcb: null,
    cdrcb: null,
    logcb: null
};
//window.wphone = wphone;
return wphone;
})();
var wpbdir = webphone_api.parameters['webphonebasedir'];
if (typeof(wpbdir) === 'undefined' || wpbdir === null || wpbdir === '.' || wpbdir.length < 2) { wpbdir = ''; }
if (wpbdir.length > 1 && wpbdir.lastIndexOf('/') < wpbdir.length - 1){wpbdir = wpbdir + '/';}
try{console.log('base diectory - webphonebasedir(helper): ' + wpbdir);} catch(err) { }
document.write('<script type="text/javascript" src="' + wpbdir + 'js/lib/api_helper.js"></script>');
