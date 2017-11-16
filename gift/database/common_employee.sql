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
/*Table structure for table `common_employee` */

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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
