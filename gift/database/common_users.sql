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
) ENGINE=InnoDB AUTO_INCREMENT=209 DEFAULT CHARSET=latin1;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
