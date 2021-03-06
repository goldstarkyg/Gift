// Internal Browser page
define(['jquery', 'common', 'stringres', 'global', 'platform'], function($, common, stringres, global, platform)
{

function onCreate (event) // called only once - bind events here
{
    try{
    common.PutToDebugLog(4, "EVENT, _newuser: onCreate");
    
    $( window ).resize(function() // window resize handling
    {
        if ($.mobile.activePage.attr('id') === 'page_newuser')
        {
            MeasureNewuser();
        }
    });

    $('#newuser_menu_ul').on('click', 'li', function(event)
    {
        MenuItemSelected($(this).attr('id'));
    });
    $("#btn_newuser_menu").on("click", function() { CreateOptionsMenu('#newuser_menu_ul'); });
    $("#btn_newuser_menu").attr("title", stringres.get("hint_menu"));
    
    $("#btn_create_newuser").on("click", function() { CreateUser(); });
    $("#btn_cancel_newuser").on("click", function() { $.mobile.back(); });
    
    } catch(err) { common.PutToDebugLogException(2, "_newuser: onCreate", err); }
}

function onStart(event)
{
    try{
    common.PutToDebugLog(4, "EVENT, _newuser: onStart");
    global.isNewuserStarted = true;
    
    if (!common.isNull(document.getElementById('newuser_title')))
    {
        document.getElementById('newuser_title').innerHTML = stringres.get('newuser_title');
    }
    $("#newuser_title").attr("title", stringres.get("hint_page"));

    if (!common.isNull(document.getElementById('newuser_btnback')))
    {
        document.getElementById('newuser_btnback').innerHTML = '<span>&LT;</span>&nbsp;' + stringres.get("go_back_btn_txt");
    }
    
    if (!common.isNull(document.getElementById('btn_create_newuser')))
    {
        document.getElementById('btn_create_newuser').innerHTML = stringres.get('btn_create');
    }
    
    if (!common.isNull(document.getElementById('btn_cancel_newuser')))
    {
        document.getElementById('btn_cancel_newuser').innerHTML = stringres.get('btn_cancel');
    }
    
if (global.isdebugversionakos === true)
{/*
    var resp = '{' +
'"data": {' +
'"fields": [' +
'{' +
'"name": " firstname ",' +
'"displayName": "First name",' +
'"type": "text",' +
'"width": "100%",' +
'"value": "",' +
'"mandatory": true,' +
'"validation": ""' +
'}, {' +
'"name": " country ",' +
'"displayName": "Country",' +
'"type": "select",' +
'"width": "100%",' +
'"value": "api:settings\/countrieslist",' +
'"mandatory": true,' +
'"validation": ""' +
'}, {' +
'"name": " username ",' +
'"displayName": "Username",' +
'"type": "text",' +
'"width": "100%",' +
'"value": "",' +
'"mandatory": true,' +
'"validation": "api:clients\/usernameavailable"' +
'}, {' +
'"name": " email ",' +
'"displayName": "Email",' +
'"type": "email",' +
'"width": "100%",' +
'"value": "",' +
'"mandatory": true,' +
'"validation": "email"' +
'}, {' +
'"name": " promocode ",' +
'"displayName": "Promo code (optional)",' +
'"type": "text",' +
'"minlength": 8,' +
'"maxlength": 8,' +
'"width": "30%",' +
'"value": "",' +
'"mandatory": false,' +
'"validation": "api:settings\/promocodevalidation"' +
'}, {' +
'"name": " device ",' +
'"model": "akarmi",' +
'"type": "hidden"' +
'}, {' +
'"name": " dialer ",' +
'"type": "hidden"' +
'}, {' +
'"name": " client_ip ",' +
'"type": "hidden"' +
'}' +
'],' +
'"action": "api:clients\/createaccount",' +
'"method": "post"' +
'},' +
'"error": ""' +
'}';
    HttpResponseHandler('{"data": [{"c":"AF","n":"Afghanistan"},{"c":"AX","n":"Aland Islands"},{"c":"AL","n":"Albania"},{"c":"DZ","n":"Algeria"}]}', 'get_new_user_countrylist');
    HttpResponseHandler(resp, 'get_new_user_form_fields');
    return;*/
}
    
    MeasureNewuser();
    
    PopulateData();
    
    } catch(err) { common.PutToDebugLogException(2, "_newuser: onStart", err); }
}

function MeasureNewuser() // resolve window height size change
{
    try{
    //var pgh = common.GetDeviceHeight() - 1; $('#page_newuser').css('min-height', pgh + 'px'); // must be set when softphone is skin in div
    $('#page_newuser').css('min-height', 'auto'); // must be set when softphone is skin in div

    $(".separator_line_thick").css( 'background-color', common.HoverCalc(common.getBgColor('#page_newuser'), -30) );
    
    var heightTemp = common.GetDeviceHeight() - $("#newuser_header").height() - $("#newuser_footer").height();
    heightTemp = heightTemp - 3;
    heightTemp = Math.floor(heightTemp);
    $("#page_newuser_content").height(heightTemp);
    
    } catch(err) { common.PutToDebugLogException(2, "_newuser: MeasureNewuser", err); }
}

function PopulateData()
{
    try{
    var reguri = common.GetParameter('newuser');
    
    // http://216.155.138.27:8084/xmapi/adduser?key=a4fg6cvss3a&u_username=USERNAME&u_password=PASSWORD&u_email=MAIL&u_name=NAME&phone=PHONE
    // &address=ADDRESS&country=COUNTRY&birthday=BIRTHDAY&gender=GENDER&forgotpasswordquestion=FORGOTPASSWORDQUESTION&forgotpasswordanswer=FORGOTPASSWORDANSWER&now
    
    $('#label_nu_username').html( '*' + stringres.get('nu_username') );
    $('#label_nu_password').html( '*' + stringres.get('nu_password') );
    $('#label_nu_email').html( stringres.get('nu_email') );
    $('#label_nu_fullname').html( stringres.get('nu_fullname') );
    $('#label_nu_phone').html( stringres.get('nu_phone') );
    $('#label_nu_address').html( stringres.get('nu_address') );

    $('#label_nu_country').html( stringres.get('nu_country') );
    $('#label_nu_birthday').html( stringres.get('nu_birthday') );
    $('#label_nu_gender').html( stringres.get('nu_gender') );
    $('#label_nu_fpq').html( stringres.get('nu_fpq') );
    $('#label_nu_fpa').html( stringres.get('nu_fpa') );
    
// dynamically get form fields
    var newuserform = common.GetConfig('newuserform');
    var newusercountrylist = common.GetConfig('newusercountrylist');
    if (!common.isNull(newuserform) && newuserform.length > 0)
    {
        if (!common.isNull(newusercountrylist) && newusercountrylist.length > 4)
        {
                //pd = ProgressDialog.show(instance, "", instance.getResources().getString(R.string.loading));

                common.UriParser(newusercountrylist, '', '', '', '', 'get_new_user_countrylist');
/*
            // wee need a delay for the request to be executed, otherwise we overwrite WorkerThread.httpReqUri  members values, and only the last request will be executed
                setTimeout(function ()
                {
                    common.UriParser(newuserform, '', '', '', '', 'get_new_user_form_fields');
                }, 500);*/
        }else
        {
            common.UriParser(newuserform, '', '', '', '', 'get_new_user_form_fields');
        }
    }else
    {
        if (!common.isNull(reguri) && reguri.length > 0)
        {
            if (reguri.indexOf("USERNAME") >= 0)
            {
                document.getElementById('nu_username_container').style.display = 'block';
            }
            if (reguri.indexOf("PASSWORD") >= 0)
            {
                document.getElementById('nu_password_container').style.display = 'block';
            }
            if (reguri.indexOf("MAIL") >= 0)
            {
                document.getElementById('nu_email_container').style.display = 'block';
            }
            if (reguri.indexOf("NAME") >= 0)
            {
                document.getElementById('nu_fullname_container').style.display = 'block';
            }
            if (reguri.indexOf("PHONE") >= 0)
            {
                document.getElementById('nu_phone_container').style.display = 'block';
            }
            if (reguri.indexOf("ADDRESS") >= 0)
            {
                document.getElementById('nu_address_container').style.display = 'block';
            }

            if (reguri.indexOf("COUNTRY") >= 0)
            {
                document.getElementById('nu_country_container').style.display = 'block';
            }
            if (reguri.indexOf("BIRTHDAY") >= 0)
            {
                document.getElementById('nu_birthday_container').style.display = 'block';
            }
            if (reguri.indexOf("GENDER") >= 0)
            {
                document.getElementById('nu_gender_container').style.display = 'block';
            }
            if (reguri.indexOf("FORGOTPASSWORDQUESTION") >= 0)
            {
                document.getElementById('nu_fpq_container').style.display = 'block';
            }
            if (reguri.indexOf("FORGOTPASSWORDANSWER") >= 0)
            {
                document.getElementById('nu_fpa_container').style.display = 'block';
            }
        }
    }
    } catch(err) { common.PutToDebugLogException(2, "_newuser: PopulateData", err); }
}

function CreateUser()	// Create User btn onclick
{							// validating the data entered by the user
    try{
// dynamically get form fields
    var newuserform = common.GetConfig('newuserform');
    if (!common.isNull(newuserform) && newuserform.length > 0)
    {
        var nameL = []; // list of parameter's names
        var valueL = []; // list of parameter value's names

        var item = null; // array
        for (var i = 0; i < formf.length; i++)
        {
            item = formf[i];
            if (common.isNull(item) || item.length < 4) { continue; }

            var name = item[FRM_NAME];
            var dispname = item[FRM_DISPNAME];
            var mandatory = item[FRM_MANDATORY];
            var validate = item[FRM_VALIDATION_TYPE];
            var type = item[FRM_TYPE];
            var value = "";
            
            if (common.isNull(type)) { type = ''; }
            type = type.toString();
            type = common.Trim(type);
            type = type.toLowerCase();
            
            var id = 1000 + i;
            var idstr = id.toString();

        // text
            if (type.length < 1 || type === 'text' || type === 'email')
            {
                value = $('#nu_' + idstr).val();
            }
            else if (type === 'select')
            {
                value = $('#nu_' + idstr + ' option:selected').val();
            }

            if (common.isNull(value)) { value = ''; }
            value = common.Trim(value);

    // handle mandatory fields
            if (common.isNull(mandatory)) { mandatory = ''; }
            mandatory = mandatory.toString();
            if (value.length < 1 && !common.isNull(mandatory) && mandatory.length > 0)
            {
                mandatory = mandatory.toLowerCase();
                if (mandatory.indexOf('yes') >= 0 || mandatory.indexOf('true') >= 0 || mandatory.indexOf('1') >= 0)
                {
                    common.ShowToast(stringres.get('newuser_pleaseenter') + ' ' + dispname);
                    return;
                }
            }
            
    // handle validation
            if (common.isNull(validate)) { validate = ''; }
            validate = validate.toString();
            validate = validate.toLowerCase();
            if (validate.indexOf('yes') >= 0 || validate.indexOf('true') >= 0 || validate.indexOf('1') >= 0 || validate.indexOf('mail') >= 0)
            {
                var isvalid = true;
            // if email
                if (validate.indexOf('mail') >= 0 || name.indexOf('mail') >= 0)
                {
                    if (common.isNull(value.match("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9|-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")))
                    {
                        isvalid = false;
                    }
                }
            // for username, password
                else if (validate.indexOf('user') >= 0 || name.indexOf('user') >= 0 || validate.indexOf('password') >= 0 || name.indexOf('password') >= 0)
                {
                    if (common.isNull(value.match("^[A-Za-z0-9_-]{2,40}$")))
                    {
                        isvalid = false;
                    }
                }

                if (isvalid === false)
                {
                    common.ShowToast(stringres.get('newuser_invalid') + ' ' + dispname);
                    return;
                }
            }
            
            nameL.push(name);
            valueL.push(value);
        }

// construct uri	[DYNAMIC_PARAMS]
        var params = '';
        for (var i = 0; i < nameL.length; i++)
        {
            var name = nameL[i];
            var value = valueL[i];
            if (common.isNull(name) || name.length < 1 || common.isNull(value)) { continue; }
            
            if (params.length > 0) params = params + "&";

            if (value.indexOf("@") < 1) { value = encodeURIComponent(value); } // don't encode email address
            params = params + name + "=" + value;
        }

        if (common.GetConfigInt('brandid', -1) === 50) // favafone // add extra parameters
        {
            var pname = platform.name;
            var pver = platform.version;

            if (common.isNull(pname) || common.GetOs() === 'Android') { pname = common.GetBrowser(); }
            if (common.isNull(pver)) { pver = common.GetBrowserVersion(); }

            params = params + "&device=version_name:" + common.GetVersionStr() + "-version_code:" + global.code_version + "-os_version:" + platform.os
                                        + "-make:" + pname + "-model:" + pver;
            params = params + "&dialer=webphone";
                //params = params + "&client_ip=" + CommonGUI.GetIPAddress(true);
                //"name": " device ", // if possible send all available information for the device brand,model
                //"name": " dialer ", // android or ios
                //"name": " client_ip ", // if possible send remote client IP address
        }

        var url = common.GetConfig('newuser');
        if (url.indexOf("?") < 1) { params = "?" + params; }
        url = url.replace('[DYNAMIC_PARAMS]', params);

        common.UriParser(url, '', '', '', '', 'newuser_dynamic');
        return;
    }
// END of dynamic
                
                
    var username = document.getElementById('nu_username').value;
    var password = document.getElementById('nu_password').value;
    var email = document.getElementById('nu_email').value;
    var fullName = document.getElementById('nu_fullname').value;
    var phone = document.getElementById('nu_phone').value;
    var address = document.getElementById('nu_address').value;
    
    var country = document.getElementById('nu_country').value;
    var birthday = document.getElementById('nu_birthday').value;
    var gender = document.getElementById('nu_gender').value;
    var fpq = document.getElementById('nu_fpq').value;
    var fpa = document.getElementById('nu_fpa').value;
    
    if (common.isNull(username)) { username = ''; } else { username = common.Trim(username); }
    if (common.isNull(password)) { password = ''; } else { password = common.Trim(password); }
    if (common.isNull(email))    { email = '';    } else { email = common.Trim(email); }
    if (common.isNull(fullName)) { fullName = ''; } else { fullName = common.Trim(fullName); }
    if (common.isNull(phone))    { phone = '';    } else { phone = common.Trim(phone); }
    if (common.isNull(address))  { address = '';  } else { address = common.Trim(username); }
    
    if (common.isNull(country))  { country = '';  } else { country = common.Trim(country); }
    if (common.isNull(birthday)) { birthday = ''; } else { birthday = common.Trim(birthday); }
    if (common.isNull(gender))   { gender = '';   } else { gender = common.Trim(gender); }
    if (common.isNull(fpq))      { fpq = '';      } else { fpq = common.Trim(fpq); }
    if (common.isNull(fpa))      { fpa = '';      } else { fpa = common.Trim(fpa); }

    //    	"http://mizu-voip.com:8888/xmapi/new?key=18542&amp;usr=${USERNAME}&amp;pwd=${PASSWORD}&amp;mail=${MAIL}&amp;name=${NAME}&amp;phone=${PHONE}&amp;address=${ADDRESS}&amp;now"
    //verify input fields
    if (document.getElementById('nu_username_container').style.display === 'block')
    {
        if (common.isNull(username) || username.length < 1)
        {
            common.ShowToast(stringres.get('err_msg_8'));
            return;
        }
        else if (username.length < common.MIN_USR_PWD_LENGHT)
        {
            common.ShowToast(stringres.get('err_msg_13') + ' ' + common.MIN_USR_PWD_LENGHT);
            return;
        }else if (common.isNull( username.match("^[A-Za-z0-9_-]{2,120}$") )
                || ( username.match("^[A-Za-z0-9_-]{2,120}$")[0] ).length < 1  )
        {
            common.ShowToast(stringres.get('err_msg_14'));
            return;
        }
    }
    
    if (document.getElementById('nu_password_container').style.display === 'block')
    {
        if (common.isNull(password) || password.length < 1)
        {
            common.ShowToast(stringres.get('err_msg_9'));
            return;
        }
        else if (password.length < common.MIN_USR_PWD_LENGHT)
        {
            common.ShowToast(stringres.get('err_msg_15') + ' ' + common.MIN_USR_PWD_LENGHT);
            return;
        }else if (common.isNull( password.match("^[A-Za-z0-9_-]{2,120}$") ) || ( password.match("^[A-Za-z0-9_-]{2,120}$")[0] ).length < 1  )
        {
            common.ShowToast(stringres.get('err_msg_16'));
            return;
        }
    }
    /*
    if (document.getElementById('nu_email_container').style.display === 'block')
    {
        if (common.isNull(email) || email.length < 1)
        {
            common.ShowToast(stringres.get('err_msg_10'));
            return;
        }else if (common.isNull( email.match("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9|-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$") )
                || ( email.match("^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9|-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$")[0] ).length < 1  )
        {
            common.ShowToast(stringres.get('err_msg_12'));
            return;
        }
    }
    
    if (document.getElementById('nu_fullname_container').style.display === 'block')
    {
        if (common.isNull(fullName) || fullName.length < 1)
        {
            common.ShowToast(stringres.get('err_msg_11'));
            return;
        }
        else if (fullName.length < common.MIN_USR_PWD_LENGHT)
        {
            common.ShowToast(stringres.get('err_msg_17') + ' ' + common.MIN_USR_PWD_LENGHT);
            return;
        }else if (common.isNull( fullName.match("^[A-Za-z0-9_ -]{2,150}$") ) || ( fullName.match("^[A-Za-z0-9_ -]{2,150}$")[0] ).length < 1  )
        {
            common.ShowToast(stringres.get('err_msg_18'));
            return;
        }
        
        fullName = encodeURIComponent(fullName);
        reguri = reguri.replace("[NAME]", fullName);
    }*/
        
    if (document.getElementById('nu_phone_container').style.display === 'block')
    {/*
        if (common.isNull(phone) || phone.length < 1)
        {
            common.ShowToast(stringres.get('err_msg_21'));
            return;
        }
        else */
        if (phone.length > 0)
        {
            if (phone.length < 5)
            {
                common.ShowToast(stringres.get('err_msg_19'));
                return;
            }else if (common.isNull( phone.match("^[0-9+]{3,25}$") ) || ( fullName.match("^[0-9+]{3,25}$")[0] ).length < 1  )
            {
                common.ShowToast(stringres.get('err_msg_19'));
                return;
            }
        }
    }
    /*
    if (document.getElementById('nu_address_container').style.display === 'block')
    {
        if (common.isNull(address) || address.length < 10)
        {
            common.ShowToast(stringres.get('err_msg_20'));
            return;
        }
        
        address = encodeURIComponent(address);
        reguri = reguri.replace("[ADDRESS]", address);
    }*/
    
    phone = common.ReplaceAll(phone, ' ', '');
    fullName = encodeURIComponent(fullName);
    phone = encodeURIComponent(phone);
    address = encodeURIComponent(address);
    country = encodeURIComponent(country);
    birthday = encodeURIComponent(birthday);
    gender = encodeURIComponent(gender);
    fpq = encodeURIComponent(fpq);
    fpa = encodeURIComponent(fpa);
    
    
    //building request URI
    var reguri = common.GetParameter('newuser');

    reguri = reguri.replace("[USERNAME]", username);
    reguri = reguri.replace("USERNAME", username);
    reguri = reguri.replace("USRNAME", username);
    
    reguri = reguri.replace("[PASSWORD]", password);
    reguri = reguri.replace("PASSWORD", password);
    
    reguri = reguri.replace("[MAIL]", email);
    reguri = reguri.replace("MAIL", email);
    
    reguri = reguri.replace("[NAME]", fullName);
    reguri = reguri.replace("NAME", fullName);
    
    reguri = reguri.replace("[PHONE]", phone);
    reguri = reguri.replace("PHONE", phone);

    reguri = reguri.replace("[ADDRESS]", address);
    reguri = reguri.replace("ADDRESS", address);
    
    reguri = reguri.replace("CURRENCY", "");
    reguri = reguri.replace("DEVICEID", GetDeviceId());
    
    reguri = reguri.replace("COUNTRY", country);
    reguri = reguri.replace("BIRTHDAY", birthday);
    reguri = reguri.replace("GENDER", gender);
    reguri = reguri.replace("FORGOTPASSWORDQUESTION", fpq);
    reguri = reguri.replace("FORGOTPASSWORDANSWER", fpa);
    

    if (!common.isNull(email) && email.length > 0)          {   common.SaveParameter("email", email);	}
    if (!common.isNull(fullName) && fullName.length > 0)    {   common.SaveParameter("displayname", fullName);	}

    if (!common.isNull(username) && username.length > 0)    {	common.SaveParameter("sipusername", username);	}
    if (!common.isNull(password) && password.length > 0)    {	common.SaveParameter("password", password);	}
    
    common.UriParser(reguri, '', '', '', '', 'newuserreg');
    
    common.PutToDebugLog(4, "EVENT, _newuser CreateUser uri: " + reguri);

    } catch(err) { common.PutToDebugLogException(2, "_newuser: CreateUser", err); }
}

var countryNameL = null;
var countryCodeL = null;
var formf = null; // form fields
var FRM_NAME = 0;
var FRM_DISPNAME = 1;
var FRM_TYPE = 2;
var FRM_DEFVAL = 3;
var FRM_MANDATORY = 4;
var FRM_VALIDATION_TYPE = 5;
function HttpResponseHandler(resp, actionHandler)
{
    try{
    if (actionHandler === 'get_new_user_countrylist')
    {
        //{"data": [{"c":"AF","n":"Afghanistan"},{"c":"AX","n":"Aland Islands"},{"c":"AL","n":"Albania"},{"c":"DZ","n":"Algeria"},...}
			
        if (resp.indexOf('HttpRequest exception') >= 0)
        {
            common.ShowToast("Can't load country list.");
            return;
        }

        if (common.GetConfigInt('brandid', -1) === 50) // favafone
        {
            var jobj = JSON.parse(resp);

            var jarray = jobj.data;
            var error = jobj.error; // string

            if (!common.isNull(error) && error.length > 0)
            {
                    common.PutToDebugLog(3, 'ERROR, newuserreg get countrylist httpresponsehandler rec error: ' + error);
                    common.ShowToast(error);
                    return;
            }

            if (common.isNull(jarray) || jarray.length < 1)
            {
                    common.PutToDebugLog(3, 'ERROR, newuserreg get countrylist httpresponsehandler data is NULL');
                    common.ShowToast("Can't load country list.");
                    return;
            }

            countryNameL = [];
            countryCodeL = [];
            countryNameL.push(''); // add empty entry for default value
            countryCodeL.push(''); // add empty entry for default value

            for (var i = 0; i < jarray.length; i++)
            {
                jobj = jarray[i];
                if (common.isNull(jobj)) { continue; }
                if (common.isNull(jobj.n) || common.isNull(jobj.c)) { continue; }

                var name = jobj.n;
                var code = jobj.c;

                if (common.isNull(name)) { name  = ''; }

                countryNameL.push(name);
                countryCodeL.push(code);
            }
        }
    }
    else if (actionHandler === 'get_new_user_form_fields')
    {
        formf = []; // form fields
	
/*{
"data": {
        "fields": [
        {
                "name": " firstname ",
                "displayName": "First name",
                "type": "text",
                "width": "100%",
                "value": "",
                "mandatory": true,
                "validation": ""
        }, {
                "name": " country ",
                "displayName": "Country",
                "type": "select",
                "width": "100%",
                "value": "api:settings\/countrieslist",
                "mandatory": true,
                "validation": ""
        }, {
                "name": " username ",
                "displayName": "Username",
                "type": "text",
                "width": "100%",
                "value": "",
                "mandatory": true,
                "validation": "api:clients\/usernameavailable"
        }, {
                "name": " email ",
                "displayName": "Email",
                "type": "email",
                "width": "100%",
                "value": "",
                "mandatory": true,
                "validation": "email"
        }, {
                "name": " promocode ",
                "displayName": "Promo code (optional)",
                "type": "text",
                "minlength": 8,
                "maxlength": 8,
                "width": "30%",
                "value": "",
                "mandatory": false,
                "validation": "api:settings\/promocodevalidation"
        }, {
                "name": " device ", // if possible send all available information for the device brand,
                model
                "type": "hidden"
        }, {
                "name": " dialer ", // android or ios
                "type": "hidden"
        }, {
                "name": " client_ip ", // if possible send remote client IP address
                "type": "hidden"
        }
        ],
        "action": "api:clients\/createaccount",
        "method": "post"
},
"error": ""
}*/
        
        if (typeof (resp) === 'string' && resp.indexOf('HttpRequest exception') >= 0)
        {
            common.ShowToast("Can't load fileds. Please try again later.");
            return;
        }
			
        if (common.GetConfigInt('brandid', -1) === 50) // favafone
        {
            var jobj = JSON.parse(resp);

            var jarray = jobj.data;
            var error = jobj.error; // string
            
            
            var jdata = jobj.data;
            var error = jobj.error; // string

            if (!common.isNull(error) && error.length > 0)
            {
                    common.PutToDebugLog(3, 'ERROR, newuserreg httpresponsehandler rec error: ' + error);
                    common.ShowToast(error);
                    return;
            }

            if (common.isNull(jdata))
            {
                    common.PutToDebugLog(3, 'ERROR, newuserreg httpresponsehandler data is NULL');
                    common.ShowToast("Can't load form.");
                    return;
            }

            var jarray = jdata.fields;

            if (common.isNull(jarray) || jarray.length < 1) { return; }

            for (var i = 0; i < jarray.length; i++)
            {
                jobj = jarray[i];
                if (common.isNull(jobj)) { continue; }
                if (common.isNull(jobj['name']) || common.isNull(jobj['displayName']) || common.isNull(jobj['type']) || common.isNull(jobj['value'])
                         || common.isNull(jobj['mandatory']) || common.isNull(jobj['validation']))
                {
                    continue;
                }

                var name = jobj['name'];
                var displayName = jobj['displayName'];
                var type = jobj['type'];
                var defvalue = jobj['value'];
                var mandatory = jobj['mandatory'];
                var validation = jobj['validation'];


                common.PutToDebugLog(2, "name: " + name);
                common.PutToDebugLog(2, "displayName: " + displayName);
                common.PutToDebugLog(2, "type: " + type);
                common.PutToDebugLog(2, "defvalue: " + defvalue);
                common.PutToDebugLog(2, "mandatory: " + mandatory);
                common.PutToDebugLog(2, "validation: " + validation);
                common.PutToDebugLog(2, "----------------------------------");

                if (common.isNull(name)) { name = ''; }
                if (common.isNull(displayName)) { displayName = ''; }
                if (common.isNull(type)) { type = ''; }
                if (common.isNull(defvalue)) { defvalue = ''; }
                if (common.isNull(mandatory)) { mandatory = ''; }
                if (common.isNull(validation)) { validation = ''; }

                name = common.Trim(name);
                displayName = common.Trim(displayName);
                type = common.Trim(type);
                defvalue = common.Trim(defvalue);
                mandatory = common.Trim(mandatory);
                validation = common.Trim(validation);

                var item = [];
                
                item.push(name);
                item.push(displayName);
                item.push(type);
                item.push(defvalue);
                item.push(mandatory);
                item.push(validation);

                formf.push(item);
            }
        }

        PopulateDynamicFields();
    }
    } catch(err) { common.PutToDebugLogException(2, "_newuser: HttpResponseHandler", err); }
}

function PopulateDynamicFields()
{
    var nu_html_content = '';
    try{
// dynamically get form fields
    var newuserform = common.GetConfig('newuserform');
    if (common.isNull(newuserform) || newuserform.length < 1) { return; }

    if (common.isNull(formf) || formf.length < 1)
    {
        common.PutToDebugLog(3, 'ERROR,newuserreg PopulateDynamicFields list is empty');
        return;
    }
    
    var textf_templ = 
            '<div id="nu_[ENTRYID]_container">' +
                '<span id="label_nu_[ENTRYID]">[LABEL]</span>' +
                '<input name="nu_[ENTRYID]" id="nu_[ENTRYID]" value="" type="text">' +
            '</div>';
    var selectf_templ = 
            '<div id="nu_[ENTRYID]_container">' +
                '<span id="label_nu_[ENTRYID]">[LABEL]</span>' +
                '<select name="nu_[ENTRYID]" id="nu_[ENTRYID]" style="margin: 0;">[SELECTCONTENT]</select>' +
            '</div>';

    var item = null;
    for (var i = 0; i < formf.length; i++)
    {
        item = formf[i];
        if (common.isNull(item) || item.length < 4) { continue; }

        var name = item[FRM_NAME];
        var dispname = item[FRM_DISPNAME];
        var mandatory = item[FRM_MANDATORY];
        var type = item[FRM_TYPE];

// content
    // html form tag entry
        var entry = textf_templ;

        if (common.isNull(mandatory)) { mandatory = ''; }
        mandatory = mandatory.toString();
        if (!common.isNull(mandatory) && mandatory.length > 0)
        {
            mandatory = mandatory.toLowerCase();
            if (mandatory.indexOf('yes') >= 0 || mandatory.indexOf('true') >= 0 || mandatory.indexOf('1') >= 0)
            {
                dispname = '*' + dispname;
            }
        }
        
        if (common.isNull(type)) { type = ''; }
        type = common.Trim(type);

// text
        if (type.length < 1 || type === 'text' || type === 'email')
        {
            var id = 1000 + i;
            var idstr = id.toString();

            entry = common.ReplaceAll(entry, '[ENTRYID]', idstr);
            entry = entry.replace('[LABEL]', dispname);
            
            nu_html_content = nu_html_content + entry;
        }
// select
        else if (type === 'select')
        {
            entry = selectf_templ;
            var selitem_templ = '<option value="[VALUE]">[TEXT]</option>';
            
            var id = 1000 + i;
            var idstr = id.toString();
            
            entry = common.ReplaceAll(entry, '[ENTRYID]', idstr);
            entry = entry.replace('[LABEL]', dispname);
            
            var selcontent = '';
            if (name === 'country' && !common.isNull(countryNameL) && countryNameL.length > 0)
            {
                for (var j = 0; j < countryNameL.length; j++)
                {
                    var selitem = selitem_templ;
                    selitem = selitem.replace('[VALUE]', countryNameL[j]);
                    selitem = selitem.replace('[TEXT]', countryNameL[j]);
                    
                    selcontent = selcontent + selitem;
                }
            }
            
            entry = entry.replace('[SELECTCONTENT]', selcontent);
            
            nu_html_content = nu_html_content + entry;
        }

            // old style fields from XML
            /*
            TextView nu_label = (TextView) findViewById( CommonGUI.GetViewResId("nu_label_" + Integer.toString(i)) );
                    EditText nu_text = (EditText) findViewById( CommonGUI.GetViewResId("nu_text_" + Integer.toString(i)) );

                    nu_text.setHint(dispname);

                    if (mandatory != null && mandatory.length() > 0)
                    {
                            mandatory = mandatory.toLowerCase();
                            if (mandatory.indexOf("yes") >= 0 || mandatory.indexOf("true") >= 0 || mandatory.indexOf("1") >= 0)
                            {
                                    dispname = "*" + dispname;
                            }
                    }

                    nu_label.setText(dispname);

                    nu_label.setVisibility(View.VISIBLE);
                    nu_text.setVisibility(View.VISIBLE);*/
    }
    
    nu_html_content = '<form>' + nu_html_content + '</form>';
    $('#page_newuser_content').html(nu_html_content).trigger('create');
    MeasureNewuser();
    setTimeout(function () { MeasureNewuser(); }, 250);
    
    } catch(err) { common.PutToDebugLogException(2, "_newuser: PopulateDynamicFields", err); }
}

var MENUITEM_CLOSE = '#menuitem_newuser_close';

function CreateOptionsMenu (menuId) // adding items to menu, called from html
{
    try{
// remove data transition for windows softphone, because it's slow
    if (common.IsWindowsSoftphone())
    {
        $( "#btn_newuser_menu" ).removeAttr('data-transition');
    }

    if ( common.isNull(menuId) || menuId.lenght < 1 ) { common.PutToDebugLog(2, "ERROR, _newuser: CreateOptionsMenu menuid null"); return; }

    if ($(menuId).length <= 0) { common.PutToDebugLog(2, "ERROR, _newuser: CreateOptionsMenu can't get reference to Menu"); return; }
    
    if (menuId.charAt(0) !== '#') { menuId = '#' + menuId; }
    
    $(menuId).html('');
    $(menuId).append( '<li id="' + MENUITEM_CLOSE + '"><a data-rel="back">' + stringres.get('btn_cancel') + '</a></li>' ).listview('refresh');

    return true;
    
    } catch(err) { common.PutToDebugLogException(2, "_newuser: CreateOptionsMenu", err); }
    
    return false;
}

function MenuItemSelected(itemid)
{
    try{
    if (common.isNull(itemid) || itemid.length < 1) { return; }
    
    $( '#newuser_menu' ).on( 'popupafterclose', function( event )
    {
        $( '#newuser_menu' ).off( 'popupafterclose' );
        
        switch (itemid)
        {
            case MENUITEM_CLOSE:
                $.mobile.back();
                break;
        }
    });
    } catch(err) { common.PutToDebugLogException(2, "_newuser: MenuItemSelected", err); }
}

function onStop(event)
{
    try{
    common.PutToDebugLog(4, "EVENT, _newuser: onStop");
    global.isNewuserStarted = false;
    
    } catch(err) { common.PutToDebugLogException(2, "_newuser: onStop", err); }
}

function onDestroy (event)
{
    try{
    common.PutToDebugLog(4, "EVENT, _newuser: onDestroy");
    global.isNewuserStarted = false;
    
    } catch(err) { common.PutToDebugLogException(2, "_newuser: onDestroy", err); }
}

var newuser_public = {

    HttpResponseHandler: HttpResponseHandler
};
window.newuser_public = newuser_public;

// public members and methods
return {
    onCreate: onCreate,
    onStart: onStart,
    onStop: onStop,
    onDestroy: onDestroy
};
});