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
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `common_schedule_report_setting` */

insert  into `common_schedule_report_setting`(`id`,`property_id`,`report_type`,`name`,`frequency`,`date`,`day`,`time`,`recipient`,`filter`,`repeat_flag`,`created_at`) values (1,4,'callaccount','1234','Daily','2016-11-03','','16:34:00','jyyblue1987@outlook.com','[]',0,'2016-11-03 10:17:01');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
