/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 10.1.9-MariaDB : Database - ennovatech_client2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `audit_login_log` */

DROP TABLE IF EXISTS `audit_login_log`;

CREATE TABLE `audit_login_log` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `location` varchar(20) NOT NULL,
  `is_success` tinyint(1) NOT NULL,
  `ip_address` varchar(20) NOT NULL,
  `hostname` varchar(20) NOT NULL,
  `user_agent` varchar(255) NOT NULL,
  `note` varchar(1000) NOT NULL,
  `via_cookie` tinyint(1) NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_F16D9FFF217BBB47` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `call_admin_calls` */

DROP TABLE IF EXISTS `call_admin_calls`;

CREATE TABLE `call_admin_calls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `extension_id` varchar(6) NOT NULL,
  `user_id` int(4) DEFAULT NULL,
  `call_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `called_no` varchar(16) NOT NULL,
  `trunk` varchar(8) DEFAULT NULL,
  `transfer` varchar(30) DEFAULT NULL,
  `call_type` enum('Internal','Received','International','Local','Mobile','National','Toll Free','Missed','Received_I') NOT NULL,
  `destination_id` int(4) NOT NULL,
  `carrier_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `classify` enum('Business','Personal','Unclassified') DEFAULT 'Unclassified',
  `approval` enum('Waiting For Approval','Pre-Approved','Approved','Rejected','Returned','Closed') DEFAULT NULL,
  `submitter` int(4) DEFAULT NULL COMMENT 'ID of user submitting for approval',
  `approver` int(4) DEFAULT NULL COMMENT 'User ID of approver',
  `comment` text,
  `admin_charge_rate_id` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `extension` (`extension_id`),
  KEY `calldate` (`call_date`),
  KEY `updatedatetime` (`called_no`,`call_type`,`duration`,`start_time`,`end_time`,`trunk`)
) ENGINE=MyISAM AUTO_INCREMENT=208094 DEFAULT CHARSET=latin1;

/*Table structure for table `call_admin_charge_map` */

DROP TABLE IF EXISTS `call_admin_charge_map`;

CREATE TABLE `call_admin_charge_map` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(256) NOT NULL,
  `carrier_group_id` int(4) NOT NULL,
  `time_slab_group` int(4) NOT NULL,
  `carrier_charges` int(4) NOT NULL,
  `call_allowance` int(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1;

/*Table structure for table `call_admin_received_calls` */

DROP TABLE IF EXISTS `call_admin_received_calls`;

CREATE TABLE `call_admin_received_calls` (
  `extension_id` varchar(6) NOT NULL,
  `from_ext` varchar(6) NOT NULL,
  `user_id` int(4) DEFAULT NULL,
  `call_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `called_no` varchar(16) NOT NULL,
  `trunk` varchar(8) DEFAULT NULL,
  `transfer` varchar(30) DEFAULT NULL,
  `call_type` varchar(10) CHARACTER SET utf8 NOT NULL,
  `destination_id` int(4) NOT NULL,
  `carrier_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `classify` enum('Business','Personal','Unclassified') DEFAULT 'Unclassified',
  `approval` enum('Waiting For Approval','Pre-Approved','Approved','Rejected','Returned','Closed') DEFAULT NULL,
  `submitter` int(4) DEFAULT NULL COMMENT 'ID of user submitting for approval',
  `approver` int(4) DEFAULT NULL COMMENT 'User ID of approver',
  `COMMENT` text,
  `admin_charge_rate_id` int(5) DEFAULT NULL,
  KEY `extension` (`extension_id`),
  KEY `calldate` (`call_date`),
  KEY `updatedatetime` (`called_no`,`call_type`,`duration`,`start_time`,`end_time`,`trunk`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `call_allowance` */

DROP TABLE IF EXISTS `call_allowance`;

CREATE TABLE `call_allowance` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `Name` varchar(20) NOT NULL,
  `Value` int(2) NOT NULL COMMENT 'in Seconds',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `call_bc_calls` */

DROP TABLE IF EXISTS `call_bc_calls`;

CREATE TABLE `call_bc_calls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `extension_id` varchar(6) NOT NULL,
  `user_id` int(4) DEFAULT NULL,
  `call_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `pulse` int(4) NOT NULL,
  `called_no` varchar(16) NOT NULL,
  `trunk` varchar(8) DEFAULT NULL,
  `transfer` varchar(256) DEFAULT NULL,
  `call_type` enum('Internal','Received','International','Local','Mobile','National','Toll Free','Missed') NOT NULL,
  `destination_id` int(4) NOT NULL,
  `carrier_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `hotel_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `tax` float(10,2) NOT NULL DEFAULT '0.00',
  `total_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `classify` enum('Business','Personal','Unclassified') DEFAULT 'Unclassified',
  `approval` enum('Waiting For Approval','Pre-Approved','Approved','Rejected','Returned','Closed') DEFAULT NULL,
  `submitter` int(4) DEFAULT NULL COMMENT 'ID of user submitting for approval',
  `approver` int(4) DEFAULT NULL COMMENT 'User ID of approver',
  `comment` text,
  `guest_charge_rate_id` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `extension` (`extension_id`),
  KEY `calldate` (`call_date`),
  KEY `updatedatetime` (`called_no`,`call_type`,`duration`,`start_time`,`end_time`,`trunk`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=latin1;

/*Table structure for table `call_bc_received_calls` */

DROP TABLE IF EXISTS `call_bc_received_calls`;

CREATE TABLE `call_bc_received_calls` (
  `extension_id` varchar(6) NOT NULL,
  `from_ext` varchar(6) NOT NULL,
  `user_id` int(4) DEFAULT NULL,
  `call_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `called_no` varchar(16) NOT NULL,
  `trunk` varchar(8) DEFAULT NULL,
  `transfer` varchar(30) DEFAULT NULL,
  `call_type` varchar(10) CHARACTER SET utf8 NOT NULL,
  `destination_id` int(4) NOT NULL,
  `carrier_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `tax` float(10,2) NOT NULL DEFAULT '0.00',
  `hotel_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `total_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `classify` enum('Business','Personal','Unclassified') DEFAULT 'Unclassified',
  `approval` enum('Waiting For Approval','Pre-Approved','Approved','Rejected','Returned','Closed') DEFAULT NULL,
  `submitter` int(4) DEFAULT NULL COMMENT 'ID of user submitting for approval',
  `approver` int(4) DEFAULT NULL COMMENT 'User ID of approver',
  `COMMENT` text,
  `admin_charge_rate_id` int(5) DEFAULT NULL,
  KEY `extension` (`extension_id`),
  KEY `calldate` (`call_date`),
  KEY `updatedatetime` (`called_no`,`call_type`,`duration`,`start_time`,`end_time`,`trunk`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `call_carrier` */

DROP TABLE IF EXISTS `call_carrier`;

CREATE TABLE `call_carrier` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `prpty_id` int(4) NOT NULL,
  `carrier` varchar(25) NOT NULL COMMENT 'provider name',
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carrier` (`carrier`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Table structure for table `call_carrier_charges` */

DROP TABLE IF EXISTS `call_carrier_charges`;

CREATE TABLE `call_carrier_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(4) NOT NULL,
  `charge` float(6,5) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `method` enum('Second','Minute','Pulse','Per Call') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `code` (`carrier_id`)
) ENGINE=MyISAM AUTO_INCREMENT=43 DEFAULT CHARSET=latin1;

/*Table structure for table `call_carrier_groups` */

DROP TABLE IF EXISTS `call_carrier_groups`;

CREATE TABLE `call_carrier_groups` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `call_type` enum('International','Local','Mobile','National','Toll Free') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `carrier_id` (`carrier_id`,`name`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;

/*Table structure for table `call_center_extension` */

DROP TABLE IF EXISTS `call_center_extension`;

CREATE TABLE `call_center_extension` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT '0',
  `extension` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Table structure for table `call_classification_reminder` */

DROP TABLE IF EXISTS `call_classification_reminder`;

CREATE TABLE `call_classification_reminder` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `max_unmark_flag` int(1) DEFAULT '0',
  `max_approver_notify_flag` int(1) DEFAULT '0',
  `max_close_notify_flag` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `call_comments` */

DROP TABLE IF EXISTS `call_comments`;

CREATE TABLE `call_comments` (
  `id` int(8) NOT NULL AUTO_INCREMENT,
  `call_id` int(8) NOT NULL,
  `user_id` int(4) NOT NULL,
  `comment` varchar(256) NOT NULL,
  `date_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100 DEFAULT CHARSET=latin1;

/*Table structure for table `call_destination` */

DROP TABLE IF EXISTS `call_destination`;

CREATE TABLE `call_destination` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `country` varchar(25) NOT NULL,
  `code` varchar(10) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `code` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=258 DEFAULT CHARSET=latin1;

/*Table structure for table `call_group_destination` */

DROP TABLE IF EXISTS `call_group_destination`;

CREATE TABLE `call_group_destination` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `carrier_group_id` int(4) NOT NULL,
  `destination_id` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `group_id` (`carrier_group_id`,`destination_id`)
) ENGINE=InnoDB AUTO_INCREMENT=885 DEFAULT CHARSET=latin1;

/*Table structure for table `call_guest_call` */

DROP TABLE IF EXISTS `call_guest_call`;

CREATE TABLE `call_guest_call` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` varchar(4) NOT NULL,
  `guest_id` int(6) NOT NULL,
  `extension_id` int(10) DEFAULT NULL,
  `call_date` date NOT NULL,
  `called_no` varchar(16) NOT NULL,
  `call_type` enum('Internal','Received','Local','Mobile','National','International','Toll Free','Missed') NOT NULL,
  `trunk` varchar(100) DEFAULT NULL,
  `transfer` varchar(30) DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `pulse` int(5) DEFAULT '0',
  `destination_id` int(4) NOT NULL,
  `carrier_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `tax` float(10,2) NOT NULL DEFAULT '0.00',
  `hotel_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `total_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `guest_charge_rate_id` int(10) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `calldate` (`call_date`),
  KEY `countrycode` (`destination_id`),
  KEY `roomno` (`room_id`),
  KEY `guestid` (`guest_id`),
  KEY `updatedatetime` (`carrier_charges`,`hotel_charges`,`called_no`,`call_type`,`duration`,`start_time`,`end_time`,`tax`,`total_charges`,`trunk`),
  KEY `id` (`id`),
  KEY `calldate_2` (`call_date`),
  KEY `roomno_2` (`room_id`),
  KEY `calldate_3` (`call_date`)
) ENGINE=MyISAM AUTO_INCREMENT=93834 DEFAULT CHARSET=latin1;

/*Table structure for table `call_guest_charge_map` */

DROP TABLE IF EXISTS `call_guest_charge_map`;

CREATE TABLE `call_guest_charge_map` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `carrier_group_id` int(4) NOT NULL,
  `carrier_charges` int(4) NOT NULL,
  `hotel_charges` int(4) NOT NULL,
  `tax` int(4) NOT NULL,
  `call_allowance` int(4) NOT NULL,
  `time_slab` int(4) NOT NULL,
  `name` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=latin1;

/*Table structure for table `call_guest_extn` */

DROP TABLE IF EXISTS `call_guest_extn`;

CREATE TABLE `call_guest_extn` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `bldg_id` int(4) NOT NULL,
  `room_id` int(4) NOT NULL,
  `primary_extn` enum('Y','N') NOT NULL,
  `extension` int(8) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `room_id` (`room_id`,`primary_extn`)
) ENGINE=InnoDB AUTO_INCREMENT=617 DEFAULT CHARSET=latin1;

/*Table structure for table `call_guest_received_call` */

DROP TABLE IF EXISTS `call_guest_received_call`;

CREATE TABLE `call_guest_received_call` (
  `room_id` varchar(4) NOT NULL,
  `from_room` varchar(6) NOT NULL,
  `guest_id` int(6) NOT NULL,
  `extension_id` int(10) DEFAULT NULL,
  `from_ext` varchar(6) NOT NULL,
  `call_date` date NOT NULL,
  `called_no` varchar(16) NOT NULL,
  `call_type` enum('Internal','Received','Local','Mobile','National','International','Toll Free','Missed','Received_I') NOT NULL,
  `trunk` varchar(100) DEFAULT NULL,
  `transfer` varchar(30) DEFAULT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `pulse` int(5) DEFAULT '0',
  `destination_id` int(4) NOT NULL,
  `carrier_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `tax` float(10,2) NOT NULL DEFAULT '0.00',
  `hotel_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `total_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `guest_charge_rate_id` int(10) DEFAULT '0',
  KEY `calldate` (`call_date`),
  KEY `countrycode` (`destination_id`),
  KEY `roomno` (`room_id`),
  KEY `guestid` (`guest_id`),
  KEY `updatedatetime` (`carrier_charges`,`hotel_charges`,`called_no`,`call_type`,`duration`,`start_time`,`end_time`,`tax`,`total_charges`,`trunk`),
  KEY `calldate_2` (`call_date`),
  KEY `roomno_2` (`room_id`),
  KEY `calldate_3` (`call_date`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `call_hotel_charges` */

DROP TABLE IF EXISTS `call_hotel_charges`;

CREATE TABLE `call_hotel_charges` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `charge` float(6,3) NOT NULL,
  `method` enum('Per Call','Percentage','Duration','Pulse') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Table structure for table `call_night_audit_time` */

DROP TABLE IF EXISTS `call_night_audit_time`;

CREATE TABLE `call_night_audit_time` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `channel_id` int(10) DEFAULT NULL,
  `build_ids` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

/*Table structure for table `call_phonebook` */

DROP TABLE IF EXISTS `call_phonebook`;

CREATE TABLE `call_phonebook` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `department_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `call_phonebook_list` */

DROP TABLE IF EXISTS `call_phonebook_list`;

CREATE TABLE `call_phonebook_list` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `phonebook_id` int(4) NOT NULL,
  `user_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `number` varchar(18) NOT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`,`number`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `call_section` */

DROP TABLE IF EXISTS `call_section`;

CREATE TABLE `call_section` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `dept_id` int(4) NOT NULL,
  `manager_id` int(4) NOT NULL,
  `section` varchar(25) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `building_id` int(4) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dept_id` (`dept_id`,`section`),
  KEY `deptid` (`dept_id`)
) ENGINE=MyISAM AUTO_INCREMENT=87 DEFAULT CHARSET=latin1;

/*Table structure for table `call_staff_extn` */

DROP TABLE IF EXISTS `call_staff_extn`;

CREATE TABLE `call_staff_extn` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `section_id` int(4) NOT NULL,
  `user_id` int(4) DEFAULT NULL,
  `extension` int(8) NOT NULL,
  `description` varchar(100) NOT NULL,
  `user_group_id` int(11) DEFAULT NULL,
  `bc_flag` enum('0','1') DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  UNIQUE KEY `section_id` (`section_id`,`extension`),
  KEY `id_2` (`id`),
  KEY `extension` (`extension`)
) ENGINE=InnoDB AUTO_INCREMENT=199 DEFAULT CHARSET=latin1;

/*Table structure for table `call_tax` */

DROP TABLE IF EXISTS `call_tax`;

CREATE TABLE `call_tax` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(4) NOT NULL,
  `name` varchar(255) NOT NULL,
  `value` float(6,3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Table structure for table `call_temp` */

DROP TABLE IF EXISTS `call_temp`;

CREATE TABLE `call_temp` (
  `id` int(11) NOT NULL DEFAULT '0',
  `call_date` date NOT NULL,
  `start_time` time NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `extension` varchar(20) DEFAULT NULL,
  `called_no` varchar(20) NOT NULL,
  `trunk` varchar(10) DEFAULT NULL,
  `call_direction` int(2) DEFAULT '0' COMMENT '0: internal, 1: received, 2: missed, 3: outgoing'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `call_time_slab` */

DROP TABLE IF EXISTS `call_time_slab`;

CREATE TABLE `call_time_slab` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `carrier_id` int(4) NOT NULL,
  `time_slab` int(4) NOT NULL,
  `name` varchar(24) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `days_of_week` set('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

/*Table structure for table `call_time_slab_group` */

DROP TABLE IF EXISTS `call_time_slab_group`;

CREATE TABLE `call_time_slab_group` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `name` varchar(25) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `cdr` */

DROP TABLE IF EXISTS `cdr`;

CREATE TABLE `cdr` (
  `calldate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `clid` varchar(80) NOT NULL DEFAULT '',
  `src` varchar(80) NOT NULL DEFAULT '',
  `dst` varchar(80) NOT NULL DEFAULT '',
  `dcontext` varchar(80) NOT NULL DEFAULT '',
  `channel` varchar(80) NOT NULL DEFAULT '',
  `dstchannel` varchar(80) NOT NULL DEFAULT '',
  `lastapp` varchar(80) NOT NULL DEFAULT '',
  `lastdata` varchar(80) NOT NULL DEFAULT '',
  `duration` int(11) NOT NULL DEFAULT '0',
  `billsec` int(11) NOT NULL DEFAULT '0',
  `disposition` varchar(45) NOT NULL DEFAULT '',
  `amaflags` int(11) NOT NULL DEFAULT '0',
  `accountcode` varchar(20) NOT NULL DEFAULT '',
  `uniqueid` varchar(100) NOT NULL DEFAULT '',
  `userfield` varchar(255) NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `common_admin_area` */

DROP TABLE IF EXISTS `common_admin_area`;

CREATE TABLE `common_admin_area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `floor_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `common_building` */

DROP TABLE IF EXISTS `common_building`;

CREATE TABLE `common_building` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `name` varchar(20) NOT NULL,
  `description` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `property_id_2` (`property_id`,`name`),
  KEY `property_id` (`property_id`),
  CONSTRAINT `dependent` FOREIGN KEY (`property_id`) REFERENCES `common_property` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

/*Table structure for table `common_chain` */

DROP TABLE IF EXISTS `common_chain`;

CREATE TABLE `common_chain` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Table structure for table `common_cmn_area` */

DROP TABLE IF EXISTS `common_cmn_area`;

CREATE TABLE `common_cmn_area` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `floor_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `common_country` */

DROP TABLE IF EXISTS `common_country`;

CREATE TABLE `common_country` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=239 DEFAULT CHARSET=utf8;

/*Table structure for table `common_department` */

DROP TABLE IF EXISTS `common_department`;

CREATE TABLE `common_department` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `department` varchar(25) NOT NULL,
  `description` varchar(19) DEFAULT NULL,
  `short_code` varchar(4) NOT NULL,
  `services` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=51 DEFAULT CHARSET=utf8;

/*Table structure for table `common_division` */

DROP TABLE IF EXISTS `common_division`;

CREATE TABLE `common_division` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `property_id` int(1) DEFAULT NULL,
  `division` varchar(25) NOT NULL,
  `description` varchar(19) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `property_id` (`property_id`,`division`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Table structure for table `common_floor` */

DROP TABLE IF EXISTS `common_floor`;

CREATE TABLE `common_floor` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `bldg_id` int(4) NOT NULL,
  `floor` varchar(2) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bldg_id` (`bldg_id`,`floor`),
  CONSTRAINT `bldg` FOREIGN KEY (`bldg_id`) REFERENCES `common_building` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=latin1;

/*Table structure for table `common_guest` */

DROP TABLE IF EXISTS `common_guest`;

CREATE TABLE `common_guest` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `guest_id` int(6) NOT NULL,
  `guest_group` int(10) NOT NULL,
  `guest_name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(25) DEFAULT NULL,
  `room_id` int(4) NOT NULL,
  `arrival` date NOT NULL,
  `departure` date NOT NULL,
  `share` tinyint(1) NOT NULL DEFAULT '0',
  `vip` int(4) NOT NULL DEFAULT '0',
  `language` varchar(4) NOT NULL DEFAULT 'EN',
  `pre_checkin` tinyint(1) NOT NULL DEFAULT '0',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `dnd` tinyint(1) NOT NULL DEFAULT '0',
  `cos` int(4) NOT NULL DEFAULT '3',
  `ml` tinyint(1) NOT NULL DEFAULT '0',
  `checkout_flag` enum('checkin','checkout') DEFAULT 'checkout',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`,`guest_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3036794 DEFAULT CHARSET=latin1;

/*Table structure for table `common_guest_log` */

DROP TABLE IF EXISTS `common_guest_log`;

CREATE TABLE `common_guest_log` (
  `id` int(6) NOT NULL AUTO_INCREMENT,
  `action` varchar(40) DEFAULT 'checkin',
  `guest_id` int(6) NOT NULL,
  `guest_group` int(10) NOT NULL,
  `guest_name` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mobile` varchar(25) DEFAULT NULL,
  `room_id` int(4) NOT NULL,
  `arrival` date NOT NULL,
  `departure` date NOT NULL,
  `share` tinyint(1) NOT NULL DEFAULT '0',
  `vip` int(4) NOT NULL DEFAULT '0',
  `language` varchar(4) NOT NULL DEFAULT 'EN',
  `pre_checkin` tinyint(1) NOT NULL DEFAULT '0',
  `is_archived` tinyint(1) NOT NULL DEFAULT '0',
  `dnd` tinyint(1) NOT NULL DEFAULT '0',
  `cos` int(4) NOT NULL DEFAULT '3',
  `ml` tinyint(1) NOT NULL DEFAULT '0',
  `checkout_flag` enum('checkin','checkout') DEFAULT 'checkout',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15249 DEFAULT CHARSET=latin1;

/*Table structure for table `common_guest_profile` */

DROP TABLE IF EXISTS `common_guest_profile`;

CREATE TABLE `common_guest_profile` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT '0',
  `guest_name` varchar(30) DEFAULT NULL,
  `mobile` varchar(15) DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `address` text,
  `gender` enum('Male','Female') DEFAULT NULL,
  `nationality` int(5) DEFAULT NULL,
  `passport` varchar(30) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3022402 DEFAULT CHARSET=utf8;

/*Table structure for table `common_guest_type` */

DROP TABLE IF EXISTS `common_guest_type`;

CREATE TABLE `common_guest_type` (
  `id` int(4) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `opera_code` int(10) DEFAULT NULL,
  `guest_type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `common_job_role` */

DROP TABLE IF EXISTS `common_job_role`;

CREATE TABLE `common_job_role` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `job_role` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dept_id` int(11) DEFAULT NULL,
  `permission_group_id` int(10) DEFAULT NULL,
  `manager_flag` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `common_language` */

DROP TABLE IF EXISTS `common_language`;

CREATE TABLE `common_language` (
  `id` int(1) unsigned NOT NULL AUTO_INCREMENT,
  `prpty_id` int(4) NOT NULL,
  `code` char(2) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `ivr_code` varchar(2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `prpty_id` (`prpty_id`,`code`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `common_notification` */

DROP TABLE IF EXISTS `common_notification`;

CREATE TABLE `common_notification` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT '0',
  `type` varchar(30) DEFAULT NULL,
  `property_id` int(10) DEFAULT NULL,
  `content` text,
  `notification_id` int(11) DEFAULT NULL,
  `unread_flag` int(1) DEFAULT '1',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=175 DEFAULT CHARSET=utf8;

/*Table structure for table `common_outdoor` */

DROP TABLE IF EXISTS `common_outdoor`;

CREATE TABLE `common_outdoor` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `common_page_route` */

DROP TABLE IF EXISTS `common_page_route`;

CREATE TABLE `common_page_route` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=67 DEFAULT CHARSET=utf8;

/*Table structure for table `common_perm_group` */

DROP TABLE IF EXISTS `common_perm_group`;

CREATE TABLE `common_perm_group` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `home_route_id` int(5) DEFAULT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

/*Table structure for table `common_permission_members` */

DROP TABLE IF EXISTS `common_permission_members`;

CREATE TABLE `common_permission_members` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `perm_group_id` int(11) DEFAULT NULL,
  `page_route_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_2DEDCC6FD2112630` (`perm_group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1890 DEFAULT CHARSET=utf8;

/*Table structure for table `common_property` */

DROP TABLE IF EXISTS `common_property`;

CREATE TABLE `common_property` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_id` int(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `contact` varchar(20) NOT NULL,
  `mobile` varchar(20) NOT NULL,
  `email` varchar(254) NOT NULL,
  `modules` set('Call Accounting','Voicemail','Room Service','Houskeeping','Guest Services','Engineering') NOT NULL,
  `city` varchar(20) NOT NULL,
  `country` varchar(20) NOT NULL,
  `address` varchar(256) NOT NULL,
  `logo_path` varchar(256) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `client_id_2` (`client_id`),
  CONSTRAINT `Dependency` FOREIGN KEY (`client_id`) REFERENCES `common_chain` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Table structure for table `common_report_history` */

DROP TABLE IF EXISTS `common_report_history`;

CREATE TABLE `common_report_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(30) DEFAULT NULL,
  `folder_path` varchar(250) DEFAULT NULL,
  `filename` varchar(250) DEFAULT NULL,
  `filter` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=utf8;

/*Table structure for table `common_room` */

DROP TABLE IF EXISTS `common_room`;

CREATE TABLE `common_room` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `type_id` int(4) NOT NULL,
  `flr_id` int(4) NOT NULL,
  `hskp_status_id` int(4) NOT NULL DEFAULT '1',
  `room` varchar(10) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bldg_id` (`room`)
) ENGINE=InnoDB AUTO_INCREMENT=617 DEFAULT CHARSET=latin1;

/*Table structure for table `common_room_type` */

DROP TABLE IF EXISTS `common_room_type`;

CREATE TABLE `common_room_type` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `bldg_id` int(4) NOT NULL,
  `type` varchar(20) NOT NULL,
  `max_time` int(10) DEFAULT '10',
  `description` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `bldg_id` (`bldg_id`,`type`),
  CONSTRAINT `rm_type` FOREIGN KEY (`bldg_id`) REFERENCES `common_building` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;

/*Table structure for table `common_schedule_report_setting` */

DROP TABLE IF EXISTS `common_schedule_report_setting`;

CREATE TABLE `common_schedule_report_setting` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `report_type` varchar(20) DEFAULT NULL,
  `name` varchar(40) DEFAULT NULL,
  `frequency` varchar(20) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `day` varchar(10) DEFAULT NULL,
  `time` time DEFAULT NULL,
  `recipient` varchar(50) DEFAULT NULL,
  `filter` text,
  `repeat_flag` int(1) DEFAULT '0',
  `submitter` int(10) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Table structure for table `common_status_per_user` */

DROP TABLE IF EXISTS `common_status_per_user`;

CREATE TABLE `common_status_per_user` (
  `id` int(10) unsigned NOT NULL,
  `max_call_no` int(12) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `common_user_group` */

DROP TABLE IF EXISTS `common_user_group`;

CREATE TABLE `common_user_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `access_level` set('IVR','User','Dispatcher','Reports','Manager','Supervisor') NOT NULL,
  `perm_group` int(4) NOT NULL,
  `group_notification` enum('Y','N') NOT NULL,
  `group_notification_type` enum('SMS','email') NOT NULL,
  `sms` varchar(20) NOT NULL,
  `email` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;

/*Table structure for table `common_user_group_members` */

DROP TABLE IF EXISTS `common_user_group_members`;

CREATE TABLE `common_user_group_members` (
  `group_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`group_id`,`user_id`),
  KEY `IDX_CC952C03296CD8AE` (`group_id`),
  KEY `IDX_CC952C03217BBB47` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `common_user_transaction` */

DROP TABLE IF EXISTS `common_user_transaction`;

CREATE TABLE `common_user_transaction` (
  `user_id` int(10) DEFAULT NULL,
  `action` varchar(200) DEFAULT NULL,
  `detail` text,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `common_users` */

DROP TABLE IF EXISTS `common_users`;

CREATE TABLE `common_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `username` varchar(25) NOT NULL,
  `password` varchar(10) NOT NULL,
  `ivr_password` int(4) NOT NULL,
  `dept_id` int(4) NOT NULL,
  `mobile` varchar(16) NOT NULL,
  `email` varchar(256) NOT NULL,
  `picture` varchar(100) DEFAULT '/frontpage/img/default_photo.png',
  `job_role_id` int(11) DEFAULT NULL,
  `unread` int(11) DEFAULT '0',
  `max_read_no` int(11) DEFAULT '0',
  `contact_pref_bus` enum('Mobile','e-mail','SMS') NOT NULL,
  `contact_pref_nbus` enum('Mobile','e-mail','SMS') NOT NULL,
  `access_token` varchar(200) DEFAULT NULL,
  `fcm_key` varchar(200) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `lock` enum('Yes','No') DEFAULT 'Yes',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=207 DEFAULT CHARSET=latin1;

/*Table structure for table `common_users_active` */

DROP TABLE IF EXISTS `common_users_active`;

CREATE TABLE `common_users_active` (
  `user_id` int(10) NOT NULL,
  `active_key` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `common_users_log_history` */

DROP TABLE IF EXISTS `common_users_log_history`;

CREATE TABLE `common_users_log_history` (
  `user_id` int(10) DEFAULT NULL,
  `password` varchar(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `extensions` */

DROP TABLE IF EXISTS `extensions`;

CREATE TABLE `extensions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `context` varchar(20) NOT NULL DEFAULT '',
  `exten` varchar(20) NOT NULL DEFAULT '',
  `priority` tinyint(4) NOT NULL DEFAULT '0',
  `app` varchar(20) NOT NULL DEFAULT '',
  `appdata` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`context`,`exten`,`priority`),
  KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=266 DEFAULT CHARSET=latin1;

/*Table structure for table `ivr_agent_status_history` */

DROP TABLE IF EXISTS `ivr_agent_status_history`;

CREATE TABLE `ivr_agent_status_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `status` varchar(10) COLLATE utf8_unicode_ci DEFAULT NULL,
  `extension` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ticket_id` int(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `duration` int(10) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3847 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `ivr_agent_status_log` */

DROP TABLE IF EXISTS `ivr_agent_status_log`;

CREATE TABLE `ivr_agent_status_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `status` varchar(10) DEFAULT NULL,
  `extension` varchar(20) DEFAULT NULL,
  `ticket_id` int(10) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8;

/*Table structure for table `ivr_call_history` */

DROP TABLE IF EXISTS `ivr_call_history`;

CREATE TABLE `ivr_call_history` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` int(10) DEFAULT NULL,
  `status` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2917 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `ivr_callcenter_state` */

DROP TABLE IF EXISTS `ivr_callcenter_state`;

CREATE TABLE `ivr_callcenter_state` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(6) DEFAULT '0',
  `no_avail_send_flag` int(1) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Table structure for table `ivr_caller_profile` */

DROP TABLE IF EXISTS `ivr_caller_profile`;

CREATE TABLE `ivr_caller_profile` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `callerid` varchar(20) DEFAULT NULL,
  `national` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `company` tinyint(1) DEFAULT '0',
  `companyname` varchar(50) DEFAULT NULL,
  `address` text,
  `salutation` varchar(10) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `spam` tinyint(1) DEFAULT '0',
  `image` varchar(1024) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8;

/*Table structure for table `ivr_dial_plan` */

DROP TABLE IF EXISTS `ivr_dial_plan`;

CREATE TABLE `ivr_dial_plan` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `context` varchar(20) NOT NULL DEFAULT '',
  `exten` varchar(20) NOT NULL DEFAULT '',
  `priority` tinyint(4) NOT NULL DEFAULT '0',
  `app` varchar(20) NOT NULL DEFAULT '',
  `appdata` varchar(128) NOT NULL DEFAULT '',
  PRIMARY KEY (`context`,`exten`,`priority`),
  KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=266 DEFAULT CHARSET=latin1;

/*Table structure for table `ivr_meetme` */

DROP TABLE IF EXISTS `ivr_meetme`;

CREATE TABLE `ivr_meetme` (
  `confno` varchar(80) NOT NULL DEFAULT '0',
  `username` varchar(64) NOT NULL DEFAULT '',
  `domain` varchar(128) NOT NULL DEFAULT '',
  `pin` varchar(20) DEFAULT NULL,
  `adminpin` varchar(20) DEFAULT NULL,
  `members` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`confno`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `ivr_queue_member` */

DROP TABLE IF EXISTS `ivr_queue_member`;

CREATE TABLE `ivr_queue_member` (
  `uniqueid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `membername` varchar(40) DEFAULT NULL,
  `queue_name` varchar(128) DEFAULT NULL,
  `interface` varchar(128) DEFAULT NULL,
  `penalty` int(11) DEFAULT NULL,
  `paused` int(11) DEFAULT NULL,
  PRIMARY KEY (`uniqueid`),
  UNIQUE KEY `queue_interface` (`queue_name`,`interface`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Table structure for table `ivr_queue_table` */

DROP TABLE IF EXISTS `ivr_queue_table`;

CREATE TABLE `ivr_queue_table` (
  `name` varchar(128) NOT NULL,
  `musiconhold` varchar(128) DEFAULT NULL,
  `announce` varchar(128) DEFAULT NULL,
  `context` varchar(128) DEFAULT NULL,
  `timeout` int(11) DEFAULT NULL,
  `monitor_join` tinyint(1) DEFAULT NULL,
  `monitor_format` varchar(128) DEFAULT NULL,
  `queue_youarenext` varchar(128) DEFAULT NULL,
  `queue_thereare` varchar(128) DEFAULT NULL,
  `queue_callswaiting` varchar(128) DEFAULT NULL,
  `queue_holdtime` varchar(128) DEFAULT NULL,
  `queue_minutes` varchar(128) DEFAULT NULL,
  `queue_seconds` varchar(128) DEFAULT NULL,
  `queue_lessthan` varchar(128) DEFAULT NULL,
  `queue_thankyou` varchar(128) DEFAULT NULL,
  `queue_reporthold` varchar(128) DEFAULT NULL,
  `announce_frequency` int(11) DEFAULT NULL,
  `announce_round_seconds` int(11) DEFAULT NULL,
  `announce_holdtime` varchar(128) DEFAULT NULL,
  `retry` int(11) DEFAULT NULL,
  `wrapuptime` int(11) DEFAULT NULL,
  `maxlen` int(11) DEFAULT NULL,
  `servicelevel` int(11) DEFAULT NULL,
  `strategy` varchar(128) DEFAULT NULL,
  `joinempty` varchar(128) DEFAULT NULL,
  `leavewhenempty` varchar(128) DEFAULT NULL,
  `eventmemberstatus` tinyint(1) DEFAULT NULL,
  `eventwhencalled` tinyint(1) DEFAULT NULL,
  `reportholdtime` tinyint(1) DEFAULT NULL,
  `memberdelay` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `timeoutrestart` tinyint(1) DEFAULT NULL,
  `periodic_announce` varchar(50) DEFAULT NULL,
  `periodic_announce_frequency` int(11) DEFAULT NULL,
  `ringinuse` tinyint(1) DEFAULT NULL,
  `setinterfacevar` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `ivr_recording_queue` */

DROP TABLE IF EXISTS `ivr_recording_queue`;

CREATE TABLE `ivr_recording_queue` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `ticket_id` int(10) DEFAULT NULL,
  `callerid` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `priority` int(3) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `ivr_sip_buddies` */

DROP TABLE IF EXISTS `ivr_sip_buddies`;

CREATE TABLE `ivr_sip_buddies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `callerid` varchar(80) DEFAULT NULL,
  `defaultuser` varchar(80) NOT NULL,
  `regexten` varchar(80) DEFAULT NULL,
  `secret` varchar(80) DEFAULT NULL,
  `mailbox` varchar(50) DEFAULT NULL,
  `accountcode` varchar(20) DEFAULT NULL,
  `context` varchar(80) DEFAULT NULL,
  `amaflags` varchar(7) DEFAULT NULL,
  `callgroup` varchar(10) DEFAULT NULL,
  `canreinvite` char(3) DEFAULT 'yes',
  `defaultip` varchar(15) DEFAULT NULL,
  `dtmfmode` varchar(7) DEFAULT NULL,
  `fromuser` varchar(80) DEFAULT NULL,
  `fromdomain` varchar(80) DEFAULT NULL,
  `fullcontact` varchar(80) DEFAULT NULL,
  `host` varchar(31) DEFAULT NULL,
  `insecure` varchar(4) DEFAULT NULL,
  `language` char(2) DEFAULT NULL,
  `md5secret` varchar(80) DEFAULT NULL,
  `nat` varchar(20) NOT NULL DEFAULT 'force_rport',
  `deny` varchar(95) DEFAULT NULL,
  `permit` varchar(95) DEFAULT NULL,
  `mask` varchar(95) DEFAULT NULL,
  `pickupgroup` varchar(10) DEFAULT NULL,
  `port` varchar(5) DEFAULT '5060',
  `qualify` char(3) DEFAULT NULL,
  `restrictcid` char(1) DEFAULT NULL,
  `rtptimeout` char(3) DEFAULT NULL,
  `rtpholdtimeout` char(3) DEFAULT NULL,
  `type` varchar(6) NOT NULL DEFAULT 'friend',
  `disallow` varchar(100) DEFAULT 'all',
  `allow` varchar(100) DEFAULT 'g729;ilbc;gsm;ulaw;alaw',
  `musiconhold` varchar(100) DEFAULT NULL,
  `regseconds` int(11) NOT NULL DEFAULT '0',
  `ipaddr` varchar(45) DEFAULT NULL,
  `cancallforward` char(3) DEFAULT 'yes',
  `lastms` int(11) DEFAULT NULL,
  `useragent` char(255) DEFAULT NULL,
  `regserver` varchar(100) DEFAULT NULL,
  `callbackextension` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `name_2` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=895 DEFAULT CHARSET=latin1;

/*Table structure for table `ivr_status_priority` */

DROP TABLE IF EXISTS `ivr_status_priority`;

CREATE TABLE `ivr_status_priority` (
  `id` int(3) unsigned NOT NULL AUTO_INCREMENT,
  `status` varchar(20) DEFAULT NULL,
  `priority` int(3) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Table structure for table `ivr_vm_users` */

DROP TABLE IF EXISTS `ivr_vm_users`;

CREATE TABLE `ivr_vm_users` (
  `uniqueid` int(11) NOT NULL AUTO_INCREMENT,
  `room_id` varchar(11) NOT NULL DEFAULT '0',
  `context` varchar(50) NOT NULL DEFAULT 'checkout',
  `mailbox` varchar(11) NOT NULL DEFAULT '0',
  `password` varchar(10) NOT NULL DEFAULT '0',
  `fullname` varchar(150) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `pager` varchar(50) DEFAULT NULL,
  `tz` varchar(10) NOT NULL DEFAULT 'central',
  `attach` varchar(4) NOT NULL DEFAULT 'yes',
  `saycid` varchar(4) NOT NULL DEFAULT 'yes',
  `dialout` varchar(10) DEFAULT NULL,
  `callback` varchar(10) DEFAULT NULL,
  `review` varchar(4) NOT NULL DEFAULT 'no',
  `operator` varchar(4) NOT NULL DEFAULT 'no',
  `envelope` varchar(4) NOT NULL DEFAULT 'no',
  `sayduration` varchar(4) NOT NULL DEFAULT 'no',
  `saydurationm` tinyint(4) NOT NULL DEFAULT '1',
  `sendvoicemail` varchar(4) NOT NULL DEFAULT 'no',
  `delete` varchar(4) NOT NULL DEFAULT 'no',
  `nextaftercmd` varchar(4) NOT NULL DEFAULT 'yes',
  `forcename` varchar(4) NOT NULL DEFAULT 'no',
  `forcegreetings` varchar(4) NOT NULL DEFAULT 'no',
  `hidefromdir` varchar(4) NOT NULL DEFAULT 'yes',
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uniqueid`),
  KEY `mailbox_context` (`mailbox`,`context`)
) ENGINE=MyISAM AUTO_INCREMENT=2005 DEFAULT CHARSET=latin1;

/*Table structure for table `ivr_voice_recording` */

DROP TABLE IF EXISTS `ivr_voice_recording`;

CREATE TABLE `ivr_voice_recording` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `property_id` int(10) DEFAULT NULL,
  `ext` int(10) DEFAULT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `callerid` varchar(20) DEFAULT NULL,
  `channel_id` varchar(50) DEFAULT NULL,
  `bridge_id` varchar(50) DEFAULT NULL,
  `call_origin` int(10) DEFAULT '0',
  `filepath` varchar(250) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `time_to_answer` time DEFAULT NULL,
  `waiting` time DEFAULT '00:00:00',
  `dial_status` varchar(10) DEFAULT NULL,
  `type` varchar(30) DEFAULT 'Other',
  `call_type` varchar(30) DEFAULT 'Internal',
  `voicemail` int(1) DEFAULT '0',
  `mute_flag` int(1) DEFAULT '0',
  `callback_flag` tinyint(1) DEFAULT '0',
  `comment` text,
  `follow` tinyint(1) DEFAULT NULL,
  `success` tinyint(1) DEFAULT NULL,
  `confirm` varchar(30) DEFAULT NULL,
  `sendconfirm` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1420 DEFAULT CHARSET=utf8;

/*Table structure for table `ivr_voicemessages` */

DROP TABLE IF EXISTS `ivr_voicemessages`;

CREATE TABLE `ivr_voicemessages` (
  `uniqueid` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `msgnum` int(4) DEFAULT NULL,
  `dir` varchar(80) DEFAULT NULL,
  `context` varchar(80) DEFAULT NULL,
  `macrocontext` varchar(80) DEFAULT NULL,
  `callerid` varchar(40) DEFAULT NULL,
  `origtime` varchar(40) DEFAULT NULL,
  `duration` varchar(20) DEFAULT NULL,
  `mailboxuser` varchar(80) DEFAULT NULL,
  `mailboxcontext` varchar(80) DEFAULT NULL,
  `recording` blob,
  `read` tinyint(1) DEFAULT '0',
  `flag` varchar(10) DEFAULT NULL,
  `msg_id` bigint(20) NOT NULL,
  PRIMARY KEY (`uniqueid`),
  UNIQUE KEY `uniqueid` (`uniqueid`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `jobs` */

DROP TABLE IF EXISTS `jobs`;

CREATE TABLE `jobs` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `payload` longtext COLLATE utf8_unicode_ci NOT NULL,
  `attempts` tinyint(3) unsigned NOT NULL,
  `reserved` tinyint(3) unsigned NOT NULL,
  `reserved_at` int(10) unsigned DEFAULT NULL,
  `available_at` int(10) unsigned NOT NULL,
  `created_at` int(10) unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_reserved_reserved_at_index` (`queue`,`reserved`,`reserved_at`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `meetme` */

DROP TABLE IF EXISTS `meetme`;

CREATE TABLE `meetme` (
  `confno` varchar(80) NOT NULL DEFAULT '0',
  `username` varchar(64) NOT NULL DEFAULT '',
  `domain` varchar(128) NOT NULL DEFAULT '',
  `pin` varchar(20) DEFAULT NULL,
  `adminpin` varchar(20) DEFAULT NULL,
  `members` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`confno`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `migrations` */

DROP TABLE IF EXISTS `migrations`;

CREATE TABLE `migrations` (
  `migration` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `parser` */

DROP TABLE IF EXISTS `parser`;

CREATE TABLE `parser` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `protocol_id` int(10) DEFAULT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `url` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dest` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `formatter` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `checker` text COLLATE utf8_unicode_ci,
  `keys` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `password_resets` */

DROP TABLE IF EXISTS `password_resets`;

CREATE TABLE `password_resets` (
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  KEY `password_resets_email_index` (`email`),
  KEY `password_resets_token_index` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `posts` */

DROP TABLE IF EXISTS `posts`;

CREATE TABLE `posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `title` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  KEY `posts_user_id_index` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `property_setting` */

DROP TABLE IF EXISTS `property_setting`;

CREATE TABLE `property_setting` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `settings_key` varchar(50) DEFAULT NULL,
  `value` varchar(200) DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;

/*Table structure for table `queue_member_table` */

DROP TABLE IF EXISTS `queue_member_table`;

CREATE TABLE `queue_member_table` (
  `uniqueid` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `membername` varchar(40) DEFAULT NULL,
  `queue_name` varchar(128) DEFAULT NULL,
  `interface` varchar(128) DEFAULT NULL,
  `penalty` int(11) DEFAULT NULL,
  `paused` int(11) DEFAULT NULL,
  PRIMARY KEY (`uniqueid`),
  UNIQUE KEY `queue_interface` (`queue_name`,`interface`)
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;

/*Table structure for table `queue_table` */

DROP TABLE IF EXISTS `queue_table`;

CREATE TABLE `queue_table` (
  `name` varchar(128) NOT NULL,
  `musiconhold` varchar(128) DEFAULT NULL,
  `announce` varchar(128) DEFAULT NULL,
  `context` varchar(128) DEFAULT NULL,
  `timeout` int(11) DEFAULT NULL,
  `monitor_join` tinyint(1) DEFAULT NULL,
  `monitor_format` varchar(128) DEFAULT NULL,
  `queue_youarenext` varchar(128) DEFAULT NULL,
  `queue_thereare` varchar(128) DEFAULT NULL,
  `queue_callswaiting` varchar(128) DEFAULT NULL,
  `queue_holdtime` varchar(128) DEFAULT NULL,
  `queue_minutes` varchar(128) DEFAULT NULL,
  `queue_seconds` varchar(128) DEFAULT NULL,
  `queue_lessthan` varchar(128) DEFAULT NULL,
  `queue_thankyou` varchar(128) DEFAULT NULL,
  `queue_reporthold` varchar(128) DEFAULT NULL,
  `announce_frequency` int(11) DEFAULT NULL,
  `announce_round_seconds` int(11) DEFAULT NULL,
  `announce_holdtime` varchar(128) DEFAULT NULL,
  `retry` int(11) DEFAULT NULL,
  `wrapuptime` int(11) DEFAULT NULL,
  `maxlen` int(11) DEFAULT NULL,
  `servicelevel` int(11) DEFAULT NULL,
  `strategy` varchar(128) DEFAULT NULL,
  `joinempty` varchar(128) DEFAULT NULL,
  `leavewhenempty` varchar(128) DEFAULT NULL,
  `eventmemberstatus` tinyint(1) DEFAULT NULL,
  `eventwhencalled` tinyint(1) DEFAULT NULL,
  `reportholdtime` tinyint(1) DEFAULT NULL,
  `memberdelay` int(11) DEFAULT NULL,
  `weight` int(11) DEFAULT NULL,
  `timeoutrestart` tinyint(1) DEFAULT NULL,
  `periodic_announce` varchar(50) DEFAULT NULL,
  `periodic_announce_frequency` int(11) DEFAULT NULL,
  `ringinuse` tinyint(1) DEFAULT NULL,
  `setinterfacevar` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`name`)
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

/*Table structure for table `services_alarm_groups` */

DROP TABLE IF EXISTS `services_alarm_groups`;

CREATE TABLE `services_alarm_groups` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `services_alarm_members` */

DROP TABLE IF EXISTS `services_alarm_members`;

CREATE TABLE `services_alarm_members` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `alarm_group` int(4) NOT NULL,
  `user_id` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `alarm_group` (`alarm_group`,`user_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=181 DEFAULT CHARSET=latin1;

/*Table structure for table `services_alarms_notifications` */

DROP TABLE IF EXISTS `services_alarms_notifications`;

CREATE TABLE `services_alarms_notifications` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `notification_group` int(4) NOT NULL,
  `user_id` int(4) NOT NULL,
  `message` varchar(256) NOT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `services_approval_route` */

DROP TABLE IF EXISTS `services_approval_route`;

CREATE TABLE `services_approval_route` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `approval` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `default_approver` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_approval_route_members` */

DROP TABLE IF EXISTS `services_approval_route_members`;

CREATE TABLE `services_approval_route_members` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `approval_route_id` int(10) DEFAULT NULL,
  `user_id` int(10) DEFAULT NULL,
  `job_role_id` int(10) DEFAULT NULL,
  `level` int(3) DEFAULT NULL,
  `max_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_awu` */

DROP TABLE IF EXISTS `services_awu`;

CREATE TABLE `services_awu` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `room_id` int(6) NOT NULL,
  `guest_id` int(6) NOT NULL,
  `extension_id` int(10) DEFAULT '0',
  `time` datetime NOT NULL,
  `set_time` time DEFAULT NULL,
  `status` enum('Success','Pending','Failed','Busy','Snooze','In-Progress','No Answer','Canceled','Not Confirmed','Waiting') NOT NULL,
  `set_by` varchar(30) DEFAULT NULL,
  `set_by_id` int(10) DEFAULT '0',
  `attempts` int(4) DEFAULT '0',
  `repeat_flag` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=140 DEFAULT CHARSET=latin1;

/*Table structure for table `services_awu_logs` */

DROP TABLE IF EXISTS `services_awu_logs`;

CREATE TABLE `services_awu_logs` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `awu_id` int(6) DEFAULT NULL,
  `status` text NOT NULL,
  `set_by` varchar(50) DEFAULT '',
  `set_by_id` int(10) DEFAULT '0',
  `attempts` int(10) DEFAULT '0',
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `record_path` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2608 DEFAULT CHARSET=latin1;

/*Table structure for table `services_checklist` */

DROP TABLE IF EXISTS `services_checklist`;

CREATE TABLE `services_checklist` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `dept_id` int(10) NOT NULL,
  `name` varchar(25) NOT NULL,
  `job_role_id` int(4) DEFAULT NULL,
  `room_type` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `services_checklist_item` */

DROP TABLE IF EXISTS `services_checklist_item`;

CREATE TABLE `services_checklist_item` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_checklist_pivot` */

DROP TABLE IF EXISTS `services_checklist_pivot`;

CREATE TABLE `services_checklist_pivot` (
  `name_id` int(10) DEFAULT NULL,
  `item_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_compensation` */

DROP TABLE IF EXISTS `services_compensation`;

CREATE TABLE `services_compensation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT '0',
  `compensation` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `cost` int(10) DEFAULT NULL,
  `approval_route_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_compensation_comments` */

DROP TABLE IF EXISTS `services_compensation_comments`;

CREATE TABLE `services_compensation_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `reason` varchar(20) DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=148 DEFAULT CHARSET=utf8;

/*Table structure for table `services_compensation_state` */

DROP TABLE IF EXISTS `services_compensation_state`;

CREATE TABLE `services_compensation_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `dispatcher` int(11) DEFAULT NULL,
  `attendant` int(11) DEFAULT NULL,
  `approval_route_id` int(4) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `elaspse_time` int(11) DEFAULT '0',
  `comment` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `status_id` int(1) DEFAULT NULL,
  `running` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_complaint_briefing` */

DROP TABLE IF EXISTS `services_complaint_briefing`;

CREATE TABLE `services_complaint_briefing` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `complaint_id` int(10) DEFAULT NULL,
  `discussed_flag` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=136 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_comments` */

DROP TABLE IF EXISTS `services_complaint_comments`;

CREATE TABLE `services_complaint_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sub_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_dept_default_assignee` */

DROP TABLE IF EXISTS `services_complaint_dept_default_assignee`;

CREATE TABLE `services_complaint_dept_default_assignee` (
  `id` int(10) DEFAULT NULL,
  `user_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_dept_pivot` */

DROP TABLE IF EXISTS `services_complaint_dept_pivot`;

CREATE TABLE `services_complaint_dept_pivot` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `complaint_id` int(10) DEFAULT NULL,
  `dept_id` int(10) DEFAULT NULL,
  `max_time` int(10) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_escalation` */

DROP TABLE IF EXISTS `services_complaint_escalation`;

CREATE TABLE `services_complaint_escalation` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int(10) DEFAULT NULL,
  `property_id` int(10) DEFAULT NULL,
  `job_role_id` int(10) DEFAULT NULL,
  `level` int(5) DEFAULT NULL,
  `max_time` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_flag` */

DROP TABLE IF EXISTS `services_complaint_flag`;

CREATE TABLE `services_complaint_flag` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `complaint_id` int(10) NOT NULL,
  `user_id` int(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_request` */

DROP TABLE IF EXISTS `services_complaint_request`;

CREATE TABLE `services_complaint_request` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `loc_id` int(11) DEFAULT '0',
  `guest_type` enum('Walk-in','In-House CO','In-House CI') DEFAULT NULL,
  `room_id` int(11) DEFAULT '0',
  `guest_id` int(11) DEFAULT '0',
  `requestor_id` int(11) DEFAULT NULL,
  `status` enum('Pending','Resolved','Rejected','Acknowledge','Timeout','Escalated','Canceled') DEFAULT 'Pending',
  `severity` int(1) DEFAULT '1',
  `comment` text,
  `initial_response` text,
  `solution` text,
  `compensation_id` int(10) DEFAULT '0',
  `compensation_status` int(3) DEFAULT NULL,
  `discussed_flag` int(1) DEFAULT '0',
  `discuss_start_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `discuss_end_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_state` */

DROP TABLE IF EXISTS `services_complaint_state`;

CREATE TABLE `services_complaint_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `dispatcher` int(11) DEFAULT NULL,
  `attendant` int(11) DEFAULT NULL,
  `type_id` int(4) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `elaspse_time` int(11) DEFAULT '0',
  `status_id` int(1) DEFAULT NULL,
  `running` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_complaint_sublist` */

DROP TABLE IF EXISTS `services_complaint_sublist`;

CREATE TABLE `services_complaint_sublist` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) DEFAULT NULL,
  `sub_id` int(10) DEFAULT '0',
  `item_id` int(10) DEFAULT NULL,
  `assignee_id` int(10) DEFAULT NULL,
  `dept_id` int(10) DEFAULT NULL,
  `submitter_id` int(10) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `severity` int(1) DEFAULT '1',
  `running` int(1) DEFAULT '1',
  `comment` text,
  `compensation_id` int(10) DEFAULT '0',
  `compensation_status` int(1) DEFAULT '0',
  `compensation_comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=71 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_sublist_comments` */

DROP TABLE IF EXISTS `services_complaint_sublist_comments`;

CREATE TABLE `services_complaint_sublist_comments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `sub_id` int(11) DEFAULT NULL,
  `parent_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT NULL,
  `comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaint_type` */

DROP TABLE IF EXISTS `services_complaint_type`;

CREATE TABLE `services_complaint_type` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `default_assignee` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_complaint_usergroup_pivot` */

DROP TABLE IF EXISTS `services_complaint_usergroup_pivot`;

CREATE TABLE `services_complaint_usergroup_pivot` (
  `id` int(10) DEFAULT NULL,
  `complaint_id` int(10) DEFAULT NULL,
  `usergroup_id` int(10) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_complaints` */

DROP TABLE IF EXISTS `services_complaints`;

CREATE TABLE `services_complaints` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `complaint` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type_id` int(2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_complaints_asignee` */

DROP TABLE IF EXISTS `services_complaints_asignee`;

CREATE TABLE `services_complaints_asignee` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `type_id` int(3) DEFAULT '1',
  `user_id` int(11) DEFAULT '1',
  `level` int(3) DEFAULT NULL,
  `max_time` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_dept_function` */

DROP TABLE IF EXISTS `services_dept_function`;

CREATE TABLE `services_dept_function` (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `dept_id` int(4) NOT NULL,
  `function` varchar(20) NOT NULL,
  `description` varchar(100) DEFAULT NULL,
  `short_code` varchar(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `dept_id` (`dept_id`,`short_code`),
  UNIQUE KEY `dept_id_2` (`dept_id`,`function`),
  UNIQUE KEY `id_2` (`id`),
  KEY `id` (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Table structure for table `services_devices` */

DROP TABLE IF EXISTS `services_devices`;

CREATE TABLE `services_devices` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `type` enum('Mobile','Landline') NOT NULL,
  `dept_func` int(4) NOT NULL,
  `number` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_escalation` */

DROP TABLE IF EXISTS `services_escalation`;

CREATE TABLE `services_escalation` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `user` int(4) NOT NULL,
  `job_role_id` int(11) DEFAULT NULL,
  `escalation_group` int(4) NOT NULL,
  `level` int(1) NOT NULL,
  `max_time` int(6) NOT NULL COMMENT 'Maximum time to act in seconds',
  PRIMARY KEY (`id`),
  UNIQUE KEY `user` (`user`,`escalation_group`,`level`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_escalation_group` */

DROP TABLE IF EXISTS `services_escalation_group`;

CREATE TABLE `services_escalation_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dept_func` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=latin1;

/*Table structure for table `services_hskp_log` */

DROP TABLE IF EXISTS `services_hskp_log`;

CREATE TABLE `services_hskp_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `room_id` int(10) DEFAULT NULL,
  `hskp_id` int(10) DEFAULT NULL,
  `user_id` int(10) DEFAULT NULL,
  `state` int(2) DEFAULT '2',
  `reason` text COLLATE utf8_unicode_ci,
  `created_at` datetime DEFAULT NULL COMMENT '0: complete: 1: dnd, 2: start, 3: stop',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1624 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_hskp_status` */

DROP TABLE IF EXISTS `services_hskp_status`;

CREATE TABLE `services_hskp_status` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `bldg_id` int(4) NOT NULL,
  `status` varchar(30) NOT NULL,
  `ivr_code` varchar(2) NOT NULL,
  `pms_code` varchar(2) NOT NULL,
  `type` enum('Supervisor','System','Attendant','') NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=latin1;

/*Table structure for table `services_location_group` */

DROP TABLE IF EXISTS `services_location_group`;

CREATE TABLE `services_location_group` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `client_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `services_location_group_members` */

DROP TABLE IF EXISTS `services_location_group_members`;

CREATE TABLE `services_location_group_members` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `location_grp` int(4) NOT NULL,
  `type` enum('Property','Building','Floor','Room','Common Area','Admin Area','Outdoor') NOT NULL,
  `type_id` int(4) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `type` (`type`,`type_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1265 DEFAULT CHARSET=latin1;

/*Table structure for table `services_managed_task_associations` */

DROP TABLE IF EXISTS `services_managed_task_associations`;

CREATE TABLE `services_managed_task_associations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `person_id` int(11) DEFAULT NULL,
  `ticket_id` int(11) DEFAULT NULL,
  `assoc_type` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_41B0E09C8DB60186` (`task_id`),
  KEY `IDX_41B0E09C217BBB47` (`person_id`),
  KEY `IDX_41B0E09C700047D2` (`ticket_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_managed_task_comments` */

DROP TABLE IF EXISTS `services_managed_task_comments`;

CREATE TABLE `services_managed_task_comments` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `content` longtext NOT NULL,
  `date_created` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_1F5E7C668DB60186` (`task_id`),
  KEY `IDX_1F5E7C66217BBB47` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_managed_task_reminder_logs` */

DROP TABLE IF EXISTS `services_managed_task_reminder_logs`;

CREATE TABLE `services_managed_task_reminder_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `date_sent` timestamp NULL DEFAULT NULL,
  `method` enum('SMS','email') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_A264D7248DB60186` (`task_id`),
  KEY `IDX_A264D724217BBB47` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_managed_tasks` */

DROP TABLE IF EXISTS `services_managed_tasks`;

CREATE TABLE `services_managed_tasks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `is_gorup` enum('Y','N') NOT NULL,
  `grp_id` int(4) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `assigned_user_id` int(11) DEFAULT NULL,
  `assigned_group_id` int(11) DEFAULT NULL,
  `is_completed` enum('Y','N') NOT NULL,
  `task` longtext NOT NULL,
  `notify` enum('SMS','Email') NOT NULL,
  `date_due` datetime DEFAULT NULL,
  `date_created` datetime NOT NULL,
  `date_completed` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `IDX_50586597217BBB47` (`user_id`),
  KEY `IDX_5058659749197702` (`assigned_user_id`),
  KEY `IDX_50586597410D1341` (`assigned_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_minibar_log` */

DROP TABLE IF EXISTS `services_minibar_log`;

CREATE TABLE `services_minibar_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guest_id` int(10) DEFAULT NULL,
  `room_id` int(10) DEFAULT NULL,
  `item_ids` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `quantity` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `total_amount` float DEFAULT NULL,
  `user_id` int(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_patrons` */

DROP TABLE IF EXISTS `services_patrons`;

CREATE TABLE `services_patrons` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `loyalty_type` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `loyalty_no` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dob` date DEFAULT NULL,
  `anniversary` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_priority` */

DROP TABLE IF EXISTS `services_priority`;

CREATE TABLE `services_priority` (
  `id` varchar(60) COLLATE utf8_bin NOT NULL,
  `sequence` decimal(18,0) DEFAULT NULL,
  `priority` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `description` text COLLATE utf8_bin,
  `icon_url` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `status_color` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `services_promotions` */

DROP TABLE IF EXISTS `services_promotions`;

CREATE TABLE `services_promotions` (
  `id` int(11) DEFAULT NULL,
  `created_by` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `day_of_week` enum('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') COLLATE utf8_unicode_ci DEFAULT NULL,
  `notify_patrons` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `frequency` int(2) DEFAULT NULL,
  `on_ocassion` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `ocassion` int(4) DEFAULT NULL,
  `frequent_patrons` int(10) DEFAULT NULL,
  `missing` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT NULL,
  `missing_frequency` int(10) DEFAULT NULL,
  `promotion` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_reservation_notifications` */

DROP TABLE IF EXISTS `services_reservation_notifications`;

CREATE TABLE `services_reservation_notifications` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `task_id` int(6) NOT NULL,
  `patron_id` int(4) NOT NULL,
  `notification` varchar(256) NOT NULL,
  `mode` enum('SMS','email') NOT NULL,
  `type` varchar(30) NOT NULL,
  `send_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_reservations` */

DROP TABLE IF EXISTS `services_reservations`;

CREATE TABLE `services_reservations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `patron_id` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `restaurant_id` int(11) DEFAULT NULL,
  `table_id` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `seats` int(3) DEFAULT NULL,
  `confirmation` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `reminder` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'Yes',
  `status` int(2) DEFAULT NULL COMMENT '0: reserved, 1: canceled, 2: walk-in, 3: no-show, 4: waiting, 5: arrived',
  `message` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_restaurant_timeslab` */

DROP TABLE IF EXISTS `services_restaurant_timeslab`;

CREATE TABLE `services_restaurant_timeslab` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `restaurant_id` int(11) NOT NULL,
  `name` varchar(24) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `days_of_week` set('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_restaurants` */

DROP TABLE IF EXISTS `services_restaurants`;

CREATE TABLE `services_restaurants` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `restaurant` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `confirmation` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `reminders` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `reminder_during` int(6) DEFAULT '0',
  `promotions` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `loyalty` varchar(40) COLLATE utf8_unicode_ci DEFAULT NULL,
  `message` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_rm_srv_grp` */

DROP TABLE IF EXISTS `services_rm_srv_grp`;

CREATE TABLE `services_rm_srv_grp` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `building_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `sales_outlet` varchar(3) NOT NULL,
  `room_type_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `services_rm_srv_itm` */

DROP TABLE IF EXISTS `services_rm_srv_itm`;

CREATE TABLE `services_rm_srv_itm` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `item_name` varchar(25) NOT NULL,
  `desc` text,
  `charge` float(10,2) NOT NULL,
  `pms_code` int(2) NOT NULL,
  `ivr_code` int(2) NOT NULL,
  `room_service_group` int(10) DEFAULT NULL,
  `img_path` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;

/*Table structure for table `services_room_assignment` */

DROP TABLE IF EXISTS `services_room_assignment`;

CREATE TABLE `services_room_assignment` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `dispatcher` int(10) DEFAULT NULL,
  `room_id` int(10) DEFAULT NULL,
  `created_at` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_shift_group` */

DROP TABLE IF EXISTS `services_shift_group`;

CREATE TABLE `services_shift_group` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dept_id` int(4) NOT NULL,
  `shift` int(4) NOT NULL,
  `name` varchar(100) NOT NULL,
  `notify_off_shift` enum('Y','N') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `services_shift_group_members` */

DROP TABLE IF EXISTS `services_shift_group_members`;

CREATE TABLE `services_shift_group_members` (
  `user_id` int(11) NOT NULL,
  `shift_group_id` int(11) NOT NULL,
  `device_id` int(4) DEFAULT NULL,
  `location_grp_id` varchar(100) NOT NULL,
  `task_group_id` varchar(100) DEFAULT NULL,
  `day_of_week` set('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') DEFAULT NULL,
  `vaca_start_date` date DEFAULT NULL,
  `vaca_end_date` date DEFAULT NULL,
  PRIMARY KEY (`user_id`),
  KEY `IDX_356C969ED2112630` (`shift_group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_shifts` */

DROP TABLE IF EXISTS `services_shifts`;

CREATE TABLE `services_shifts` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `name` varchar(24) NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `days_of_week` set('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;

/*Table structure for table `services_srv_grp_mbr` */

DROP TABLE IF EXISTS `services_srv_grp_mbr`;

CREATE TABLE `services_srv_grp_mbr` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `grp_id` int(10) DEFAULT NULL,
  `item_id` int(10) DEFAULT NULL,
  `max_qty` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `services_status` */

DROP TABLE IF EXISTS `services_status`;

CREATE TABLE `services_status` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `status` varchar(25) NOT NULL,
  `description` varchar(256) DEFAULT NULL,
  `icon_url` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_survey_answer` */

DROP TABLE IF EXISTS `services_survey_answer`;

CREATE TABLE `services_survey_answer` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `guest_id` int(11) DEFAULT NULL,
  `survey_id` int(10) DEFAULT NULL,
  `builder` text COLLATE utf8_unicode_ci,
  `answer` text COLLATE utf8_unicode_ci,
  `answer_flag` int(1) DEFAULT '0',
  `token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `answer_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_surveylist` */

DROP TABLE IF EXISTS `services_surveylist`;

CREATE TABLE `services_surveylist` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `dept_id` int(10) NOT NULL,
  `name` varchar(25) NOT NULL,
  `guest_type` varchar(100) NOT NULL,
  `room_type` varchar(100) DEFAULT NULL,
  `builder` text,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_tables` */

DROP TABLE IF EXISTS `services_tables`;

CREATE TABLE `services_tables` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8_unicode_ci,
  `availability` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `location` text COLLATE utf8_unicode_ci,
  `restaurant_id` int(10) DEFAULT NULL,
  `out_of_door` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `table_time` int(10) DEFAULT '60',
  `seats` int(3) DEFAULT '2',
  `min_seats` int(3) DEFAULT '1',
  `VIP` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT NULL,
  `image_url` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_task` */

DROP TABLE IF EXISTS `services_task`;

CREATE TABLE `services_task` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT '0',
  `dept_func` int(4) NOT NULL,
  `department_id` int(4) DEFAULT NULL,
  `type` int(4) NOT NULL,
  `subtype` int(4) DEFAULT '0',
  `priority` int(4) NOT NULL,
  `start_date_time` datetime NOT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `dispatcher` int(4) NOT NULL,
  `finisher` int(11) DEFAULT NULL,
  `attendant` int(4) NOT NULL,
  `room` int(4) NOT NULL,
  `task_list` int(4) NOT NULL,
  `complaint_list` int(4) DEFAULT NULL,
  `location_id` int(11) DEFAULT '0',
  `max_time` int(10) DEFAULT NULL,
  `quantity` int(2) NOT NULL,
  `guest_id` int(10) DEFAULT NULL,
  `requester_id` int(11) DEFAULT '0',
  `requester_name` varchar(30) DEFAULT NULL,
  `requester_job_role` varchar(30) DEFAULT NULL,
  `requester_notify_flag` int(1) DEFAULT '0',
  `requester_mobile` varchar(20) DEFAULT NULL,
  `requester_email` varchar(30) DEFAULT NULL,
  `custom_message` varchar(150) NOT NULL,
  `compensation_id` int(4) DEFAULT '0',
  `compensation_status` int(4) DEFAULT '1' COMMENT '0: complete approved, 1: on-route 2: rejected, 3: Returned, 4: Pending',
  `compensation_comment` varchar(150) DEFAULT NULL,
  `is_group` enum('Y','N') DEFAULT NULL,
  `group_id` int(10) DEFAULT NULL,
  `user_id` int(10) DEFAULT NULL,
  `follow_id` int(10) DEFAULT '0',
  `status_id` int(4) NOT NULL COMMENT '0: Completed, 1: Open, 2: Escalated, 3: Timeout, 4: Canceled',
  `escalate_flag` int(1) DEFAULT '0',
  `running` int(1) DEFAULT '1',
  `ack` int(1) DEFAULT '0' COMMENT '0: not delivered, 1: sent, 2: acknowledgment',
  `picture_path` text,
  `repeat_flag` int(1) DEFAULT '0',
  `repeat_end_date` datetime DEFAULT NULL,
  `until_checkout_flag` int(1) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=438 DEFAULT CHARSET=latin1;

/*Table structure for table `services_task_group` */

DROP TABLE IF EXISTS `services_task_group`;

CREATE TABLE `services_task_group` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `dept_function` int(4) NOT NULL,
  `escalation_group` int(4) NOT NULL,
  `name` varchar(256) NOT NULL,
  `max_time` int(11) NOT NULL COMMENT 'max time to finish task in seconds',
  `escalation` enum('Yes','No') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;

/*Table structure for table `services_task_group_members` */

DROP TABLE IF EXISTS `services_task_group_members`;

CREATE TABLE `services_task_group_members` (
  `task_grp_id` int(4) NOT NULL,
  `task_list_id` int(4) NOT NULL,
  PRIMARY KEY (`task_grp_id`,`task_list_id`),
  UNIQUE KEY `task_grp_id_2` (`task_grp_id`,`task_list_id`),
  UNIQUE KEY `task_grp_id_3` (`task_grp_id`,`task_list_id`),
  UNIQUE KEY `task_grp_id_5` (`task_grp_id`,`task_list_id`),
  KEY `task_grp_id` (`task_grp_id`,`task_list_id`),
  KEY `task_grp_id_4` (`task_grp_id`),
  KEY `task_list_id` (`task_list_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_task_list` */

DROP TABLE IF EXISTS `services_task_list`;

CREATE TABLE `services_task_list` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `task` varchar(256) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_2` (`id`),
  KEY `id` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=latin1;

/*Table structure for table `services_task_log` */

DROP TABLE IF EXISTS `services_task_log`;

CREATE TABLE `services_task_log` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(10) DEFAULT NULL,
  `comment` text COLLATE utf8_unicode_ci,
  `user_id` int(10) DEFAULT NULL,
  `log_type` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `log_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1088 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_task_notifications` */

DROP TABLE IF EXISTS `services_task_notifications`;

CREATE TABLE `services_task_notifications` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `task_id` int(6) NOT NULL,
  `user_id` int(4) NOT NULL,
  `notification` varchar(256) NOT NULL,
  `mode` enum('SMS','email') NOT NULL,
  `type` varchar(30) NOT NULL,
  `send_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id` (`id`),
  KEY `id_2` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=905 DEFAULT CHARSET=latin1;

/*Table structure for table `services_task_state` */

DROP TABLE IF EXISTS `services_task_state`;

CREATE TABLE `services_task_state` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `task_id` int(11) DEFAULT NULL,
  `dispatcher` int(11) DEFAULT NULL,
  `attendant` int(11) DEFAULT NULL,
  `task_group_id` int(11) DEFAULT NULL,
  `escalation_group_id` int(11) DEFAULT NULL,
  `level` int(11) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `elaspse_time` int(11) DEFAULT '0',
  `status_id` int(1) DEFAULT NULL,
  `running` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_task_tracker` */

DROP TABLE IF EXISTS `services_task_tracker`;

CREATE TABLE `services_task_tracker` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `notification` int(4) NOT NULL,
  `task` int(4) NOT NULL,
  `created_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `task_group` int(4) NOT NULL,
  `attendant` int(4) NOT NULL,
  `max_time` int(4) NOT NULL COMMENT 'in seconds',
  `is_escalation` enum('Y','N') NOT NULL DEFAULT 'N',
  `is_timeout` enum('Y','N') NOT NULL DEFAULT 'N',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `services_trigger_task` */

DROP TABLE IF EXISTS `services_trigger_task`;

CREATE TABLE `services_trigger_task` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `attendant` int(10) DEFAULT NULL,
  `active` int(1) DEFAULT '0',
  `room_status` varchar(30) COLLATE utf8_unicode_ci DEFAULT '[]',
  `room_type` varchar(30) COLLATE utf8_unicode_ci DEFAULT '[]',
  `guest_type` varchar(30) COLLATE utf8_unicode_ci DEFAULT '[]',
  `inspection` int(1) DEFAULT '0',
  `sms` int(1) DEFAULT '0',
  `email` int(1) DEFAULT '0',
  `notifygroup_flag` int(1) DEFAULT '0',
  `notify_group` varchar(30) COLLATE utf8_unicode_ci DEFAULT '[]',
  `task_id` int(10) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `services_type` */

DROP TABLE IF EXISTS `services_type`;

CREATE TABLE `services_type` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `type` varchar(20) NOT NULL,
  `description` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Table structure for table `sip_buddies` */

DROP TABLE IF EXISTS `sip_buddies`;

CREATE TABLE `sip_buddies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(80) NOT NULL,
  `callerid` varchar(80) DEFAULT NULL,
  `callbackextension` varchar(20) DEFAULT NULL,
  `defaultuser` varchar(80) NOT NULL,
  `regexten` varchar(80) DEFAULT NULL,
  `secret` varchar(80) DEFAULT NULL,
  `mailbox` varchar(50) DEFAULT NULL,
  `accountcode` varchar(20) DEFAULT NULL,
  `context` varchar(80) DEFAULT NULL,
  `amaflags` varchar(7) DEFAULT NULL,
  `callgroup` varchar(10) DEFAULT NULL,
  `canreinvite` char(3) DEFAULT 'yes',
  `defaultip` varchar(15) DEFAULT NULL,
  `dtmfmode` varchar(7) DEFAULT NULL,
  `fromuser` varchar(80) DEFAULT NULL,
  `fromdomain` varchar(80) DEFAULT NULL,
  `fullcontact` varchar(80) DEFAULT NULL,
  `host` varchar(31) NOT NULL,
  `insecure` varchar(20) DEFAULT NULL,
  `language` char(2) DEFAULT NULL,
  `md5secret` varchar(80) DEFAULT NULL,
  `nat` varchar(20) NOT NULL DEFAULT 'no',
  `deny` varchar(95) DEFAULT NULL,
  `permit` varchar(95) DEFAULT NULL,
  `mask` varchar(95) DEFAULT NULL,
  `pickupgroup` varchar(10) DEFAULT NULL,
  `port` varchar(5) NOT NULL DEFAULT '5060',
  `qualify` char(3) DEFAULT NULL,
  `compactheaders` varchar(10) NOT NULL DEFAULT 'yes',
  `restrictcid` char(1) DEFAULT NULL,
  `rtptimeout` char(3) DEFAULT NULL,
  `rtpholdtimeout` char(3) DEFAULT NULL,
  `type` varchar(6) NOT NULL DEFAULT 'friend',
  `disallow` varchar(100) DEFAULT 'all',
  `allow` varchar(100) DEFAULT 'g729;ilbc;gsm;ulaw;alaw',
  `musiconhold` varchar(100) DEFAULT NULL,
  `regseconds` int(11) NOT NULL DEFAULT '0',
  `ipaddr` varchar(45) NOT NULL DEFAULT '0.0.0.0',
  `cancallforward` char(3) DEFAULT 'yes',
  `lastms` int(11) NOT NULL DEFAULT '0',
  `useragent` char(255) DEFAULT NULL,
  `regserver` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `name_2` (`name`)
) ENGINE=MyISAM AUTO_INCREMENT=904 DEFAULT CHARSET=latin1;

/*Table structure for table `system_mailserver` */

DROP TABLE IF EXISTS `system_mailserver`;

CREATE TABLE `system_mailserver` (
  `ID` decimal(18,0) NOT NULL,
  `property_id` int(4) NOT NULL,
  `NAME` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `DESCRIPTION` text COLLATE utf8_bin,
  `mailfrom` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `PREFIX` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `smtp_port` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `protocol` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `server_type` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `SERVERNAME` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `JNDILOCATION` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `mailusername` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `mailpassword` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `ISTLSREQUIRED` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `TIMEOUT` decimal(18,0) DEFAULT NULL,
  `socks_port` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  `socks_host` varchar(60) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `property_id` (`property_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

/*Table structure for table `system_managed_task_queue` */

DROP TABLE IF EXISTS `system_managed_task_queue`;

CREATE TABLE `system_managed_task_queue` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `runner_class` varchar(255) NOT NULL,
  `task_data` longblob NOT NULL COMMENT '(DC2Type:array)',
  `date_runnable` datetime NOT NULL,
  `task_group` varchar(50) DEFAULT NULL,
  `status` varchar(25) NOT NULL,
  `date_started` datetime DEFAULT NULL,
  `date_completed` datetime DEFAULT NULL,
  `error_text` longtext NOT NULL,
  `run_status` longtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `system_sms_accounts` */

DROP TABLE IF EXISTS `system_sms_accounts`;

CREATE TABLE `system_sms_accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `phone_number_id` int(11) DEFAULT NULL,
  `type` varchar(20) NOT NULL,
  `params` longblob COMMENT '(DC2Type:array)',
  `identifier` varchar(128) DEFAULT NULL,
  `is_enabled` tinyint(1) NOT NULL,
  `is_connected` tinyint(1) NOT NULL,
  `is_tested` tinyint(1) NOT NULL,
  `test_code` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UNIQ_AC3EBFAD39DFD528` (`phone_number_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `system_worker_jobs` */

DROP TABLE IF EXISTS `system_worker_jobs`;

CREATE TABLE `system_worker_jobs` (
  `id` varchar(50) NOT NULL,
  `worker_group` varchar(50) DEFAULT NULL,
  `title` varchar(100) NOT NULL,
  `description` varchar(255) NOT NULL,
  `job_class` varchar(100) NOT NULL,
  `data` longblob COMMENT '(DC2Type:array)',
  `run_interval` int(11) NOT NULL,
  `last_run_date` datetime DEFAULT NULL,
  `last_start_date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(60) COLLATE utf8_unicode_ci NOT NULL,
  `remember_token` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `updated_at` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=501 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Table structure for table `voicemail_users` */

DROP TABLE IF EXISTS `voicemail_users`;

CREATE TABLE `voicemail_users` (
  `uniqueid` int(11) NOT NULL AUTO_INCREMENT,
  `customer_id` varchar(11) NOT NULL DEFAULT '0',
  `context` varchar(50) NOT NULL,
  `mailbox` varchar(11) NOT NULL DEFAULT '0',
  `password` varchar(10) NOT NULL DEFAULT '0',
  `fullname` varchar(150) NOT NULL,
  `email` varchar(50) NOT NULL,
  `pager` varchar(50) NOT NULL,
  `tz` varchar(10) NOT NULL DEFAULT 'central',
  `attach` varchar(4) NOT NULL DEFAULT 'yes',
  `saycid` varchar(4) NOT NULL DEFAULT 'yes',
  `dialout` varchar(10) NOT NULL,
  `callback` varchar(10) NOT NULL,
  `review` varchar(4) NOT NULL DEFAULT 'no',
  `operator` varchar(4) NOT NULL DEFAULT 'no',
  `envelope` varchar(4) NOT NULL DEFAULT 'no',
  `sayduration` varchar(4) NOT NULL DEFAULT 'no',
  `saydurationm` tinyint(4) NOT NULL DEFAULT '1',
  `sendvoicemail` varchar(4) NOT NULL DEFAULT 'no',
  `delete` varchar(4) NOT NULL DEFAULT 'no',
  `nextaftercmd` varchar(4) NOT NULL DEFAULT 'yes',
  `forcename` varchar(4) NOT NULL DEFAULT 'no',
  `forcegreetings` varchar(4) NOT NULL DEFAULT 'no',
  `hidefromdir` varchar(4) NOT NULL DEFAULT 'yes',
  `stamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`uniqueid`),
  KEY `mailbox_context` (`mailbox`,`context`)
) ENGINE=MyISAM AUTO_INCREMENT=2002 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
