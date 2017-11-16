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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `ivr_agent_status_history` */

insert  into `ivr_agent_status_history`(`id`,`user_id`,`status`,`extension`,`ticket_id`,`created_at`,`duration`) values (1,1,'Online',NULL,NULL,'2016-11-10 23:16:00',0),(2,1,'Log out','10001',99,'2016-11-10 23:19:49',0),(3,1,'Online','10001',99,'2016-11-10 23:19:50',0),(4,1,'Log out','10001',99,'2016-11-10 23:25:14',0),(5,1,'Online','10001',99,'2016-11-10 23:25:16',0);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
