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
/*Table structure for table `common_guest_advanced_detail` */

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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
