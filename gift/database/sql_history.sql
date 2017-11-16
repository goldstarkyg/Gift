php artisan config:cache
php artisan config:clear

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'night_audit_file_type', 'PDF', 'PDF/Excel');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'night_audit_email_flag', 'YES', 'flag YES/NO'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'max_wakeup_call', '4', 'Max Simultaneous Calls');
ALTER TABLE `services_awu` CHANGE `status` `status` ENUM('Success','Pending','Failed','Busy','Snooze','In-Progress','No Answer','Canceled','Not Confirmed','Waiting') CHARSET latin1 COLLATE latin1_swedish_ci NOT NULL; 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'max_wakeup_waiting_time', '60', 'max wakeup waiting time(sec)'); 
ALTER TABLE `services_awu_logs` CHANGE `status` `status` TEXT CHARSET latin1 COLLATE latin1_swedish_ci NOT NULL; 
UPDATE `property_setting` SET `value` = 'jyyblue1987@outlook.com|+8618841568615' WHERE `settings_key` = 'duty_manager'; 
UPDATE `property_setting` SET `value` = 'email|mobile' WHERE `settings_key` = 'duty_manager_device'; 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_notify_mode', 'email|sms|mobile|webapp', 'when post complaint, notify duty manager.'); 
INSERT INTO `common_page_route` (`name`) VALUES ('app.guestservice.complaint');

call_bc_calls.sql
services_complaint_request.sql
common_guest_profile.sql

ALTER TABLE `ennovatech_client2`.`call_staff_extn` ADD COLUMN `bc_flag` ENUM('0','1') DEFAULT '0' NULL AFTER `user_group_id`; 

services_complaint_dept_pivot.sql
services_complaint_dept_default_assignee.sql
services_complaint_sublist.sql
services_complaint_escalation.sql
services_complaint_usergroup_pivot.sql

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'night_audit_include_mb', 'true', 'add minibar in the night audit report.'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_guest_mandotary_flag', 'true', 'in complaint post, guest profile mandantory.'); 
ALTER TABLE `common_guest_profile` ADD COLUMN `property_id` INT(11) NULL AFTER `id`, ADD COLUMN `guest_id` INT(11) DEFAULT 0 NULL AFTER `property_id`, ADD COLUMN `guest_name` VARCHAR(30) NULL AFTER `guest_id`; 

step 1. create sql
step 2. pull source code
step 3. insert into these 3 tables

ALTER TABLE call_admin_calls CHANGE call_type call_type ENUM('Internal','Received','International','Local','Mobile','National','Toll Free','Missed','Received_I') CHARSET latin1 COLLATE latin1_swedish_ci NOT NULL; 

DROP TABLE IF EXISTS call_admin_received_calls;

CREATE TABLE call_admin_received_calls (
  extension_id VARCHAR(6) NOT NULL,
  from_ext VARCHAR(6) NOT NULL,
  user_id INT(4) DEFAULT NULL,
  call_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME DEFAULT NULL,
  duration INT(11) NOT NULL COMMENT 'duration in seconds',
  called_no VARCHAR(16) NOT NULL,
  trunk VARCHAR(8) DEFAULT NULL,
  transfer VARCHAR(30) DEFAULT NULL,
  call_type VARCHAR(10) CHARACTER SET utf8 NOT NULL,
  destination_id INT(4) NOT NULL,
  carrier_charges FLOAT(10,2) NOT NULL DEFAULT '0.00',
  classify ENUM('Business','Personal','Unclassified') DEFAULT 'Unclassified',
  approval ENUM('Waiting For Approval','Pre-Approved','Approved','Rejected','Returned','Closed') DEFAULT NULL,
  submitter INT(4) DEFAULT NULL COMMENT 'ID of user submitting for approval',
  approver INT(4) DEFAULT NULL COMMENT 'User ID of approver',
  COMMENT TEXT,
  admin_charge_rate_id INT(5) DEFAULT NULL,
  KEY extension (extension_id),
  KEY calldate (call_date),
  KEY updatedatetime (called_no,call_type,duration,start_time,end_time,trunk)
) ENGINE=MYISAM DEFAULT CHARSET=latin1;
  
  DELETE FROM call_admin_received_calls;
  
  INSERT INTO call_admin_received_calls (
  SELECT se.id, se1.extension, ac.user_id, call_date, start_time, end_time, duration, 
    called_no, trunk, transfer, 'Received_I' AS call_type, destination_id, carrier_charges, classify, approval, 
    submitter, approver, COMMENT, admin_charge_rate_id 
  FROM call_admin_calls AS ac 
  JOIN call_staff_extn AS se ON (ac.called_no = se.extension AND se.bc_flag = '0')
  JOIN call_staff_extn AS se1 ON ac.extension_id = se1.id
  WHERE call_type = 'Internal' 	
  ); 
  
 INSERT INTO call_admin_received_calls (
  SELECT se.id, se1.extension, bc.user_id, call_date, start_time, end_time, duration, 
    called_no, trunk, transfer, 'Received_I' AS call_type, destination_id, carrier_charges, classify, approval, 
    submitter, approver, COMMENT, guest_charge_rate_id 
  FROM call_bc_calls AS bc 
  JOIN call_staff_extn AS se ON (bc.called_no = se.extension AND bc_flag = '0')
  JOIN call_staff_extn AS se1 ON bc.extension_id = se1.id
  WHERE call_type = 'Internal' 	
  );  
    
  INSERT INTO call_admin_received_calls (
    SELECT se.id, ge1.extension, 0 AS user_id, call_date, start_time, end_time, duration, 
    called_no, trunk, transfer, 'Received_I' AS call_type, destination_id, carrier_charges, 'Unclassified' AS classify, 'Waiting For Approval', 
    0 AS submitter, 0 AS approver, '' AS COMMENT, 0 AS admin_charge_rate_id 
  FROM call_guest_call AS gc 
  JOIN call_staff_extn AS se ON (gc.called_no = se.extension AND bc_flag = '0')
  JOIN call_guest_extn AS ge1 ON gc.extension_id = ge1.id
  WHERE call_type = 'Internal' 	
  ); 
  
 DROP TABLE IF EXISTS call_guest_received_call;

CREATE TABLE call_guest_received_call (
  room_id VARCHAR(4) NOT NULL,
  from_room VARCHAR(6) NOT NULL,
  guest_id INT(6) NOT NULL,
  extension_id INT(10) DEFAULT NULL,
  from_ext VARCHAR(6) NOT NULL,
  call_date DATE NOT NULL,
  called_no VARCHAR(16) NOT NULL,
  call_type ENUM('Internal','Received','Local','Mobile','National','International','Toll Free','Missed', 'Received_I') NOT NULL,
  trunk VARCHAR(100) DEFAULT NULL,
  transfer VARCHAR(30) DEFAULT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration INT(11) NOT NULL COMMENT 'duration in seconds',
  pulse INT(5) DEFAULT '0',
  destination_id INT(4) NOT NULL,
  carrier_charges FLOAT(10,2) NOT NULL DEFAULT '0.00',
  tax FLOAT(10,2) NOT NULL DEFAULT '0.00',
  hotel_charges FLOAT(10,2) NOT NULL DEFAULT '0.00',
  total_charges FLOAT(10,2) NOT NULL DEFAULT '0.00',
  guest_charge_rate_id INT(10) DEFAULT '0',
  KEY calldate (call_date),
  KEY countrycode (destination_id),
  KEY roomno (room_id),
  KEY guestid (guest_id),
  KEY updatedatetime (carrier_charges,hotel_charges,called_no,call_type,duration,start_time,end_time,tax,total_charges,trunk),
  KEY calldate_2 (call_date),
  KEY roomno_2 (room_id),
  KEY calldate_3 (call_date)
) ENGINE=MYISAM DEFAULT CHARSET=latin1; 
  
  DELETE FROM call_guest_received_call;
  
INSERT INTO call_guest_received_call (
 SELECT 
	ge.room_id, cr.room, guest_id, ge.id, ge1.extension, call_date, called_no, 'Received_I' AS call_type, trunk, transfer, start_time, end_time, duration, 
	pulse, destination_id, carrier_charges, tax, hotel_charges, total_charges, guest_charge_rate_id 
	FROM call_guest_call AS gc
JOIN call_guest_extn AS ge ON gc.called_no = ge.extension
JOIN call_guest_extn AS ge1 ON gc.extension_id = ge1.id
JOIN common_room AS cr ON gc.room_id = cr.id
  WHERE call_type = 'Internal' 	
  ); 
  
INSERT INTO call_guest_received_call (
 SELECT 
	ge.room_id, '' AS from_room, 0 AS guest_id, ge.id, se1.extension, call_date, called_no, 'Received_I' AS call_type, trunk, transfer, start_time, end_time, duration, 
	0 AS pulse, destination_id, carrier_charges, 0 AS tax, 0 AS hotel_charges, 0 AS total_charges, 0 AS guest_charge_rate_id 
	FROM call_admin_calls AS ac
JOIN call_guest_extn AS ge ON ac.called_no = ge.extension
  JOIN call_staff_extn AS se1 ON ac.extension_id = se1.id  
  WHERE call_type = 'Internal' 	
  );   
  
  
INSERT INTO call_guest_received_call (
 SELECT 
	ge.room_id, '' AS from_room, 0 AS guest_id, ge.id, se1.extension, call_date, called_no, 'Received_I' AS call_type, trunk, transfer, start_time, end_time, duration, 
	0 AS pulse, destination_id, carrier_charges, 0 AS tax, 0 AS hotel_charges, 0 AS total_charges, guest_charge_rate_id 
	FROM call_bc_calls AS bc
JOIN call_guest_extn AS ge ON bc.called_no = ge.extension
  JOIN call_staff_extn AS se1 ON bc.extension_id = se1.id  
  WHERE call_type = 'Internal' 	
  );     

CREATE TABLE call_bc_received_calls (
  extension_id VARCHAR(6) NOT NULL,
  from_ext VARCHAR(6) NOT NULL,
  user_id INT(4) DEFAULT NULL,
  call_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME DEFAULT NULL,
  duration INT(11) NOT NULL COMMENT 'duration in seconds',
  called_no VARCHAR(16) NOT NULL,
  trunk VARCHAR(8) DEFAULT NULL,
  transfer VARCHAR(30) DEFAULT NULL,
  call_type VARCHAR(10) CHARACTER SET utf8 NOT NULL,
  destination_id INT(4) NOT NULL,
  carrier_charges FLOAT(10,2) NOT NULL DEFAULT '0.00',
  tax FLOAT(10,2) NOT NULL DEFAULT '0.00',
  hotel_charges FLOAT(10,2) NOT NULL DEFAULT '0.00',
  total_charges FLOAT(10,2) NOT NULL DEFAULT '0.00',
  classify ENUM('Business','Personal','Unclassified') DEFAULT 'Unclassified',
  approval ENUM('Waiting For Approval','Pre-Approved','Approved','Rejected','Returned','Closed') DEFAULT NULL,
  submitter INT(4) DEFAULT NULL COMMENT 'ID of user submitting for approval',
  approver INT(4) DEFAULT NULL COMMENT 'User ID of approver',
  COMMENT TEXT,
  admin_charge_rate_id INT(5) DEFAULT NULL,
  KEY extension (extension_id),
  KEY calldate (call_date),
  KEY updatedatetime (called_no,call_type,duration,start_time,end_time,trunk)
) ENGINE=MYISAM DEFAULT CHARSET=latin1;
  
  DELETE FROM call_bc_received_calls;
  
  INSERT INTO call_bc_received_calls (
  SELECT se.id, se1.extension, ac.user_id, call_date, start_time, end_time, duration, 
    called_no, trunk, transfer, 'Received_I' AS call_type, destination_id, carrier_charges, 0 AS tax, 0 AS hotel_charges, 0 AS total_charges, classify, approval, 
    submitter, approver, COMMENT, admin_charge_rate_id 
  FROM call_admin_calls AS ac 
  JOIN call_staff_extn AS se ON (ac.called_no = se.extension AND se.bc_flag = '1')
  JOIN call_staff_extn AS se1 ON ac.extension_id = se1.id
  WHERE call_type = 'Internal' 	
  ); 
  
 INSERT INTO call_bc_received_calls (
  SELECT se.id, se1.extension, bc.user_id, call_date, start_time, end_time, duration, 
    called_no, trunk, transfer, 'Received_I' AS call_type, destination_id, carrier_charges, tax, hotel_charges, total_charges, classify, approval, 
    submitter, approver, COMMENT, guest_charge_rate_id 
  FROM call_bc_calls AS bc 
  JOIN call_staff_extn AS se ON (bc.called_no = se.extension AND se.bc_flag = '1')
  JOIN call_staff_extn AS se1 ON bc.extension_id = se1.id
  WHERE call_type = 'Internal' 	
  );  
    
  INSERT INTO call_bc_received_calls (
    SELECT se.id, ge1.extension, 0 AS user_id, call_date, start_time, end_time, duration, 
    called_no, trunk, transfer, 'Received_I' AS call_type, destination_id, carrier_charges, tax, hotel_charges, total_charges, 'Unclassified' AS classify, 'Waiting For Approval', 
    0 AS submitter, 0 AS approver, '' AS COMMENT, 0 AS admin_charge_rate_id 
  FROM call_guest_call AS gc 
  JOIN call_staff_extn AS se ON (gc.called_no = se.extension AND se.bc_flag = '1')
  JOIN call_guest_extn AS ge1 ON gc.extension_id = ge1.id
  WHERE call_type = 'Internal' 	
  );   
  
  INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'password_compare_flag', '1');
  INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'password_expire_date', '3'); 
  
  ALTER TABLE `common_users` ADD COLUMN `created_at` DATETIME NULL AFTER `fcm_key`; 
  
  ALTER TABLE `services_complaint_escalation` CHANGE `id` `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, ADD PRIMARY KEY (`id`); 
  
  CREATE TABLE `common_user_transaction` (
  `user_id` INT(10) DEFAULT NULL,
  `action` VARCHAR(200) DEFAULT NULL,
  `detail` TEXT,
  `created_at` DATETIME DEFAULT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8;  
  
CREATE TABLE `common_users_log_history` (
  `user_id` INT(10) DEFAULT NULL,
  `password` VARCHAR(10) DEFAULT NULL,
  `created_at` DATETIME DEFAULT NULL
) ENGINE=INNODB DEFAULT CHARSET=utf8;  

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'password_lock_attempts', '5');

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'password_minimum_length', '6', 'Minimum length of password');
 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'password_type', 'None', ' None, Alphanumeric, Alphanumeric_Special');

ALTER TABLE `common_users` ADD COLUMN `lock` ENUM('Yes','No') DEFAULT 'Yes' NULL AFTER `created_at`;

CREATE TABLE `services_complaint_sublist_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sub_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

CREATE TABLE `services_complaint_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sub_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

ALTER TABLE `common_job_role` ADD COLUMN `manager_flag` INT(1) DEFAULT 0 NULL AFTER `permission_group_id`;

ALTER TABLE `services_approval_route_members` ADD COLUMN `job_role_id` INT(10) NULL AFTER `user_id`; 
ALTER TABLE `services_approval_route_members` ADD COLUMN `property_id` INT(10) NULL AFTER `id`;
CREATE TABLE `common_users_active`( `user_id` INT(10) NOT NULL, `active_key` VARCHAR(30) NOT NULL ) CHARSET=utf8;
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'default_password', '00000000', 'default password');
ALTER TABLE `services_compensation` ADD COLUMN `property_id` INT(10) DEFAULT 0 NULL AFTER `id`; 
INSERT INTO `common_page_route` (`name`) VALUES ('app.reports.audit');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'default_approval_route', '1', 'default approval route.'); 

CREATE TABLE `services_compensation_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `reason` varchar(20) DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

ALTER TABLE `common_guest` ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL AFTER `checkout_flag`;
UPDATE common_guest SET created_at = arrival;

ALTER TABLE `common_guest_log` ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL AFTER `checkout_flag`;
UPDATE common_guest_log SET created_at = arrival;

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'password_expire_confirm_day', '[10,7,1]', '[10,7,1] user confirm expired day when login with 10,7,1 day ');

ALTER TABLE `ennovatech_client2`.`services_complaint_sublist` ADD COLUMN `sub_id` INT(10) DEFAULT 0 NULL AFTER `parent_id`; 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'last_use_password' , '10' ,'compare until 10 times from last day when change password');

INSERT INTO `ennovatech_client2`.`common_page_route` (`name`) VALUES ('app.callaccounting.myapproval_edit'); 
INSERT INTO `ennovatech_client2`.`common_page_route` (`name`) VALUES ('app.callaccounting.finance_edit'); 

ALTER TABLE `services_complaint_request` CHANGE `guest_type` `guest_type` ENUM('Walk-in','In-House CO','In-House CI') CHARSET utf8 COLLATE utf8_general_ci NULL;

ALTER TABLE `services_complaint_request` ADD COLUMN `initial_response` TEXT NULL AFTER `comment`; 
ALTER TABLE `services_complaint_request` ADD COLUMN `severity` INT(1) DEFAULT 1 NULL AFTER `status`;
ALTER TABLE `services_complaint_sublist` ADD COLUMN `severity` INT(1) DEFAULT 1 NULL AFTER `status`; 

INSERT INTO `common_page_route` (`name`) VALUES ('app.guestservice.briefing_mng'); 
ALTER TABLE `services_complaint_request` ADD COLUMN `discussed_flag` INT(1) DEFAULT 0 NULL AFTER `compensation_status`, ADD COLUMN `discuss_start_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL AFTER `discussed_flag`, ADD COLUMN `discuss_end_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL AFTER `discuss_start_time`; 

CREATE TABLE `services_complaint_briefing` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `complaint_id` int(10) DEFAULT NULL,
  `discussed_flag` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=34 DEFAULT CHARSET=utf8;

INSERT INTO `common_page_route` (`name`) VALUES ('app.guestservice.briefing_view');

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'pre_approved_call_types', '', 'Internal,International,LOCAL,Mobile,Missed,Mobile,NATIONAL,Received,Toll Free');

CREATE TABLE `services_complaint_flag`( `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, `complaint_id` INT(10) NOT NULL, `user_id` INT(10), `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (`id`) ); 

ALTER TABLE `ennovatech_client2`.`common_guest_profile` ADD COLUMN `client_id` INT(11) DEFAULT 4 NULL AFTER `id`; 

INSERT INTO `common_page_route` (`name`) VALUES ('app.engineering.checklist');

DROP TABLE IF EXISTS `services_room_status`;
CREATE TABLE `services_room_status` (
  `id` int(10) unsigned NOT NULL COMMENT '// room_id',
  `property_id` int(10) DEFAULT '0',
  `dispatcher` int(10) DEFAULT '0',
  `room_status` varchar(20) DEFAULT 'Dirty',
  `occupancy` varchar(20) DEFAULT 'Vacant',
  `working_status` int(2) DEFAULT '100',
  `rush_flag` int(1) DEFAULT '0',
  `arrival` int(1) DEFAULT '0',
  `due_out` int(1) DEFAULT '0',
  `priority` int(2) DEFAULT NULL,
  `start_time` timestamp NULL DEFAULT NULL,
  `end_time` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

quipment.sql

delete from eng_equip_status;
insert  into `eng_equip_status`(`id`,`status`) values (1,'Due'),(2,'OK'),(3,'Retired'),(4,'Faulty'),(5,'Down'),(6,'Over Due');

ALTER TABLE `common_job_role` ADD COLUMN `cost` FLOAT(10,2) DEFAULT 0.00 NULL AFTER `manager_flag`;

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'hskp_cleaning_time', '09:00 - 12:00', 'hskp_cleaning_time'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'vacant_room_cleaning', '00:00 - 23:59', 'vacant_room_cleaning');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'due_out_clean', '1', 'due_out_clean');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'due_out_time', '00:00 - 14:00', 'due_out_time');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'turn_down_service', '05:00 - 07:00', 'turn_down_service');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'max_clean_duration', '300', 'max_clean_duration');

DROP TABLE IF EXISTS `eng_checklist`;

CREATE TABLE `eng_checklist` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(5) DEFAULT '0',
  `name` varchar(100) DEFAULT '',
  `equip_group_id` int(11) unsigned DEFAULT '0',
  `work_order_type` enum('Repairs','Requests','Preventive','Upgrade','New') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `eng_workorder`;

CREATE TABLE `eng_workorder` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT '0',
  `name` varchar(50) DEFAULT '',
  `description` text,
  `checklist_id` int(11) DEFAULT '0',
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Low',
  `equipment_id` int(11) DEFAULT '0',
  `frequency` int(5) DEFAULT '0',
  `frequency_unit` enum('Days','Weeks','Months','Years') DEFAULT 'Days',
  `created_date` datetime DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `duration` int(11) DEFAULT '0',
  `staff_id` int(11) DEFAULT '0',
  `staff_cost` float(10,2) DEFAULT '0.00',
  `part_group` text COMMENT '[{"part_id":7,"part_number":3},{"part_id":2,"part_number":5}]',
  `part_cost` float(10,2) DEFAULT '0.00',
  `critical_flag` int(2) DEFAULT '0',
  `status` enum('Pending','On Hold','In Progress','Completed') DEFAULT 'Pending',
  `work_order_type` enum('Repairs','Requests','Preventive','Upgrade','New') DEFAULT 'Repairs',
  `property_id` int(5) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `eng_workorder_status_log`;

CREATE TABLE `eng_workorder_status_log` (
  `workorder_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('Pending','On Hold','In Progress','Completed') DEFAULT 'Pending',
  `setdate` datetime DEFAULT NULL,
  PRIMARY KEY (`workorder_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `common_guest_advanced_detail`;

CREATE TABLE `common_guest_advanced_detail` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(30) DEFAULT NULL COMMENT '1: Guest First Name',
  `last_name` varchar(30) DEFAULT NULL COMMENT '2: Guest Last Name',
  `uuid` varchar(20) DEFAULT NULL COMMENT '3: Guest Unique ID',
  `group_name` varchar(30) DEFAULT NULL COMMENT '4: Group Name',
  `room_type` varchar(20) DEFAULT NULL COMMENT '5: Room Type',
  `audit_no` varchar(20) DEFAULT NULL COMMENT '6: No of Adult',
  `rate_code` varchar(20) DEFAULT NULL COMMENT '7: Rate Code',
  `children` int(2) DEFAULT NULL COMMENT '8: No of Children',
  `company` varchar(50) DEFAULT NULL COMMENT '9: Company',
  `occupation` varchar(20) DEFAULT NULL COMMENT '10: Occupation',
  `dob` varchar(20) DEFAULT NULL COMMENT '11: DOB',
  `country` varchar(20) DEFAULT NULL COMMENT '12: Country',
  `nationality` varchar(20) DEFAULT NULL COMMENT '13: Nationality',
  `membership` varchar(20) DEFAULT NULL COMMENT '14: Membership No',
  `passport` varchar(30) DEFAULT NULL COMMENT '15: Passport No',
  `checkin` date DEFAULT NULL COMMENT '16: Checkin time',
  `street1` varchar(50) DEFAULT NULL COMMENT '17: Street1 ADDRESS1',
  `street2` varchar(50) DEFAULT NULL COMMENT '18: Street2 ADDRESS2',
  `city` varchar(20) DEFAULT NULL COMMENT '19: City',
  `state` varchar(20) DEFAULT NULL COMMENT '20: State',
  `country_town` varchar(20) DEFAULT NULL COMMENT '21: Country',
  `checkout` date DEFAULT NULL COMMENT '22: Checkout time',
  `last_room` varchar(10) DEFAULT NULL COMMENT '23: Last Room',
  `preferred_room` varchar(10) DEFAULT NULL COMMENT '24: Preferred Room',
  `luggage_tag` varchar(10) DEFAULT NULL COMMENT '25: Luggage Tag U',
  `car_no` varchar(20) DEFAULT NULL COMMENT '26: Car No',
  `sip_vpg_code` varchar(20) DEFAULT NULL COMMENT '27: SPG/VIP Code',
  `email` varchar(50) DEFAULT NULL COMMENT '28: Email',
  `contact_no` varchar(30) DEFAULT NULL COMMENT '29: Contact No',
  `special_reqeust` text COMMENT '30: Special Request',
  `amenity` varchar(20) DEFAULT NULL COMMENT '31: Amenities',
  `package` varchar(20) DEFAULT NULL COMMENT '32: Packages',
  `comments` text COMMENT '33: Comments',
  `def_ref8` text COMMENT '34: Full Name GUEST_TITLE GUEST_NAME GUEST_FIRSTNAME',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=234325 DEFAULT CHARSET=utf8;

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'daily_auto_room_assign', '1', 'Daily room assignment automatically.'); 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'pax_allowance', '1', 'Pax Allowance'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'adult_pax_allowance', '5', 'Audit Pax Allowance'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'child_pax_allowance', '5', 'Child Pax Allowance(Min)'); 

INSERT INTO `common_page_route` (`name`) VALUES ('app.housekeeping.turndown_assign'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'max_turndown_duration', '100', 'Max Turn Down Service Duration');

DROP TABLE IF EXISTS `services_room_turndown_status`;

CREATE TABLE `services_room_turndown_status` (
  `id` INT(10) UNSIGNED NOT NULL COMMENT 'room id',
  `property_id` INT(11) DEFAULT '0',
  `dispatcher` INT(10) DEFAULT '0',
  `working_status` INT(3) DEFAULT NULL,
  `rush_flag` INT(1) DEFAULT '0',
  `start_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `end_time` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=INNODB DEFAULT CHARSET=utf8;

INSERT INTO `common_page_route` (`name`) VALUES ('app.department.head');

ALTER TABLE `services_complaint_sublist` ADD COLUMN `category_id` INT(10) DEFAULT 0 NULL AFTER `compensation_comment`, ADD COLUMN `subcategory_id` INT(10) DEFAULT 0 NULL AFTER `category_id`; 

ALTER TABLE `services_complaint_request` ADD COLUMN `path` VARCHAR(300) NULL AFTER `closed_time`; 
ALTER TABLE `services_complaint_request` CHANGE `path` `path` TEXT NULL; 

CREATE TABLE `services_complaint_category` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `dept_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT '0',
  `disabled` int(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;


CREATE TABLE `services_complaint_subcategory` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) DEFAULT NULL,
  `category_id` int(10) DEFAULT '0',
  `user_id` int(11) DEFAULT '0',
  `disabled` int(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'schedule_report_subject', 'LRM Schedule Report'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'night_audit_guest_report_subject', 'LRM Night Audit Guest Report'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'night_audit_admin_report_subject', 'LRM Night Audit Admin Report'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'night_audit_report_subject', 'LRM Reports'); 

ALTER TABLE `ennovatech_interface`.`alarm` ADD COLUMN `sender` VARCHAR(40) DEFAULT 'alarms@ennovatech.ae' NULL AFTER `password`; 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'smtp_auth', '1', '1/0'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'smtp_sender', 'jyyblue1987@outlook.com'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'notification_smtp_auth', '1', '1/0'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'notification_smtp_sender', 'jyyblue1987@outlook.com'); 

ALTER TABLE `services_complaint_sublist` ADD COLUMN `path` VARCHAR(50) NULL AFTER `subcategory_id`;
ALTER TABLE `services_complaint_sublist` CHANGE `path` `path` TEXT CHARSET utf8 COLLATE utf8_general_ci NULL; 

INSERT INTO `common_page_route` (`name`) VALUES ('dept.app.guestservice'); 

ALTER TABLE `services_task` ADD COLUMN `forward_flag` INT(1) DEFAULT 0 NULL AFTER `escalate_flag`;

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_report_time_interval', '6', 'how many hours before the report will be sent.');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_report_recipients', 'jyyblue1987@outlook', 'list of email addresses where the report is going to be sent'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_in_nightaudit', '1', 'add complaints in the night audit report.'); 

UPDATE services_complaint_request SET updated_at = created_at
ALTER TABLE `services_complaint_sublist` ADD COLUMN `updated_at` DATETIME NULL AFTER `completed_at`;
UPDATE services_complaint_sublist SET updated_at = created_at

INSERT INTO  `common_page_route` (`name`) VALUES ('access.guestservice.swapdatabase');

ALTER TABLE `services_task_list` ADD COLUMN `user_created` INT(1) DEFAULT 0 NULL AFTER `type`, ADD COLUMN `created_by` INT(10) DEFAULT 0 NULL AFTER `user_created`, ADD COLUMN `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL AFTER `created_by`; 

ALTER TABLE `services_task` CHANGE `repeat_end_date` `repeat_end_date` DATE NULL; 

CREATE TABLE `services_task_profile` (
  `user_id` INT(10) NOT NULL DEFAULT '0',
  `ticket` VARCHAR(50) DEFAULT '',
  `status_id` VARCHAR(100) DEFAULT '',
  `priority` VARCHAR(100) DEFAULT '',
  `department_id` VARCHAR(100) DEFAULT '',
  PRIMARY KEY (`user_id`)
)

ALTER TABLE `services_task` ADD COLUMN `duration` INT(10) DEFAULT 0 NULL AFTER `end_date_time`, ADD COLUMN `closed_flag` INT(1) DEFAULT 0 NULL AFTER `forward_flag`;


UPDATE services_task 
SET duration = TIME_TO_SEC(TIMEDIFF(end_date_time, start_date_time)) 
WHERE end_date_time >= start_date_time AND status_id IN (0, 3, 4)

ALTER TABLE `common_users` ADD COLUMN `employee_id` VARCHAR(8) DEFAULT '' NULL AFTER `username`;

INSERT INTO `common_page_route` (`name`) VALUES ('app.mytask.complaint'); 
INSERT INTO `common_page_route` (`name`) VALUES ('app.mytask.guestservice'); 
INSERT INTO `common_page_route` (`name`) VALUES ('app.mytask.workorder'); 

ALTER TABLE `services_complaint_request` CHANGE `guest_type` `guest_type` ENUM('Walk-in','Arrival','In-House CO','In-House CI','House_Complaint') CHARSET utf8 COLLATE utf8_general_ci NULL; 
CREATE TABLE `common_house_complaints_category`( `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT, `name` VARCHAR(30), PRIMARY KEY (`id`) ); 
ALTER TABLE `services_complaint_request` ADD COLUMN `housecomplaint_id` INT(10) DEFAULT 0 NULL AFTER `requestor_id`; 

ALTER TABLE `services_task_notifications` CHANGE `mode` `mode` ENUM('SMS','email','Mobile') CHARSET latin1 COLLATE latin1_swedish_ci NOT NULL; 

ALTER TABLE `services_complaint_request` CHANGE `guest_type` `guest_type` ENUM('Walk-in','Arrival','In-House CO','In-House CI','House Complaint') CHARSET utf8 COLLATE utf8_general_ci NULL;
UPDATE services_complaint_request SET guest_type = 'House Complaint' WHERE guest_type = '';

ALTER TABLE `services_task` ADD COLUMN `queued_flag` INT(1) DEFAULT 0 NULL AFTER `closed_flag`; 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_report_time_start', '8,20', 'complaint report trigger hours.'); 

ALTER TABLE `services_complaint_sublist` ADD COLUMN `completed_by` INT(10) DEFAULT 0 NULL AFTER `path`; 

ALTER TABLE `services_complaint_request` ADD COLUMN `incident_time` DATETIME NULL AFTER `closed_comment`; 
UPDATE services_complaint_request SET incident_time = created_at

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'task_queued_flag', '1', 'Task Queue Logic.');
ALTER TABLE `services_task_group` ADD COLUMN `queue_flag` INT(1) DEFAULT 0 NULL AFTER `escalation`;

CREATE TABLE `common_users_notification`( 
		`id` INT(10) UNSIGNED NOT NULL, 
		`complaint_cnt` INT(10) DEFAULT 0, 
		`guestservice_cnt` INT(10) DEFAULT 0, 
		`workorder_cnt` INT(10) DEFAULT 0, 
		PRIMARY KEY (`id`) ); 
		
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_forward_flag', '1', 'Complaint Forward Flag.'); 		
INSERT INTO `common_page_route` (`name`) VALUES ('app.mytask.dashboard'); 


ALTER TABLE `common_job_role` ADD COLUMN `property_id` INT(10) DEFAULT 4 NULL AFTER `job_role`, CHANGE `dept_id` `dept_id` INT(11) DEFAULT 0 NULL; 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'housekeeping_dept_id', '50', 'Housekeeping Department ID'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'engineering_dept_id', '35', 'Engieneering Department ID'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'roomattendant_job_role', '2', 'Room Attendant Job Role ID'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'supervisor_job_role', '4', 'Supervisor Job Role ID'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'callcenteragent_job_role', '6', 'Call Centre Agent Job Role ID'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'dutymanager_job_role', '8', 'Duty Manager Job Role ID');

INSERT INTO `common_page_route` (`name`) VALUES ('mobile.guestservice.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.guestservice.create'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.guestservice.edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.hskpattendant.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.hskpattendant.create'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.hskpattendant.edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.hskpsupervisor.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.hskpsupervisor.create'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.hskpsupervisor.edit');
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.minibar.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.minibar.create'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.minibar.edit'); 

ALTER TABLE `services_rm_srv_itm` ADD COLUMN `max_qty` INT(10) DEFAULT 0 NULL AFTER `ivr_code`;

- 2017-04-17

ALTER TABLE `services_complaint_request` ADD COLUMN `modified_by` INT(10) DEFAULT 0 NULL AFTER `initial_response`;
ALTER TABLE `services_task_profile` ADD COLUMN `type_id` VARCHAR(100) DEFAULT '' NULL AFTER `department_id`;
CREATE TABLE `services_complaint_reminder`( `id` INT(10) UNSIGNED NOT NULL, `emails` TEXT, `reminder_time` DATETIME, `comment` TEXT, PRIMARY KEY (`id`) );  

CREATE TABLE `services_complaint_reminder` (
  `id` int(10) unsigned NOT NULL,
  `emails` text,
  `reminder_time` datetime DEFAULT NULL,
  `comment` text,
  `ack` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 
 - 2017-04-18
 
DROP TABLE IF EXISTS `services_complaint_reminder`;

CREATE TABLE `services_complaint_reminder` (
  `id` int(10) unsigned NOT NULL,
  `reminder_ids` text,
  `reminder_flag` int(1) DEFAULT '0',
  `reminder_time` datetime DEFAULT NULL,
  `comment` text,
  `by_user` int(10) DEFAULT '0',
  `ack` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `services_compensation_request`;

CREATE TABLE `services_compensation_request` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `complaint_id` int(10) DEFAULT '0',
  `item_id` int(10) DEFAULT NULL,
  `cost` int(10) DEFAULT '0',
  `status` int(4) DEFAULT '1',
  `comment` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `services_compensation_state` ADD COLUMN `comp_id` INT(11) NULL AFTER `task_id`;
ALTER TABLE `services_compensation_comments` ADD COLUMN `comp_id` INT(11) DEFAULT 0 NULL AFTER `task_id`; 

- 2017-04-19
CREATE TABLE `common_guest_profile` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT '4',
  `property_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT '0',
  `salutation` text,
  `fname` text,
  `mname` text,
  `lname` text,
  `guest_name` text,
  `company` text,
  `contact` text NOT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` text,
  `address` text,
  `gender` enum('Male','Female') DEFAULT NULL,
  `nationality` int(5) DEFAULT NULL,
  `DOB` date DEFAULT NULL,
  `passport` varchar(30) DEFAULT NULL,
  `job` text,
  `city` text,
  `country` int(4) DEFAULT NULL,
  `VIP` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=105571 DEFAULT CHARSET=utf8;

INSERT INTO  `common_page_route` (`name`) VALUES ('access.backoffice'); 
INSERT INTO  `common_page_route` (`name`) VALUES ('bo.users.permission.edit'); 
INSERT INTO  `common_page_route` (`name`) VALUES ('bo.users.permission.view'); 
INSERT INTO  `common_page_route` (`name`) VALUES ('bo.users');
INSERT INTO `common_page_route` (`name`) VALUES ('app.complaintmgnt.dashboard');
INSERT INTO `common_page_route` (`name`) VALUES ('bo.property'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.admin'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices');
INSERT INTO `common_page_route` (`name`) VALUES ('bo.complaints'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.ivr'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.interface'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.engineering'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.configuration');
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.permissiongroup.edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.permissiongroup.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.user.edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.user.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.usergroup.edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.usergroup.view');
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.jobrole.edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.jobrole.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.shift.edit');

ALTER TABLE `services_complaint_request` CHANGE `status` `status` ENUM('Pending','Resolved','Rejected','Acknowledge','Timeout','Escalated','Canceled','Forwarded','Unresolved') CHARSET utf8 COLLATE utf8_general_ci DEFAULT 'Pending' NULL; 

ALTER TABLE `services_complaint_request` ADD COLUMN `mark_flag` INT(1) DEFAULT 0 NULL AFTER `closed_flag`;

- 2017-04-20
DELETE FROM `common_page_route` WHERE `name` = 'bo.users.jobrole.edit';
DELETE FROM `common_page_route` WHERE `name` = 'bo.users.permission.edit';
DELETE FROM `common_page_route` WHERE `name` = 'bo.users.permissiongroup.edit';
DELETE FROM `common_page_route` WHERE `name` = 'bo.users.shif.edit';
DELETE FROM `common_page_route` WHERE `name` = 'bo.users.user.edit'; 
DELETE FROM `common_page_route` WHERE `name` = 'bo.users.usergroup.edit'; 

INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.jobrole'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.permission'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.permissiongroup'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.shift'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.user'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.users.usergroup'); 



INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.admin_extension'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.guest_extension'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.section'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.destination'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.carrier'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.carrier_group'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.carrier_charge'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.property_charge'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.tax'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.allowance'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.time_slabs'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.admin_rate_mapping'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.callaccounting.guest_rate_mapping'); 

INSERT INTO `common_page_route` (`name`) VALUES ('bo.property.client'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.property.property'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.property.building'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.property.floors'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.property.room_type'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.property.room'); 

INSERT INTO `common_page_route` (`name`) VALUES ('bo.admin.department'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.admin.admin_area'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.admin.common_area'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.admin.outdoor'); 

INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.department_function'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.location_group'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.escalation_group'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.tasks'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.task_group'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.housekeeping'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.device'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.minibar'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.minibar_item'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.alarm'); 
INSERT INTO `common_page_route` (`name`) VALUES ('compensation'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.compensation_approval_route'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.compensation_approval_route_member'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.department_default_assignee'); 

INSERT INTO `common_page_route` (`name`) VALUES ('bo.complaints.sub_complaint'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.complaints.complaint_type'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.complaints.complaint_department_pivot'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.complaints.complaint_escalation'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.complaints.complaint_user_group_pivot'); 

INSERT INTO `common_page_route` (`name`) VALUES ('bo.interface.channel'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.interface.protocol'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.interface.parsers'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.interface.formatters');
INSERT INTO `common_page_route` (`name`) VALUES ('bo.interface.alarm');  
INSERT INTO `common_page_route` (`name`) VALUES ('bo.interface.logs'); 

INSERT INTO `common_page_route` (`name`) VALUES ('bo.configuration.general');
INSERT INTO `common_page_route` (`name`) VALUES ('bo.configuration.auto_wakeup'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.configuration.call_accounting'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.configuration.call_centre'); 
INSERT INTO `common_page_route` (`name`) VALUES ('bo.configuration.minibar');

CREATE TABLE `services_complaint_updated` (
  `complaint_id` int(11) unsigned NOT NULL DEFAULT '0',
  `user_id` int(11) unsigned NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

ALTER TABLE `services_complaint_request` DROP COLUMN `modified_by`;

DELETE FROM `common_page_route` WHERE `name` = 'app.guestservice.complaint';
INSERT INTO `common_page_route` (`name`) VALUES ('app.complaint.complaint');

DELETE FROM `common_page_route` WHERE `name` = 'app.guestservice.briefing_mng';
INSERT INTO `common_page_route` (`name`) VALUES ('app.complaint.briefing_mng');

DELETE FROM `common_page_route` WHERE `name` = 'app.guestservice.briefing_view';
INSERT INTO `common_page_route` (`name`) VALUES ('app.complaint.briefing_view');

DELETE FROM `common_page_route` WHERE `name` LIKE 'bo.guestservices.compensation_approval_route_mem%';
INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.compensation_approval_ro_mem');

ALTER TABLE `common_users` ADD COLUMN `deleted` INT(2) DEFAULT 0 NULL AFTER `lock`;
ALTER TABLE `common_users` ADD COLUMN `deleted_comment` TEXT NULL AFTER `deleted`;

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('0', 'public_live_host', 'http://62a00d7a.ngrok.io/', 'Public Live Server URL'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('0', 'public_domain', 'ngrok.io', 'Public Domain'); 
ALTER TABLE `common_user_transaction` ADD COLUMN `agent_id` INT(10) NULL AFTER `created_at`;

- 2017-04-21

INSERT INTO `common_page_route` (`name`) VALUES ('app.complaint.compensation_template'); 

CREATE TABLE `services_complaint_compensation_template` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `template` LONGTEXT,
  `modified_by` int(10) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

insert  into `services_complaint_compensation_template`(`id`,`property_id`,`template`,`modified_by`,`created_at`) values (1,4,'<p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\" class=\"ql-size-large\">{{guest_address}}</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Dear </span><strong style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{salutation}}. {{guest_name}}</strong><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">,</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Thank you for taking your time to speak with me in reference to your concern with us. </span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">I recognize that your holiday experience was diminished by the inconvenience you encountered, </span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">I also wish to reassure you that this is not reflective of our standards and as a gesture of goodwill, </span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">and without accepting liability we would like to offer you:</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{compensations}} </span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">during your future stay at </span><strong style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{property_name}}</strong></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">The gesture is made in full and final settlement of any claim you and your traveling party may otherwise bring, as a result of the inconvenience caused.</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">If this offer is acceptable to you, please indicate your agreement by signing in the space provided below.</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">As a valued guest of our hotel I sincerely hope that this experience will not deter you from returning, and look forward to welcoming you back to </span><strong style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{property_name}}</strong><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\"> in the near future.</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Yours Sincerely,</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{username}}</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{job_role}}</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Agreed and accepted:</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">By _____________________________</span></p><p>{{guest_name}}</p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{room_number}}</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{property_name}}</span></p>',1,'2017-04-21 22:24:48');

ALTER TABLE `common_user_transaction` ADD COLUMN `agent_id` INT(10) NULL AFTER `created_at`;

ALTER TABLE `common_user_transaction` ADD COLUMN `agent_id` INT(10) NULL AFTER `created_at`;

- 2017-04-22

ALTER TABLE `services_complaint_request` ADD COLUMN `comment_highlight` TEXT NULL AFTER `initial_response`, ADD COLUMN `response_highlight` TEXT NULL AFTER `comment_highlight`; 

- 2017-04-24

CREATE TABLE `services_complaint_maincategory` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `name` varchar(30) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

ALTER TABLE `services_complaint_request` ADD COLUMN `category_id` INT(10) DEFAULT 0 NULL AFTER `solution`;

- 2017-04-25 

INSERT INTO `common_page_route` (`name`) VALUES ('mobile.dutymanager.view');

ALTER TABLE `call_guest_extn` DROP INDEX `room_id`; 

CREATE TABLE `services_task_action_reason` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) DEFAULT NULL,
  `action` varchar(30) DEFAULT NULL,
  `reason` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

- 2017-04-26

INSERT INTO `common_page_route` (`name`) VALUES ('bo.guestservices.compensation');

CREATE TABLE `common_status_per_property` (
  `id` int(10) unsigned NOT NULL,
  `max_admin_call_no` int(20) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

- 2017-04-27
ALTER TABLE `services_shift_group` ADD COLUMN `job_role_ids` VARCHAR(300) DEFAULT '[]' NULL AFTER `shift`; 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'dynamic_shift_for_mobile', '1', 'When login with mobile, change shift_group_id dynamically.'); 

- 2017-04-28
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'push_confirm_with_sms', '1', 'enable or disable(1/0) send SMS to mobile of staff when push message delivery fails. if enabled, SMS will be send incase the message deliver for push notification fails.'); 

- 2017-04-29
ALTER TABLE `common_users` ADD COLUMN `active_status` INT(3) DEFAULT 0 NULL AFTER `deleted_comment`;
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.lostfound.view');

- 2017-05-02
ALTER TABLE `common_department` ADD COLUMN `default_assignee` INT(10) DEFAULT 0 NULL AFTER `default_dept_func_id`; 
ALTER TABLE `services_task_notifications` CHANGE `mode` `mode` VARCHAR(10) CHARSET latin1 COLLATE latin1_swedish_ci NOT NULL; 

- 2017-05-03
ALTER TABLE `common_notification` ADD COLUMN `payload` TEXT NULL AFTER `content`; 
ALTER TABLE `common_notification` CHANGE `created_at` `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP NULL; 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'mobile_app_url', 'http://192.168.1.253/mobile/hotlync.apk', 'Mobile app download url'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'mobile_app_version', '1.0.1', 'Mobile app version'); 

- 2017-05-04
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.guestservice.dashboard'); 


- 2017-05-05
INSERT INTO `common_page_route` (`name`) VALUES ('bo.engineering.partgroup');
ALTER TABLE `common_users` ADD COLUMN `device_id` VARCHAR(100) NULL AFTER `fcm_key`; 
ALTER TABLE `services_task_group` ADD COLUMN `comment_flag` INT(1) DEFAULT 0 NULL AFTER `queue_flag`; 

- 2017-05-06
INSERT INTO `common_page_route` (`name`) VALUES ('bo.engineering.equipgroup');
ALTER TABLE `eng_workorder` ADD COLUMN `purpose_start_date` DATETIME NULL AFTER `property_id`, ADD COLUMN `purpose_end_date` DATETIME NULL AFTER `purpose_start_date`;

- 2017-05-08
INSERT INTO `common_page_route` (`name`) VALUES ('bo.engineering.supplier');
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.mymanager.view');

- 2017-05-09
ALTER TABLE `common_department` ADD COLUMN `dynamic_job_role` INT(1) DEFAULT 0 NULL AFTER `services`; 

CREATE TABLE `services_secondary_jobrole` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `job_role_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

CREATE TABLE `services_secondary_jobrole_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `job_role_ids` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'eng_low_stock_notify', '1,2', 'this is user group id with multi value and classification comma');

- 2017-05-11
ALTER TABLE `services_task_group` ADD COLUMN `self_start_flag` INT(1) DEFAULT 0 NULL AFTER `comment_flag`, ADD COLUMN `start_duration` INT(10) DEFAULT 120 NULL AFTER `self_start_flag`; 
ALTER TABLE `services_task` ADD COLUMN `self_start_status` INT(2) DEFAULT 0 NULL AFTER `running`; 

- 2017-05-12
ALTER TABLE `services_task` ADD COLUMN `start_duration` INT(10) DEFAULT 120 NULL AFTER `self_start_status`; 

- 2017-05-13
CREATE TABLE `services_complaint_briefing_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `discussed_complaints` text,
  `participants` varchar(200) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

- 2017-05-14
CREATE TABLE `common_room_occupancy` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `occupancy` int(11) DEFAULT '0',
  `check_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=381 DEFAULT CHARSET=utf8;

- 2017-05-16
ALTER TABLE `services_compensation_request` ADD COLUMN `provider_id` INT(10) DEFAULT 0 NULL AFTER `cost`; 

- 2017-05-18
CREATE TABLE eng_request (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  property_id INT(11) DEFAULT '0',
  requestor_id INT(11) DEFAULT '0',
  priority ENUM('Low','Medium','High','Urgent') DEFAULT NULL,
  loc_id INT(11) DEFAULT '0',
  category_id INT(11) DEFAULT '0',
  sub_category_id INT(11) DEFAULT '0',
  subject TEXT,
  comment TEXT,
  path TEXT,
  created_at DATETIME DEFAULT NULL,
  PRIMARY KEY (id)
); 

CREATE TABLE eng_request_category (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(250) DEFAULT '',
  property_id INT(11) DEFAULT '0',
  PRIMARY KEY (id)
);


CREATE TABLE eng_request_subcategory (
  id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  category_id INT(11) DEFAULT '0',
  name VARCHAR(250) DEFAULT '',
  property_id INT(11) DEFAULT '0',
  PRIMARY KEY (id)
);

INSERT INTO common_page_route (name) VALUES ('bo.engineering.category'); 
INSERT INTO common_page_route (name) VALUES ('bo.engineering.subcategory');

DROP TABLE IF EXISTS `services_chat_guest_session`;

CREATE TABLE `services_chat_guest_session` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT '0',
  `guest_name` varchar(50) DEFAULT NULL,
  `room_id` int(11) DEFAULT NULL,
  `status` enum('Waiting','Active','Transfer','Ended') DEFAULT 'Waiting',
  `transfer_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `language` varchar(30) DEFAULT 'English',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8;

INSERT INTO common_page_route (name) VALUES ('app.engineering.request');

ALTER TABLE eng_workorder ADD COLUMN request_id INT(11) DEFAULT 0 NULL COMMENT 'request_id from staff' AFTER purpose_end_date, ADD COLUMN request_flag INT(3) DEFAULT 2 NULL COMMENT '1=requet, 2=work order, 3=preventive automatically' AFTER request_id;
ALTER TABLE eng_request ADD COLUMN status ENUM('Default','Pending','On Hold','In Progress','Completed','Rejected') DEFAULT 'Default' NULL COMMENT 'Pending = Accepted' AFTER created_at;

- 2017-05-19
ALTER TABLE `services_chat_history` ADD COLUMN `session_id` INT(11) NULL AFTER `property_id`; 

ALTER TABLE eng_request ADD COLUMN user_id INT(11) DEFAULT 0 NULL COMMENT 'person to update status' AFTER status, ADD COLUMN updated_at DATETIME NULL COMMENT 'updating datetime status' AFTER user_id;

- 2017-05-20
ALTER TABLE `services_chat_history` ADD COLUMN `text_trans` TEXT NULL AFTER `text`; 

- 2017-05-22
INSERT INTO common_page_route (name) VALUES ('bo.engineering.inventory');
INSERT INTO common_page_route (name) VALUES ('app.minibar.transfer_log'); 
INSERT INTO common_page_route (name) VALUES ('app.minibar.by_guest');

- 2017-05-23
CREATE TABLE `services_chat_agent_history` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `from_id` int(11) DEFAULT NULL,
  `to_id` int(11) DEFAULT NULL,
  `text` text,
  `direction` int(1) DEFAULT '1',
  `type` int(2) DEFAULT NULL COMMENT '1: text, 2: image, 3: sound, 4: file',
  `path` varchar(200) DEFAULT NULL,
  `ack` int(1) DEFAULT '1' COMMENT '0: pending, 1: send, 2: receive',
  `unread` int(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=121 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_checklist_location;

CREATE TABLE eng_checklist_location (
  checklist_id int(11) unsigned NOT NULL DEFAULT '0',
  location_id int(11) DEFAULT '0',
  lg_id int(11) DEFAULT '0',
  location_grp int(11) DEFAULT '0',
  name varchar(50) DEFAULT '',
  property_id int(5) DEFAULT '0',
  type varchar(50) DEFAULT '',
  type_id int(11) DEFAULT '0',
  KEY id (checklist_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_preventive_part;

CREATE TABLE eng_preventive_part (
  preventive_id int(11) DEFAULT '0',
  part_id int(11) DEFAULT '0' COMMENT 'part_id or part group_id',
  part_type varchar(20) DEFAULT '' COMMENT 'group or single'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_checklist_item;

CREATE TABLE eng_checklist_item (
  id int(20) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_checklist_pivot;

CREATE TABLE eng_checklist_pivot (
  checklist_id int(20) unsigned NOT NULL DEFAULT '0',
  item_id int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_workorder;

CREATE TABLE eng_workorder (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  user_id int(11) DEFAULT '0',
  name varchar(50) DEFAULT '',
  description text,
  checklist_id int(11) DEFAULT '0',
  priority enum('Low','Medium','High','Urgent') DEFAULT 'Low',
  equipment_id int(11) DEFAULT '0',
  frequency int(5) DEFAULT '0',
  frequency_unit enum('Days','Weeks','Months','Years') DEFAULT 'Days',
  created_date datetime DEFAULT NULL,
  start_date datetime DEFAULT NULL,
  end_date datetime DEFAULT NULL,
  duration int(11) DEFAULT '0',
  staff_id int(11) DEFAULT '0',
  staff_type varchar(20) DEFAULT '',
  staff_cost float(10,2) DEFAULT '0.00',
  part_cost float(10,2) DEFAULT '0.00',
  critical_flag int(2) DEFAULT '0',
  status enum('Pending','On Hold','In Progress','Completed') DEFAULT 'Pending',
  work_order_type enum('Repairs','Requests','Preventive','Upgrade','New') DEFAULT 'Repairs',
  property_id int(5) DEFAULT '0',
  purpose_start_date datetime DEFAULT NULL,
  purpose_end_date datetime DEFAULT NULL,
  request_id int(11) DEFAULT '0' COMMENT 'request_id from staff',
  request_flag int(3) DEFAULT '2' COMMENT '1=requet, 2=work order, 3=preventive automatically',
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8;


DROP TABLE IF EXISTS eng_workorder_part;

CREATE TABLE eng_workorder_part (
  workorder_id int(11) unsigned NOT NULL DEFAULT '0',
  part_id int(11) unsigned NOT NULL DEFAULT '0',
  part_name varchar(100) DEFAULT '',
  part_number int(5) DEFAULT '0',
  part_cost float(10,2) DEFAULT '0.00',
  part_stock int(5) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

kyg gold, [24.05.17 00:08]
DROP TABLE IF EXISTS eng_workorder_staff_status;

CREATE TABLE eng_workorder_staff_status (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  workorder_id int(11) DEFAULT '0',
  user_id int(11) DEFAULT '0',
  status enum('Pending','Working','Hold','Finished') DEFAULT 'Pending',
  status_flag int(2) DEFAULT '0' COMMENT '1= hold  0 = no hold',
  start_date datetime DEFAULT '0000-00-00 00:00:00',
  end_date datetime DEFAULT '0000-00-00 00:00:00',
  staff_id int(11) DEFAULT '0',
  staff_cost float(10,2) DEFAULT '0.00',
  duration int(11) DEFAULT '0',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;

/*Table structure for table eng_workorder_status_log */

DROP TABLE IF EXISTS eng_workorder_status_log;

CREATE TABLE eng_workorder_status_log (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  user_id int(11) DEFAULT '0',
  workorder_id int(11) unsigned NOT NULL,
  status enum('Pending','On Hold','In Progress','Completed','Custom','Working','Hold') DEFAULT 'Pending' COMMENT 'work order = Pending,On Hold,In Progress,Completed, Custom   staff stuts= Working, Hold, Finished',
  setdate datetime DEFAULT CURRENT_TIMESTAMP,
  staff_id int(11) DEFAULT '0',
  description text,
  log_kind enum('workorder','staff') DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_workorder_staff_status;

CREATE TABLE eng_workorder_staff_status (
  id bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  workorder_id int(11) DEFAULT '0',
  user_id int(11) DEFAULT '0',
  status enum('Pending','Working','Hold','Finished') DEFAULT 'Pending',
  status_flag int(2) DEFAULT '0' COMMENT '1= hold  0 = no hold',
  start_date datetime DEFAULT NULL,
  end_date datetime DEFAULT NULL,
  staff_id int(11) DEFAULT '0',
  staff_cost float(10,2) DEFAULT '0.00',
  duration int(11) DEFAULT '0',
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=89 DEFAULT CHARSET=utf8;

/*Table structure for table eng_workorder_status_log */

DROP TABLE IF EXISTS eng_workorder_status_log;

CREATE TABLE eng_workorder_status_log (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  user_id int(11) DEFAULT '0',
  workorder_id int(11) unsigned NOT NULL,
  status enum('Pending','On Hold','In Progress','Completed','Custom','Working','Hold') DEFAULT 'Pending' COMMENT 'work order = Pending,On Hold,In Progress,Completed, Custom   staff stuts= Working, Hold, Finished',
  setdate datetime DEFAULT CURRENT_TIMESTAMP,
  staff_id int(11) DEFAULT '0',
  description text,
  log_kind enum('workorder','staff') DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=188 DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_equip_part_group;

CREATE TABLE eng_equip_part_group (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  name varchar(150) DEFAULT NULL,
  description varchar(255) DEFAULT NULL,
  code varchar(50) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS eng_preventive_staff;

CREATE TABLE eng_preventive_staff (
  preventive_id int(11) DEFAULT '0',
  staff_id int(11) DEFAULT '0' COMMENT 'stff_id or staff_group_id',
  staff_type varchar(20) DEFAULT '' COMMENT 'staff (single) or staff group (group)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

- 2017-05-27
INSERT INTO common_page_route (name) VALUES ('app.engineering.preventive');

- 2017-05-29
INSERT INTO `common_page_route` (`name`) VALUES ('multi.property.access');
CREATE TABLE `common_property_jobrole_pivot`	( 
	`id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, 
	`property_id` INT(11), 
	`job_role_id` INT(11), 
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	`updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (`id`) );
	
DROP TABLE IF EXISTS `common_property_department_pivot`;

CREATE TABLE `common_property_department_pivot` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;


- 2017-05-30
INSERT INTO common_page_route (name) VALUES ('app.reports.complaints'); 

INSERT INTO common_page_route (name) VALUES ('bo.configuration.engineering'); 

ALTER TABLE eng_preventive_part ADD COLUMN part_quantity INT(10) DEFAULT 0 NULL COMMENT 'quantity from preventive' AFTER part_type; 

ALTER TABLE eng_workorder DROP INDEX name;	

CREATE TABLE eng_workorder_staff( workorder_id INT(11) UNSIGNED DEFAULT 0, staff_id INT(11) UNSIGNED DEFAULT 0, staff_name VARCHAR(50) DEFAULT '', staff_type VARCHAR(20) DEFAULT '', staff_cost FLOAT(10,2) DEFAULT 0.00 ); 
ALTER TABLE eng_preventive_staff ADD COLUMN staff_name VARCHAR(50) DEFAULT '' NULL AFTER staff_type;

ALTER TABLE `ennovatech_interface`.`channel` ADD COLUMN `alarm_level` INT(2) DEFAULT 0 NULL AFTER `complete_flag`; 

ALTER TABLE eng_workorder DROP COLUMN staff_id, DROP COLUMN staff_type;

- 2017-05-31
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.workorder.view'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.workorder.edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('mobile.maintenance.view');

- 2017-06-02
CREATE TABLE common_module (
  id int(5) NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT '',
  description varchar(200) DEFAULT '',
  PRIMARY KEY (id)
);

INSERT INTO common_page_route (name) VALUES ('bo.property.module'); 

CREATE TABLE common_module_property (
  property_id int(11) DEFAULT '0',
  module_id int(11) DEFAULT '0'
);

INSERT INTO common_page_route (name) VALUES ('bo.users.permissionmodule'); 


ALTER TABLE common_page_route ADD COLUMN module_id INT(5) DEFAULT 0 NULL AFTER name;

- 2017-06-05
INSERT INTO `common_page_route` (`name`) VALUES ('app.guestservice.reassign'); 
ALTER TABLE `services_task_log` ADD COLUMN `status` VARCHAR(20) NULL AFTER `user_id`, ADD COLUMN `method` VARCHAR(20) NULL AFTER `status`; 

- 2017-06-08
INSERT INTO ennovatech.common_page_route (name) VALUES ('bo.property.license'); 

CREATE TABLE common_property_license (
  id int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'index',
  name varchar(100) DEFAULT '' COMMENT 'name to connect central server',
  client_id int(10) DEFAULT '0' COMMENT 'client id',
  property_id int(11) DEFAULT '0' COMMENT 'property id',
  user_count int(11) DEFAULT '0' COMMENT 'property ''s count of user',
  room_count int(11) DEFAULT '0' COMMENT 'property ''s count of room',
  device_number varchar(250) DEFAULT '' COMMENT 'mainbord number',
  serial_number varchar(250) DEFAULT '' COMMENT 'registered licence number',
  detail text COMMENT 'property detail',
  register_date date DEFAULT NULL COMMENT 'registered date',
  period_day int(5) DEFAULT '90' COMMENT 'default is 90 day',
  expiry_date int(2) DEFAULT NULL COMMENT 'expiry date',
  PRIMARY KEY (id)
);


- 2017-06-14
INSERT INTO property_setting (property_id, settings_key, value, comment) VALUES ('4', 'central_server', '192.168.1.91', 'This is central server address. eg:192.168.1.91'); 
INSERT INTO property_setting (property_id, settings_key, value, comment) VALUES ('4', 'central_port', '80', 'This is central server port. eg:80'); 
INSERT INTO property_setting (property_id, settings_key, value, comment) VALUES ('4', 'central_email', 'admin@domain.com', 'This is central server email'); 
INSERT INTO property_setting (property_id, settings_key, value, comment) VALUES ('4', 'central_flag', '0', 'This is flag to use license');

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'auto_sync_employee_time', '01:00', 'auto employee sync time.'); 


DROP TABLE IF EXISTS common_property_license;

CREATE TABLE common_property_license (
  id int(11) unsigned NOT NULL AUTO_INCREMENT COMMENT 'index',
  client_id int(10) DEFAULT '0' COMMENT 'client id',
  address text COMMENT 'address',
  company varchar(200) DEFAULT '' COMMENT 'company',
  phone varchar(100) DEFAULT '' COMMENT 'phone',
  email varchar(100) DEFAULT '' COMMENT 'email',
  property_id int(11) DEFAULT '0' COMMENT 'property id',
  module text COMMENT 'property module',
  user_count int(11) DEFAULT '0' COMMENT 'property ''s count of user',
  room_count int(11) DEFAULT '0' COMMENT 'property ''s count of room',
  device_number varchar(250) DEFAULT '' COMMENT 'mainbord number',
  serial_number text COMMENT 'registered licence number',
  created_at datetime DEFAULT NULL COMMENT 'created date',
  updated_at datetime DEFAULT NULL COMMENT 'updated at',
  expiry_date datetime DEFAULT NULL COMMENT 'expiry date',
  PRIMARY KEY (id)
);

ALTER TABLE common_property_license DROP COLUMN module;

- 2017-06-17
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'push_confirm_duration', '70', 'push message deliver check duration'); 

- 2017-06-19

DROP TABLE IF EXISTS `common_employee`;

CREATE TABLE `common_employee` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `property_id` int(11) DEFAULT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `wef` datetime DEFAULT NULL,
  `rtype` varchar(10) DEFAULT NULL COMMENT 'record type',
  `empid` varchar(10) DEFAULT NULL,
  `fname` varchar(30) DEFAULT NULL,
  `lname` varchar(30) DEFAULT NULL,
  `sex` enum('Male','Female') DEFAULT NULL,
  `mstatus` enum('SINGLE','MARRIED') DEFAULT NULL COMMENT 'married status',
  `dob` date DEFAULT NULL COMMENT 'date of birth',
  `nationality` varchar(30) DEFAULT NULL,
  `tel` varchar(20) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `address` text,
  `country` varchar(30) DEFAULT NULL,
  `property` varchar(100) DEFAULT NULL,
  `divsn` varchar(10) DEFAULT NULL COMMENT ' sub we have section',
  `dept` varchar(100) DEFAULT NULL,
  `sdept` varchar(100) DEFAULT NULL COMMENT 'sub department',
  `design` varchar(10) DEFAULT NULL,
  `doj` datetime DEFAULT NULL COMMENT 'date of joining',
  `psnum` varchar(20) DEFAULT NULL COMMENT 'passport number',
  `psexp` date DEFAULT NULL COMMENT 'passport expiry',
  `vsexp` date DEFAULT NULL COMMENT 'visa expiry',
  `hasdone` enum('Y','N') DEFAULT NULL,
  `dot` datetime DEFAULT NULL,
  `cardid` varchar(10) DEFAULT NULL,
  `resfileno` varchar(50) DEFAULT NULL,
  `dateofissue` date DEFAULT NULL,
  `passportno` varchar(50) DEFAULT NULL,
  `vacation_start` datetime DEFAULT NULL,
  `vacation_end` datetime DEFAULT NULL,
  `grade` varchar(100) DEFAULT NULL,
  `short_name` varchar(100) DEFAULT NULL,
  `employee_type` varchar(1) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1006691 DEFAULT CHARSET=utf8;

- 2017-06-20
ALTER TABLE `services_task_log` ADD COLUMN `notify_id` INT(11) DEFAULT 0 NULL AFTER `method`; 
ALTER TABLE `services_shift_group_members` ADD COLUMN `delegated_user_id` INT(11) DEFAULT 0 NULL AFTER `vaca_end_date`; 

- 2017-06-23
INSERT INTO property_setting (property_id, settings_key, value, comment) VALUES ('4', 'central_server_request_time', '01:00', 'schedule time for request to central server.');

- 2017-06-24
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('0', 'export_server', 'http://192.168.1.253:8005/', 'export server url'); 

CREATE TABLE `services_complaint_subcomplaint_jobrole_dept_pivot` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `dept_id` int(11) DEFAULT NULL,
  `job_role_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

- 2017-06-30
CREATE TABLE `common_users_meta` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `meta_key` varchar(50) DEFAULT NULL,
  `meta_value` text,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

ALTER TABLE `services_complaint_log` ADD COLUMN `user_id` INT DEFAULT 0 NULL AFTER `type`; 

- 2017-07-01
ALTER TABLE `services_complaint_sublist` ADD COLUMN `ack` INT(1) DEFAULT 0 NULL AFTER `completed_by`, ADD COLUMN `ack_by` INT(11) DEFAULT 0 NULL AFTER `ack`; 

ALTER TABLE `services_complaint_sublist` ADD COLUMN `in_progress` INT(1) DEFAULT 0 NULL AFTER `ack_by`; 

- 2017-07-02
INSERT INTO `common_page_route` (`name`) VALUES ('app.complaint.complaint_edit'); 
INSERT INTO `common_page_route` (`name`) VALUES ('app.complaint.maincategory_add'); 

ALTER TABLE `services_complaint_maincategory` ADD COLUMN `user_id` INT(11) DEFAULT 0 NULL AFTER `name`; 

- 2017-07-03
INSERT INTO ennovatech.common_page_route (name) VALUES ('app.guestservice.promotion'); 

CREATE TABLE services_guest_promotion (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  outlet_name varchar(200) DEFAULT '',
  title varchar(250) DEFAULT '',
  price int(10) DEFAULT '0',
  discnt int(11) DEFAULT NULL,
  start_date datetime DEFAULT NULL,
  end_date datetime DEFAULT NULL,
  description varchar(250) DEFAULT '',
  highlight text,
  cond text,
  contact text,
  disclaimer varchar(200) DEFAULT '',
  email varchar(100) DEFAULT '',
  contact_no varchar(100) DEFAULT '0',
  comment text,
  enquiry_to text COMMENT 'will be separated by comma with email address',
  property_id int(10) DEFAULT NULL,
  path text,
  status enum('Active','Disable','Enabled','Expired','Cancel','Extended','Scheduled') DEFAULT 'Active',
  user_id int(11) DEFAULT NULL COMMENT 'user id',
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE services_guest_promotion_log (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  promotion_id int(11) NOT NULL DEFAULT '0',
  status enum('Active','Disable','Enabled','Expired','Cancel','Extended','Scheduled') NOT NULL DEFAULT 'Active',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
);

- 2017-07-07
ALTER TABLE `common_employee` CHANGE `design` `design` VARCHAR(100) CHARSET utf8 COLLATE utf8_general_ci NULL;

- 2017-07-08
INSERT INTO `common_page_route` (`name`) VALUES ('app.marketing'); 
INSERT INTO `common_page_route` (`name`) VALUES ('app.marketing.campaign'); 

ALTER TABLE `ennovatech_interface`.`channel` ADD COLUMN `ls_formatter` TEXT NULL AFTER `alarm_level`, ADD COLUMN `la_parser` TEXT NULL AFTER `ls_formatter`; 


- 2017-07-10
DROP TABLE IF EXISTS services_guest_promotion;

CREATE TABLE services_guest_promotion (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  outlet_name varchar(200) DEFAULT '',
  title varchar(250) DEFAULT '',
  price int(10) DEFAULT '0',
  discnt int(11) DEFAULT NULL,
  start_date datetime DEFAULT NULL,
  end_date datetime DEFAULT NULL,
  description varchar(250) DEFAULT '',
  highlight text,
  cond text,
  disclaimer varchar(200) DEFAULT '',
  enquiry_to text COMMENT 'will be separated by comma with email address',
  property_id int(10) DEFAULT NULL,
  path text,
  status enum('Active','Disable','Enabled','Expired','Cancel','Extended','Scheduled') DEFAULT 'Active',
  user_id int(11) DEFAULT NULL COMMENT 'user id',
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);



DROP TABLE IF EXISTS services_guest_promotion_log;

CREATE TABLE services_guest_promotion_log (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  promotion_id int(11) NOT NULL DEFAULT '0',
  status enum('Active','Disable','Enabled','Expired','Cancel','Extended','Scheduled') NOT NULL DEFAULT 'Active',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  user_id int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (id)
);

ALTER TABLE `ennovatech_interface`.`channel` ADD COLUMN `ls_duration` INT(10) DEFAULT 30 NULL AFTER `la_parser`; 
UPDATE `ennovatech_interface`.`protocol` SET `duplex` = 'Yes' WHERE `id` = '1';

ALTER TABLE `ennovatech_interface`.`channel` ADD COLUMN `sanity_check` ENUM('Yes','No') DEFAULT 'No' NULL AFTER `alarm_level`; 

- 2017-07-13
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_smtp_server', 'send.one.com'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_smtp_port', '465');
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_smtp_user', 'reports@myhotlync.com'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_smtp_password', 'Hotlync_2@16'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_smtp_sender', 'reports@myhotlync.com'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_smtp_auth', '1'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_smtp_tls', 'ssl'); 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_sms_host', 'http://api.infobip.com/sms/1/text/single'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_sms_auth', 'dtdu:0B0m9nBf'); 
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_sms_from', 'Ennovatech'); 

CREATE TABLE `marketing_addressbook` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `public` int(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `marketing_addressbook_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `book_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `marketing_campaign_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `active` enum('true','false') DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `type` enum('Birthday','Anniversary','Holiday','Other') DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `send_to` enum('Address Book','Manually') DEFAULT NULL,
  `email_flag` enum('true','false') DEFAULT NULL,
  `sms_flag` enum('true','false') DEFAULT NULL,
  `sms_content` text,
  `email_content` longtext,
  `periodic` enum('Pre Deliver','Immediately','Periodic') DEFAULT NULL,
  `before_date` int(10) DEFAULT '0',
  `every_date` int(10) DEFAULT '1',
  `holiday` date DEFAULT NULL,
  `trigger_at` time DEFAULT NULL,
  `trigger_datetime` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `marketing_campign_addressbook_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) DEFAULT NULL,
  `book_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `marketing_campign_guest_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `marketing_guest` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `first_name` varchar(50) DEFAULT NULL,
  `last_name` varchar(50) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `anniversary` date DEFAULT NULL,
  `mobile` varchar(30) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

ALTER TABLE `marketing_campaign_list` ADD COLUMN `email_subject` TEXT NULL AFTER `email_content`;

- 2017-07-15
ALTER TABLE `marketing_guest` ADD COLUMN `optout` INT(1) DEFAULT 0 NULL AFTER `email`, ADD COLUMN `access_token` VARCHAR(30) NULL AFTER `optout`; 

ALTER TABLE `marketing_campaign_list` ADD COLUMN `reject_flag` ENUM('true','false') DEFAULT 'true' NULL AFTER `trigger_datetime`; 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_email_reject_content', '<p>If you want to reject this promotion, please click follow link.</p><a href=\"http://192.168.1.253/hotlync/rejectpromotion?access_token=%s&guest_id=%d\">Reject Promotion</a>'); 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`) VALUES ('4', 'promotion_sms_reject_content', 'If you want to reject this promotion, please click follow link. http://192.168.1.253/hotlync/rejectpromotion?access_token=%s&guest_id=%d'); 

- 2017-07-17
CREATE INDEX guest_index ON common_guest (guest_id); 
ALTER TABLE `common_guest` ADD COLUMN `property_id` INT(11) NULL AFTER `id`; 
ALTER TABLE `common_guest` ADD COLUMN `first_name` VARCHAR(50) NULL AFTER `guest_name`, ADD COLUMN `title` VARCHAR(20) DEFAULT 'Mr' NULL AFTER `first_name`; 


UPDATE common_guest AS cg 
JOIN common_room AS cr ON cg.room_id = cr.id
JOIN common_floor AS cf ON cr.flr_id = cf.id
JOIN common_building AS cb ON cf.bldg_id = cb.id
SET cg.property_id = cb.property_id;

- 2017-07-18
ALTER TABLE `common_guest_advanced_detail` ADD COLUMN `property_id` INT(10) NULL AFTER `id`, ADD COLUMN `guest_id` INT(10) NULL AFTER `property_id`; 

UPDATE common_guest_advanced_detail 
SET guest_id = id;

UPDATE common_guest_advanced_detail AS de 
JOIN common_guest AS cg ON de.id = cg.id
SET de.property_id = cg.property_id;

ALTER TABLE `common_guest_log` ADD COLUMN `property_id` VARCHAR(11) NULL AFTER `action`, ADD COLUMN `first_name` VARCHAR(50) NULL AFTER `guest_name`, ADD COLUMN `title` VARCHAR(10) DEFAULT 'Mr' NULL AFTER `first_name`; 

UPDATE common_guest_log AS cg 
JOIN common_room AS cr ON cg.room_id = cr.id
JOIN common_floor AS cf ON cr.flr_id = cf.id
JOIN common_building AS cb ON cf.bldg_id = cb.id
SET cg.property_id = cb.property_id;

ALTER TABLE services_guest_promotion_log CHANGE status status ENUM('Active','Disable','Enabled','Expired','Cancel','Extended','Scheduled','Created') CHARSET latin1 COLLATE latin1_swedish_ci DEFAULT 'Active' NOT NULL;

- 2017-07-21
ALTER TABLE services_rm_srv_itm ADD COLUMN active_status INT(2) DEFAULT 1 NULL AFTER img_path;

CREATE TABLE services_rm_srv_itm_log (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  itm_id int(11) DEFAULT '0',
  user_id int(11) DEFAULT '0',
  action varchar(20) DEFAULT '',
  created_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
);

CREATE INDEX call_date ON call_admin_calls (call_date);
CREATE INDEX call_date_time ON call_admin_calls (call_date, start_time);
CREATE INDEX destination_id ON call_admin_calls (destination_id);
CREATE INDEX call_type ON call_admin_calls (call_type);
CREATE INDEX start_date_time ON ivr_voice_recording (start_date_time);

ALTER TABLE services_rm_srv_itm_log CHANGE action action VARCHAR(255) CHARSET latin1 COLLATE latin1_swedish_ci DEFAULT '' NULL;


ALTER TABLE `services_task_group` ADD COLUMN `by_guest_flag` INT(1) DEFAULT 1 NULL AFTER `comment_flag`;

- 2017-07-24
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_same_guest_notify', '1', 'if guest checkin again, send notification to duty manager'); 

ALTER TABLE `common_guest_profile` ADD COLUMN `check_flag` INT(1) DEFAULT 0 NULL AFTER `VIP`, ADD COLUMN `comment` TEXT NULL AFTER `check_flag`, ADD COLUMN `pref` TEXT NULL AFTER `comment`; 

INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'complaint_briefing_summary', '1', 'when briefing is ended, send summary report to attendants'); 

- 2017-07-25
ALTER TABLE `common_guest_profile` ADD COLUMN `flag_by` INT(11) DEFAULT 0 NULL AFTER `pref`, ADD COLUMN `flag_at` DATETIME NULL AFTER `flag_by`; 

ALTER TABLE `services_awu` ADD COLUMN `until_checkout_flag` INT(1) DEFAULT 1 NULL AFTER `repeat_flag`, ADD COLUMN `repeat_end_date` DATE NULL AFTER `until_checkout_flag`; 

- 2017-07-26
INSERT INTO common_page_route (name) VALUES ('app.guestservice.guest_sms_template'); 
CREATE TABLE common_guest_sms_template( id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT, property_id INT(10), template LONGTEXT, modified_by INT(10), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (id) );

ALTER TABLE common_guest ADD COLUMN ack INT(1) DEFAULT 0 NULL COMMENT '0: not delivered,  2: acknowledgment' AFTER created_at;

ALTER TABLE common_guest_log ADD COLUMN ack INT(1) DEFAULT 0 NULL COMMENT '0: not delivered,  2: acknowledgment' AFTER created_at;

- 2017-07-27
INSERT INTO `common_page_route` (`name`) VALUES ('app.complaint.advance_briefing'); 

CREATE TABLE common_guest_sms_history (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  guest_id int(11) DEFAULT '0',
  number varchar(20) DEFAULT '',
  status int(1) DEFAULT '0',
  user_id int(11) DEFAULT '0',
  created_at timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=latin1;

- 2017-07-31
INSERT INTO common_page_route (name) VALUES ('bo.admin.faq'); 
INSERT INTO common_page_route (name) VALUES ('app.faq');
CREATE TABLE common_category (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT '',
  PRIMARY KEY (id)
);


CREATE TABLE common_faq (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  title varchar(200) DEFAULT '',
  content text,
  excerpt text,
  module_id int(10) DEFAULT '0',
  category_id int(10) DEFAULT NULL,
  user_id int(11) DEFAULT '0',
  created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);


CREATE TABLE common_faq_tag (
  faq_id int(11) DEFAULT '0',
  tag_id int(11) DEFAULT '0'
);


CREATE TABLE common_tag (
  id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(50) DEFAULT '',
  PRIMARY KEY (id)
);
- 2017-08-01
ALTER TABLE `common_faq` CHANGE `content` `content` LONGTEXT NULL;
ALTER TABLE `common_property` ADD COLUMN `shortcode` VARCHAR(30) DEFAULT '' NULL AFTER `logo_path`;
INSERT INTO `property_setting` (`property_id`, `settings_key`, `value`, `comment`) VALUES ('4', 'send_sms_to_guest', 'OFF', 'ON/OFF   default=OFF');

ALTER TABLE `services_complaint_briefing_history` ADD COLUMN `briefing_room_id` INT(11) DEFAULT 0 NULL AFTER `property_id`; 

CREATE TABLE `services_complaint_briefing_room_complaint` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `briefing_room_id` int(11) DEFAULT NULL,
  `complaint_id` int(11) DEFAULT NULL,
  `discussed_flag` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `services_complaint_briefing_room_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(11) DEFAULT NULL,
  `property_id` int(11) DEFAULT NULL,
  `free_join_flag` int(1) DEFAULT '1',
  `status` enum('Waiting','Active','Ended','Cancelled','Scheduled') DEFAULT NULL,
  `start_at` datetime DEFAULT NULL,
  `end_at` datetime DEFAULT NULL,
  `schedule_flag` int(1) DEFAULT '0',
  `email_link_flag` int(1) DEFAULT '0',
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

CREATE TABLE `services_complaint_briefing_room_member` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `briefing_room_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `status` int(1) DEFAULT '0',
  `access_token` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8;

- 2017-08-02
ALTER TABLE `ennovatech_interface`.`channel` ADD COLUMN `le_parser` TEXT NULL AFTER `la_parser`;

- 2017-08-03
ALTER TABLE `ennovatech_interface`.`channel` ADD COLUMN `restart` INT(11) DEFAULT 120 NULL AFTER `duration`;
ALTER TABLE `ennovatech_interface`.`channel` ADD COLUMN `le_formatter` TEXT NULL AFTER `le_parser`; 

- 2017-08-04
INSERT INTO `common_page_route` (`name`, `module_id`) VALUES ('app.guestservice.manualposting', '10000'); 

- 2107-08-08

INSERT INTO property_setting (property_id, settings_key, value, comment) VALUES ('4', 'support_email', 'support@ennovatech.ae', 'This is email address of support'); 
INSERT INTO property_setting (property_id, settings_key, value, comment) VALUES ('4', 'central_live_server', 'http://192.168.1.91:8080/', 'central live server path(http://192.168.1.91:8003)\r\n'); 

CREATE TABLE common_support (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  client_id int(11) DEFAULT '0',
  property_id int(10) DEFAULT '0',
  module_id int(10) DEFAULT '0',
  subject varchar(200) DEFAULT '',
  severity enum('High','Medium','Low') DEFAULT 'Low',
  created_at datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  attach_path text,
  status enum('Open','Assigned','Pending','Close') DEFAULT 'Open',
  from_email varchar(200) DEFAULT '',
  to_email varchar(200) DEFAULT '',
  cc_email varchar(250) DEFAULT '',
  issue text,
  user_id int(11) DEFAULT '0',
  device_number varchar(250) DEFAULT '' COMMENT 'mainboard number',
  PRIMARY KEY (id)
);


CREATE TABLE common_support_log (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  status varchar(50) DEFAULT '',
  user_id int(11) DEFAULT '0',
  support_id int(11) DEFAULT '0',
  PRIMARY KEY (id)
);


CREATE TABLE common_support_message (
  id int(11) unsigned NOT NULL AUTO_INCREMENT,
  support_id int(11) DEFAULT '0',
  user_id int(11) DEFAULT '0',
  first_name varchar(50) DEFAULT '',
  last_name varchar(50) DEFAULT '',
  option enum('support','user') DEFAULT 'user' COMMENT 'support = centralserver, user= hotlync',
  message text,
  created_at datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

ALTER TABLE `services_complaint_request` ADD COLUMN `send_flag` enum('0','1') DEFAULT '0' NOT NULL AFTER `path`;  
ALTER TABLE `services_complaint_request` ADD COLUMN `sent_ids` text NOT NULL AFTER `send_flag`;
