// Internal Browser page
define(['jquery', 'common', 'stringres', 'global'], function($, common, stringres, global)
{

function onCreate (event) // called only once - bind events here
{
    try{
    common.PutToDebugLog(4, "EVENT, _filetransfer: onCreate");
    
    $( window ).resize(function() // window resize handling
    {
        if ($.mobile.activePage.attr('id') === 'page_filetransfer')
        {
            MeasureFiletransfer();
        }
    });

    $('#filetransfer_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected($(this).attr('id'));
    });
    $("#btn_filetransfer_menu").on("click", function() { CreateOptionsMenu('#filetransfer_menu_ul'); });
    $("#btn_filetransfer_menu").attr("title", stringres.get("hint_menu"));
    
    $("#btn_filetransfpick").on("click", function() { common.PickContact(PickContactResult); });
    $("#btn_filetransfpick").attr("title", stringres.get('hint_choosect'));
    
    $("#filetransfer_btnback").attr("title", stringres.get("hint_btnback"));
    
//    $("#btn_filetransf").on("click", function(event) { SendFile(event); });
//    $("#btn_filetransf").attr("title", stringres.get('hint_filetranf'));
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: onCreate", err); }
}

var iframe = document.createElement('iframe');
var actionurl = '';
function onStart(event)
{
    try{
    common.PutToDebugLog(4, "EVENT, _filetransfer: onStart");
    global.isFiletransferStarted = true;
    
    if (!common.isNull(document.getElementById('filetransfer_title')))
    {
        document.getElementById('filetransfer_title').innerHTML = stringres.get("filetransf_title");
    }
    $("#filetransfer_title").attr("title", stringres.get("hint_page"));

    if (!common.isNull(document.getElementById('filetransfer_btnback')))
    {
        document.getElementById('filetransfer_btnback').innerHTML = '<span>&LT;</span>&nbsp;' + stringres.get("go_back_btn_txt");
    }
    
    var destination = common.GetIntentParam(global.intentfiletransfer, 'destination');
    if (common.isNull(destination)) { destination = ''; }
    $('#filetransfpick_input').val(destination);
    
    $(".separator_line_thick").css( 'background-color', common.HoverCalc(common.getBgColor('#filetransfer_header'), -30) );
    
    $("#filetransfpick_input").attr("placeholder", stringres.get("filetransfer_nr"));
    // set focus on destination
    setTimeout(function ()
    {
        var tovalTmp = $("#filetransfpick_input").val();
        if (common.isNull(tovalTmp) || (common.Trim(tovalTmp)).length < 1)
        {
            $("#filetransfpick_input").focus();
        }
    }, 100);
    
    actionurl = GetFormActionUrl();
    common.PutToDebugLog(4, 'EVENT, filetransfer actionurl: ' + actionurl);
    
// add iframe
    iframe.style.background = 'transparent';
    iframe.style.border = '0';
    iframe.style.width = '100%';
    iframe.style.overflow = 'hidden';
    var html = '<body style="margin 0; padding 0; background: transparent; width: 100%; overflow:hidden; font-size: 1em; color: #cecece;">' +
                    '<style>' +
                        '#fileinput { padding: .6em; background: #ffffff; display: inline-block; width: 95%; border: .1em solid #b8b8b8; -webkit-border-radius: .15em; border-radius: .15em;' +
                                            'cursor: pointer; font-weight: bold; font-size: 1em; }' +

                        '#btn_filetransf { display: inline-block; margin-top: 1.5em; padding: .6em 2em .6em 2em; border: .1em solid #b8b8b8; -webkit-border-radius: .15em; border-radius: .15em;' +
                                            'cursor: pointer; font-weight: bold; font-size: 1em; background: #cccccc; }' +
                        '#btn_filetransf:hover { background: #ffffff; }' +
                    '</style>' +
                    '<form style=" width: 100%; margin: 0; padding: 0;" action="' + actionurl + '" method="post" enctype="multipart/form-data" id="frm_filetransf" name="frm_filetransf" onsubmit="OnFormSubmit()">' +
                        '<input type="hidden" id="filepath" name="filepath" value="">' +
                        '<input name="filedata" type="file" id="fileinput" /><br />' +
                        '<input type="submit" id="btn_filetransf" value="Send" title="Transfer file" />' +
                        '<script>' +
                            'function OnFormSubmit(){' +
                                'var directory = document.getElementById("filepath").value;' +
                                'var filename = document.getElementById("fileinput").value;' +
                                'parent.filetransfer_public.FileTransferOnSubmit(directory, filename);' +
                            '}' +
                        '</script>' +
                    '</form>' +
                '</body>';
    //document.body.appendChild(iframe);
    document.getElementById('ftranf_iframe_container').appendChild(iframe);
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
    iframe.onload = function (evt) { FileUploaded(evt); }
    
    var ifrmDoc = iframe.contentDocument || iframe.contentWindow.document;
    
    setTimeout(function ()
    {
        ifrmDoc.addEventListener('click', function(event)
        {
            var dest = document.getElementById('filetransfpick_input').value;

            if (common.isNull(dest) || (common.Trim(dest)).length < 1)
            {
                event.preventDefault();
                $("#filetransfpick_input").focus();
                common.ShowToast(stringres.get('filetransf_err'));
                return;
            }else
            {
                // set userguid (directory name)
                var filepath = common.GetTransferDirectoryName(dest);
                ifrmDoc.getElementById('filepath').value = filepath;
                
                common.PutToDebugLog(4, 'EVENT, filetransfer directory: ' + filepath);
            }
        }, false);
        
    }, 150);
    
    MeasureFiletransfer();

    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: onStart", err); }
}

// called from iframe -> for onsubmit
var transf_initiated = false;
function FileTransferOnSubmit(directory, filename)
{
    try{
    common.PutToDebugLog(4, 'EVENT, FileTransferOnSubmit called from iframe form');
    common.PutToDebugLog(4, 'EVENT, FileTransferOnSubmit directory: ' + directory + '; filename: ' + filename);
    
    //FileTransferOnSubmit directory: 0ecf34d0bd5c69f07b6fa8b654d80a74; filename: C:\fakepath\webphonejar_parameters.txt
    
    if (common.isNull(directory)) { directory = ''; } else { directory = '/' + directory; }
    if (common.isNull(filename) || filename.length < 1)
    {
        common.PutToDebugLog(3, 'ERROR, FileTransfer send failed: ivalid filename: ' + filename);
        common.ShowToast(stringres.get('fitransf_failed'));
        return;
    }
    
    var pos = filename.lastIndexOf('/');
    if (pos >= 0) { filename = filename.substring(pos + 1, filename.length); }
    pos = filename.lastIndexOf('\\');
    if (pos >= 0) { filename = filename.substring(pos + 1, filename.length); }
    
// the path of the uploaded file on the server
    var transferpath = actionurl + 'filestorage' + directory + '/' + NormalizeFilename(filename);
    common.PutToDebugLog(4, 'EVENT, FileTransferOnSubmit filepath: ' + transferpath);
    
    $('#ftranf_status').html(stringres.get('ftrnasf_status_processing'));
    
    // go back one step in history, otherwise <Back must be clicked 2 times to close the window
   /*setTimeout(function ()
    {
        $.mobile.back();
        common.ShowToast(stringres.get('fitransf_succeded'));
    }, 1500);*/
    
// send chat to destination
    var msg = '[DONT_START_CHAT_WINDOW]' + common.GetParameter('sipusername') + ' ' + stringres.get('fitransf_chat') + ': ' + transferpath;
    var to = common.Trim(document.getElementById('filetransfpick_input').value);
    
    webphone_api.sendchat(to, msg);
    transf_initiated = true;
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer:  FileTransferOnSubmit", err); }
}

function FileUploaded(evt) // actually it's called on iframe.onload
{
    try{
    if (transf_initiated === false) { return; }
    transf_initiated = false;
    
    $('#ftranf_status').html(stringres.get('ftrnasf_status_waiting'));
    
    // go back one step in history, otherwise <Back must be clicked 2 times to close the window
    setTimeout(function ()
    {
        $.mobile.back();
    }, 500);
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer:  FileUploaded", err); }
}

function NormalizeFilename(filename)
{
    try{
    var tmp = filename;
    var chars = filename.split('');
    
    if (common.isNull(chars) || chars.length < 1) { return tmp; }
    
    for (var i = 0; i < chars.length; i++)
    {
        if((chars[i] >= '0' && chars[i] <= '9') ||
            (chars[i] >= 'A' && chars[i] <= 'Z') ||
            (chars[i] >= 'a' && chars[i] <= 'z') ||
            chars[i] === '_' || chars[i] === '.' || chars[i] === '-')
        {
          ; //ok
        }
        else
        {
          chars[i] = '_';
        }
    }
    
    return chars.join('');
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer:  NormalizeFilename", err); }
    return tmp;
}


function MeasureFiletransfer() // resolve window height size change
{
    try{
    //var pgh = common.GetDeviceHeight() - 1; $('#page_filetransfer').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    $('#page_filetransfer').css('min-height', 'auto'); // must be set when softphone is skin in div

    $("#page_filetransfer_content").height(common.GetDeviceHeight() - $("#filetransfer_header").height() - 2);
    //$("#log_text").height(common.GetDeviceHeight() - $("#filetransfer_header").height() - $("#sendtosupport_container").height() - 5);
    //$("#log_text").width(common.GetDeviceWidth());

    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: MeasureFiletransfer", err); }
}

function PickContactResult(number)
{
    try{
    document.getElementById('filetransfpick_input').value = number;
    //$("#msg_textarea").focus();
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: PickContactResult", err); }
}

function GetFormActionUrl()
{
    try{
    var srv = '';
// if defined in config, then use that for filetransfer
    var filetransferurl = common.GetConfig('filetransferurl');
    if (!common.isNull(filetransferurl) && filetransferurl.length > 2)
    {
        filetransferurl = common.Trim(filetransferurl);
        filetransferurl = filetransferurl.toLowerCase();
        
        if (filetransferurl.indexOf('http:') < 0 && filetransferurl.indexOf('https:') < 0) { filetransferurl = 'http://' + filetransferurl; }
        
        if (common.IsHttps())
        {
            filetransferurl = filetransferurl.replace('http:', 'https:');
        }

        return filetransferurl;
    }
    
    if (common.IsMizuWebRTCGateway())
    {
        srv = common.GetWp();
        srv = srv.replace('wss://', '');
        srv = srv.replace('ws://', '');
        srv = srv.replace('udp://', '');
        
        if (srv.indexOf('/') > 0) { srv = srv.substring(0, srv.indexOf('/')); }
    }
    else if (common.GetConfigBool('usingmizuserver', false) === true)
    {
        srv = common.GetParameter('serveraddress_user');
    }
    
    if (srv.length < 1)
    {
        common.PutToDebugLog(3, 'ERROR, filetransfer invalid server');
        return;
    }
    var protocol = 'http://';
    if (common.IsHttps()) { protocol = 'https://'; }
    
    var url = protocol + srv + '/mvweb/';
    
    //$('#frm_filetransf').attr('action', url);
    return url;
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: GetFormActionUrl", err); }
    return '';
}

var MENUITEM_FILETRANSFER_CLOSE = '#menuitem_filetransfer_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (common.GetParameter('devicetype') === common.DEVICE_WIN_SOFTPHONE())
    {
        $( "#btn_filetransfer_menu" ).removeAttr('data-transition');
    }

    if ( common.isNull(menuId) || menuId.lenght < 1 ) { common.PutToDebugLog(2, "ERROR, _filetransfer: CreateOptionsMenu menuid null"); return; }

    if ($(menuId).length <= 0) { common.PutToDebugLog(2, "ERROR, _filetransfer: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    $(menuId).html('');
    $(menuId).append( '<li id="' + MENUITEM_FILETRANSFER_CLOSE + '"><a data-rel="back">' + stringres.get('menu_close') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (common.isNull(itemid) || itemid.length < 1) { return; }
    
    $( '#filetransfer_menu' ).on( 'popupafterclose', function( event )
    {
        $( '#filetransfer_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_FILETRANSFER_CLOSE:
                $.mobile.back();
                break;
        }
    });
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    common.PutToDebugLog(4, "EVENT, _filetransfer: onStop");
    global.isFiletransferStarted = false;
    
    if (!common.isNull(iframe))
    {
        document.getElementById('ftranf_iframe_container').removeChild(iframe);
    }
    document.getElementById('filetransfpick_input').value = '';
    $('#ftranf_status').html('');
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: onStop", err); }
}

function onDestroy (event)
{
    try{
    common.PutToDebugLog(4, "EVENT, _filetransfer: onDestroy");
    global.isFiletransferStarted = false;
    
    } catch(err) { common.PutToDebugLogException(2, "_filetransfer: onDestroy", err); }
}

var filetransfer_public = {

    FileTransferOnSubmit: FileTransferOnSubmit
};
window.filetransfer_public = filetransfer_public;

// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy
};
});