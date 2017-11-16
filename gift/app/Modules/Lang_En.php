<?php

namespace App\Modules;

$lang = array();

//Account
$lang = array_merge($lang,array(
	"ACCOUNT_SPECIFY_USERNAME" 		=> "Please enter your user ID.",
	"ACCOUNT_SPECIFY_PASSWORD" 		=> "Please enter your password.",
	"ACCOUNT_SPECIFY_EMAIL"			=> "Please enter your email address.",
	"ACCOUNT_INVALID_EMAIL"			=> "Invalid email address.",
	"ACCOUNT_INVALID_CONTACT"		=> "Invalid contact no.",
	"ACCOUNT_USER_OR_EMAIL_INVALID"		=> "User ID or email address is invalid.",
	"ACCOUNT_USER_OR_PASS_INVALID"		=> "Email or password is invalid.",
	"ACCOUNT_ALREADY_ACTIVE"		=> "Your account is already activated.",
	"ACCOUNT_INACTIVE"			=> "Your account is in-active. Check your emails / spam folder for account activation instructions.",
	"ACCOUNT_USER_CHAR_LIMIT"		=> "Name must be between %m1% and %m2% characters in length.",
	"ACCOUNT_DISPLAY_CHAR_LIMIT"		=> "Your name must be between %m1% and %m2% characters in length.",
	"ACCOUNT_PASS_CHAR_LIMIT"		=> "Your password must be between %m1% and %m2% characters in length.",
	"ACCOUNT_TITLE_CHAR_LIMIT"		=> "Titles must be between %m1% and %m2% characters in length.",
	"ACCOUNT_PASS_MISMATCH"			=> "Your password and confirmation password does not match.",
	"ACCOUNT_USER_NO_RATING"                => "You do not have permission to login.",
	"ACCOUNT_DISPLAY_INVALID_CHARACTERS"	=> "Name can only include alpha-numeric characters.",
	"ACCOUNT_USERNAME_IN_USE"		=> "User ID %m1% is already in use.",
	"ACCOUNT_REGNO_IN_USE"			=> "Registration No %m1% is already in use.",
	"ACCOUNT_EMAIL_IN_USE"			=> "Email %m1% is already in use.",
	"ACCOUNT_COMPANY_IN_USE"		=> "Company %m1% is already in use.",
	"ACCOUNT_COMPANY_NO_EXIST"		=> "Company %m1% is not exist.",
	"ACCOUNT_IC_NO_IN_USE"			=> "IC No %m1% is already in use.",
 	"ACCOUNT_KENAN_CODE_IN_USE"		=> "Kenan code %m1% is already in use.",
	"ACCOUNT_KENAN_INTERNAL_CODE_IN_USE"	=> "Kenan internal code %m1% is already in use.",
	"ACCOUNT_LINK_ALREADY_SENT"		=> "An activation email has already been sent to this email address in the last %m1% hour(s).",
	"ACCOUNT_NEW_ACTIVATION_SENT"		=> "We have emailed you a new activation link, please check your email.",
	"ACCOUNT_SPECIFY_NEW_PASSWORD"		=> "Please enter your new password.",
	"ACCOUNT_SPECIFY_CONFIRM_PASSWORD"	=> "Please confirm your new password.",
	"ACCOUNT_NEW_PASSWORD_LENGTH"		=> "New password must be between %m1% and %m2% characters in length.",
	"ACCOUNT_PASSWORD_INVALID"		=> "Current password doesn't match the one we have on record.",
	"ACCOUNT_DETAILS_UPDATED"		=> "Account details updated.",
	"ACCOUNT_ACTIVATION_MESSAGE"		=> "You will need to activate your account before you can login. Please follow the link below to activate your account. \n\n
	%m1%activate-account.php?token=%m2%.",
	"ACCOUNT_ACTIVATION_COMPLETE"		=> "You have successfully activated your account. You can now login <a href=\"login.php\">here</a>",
	"ACCOUNT_REGISTRATION_COMPLETE_TYPE1"	=> "You have successfully registered.",
	"ACCOUNT_REGISTRATION_COMPLETE_TYPE2"	=> "You have successfully registered. You will soon receive an activation email.
	You must activate your account before logging in.",
	"ACCOUNT_UPDATE_COMPLETE"               => "You have successfully updated.",
	"ACCOUNT_PASSWORD_NOTHING_TO_UPDATE"	=> "You cannot update with the same password.",
	"ACCOUNT_PASSWORD_UPDATED"		=> "Account password updated.",
	"ACCOUNT_EMAIL_UPDATED"			=> "Account email updated.",
	"ACCOUNT_CONTACTNO_UPDATED"		=> "Account contact no updated.",
	"ACCOUNT_TOKEN_NOT_FOUND"		=> "Token does not exist / Account is already activated.",
	"ACCOUNT_USER_INVALID_CHARACTERS"	=> "User ID can only include alpha-numeric characters.",
	"ACCOUNT_STAFF_MAX_CHARACTERS"          => "Staff max no can only include numeric characters.",
	"ACCOUNT_DELETIONS_SUCCESSFUL"		=> "You have successfully deleted %m1% users.",
	"ACCOUNT_MANUALLY_ACTIVATED"		=> "%m1%'s account has been manually activated.",
	"ACCOUNT_DISPLAYNAME_UPDATED"		=> "Name changed to %m1%.",
	"ACCOUNT_TITLE_UPDATED"			=> "%m1%'s title changed to %m2%.",
	"ACCOUNT_PERMISSION_ADDED"		=> "Added access to %m1% permission levels.",
	"ACCOUNT_PERMISSION_REMOVED"		=> "Removed access from %m1% permission levels.",
	"ACCOUNT_INVALID_USERNAME"		=> "Invalid user ID.",
	"ROLE_DELETIONS_SUCCESSFUL"		=> "You have successfully deleted %m1% roles.",
	"ROLE_NAME_IN_USE"                      => "Role name %m1% is already in use.",
	"CATEGORY_DELETIONS_SUCCESSFUL"		=> "You have successfully deleted %m1% categories.",
	"CATEGORY_NAME_IN_USE"                  => "Category name %m1% is already in use.",
	"REGION_NAME_IN_USE"                    => "Region name %m1% is already in use.",
	"CLASS_NAME_IN_USE"                    => "Class name %m1% is already in use.",
	"SERVICE_NAME_IN_USE"                    => "Service name %m1% is already in use.",
	"STATE_NAME_IN_USE"                    => "State name %m1% is already in use.",
	"DELETIONS_SUCCESSFUL"                  => "You have successfully deleted %m1% items.",
	"NAME_IN_USE"                           => "The name %m1% is already in use.",
	));

//Configuration
$lang = array_merge($lang,array(
	"CONFIG_NAME_CHAR_LIMIT"		=> "Site name must be between %m1% and %m2% characters in length.",
	"CONFIG_URL_CHAR_LIMIT"			=> "Site name must be between %m1% and %m2% characters in length.",
	"CONFIG_EMAIL_CHAR_LIMIT"		=> "Site name must be between %m1% and %m2% characters in length.",
	"CONFIG_ACTIVATION_TRUE_FALSE"		=> "Email activation must be either `true` or `false`.",
	"CONFIG_ACTIVATION_RESEND_RANGE"	=> "Activation Threshold must be between %m1% and %m2% hours.",
	"CONFIG_LANGUAGE_CHAR_LIMIT"		=> "Language path must be between %m1% and %m2% characters in length.",
	"CONFIG_LANGUAGE_INVALID"		=> "There is no file for the language key `%m1%`.",
	"CONFIG_TEMPLATE_CHAR_LIMIT"		=> "Template path must be between %m1% and %m2% characters in length.",
	"CONFIG_TEMPLATE_INVALID"		=> "There is no file for the template key `%m1%`.",
	"CONFIG_EMAIL_INVALID"			=> "The email you have entered is not valid.",
	"CONFIG_INVALID_URL_END"		=> "Please include the ending / in your site's URL.",
	"CONFIG_UPDATE_SUCCESSFUL"		=> "Your site's configuration has been updated. You may need to load a new page for all the settings to take effect.",
	));

//Forgot Password
$lang = array_merge($lang,array(
	"FORGOTPASS_INVALID_TOKEN"		=> "Your activation token is not valid.",
	"FORGOTPASS_NEW_PASS_EMAIL"		=> "We have emailed you a new password.",
	"FORGOTPASS_REQUEST_CANNED"		=> "Lost password request cancelled.",
	"FORGOTPASS_REQUEST_EXISTS"		=> "There is already a outstanding lost password request on this account.",
	"FORGOTPASS_REQUEST_SUCCESS"		=> "We have emailed you instructions on how to regain access to your account.",
	));

//Mail
$lang = array_merge($lang,array(
	"MAIL_ERROR"				=> "Fatal error attempting mail, contact your server administrator.",
	"MAIL_TEMPLATE_BUILD_ERROR"		=> "Error building email template.",
	"MAIL_TEMPLATE_DIRECTORY_ERROR"		=> "Unable to open mail-templates directory. Perhaps try setting the mail directory to %m1%.",
	"MAIL_TEMPLATE_FILE_EMPTY"		=> "Template file is empty... nothing to send.",
	));

//Miscellaneous
$lang = array_merge($lang,array(
	"CAPTCHA_FAIL"				=> "Failed security question.",
	"CONFIRM"				=> "Confirm.",
	"DENY"					=> "Deny.",
	"SUCCESS"				=> "Success.",
	"ERROR"					=> "Error.",
	"NOTHING_TO_UPDATE"			=> "Nothing to update.",
	"SQL_ERROR"				=> "Fatal SQL error.",
	"YOUTUBE_FILE_FORMAT_ERROR"		=> "Youtube url format is not available.",
	"FEATURE_DISABLED"			=> "This feature is currently disabled.",
	"PAGE_PRIVATE_TOGGLED"			=> "This page is now %m1%.",
	"PAGE_ACCESS_REMOVED"			=> "Page access removed for %m1% permission level(s).",
	"PAGE_ACCESS_ADDED"			=> "Page access added for %m1% permission level(s).",
	));

//Permissions
$lang = array_merge($lang,array(
	"PERMISSION_CHAR_LIMIT"			=> "Permission names must be between %m1% and %m2% characters in length.",
	"PERMISSION_NAME_IN_USE"		=> "Permission name %m1% is already in use.",
	"PERMISSION_DELETIONS_SUCCESSFUL"	=> "Successfully deleted %m1% permission level(s).",
	"PERMISSION_CREATION_SUCCESSFUL"	=> "Successfully created the permission level `%m1%`.",
	"PERMISSION_NAME_UPDATE"		=> "Permission level name changed to `%m1%`.",
	"PERMISSION_REMOVE_PAGES"		=> "Successfully removed access to %m1% page(s).",
	"PERMISSION_ADD_PAGES"			=> "Successfully added access to %m1% page(s).",
	"PERMISSION_REMOVE_USERS"		=> "Successfully removed %m1% user(s).",
	"PERMISSION_ADD_USERS"			=> "Successfully added %m1% user(s).",
	"CANNOT_DELETE_NEWUSERS"		=> "You cannot delete the default 'new user' group.",
	"CANNOT_DELETE_ADMIN"			=> "You cannot delete the default 'admin' group.",
	));

//Smart Library
$lang = array_merge($lang,array(
	"LIBRARY_ADD_SUCCESS"			=> "Successfully added the library.",
	"LIBRARY_ADD_FAILED"			=> "Failed add of library."
	));
//Smart Library
$lang = array_merge($lang,array(
	"ASSIST_CATEGORY_ADD_SUCCESS"			=> "Successfully added the assist class.",
	"ASSIST_CATEGORY_UPDATE_SUCCESS"			=> "Successfully updated the assist class.",
	"ASSIST_UPDATE_SUCCESS"			=> "Successfully updated the smart assist.",
	"LOCATOR_UPDATE_SUCCESS"			=> "Successfully updated the smart locator.",
	"ASSIST_ADD_SUCCESS"			=> "Successfully added the smart assist.",
	"LOCATOR_ADD_SUCCESS"			=> "Successfully added the smart locator.",
	"ASSIST_CATEGORY_ADD_FAILED"			=> "Failed add of assist class.",
	"ASSIST_CATEGORY_UPDATED_FAILED"			=> "Failed update of assist class.",
	"ASSIST_UPDATED_FAILED"			=> "Failed update of smart assist.",
	"ASSIST_ADD_FAILED"			=> "Failed add of smart assist.",
	"LOCATOR_UPDATED_FAILED"			=> "Failed update of smart locator.",
	"LOCATOR_ADD_FAILED"			=> "Failed add of smart locator."
	));
?>