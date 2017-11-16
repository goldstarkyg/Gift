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
/*Table structure for table `services_complaint_request` */

DROP TABLE IF EXISTS `services_complaint_request`;

CREATE TABLE `services_complaint_request` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `loc_id` int(11) DEFAULT '0',
  `guest_type` enum('In-house','Walk-in') DEFAULT NULL,
  `room_id` int(11) DEFAULT '0',
  `guest_id` int(11) DEFAULT '0',
  `requestor_id` int(11) DEFAULT NULL,
  `status` enum('Pending','Resolved','Rejected','Acknowledge','Timeout','Escalated','Canceled') DEFAULT 'Pending',
  `comment` text,
  `solution` text,
  `compensation_id` int(10) DEFAULT '0',
  `compensation_status` int(3) DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `services_complaint_request` */

insert  into `services_complaint_request`(`id`,`property_id`,`loc_id`,`guest_type`,`room_id`,`guest_id`,`requestor_id`,`status`,`comment`,`solution`,`compensation_id`,`compensation_status`,`created_at`) values (1,4,1136,'Walk-in',2,0,2,'Pending','13123213',NULL,NULL,NULL,'2017-01-07 18:26:28'),(2,4,1136,'In-house',2,3019070,2,'Pending','324234234',NULL,NULL,NULL,'2017-01-07 18:28:25'),(3,4,1136,'Walk-in',0,0,2,'Rejected','234324324',NULL,NULL,NULL,'2017-01-07 18:32:34'),(4,4,1132,'Walk-in',6,0,2,'Pending','324324',NULL,NULL,NULL,'2017-01-07 18:38:06'),(5,4,1249,'Walk-in',553,0,2,'Pending','12313',NULL,NULL,NULL,'2017-01-07 19:20:38'),(6,4,1132,'Walk-in',35,3022388,2,'Acknowledge','23432',NULL,NULL,NULL,'2017-01-07 20:02:47'),(7,4,640,'Walk-in',69,3011050,2,'Acknowledge','234','222222',NULL,NULL,'2017-01-07 20:03:47');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
