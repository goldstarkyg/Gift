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
/*Table structure for table `services_complaint_sublist` */

DROP TABLE IF EXISTS `services_complaint_sublist`;

CREATE TABLE `services_complaint_sublist` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `parent_id` int(10) DEFAULT NULL,
  `item_id` int(10) DEFAULT NULL,
  `assignee_id` int(10) DEFAULT NULL,
  `dept_id` int(10) DEFAULT NULL,
  `submitter_id` int(10) DEFAULT NULL,
  `status` int(11) DEFAULT NULL,
  `running` int(1) DEFAULT '1',
  `comment` text,
  `compensation_id` int(10) DEFAULT '0',
  `compensation_status` int(1) DEFAULT '0',
  `compensation_comment` text,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `services_complaint_sublist` */

insert  into `services_complaint_sublist`(`id`,`parent_id`,`item_id`,`assignee_id`,`dept_id`,`submitter_id`,`status`,`running`,`comment`,`compensation_id`,`compensation_status`,`compensation_comment`,`created_at`) values (1,6,1,1,4,1,0,1,'1111',0,1,'','2017-01-13 22:54:06'),(2,6,2,1,4,1,0,1,'22222',0,0,'','2017-01-13 22:54:06'),(3,6,3,1,4,1,0,1,'33333',0,0,'','2017-01-13 22:54:06'),(4,6,4,1,4,1,1,1,'4444\r\n',0,0,NULL,'2017-01-13 22:54:06'),(5,7,1,1,4,1,1,1,'1111',0,0,'','2017-01-13 23:18:39'),(6,7,2,1,4,1,1,1,'2222',0,0,'','2017-01-13 23:18:39'),(7,7,4,1,4,1,1,1,'44444',0,0,'','2017-01-14 17:47:43');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
