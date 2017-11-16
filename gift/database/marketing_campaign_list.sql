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
/*Table structure for table `marketing_campaign_list` */

DROP TABLE IF EXISTS `marketing_campaign_list`;

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

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
