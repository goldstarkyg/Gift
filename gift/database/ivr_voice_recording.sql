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
/*Table structure for table `ivr_voice_recording` */

DROP TABLE IF EXISTS `ivr_voice_recording`;

CREATE TABLE `ivr_voice_recording` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) DEFAULT NULL,
  `ext` int(10) DEFAULT NULL,
  `start_date_time` datetime DEFAULT NULL,
  `end_date_time` datetime DEFAULT NULL,
  `duration` time DEFAULT NULL,
  `callerid` varchar(16) DEFAULT NULL,
  `channel_id` varchar(50) DEFAULT '0',
  `bridge_id` varchar(50) DEFAULT NULL,
  `filepath` varchar(250) DEFAULT NULL,
  `filename` varchar(100) DEFAULT NULL,
  `time_to_answer` time DEFAULT NULL,
  `waiting` time DEFAULT '00:00:00',
  `dial_status` varchar(10) DEFAULT NULL,
  `call_type` varchar(10) DEFAULT 'incoming',
  `type` varchar(30) DEFAULT 'Other',
  `comment` text,
  `follow` tinyint(1) DEFAULT '0',
  `success` tinyint(1) DEFAULT '0',
  `confirm` varchar(30) DEFAULT NULL,
  `sendconfirm` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=334 DEFAULT CHARSET=utf8;

/*Data for the table `ivr_voice_recording` */

insert  into `ivr_voice_recording`(`id`,`user_id`,`ext`,`start_date_time`,`end_date_time`,`duration`,`callerid`,`channel_id`,`bridge_id`,`filepath`,`filename`,`time_to_answer`,`waiting`,`dial_status`,`call_type`,`type`,`comment`,`follow`,`success`,`confirm`,`sendconfirm`) values (2,2,2000,'2016-11-13 23:33:03','2016-11-13 23:33:38','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/13/','2.wav','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(3,2,2000,'2016-11-13 23:33:29','2016-11-13 23:33:54','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(4,1,4000,'2016-11-13 23:33:45','2016-11-13 23:34:03','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(6,2,2000,'2016-11-13 23:34:39','2016-11-13 23:44:41','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(7,2,2000,'2016-11-13 23:44:11','2016-11-13 23:45:24','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(10,1,4000,'2016-11-13 23:46:14','2016-11-13 23:46:44','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(11,4,3000,'2016-11-13 23:47:31','2016-11-13 23:47:58','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(13,2,2000,'2016-11-13 23:53:01','2016-11-13 23:53:24','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/13/','13.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(14,2,2000,'2016-11-13 23:55:13','2016-11-13 23:55:53','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(17,1,4000,'2016-11-13 23:56:57','2016-11-13 23:57:10','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/13/','17.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(19,2,2000,'2016-11-14 00:03:39','2016-11-14 00:04:22','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(20,2,2000,'2016-11-14 00:04:18','2016-11-14 00:04:29','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(21,2,2000,'2016-11-14 00:04:27','2016-11-14 00:04:59','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(23,4,3000,'2016-11-14 00:05:05','2016-11-14 00:05:46','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(27,4,3000,'2016-11-14 00:06:11','2016-11-14 00:07:28','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(28,1,4000,'2016-11-14 00:06:46','2016-11-14 00:08:12','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(31,1,4000,'2016-11-14 00:10:35','2016-11-14 00:11:16','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(33,2,2000,'2016-11-14 00:11:19','2016-11-14 00:11:26','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(34,4,3000,'2016-11-14 00:11:30','2016-11-14 00:13:24','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(37,1,4000,'2016-11-14 00:22:20','2016-11-14 00:22:25','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(38,2,5000,'2016-11-14 00:22:57','2016-11-14 00:23:07','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(39,4,3000,'2016-11-14 00:23:19','2016-11-14 00:23:41','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','39.wav','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(41,2,5000,'2016-11-14 00:23:49','2016-11-14 00:24:02','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','41.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(42,2,5000,'2016-11-14 00:24:06','2016-11-14 00:24:11','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','42.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(43,2,5000,'2016-11-14 00:24:14','2016-11-14 00:24:24','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(44,1,4000,'2016-11-14 00:24:46','2016-11-14 00:25:07','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(45,1,4000,'2016-11-14 00:25:23','2016-11-14 00:25:52','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(46,4,3000,'2016-11-14 00:25:45','2016-11-14 00:26:46','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(49,4,3000,'2016-11-14 00:28:44','2016-11-14 00:28:54','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(50,2,5000,'2016-11-14 00:29:43','2016-11-14 00:29:47','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(51,4,3000,'2016-11-14 00:29:51','2016-11-14 00:30:06','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','51.wav','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(52,2,5000,'2016-11-14 00:29:59','2016-11-14 00:30:48','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(54,4,3000,'2016-11-14 00:32:18','2016-11-14 00:32:35','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','54.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(55,2,5000,'2016-11-14 00:32:43','2016-11-14 00:32:53','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(56,2,5000,'2016-11-14 00:33:22','2016-11-14 00:33:30','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','56.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(57,2,5000,'2016-11-14 00:33:34','2016-11-14 00:33:39','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','57.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(58,2,5000,'2016-11-14 00:33:42','2016-11-14 00:33:48','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','58.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(59,2,5000,'2016-11-14 00:33:51','2016-11-14 00:34:31','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(62,4,3000,'2016-11-14 00:34:49','2016-11-14 00:34:54','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(64,2,5000,'2016-11-14 00:35:09','2016-11-14 00:35:12','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(66,4,3000,'2016-11-14 00:35:29','2016-11-14 00:35:35','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(67,2,5000,'2016-11-14 00:35:43','2016-11-14 00:35:47','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(68,4,3000,'2016-11-14 00:35:55','2016-11-14 00:36:01','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(69,2,5000,'2016-11-14 00:36:22','2016-11-14 00:37:04','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(72,2,5000,'2016-11-14 00:37:26','2016-11-14 00:37:46','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(74,2,5000,'2016-11-14 00:38:35','2016-11-14 00:38:48','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(76,2,5000,'2016-11-14 00:42:22','2016-11-14 00:42:41','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(81,2,5000,'2016-11-14 00:49:19','2016-11-14 00:49:40','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(83,4,3000,'2016-11-14 00:49:57','2016-11-14 00:50:17','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(85,2,5000,'2016-11-14 00:50:27','2016-11-14 00:50:39','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(86,4,3000,'2016-11-14 00:50:31','2016-11-14 00:55:00','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(89,4,3000,'2016-11-14 00:57:54','2016-11-14 00:58:14','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(90,2,5000,'2016-11-14 00:58:06','2016-11-14 00:58:56','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','90.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(91,2,5000,'2016-11-14 00:58:35','2016-11-14 00:58:53','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','91.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(94,2,5000,'2016-11-14 01:00:25','2016-11-14 01:00:36','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','94.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(118,3,3000,'2016-11-14 02:03:42','2016-11-14 02:04:03','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(119,2,5000,'2016-11-14 02:04:21','2016-11-14 02:04:40','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(120,3,3000,'2016-11-14 02:04:26','2016-11-14 02:04:41','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(121,2,5000,'2016-11-14 02:05:29','2016-11-14 02:05:49','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(122,3,3000,'2016-11-14 02:05:33','2016-11-14 02:05:47','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(123,2,5000,'2016-11-14 02:06:15','2016-11-14 02:06:35','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(124,2,5000,'2016-11-14 02:10:02','2016-11-14 02:10:21','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(125,3,3000,'2016-11-14 02:12:31','2016-11-14 02:12:51','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(127,2,5000,'2016-11-14 02:19:58','2016-11-14 02:20:18','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(131,2,5000,'2016-11-14 02:23:59','2016-11-14 02:24:19','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(134,2,5000,'2016-11-14 02:27:08','2016-11-14 02:27:28','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(137,2,5000,'2016-11-14 02:32:46','2016-11-14 02:33:06','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(140,3,3000,'2016-11-14 02:36:27','2016-11-14 02:36:47','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(142,2,5000,'2016-11-14 02:38:20','2016-11-14 02:38:25','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(144,2,5000,'2016-11-14 02:39:01','2016-11-14 02:39:06','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(146,2,5000,'2016-11-14 02:44:13','2016-11-14 02:44:33','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(149,2,5000,'2016-11-14 02:48:36','2016-11-14 02:48:56','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(151,2,5000,'2016-11-14 02:57:28','2016-11-14 02:57:40','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(153,2,5000,'2016-11-14 02:58:16','2016-11-14 02:58:37','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(156,2,5000,'2016-11-14 03:02:03','2016-11-14 03:02:08','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(158,2,5000,'2016-11-14 03:02:38','2016-11-14 03:02:43','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(160,2,5000,'2016-11-14 03:03:52','2016-11-14 03:03:57','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(162,2,5000,'2016-11-14 03:04:36','2016-11-14 03:04:42','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(164,2,5000,'2016-11-14 03:05:38','2016-11-14 03:05:43','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(166,2,5000,'2016-11-14 03:06:07','2016-11-14 03:06:13','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(168,3,3000,'2016-11-14 03:07:14','2016-11-14 03:07:19','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(170,2,5000,'2016-11-14 03:07:44','2016-11-14 03:07:49','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(172,3,3000,'2016-11-14 03:08:55','2016-11-14 03:09:01','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(173,2,5000,'2016-11-14 03:09:06','2016-11-14 03:09:11','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(174,3,3000,'2016-11-14 03:09:59','2016-11-14 03:10:21','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','174.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(175,2,5000,'2016-11-14 03:10:05','2016-11-14 03:10:21','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','175.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(176,2,5000,'2016-11-14 03:10:54','2016-11-14 03:11:01','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','176.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(177,3,3000,'2016-11-14 03:11:00','2016-11-14 03:11:01','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','177.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(178,2,5000,'2016-11-14 03:12:50','2016-11-14 03:12:55','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','178.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(182,2,5000,'2016-11-14 03:16:57','2016-11-14 03:17:20','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','182.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(184,1,4000,'2016-11-14 03:18:18','2016-11-14 03:18:36','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(186,1,4000,'2016-11-14 03:19:45','2016-11-14 03:20:05','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(187,1,4000,'2016-11-14 03:20:57','2016-11-14 03:21:04','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(188,1,4000,'2016-11-14 03:22:43','2016-11-14 03:22:51','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','188.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(190,1,4000,'2016-11-14 03:24:45','2016-11-14 03:24:49','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','190.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(194,1,4000,'2016-11-14 03:26:37','2016-11-14 03:26:43','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','194.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(198,1,4000,'2016-11-14 03:35:57','2016-11-14 03:36:26','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','198.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(200,1,4000,'2016-11-14 03:36:40','2016-11-14 03:37:10','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','200.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(202,1,4000,'2016-11-14 03:37:20','2016-11-14 03:37:28','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','202.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(204,1,4000,'2016-11-14 03:38:51','2016-11-14 03:39:08','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','204.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(206,1,4000,'2016-11-14 03:41:25','2016-11-14 03:41:44','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','206.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(208,1,1000,'2016-11-14 03:42:08','2016-11-14 03:42:25','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','208.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(210,1,1000,'2016-11-14 03:45:44','2016-11-14 03:45:48','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(211,1,1000,'2016-11-14 03:46:11','2016-11-14 03:46:22','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','211.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(213,1,1000,'2016-11-14 03:48:31','2016-11-14 03:48:43','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','213.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(217,1,1000,'2016-11-14 03:55:24','2016-11-14 03:55:35','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','217.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(219,1,1000,'2016-11-14 03:58:05','2016-11-14 03:59:01','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','219.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(221,1,1000,'2016-11-14 04:01:42','2016-11-14 04:02:14','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','221.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(222,1,1000,'2016-11-14 04:02:29','2016-11-14 04:02:41','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','222.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(223,1,1000,'2016-11-14 04:03:27','2016-11-14 04:03:40','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','223.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(224,1,4000,'2016-11-14 04:03:48','2016-11-14 04:03:59','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','224.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(225,1,4000,'2016-11-14 04:11:04','2016-11-14 04:11:09','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(227,1,4000,'2016-11-14 04:13:51','2016-11-14 04:14:11','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(229,1,4000,'2016-11-14 04:18:54','2016-11-14 04:19:14','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(231,1,4000,'2016-11-14 04:24:47','2016-11-14 04:25:07','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(233,1,4000,'2016-11-14 04:29:58','2016-11-14 04:30:18','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(237,1,4000,'2016-11-14 04:32:53','2016-11-14 04:33:14','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(240,1,4000,'2016-11-14 04:35:30','2016-11-14 04:35:35','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(242,1,4000,'2016-11-14 04:38:54','2016-11-14 04:39:00','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(245,1,4000,'2016-11-14 04:46:39','2016-11-14 04:46:45','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(246,1,4000,'2016-11-14 04:48:34','2016-11-14 04:48:40','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(247,1,4000,'2016-11-14 04:50:15','2016-11-14 04:50:21','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(248,1,4000,'2016-11-14 04:53:42','2016-11-14 04:53:47','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(251,1,4000,'2016-11-14 04:54:59','2016-11-14 04:55:05','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(253,1,4000,'2016-11-14 04:55:18','2016-11-14 04:55:23','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(256,3,3000,'2016-11-14 04:57:11','2016-11-14 04:57:26','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','256.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(257,1,4000,'2016-11-14 04:57:44','2016-11-14 04:58:05','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','257.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(258,1,4000,'2016-11-14 04:58:37','2016-11-14 04:59:21','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','258.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(259,1,4000,'2016-11-14 04:59:44','2016-11-14 04:59:58','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','259.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(260,1,4000,'2016-11-14 05:02:02','2016-11-14 05:02:05','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(261,1,4000,'2016-11-14 05:07:24','2016-11-14 05:07:47','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(262,1,4000,'2016-11-14 05:08:02','2016-11-14 05:08:16','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','262.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(263,1,4000,'2016-11-14 05:09:24','2016-11-14 05:09:44','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','263.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(266,1,4000,'2016-11-14 05:20:49','2016-11-14 05:21:04','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','266.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(267,1,4000,'2016-11-14 05:40:57','2016-11-14 05:41:17','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(270,3,3000,'2016-11-14 05:42:41','2016-11-14 05:43:05','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','270.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(271,3,3000,'2016-11-14 05:48:06','2016-11-14 05:48:44','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','271.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(272,3,3000,'2016-11-14 06:18:22','2016-11-14 06:18:42','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','272.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(273,3,3000,'2016-11-14 06:19:18','2016-11-14 06:19:40','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','273.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(274,3,3000,'2016-11-14 06:20:26','2016-11-14 06:20:41','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','274.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(275,3,3000,'2016-11-14 06:21:19','2016-11-14 06:21:34','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','275.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(276,3,3000,'2016-11-14 06:22:06','2016-11-14 06:22:29','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','276.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(277,3,3000,'2016-11-14 06:23:50','2016-11-14 06:24:34','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','277.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(278,1,4000,'2016-11-14 09:20:07','2016-11-14 09:20:13','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(279,1,4000,'2016-11-14 09:20:26','2016-11-14 09:20:52','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','279.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(280,1,4000,'2016-11-14 09:23:46','2016-11-14 09:24:05','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','280.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(281,1,4000,'2016-11-14 09:27:22','2016-11-14 09:27:49','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','281.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(282,1,4000,'2016-11-14 09:35:05','2016-11-14 09:35:28','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','282.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(283,1,4000,'2016-11-14 09:37:20','2016-11-14 09:37:28','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(284,1,4000,'2016-11-14 09:37:39','2016-11-14 09:37:56','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','284.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(290,1,4000,'2016-11-14 11:05:54','2016-11-14 11:06:05','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','290.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(291,1,4000,'2016-11-14 11:09:44','2016-11-14 11:09:49','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','291.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(292,1,4000,'2016-11-14 11:12:05','2016-11-14 11:12:11','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','292.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(293,1,4000,'2016-11-14 11:13:35','2016-11-14 11:14:11','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','293.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(294,1,4000,'2016-11-14 11:15:12','2016-11-14 11:15:20','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','294.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(295,1,4000,'2016-11-14 11:17:09','2016-11-14 11:17:18','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','295.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(296,1,4000,'2016-11-14 11:17:36','2016-11-14 11:17:56','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(297,1,4000,'2016-11-14 11:19:36','2016-11-14 11:20:14','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','297.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(298,1,4000,'2016-11-14 11:20:21','2016-11-14 11:22:07','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','298.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(299,1,4000,'2016-11-14 11:25:27','2016-11-14 11:25:33','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','299.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(300,1,4000,'2016-11-14 11:25:49','2016-11-14 11:25:56','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','300.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(301,1,4000,'2016-11-14 11:26:50','2016-11-14 11:29:22','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','301.wav','00:00:00','00:00:00','Answered','incoming',NULL,'',0,0,'',''),(302,1,4000,'2016-11-14 11:31:27','2016-11-14 11:31:49','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','302.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(303,1,4000,'2016-11-14 11:32:04','2016-11-14 11:33:04','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','303.wav','00:00:00','00:00:00','Answered','incoming','Inquiry','test',1,0,'',''),(304,1,4000,'2016-11-14 11:38:26','2016-11-14 11:38:46','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(305,1,4000,'2016-11-14 11:39:10','2016-11-14 11:42:52','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','305.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(306,1,4000,'2016-11-14 11:44:01','2016-11-14 11:44:26','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','306.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(307,1,4000,'2016-11-14 11:44:52','2016-11-14 11:45:29','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','307.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(308,1,4000,'2016-11-14 11:45:36','2016-11-14 11:46:08','00:00:00','0','0',NULL,'/var/www/hotlync/hotel/CMS/public/uploads/record/2016/Nov/14/','308.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(309,1,4000,'2016-11-14 11:49:05','2016-11-14 11:49:29','00:00:00','0','0',NULL,'/uploads/record/2016/Nov/14/','309.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(310,1,4000,'2016-11-14 11:51:54','2016-11-14 11:52:08','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(313,1,4000,'2016-11-14 11:57:54','2016-11-14 11:58:05','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(314,3,2000,'2016-11-14 12:02:03','2016-11-14 12:02:12','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(315,3,2000,'2016-11-14 12:03:48','2016-11-14 12:04:02','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(316,1,4000,'2016-11-14 12:06:34','2016-11-14 12:06:43','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(317,3,2000,'2016-11-14 12:10:59','2016-11-14 12:11:19','00:00:00','0','0',NULL,'/uploads/record/2016/Nov/14/','317.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(318,3,2000,'2016-11-14 12:11:37','2016-11-14 12:12:03','00:00:00','0','0',NULL,'/uploads/record/2016/Nov/14/','318.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(319,3,2000,'2016-11-14 12:17:14','2016-11-14 12:17:19','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(323,3,2000,'2016-11-14 12:44:44','2016-11-14 12:45:17','00:00:00','0','0',NULL,'/uploads/record/2016/Nov/14/','323.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(326,3,2000,'2016-11-14 13:04:07','2016-11-14 13:04:46','00:00:00','0','0',NULL,'/uploads/record/2016/Nov/14/','326.wav','00:00:00','00:00:00','Answered','incoming','Inquiry','mnvhfjhf',1,0,'','Email'),(327,3,2000,'2016-11-14 13:08:26','2016-11-14 13:08:28','00:00:00','0','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(329,1,4000,'2016-11-14 13:18:27','2016-11-14 13:19:10','00:00:00','SIP/1000-0000011','0',NULL,'/uploads/record/2016/Nov/14/','329.wav','00:00:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL),(330,1,4000,'2016-11-14 13:23:14','2016-11-14 13:23:16','00:00:00','SIP/1000-0000011','0',NULL,'','','00:00:00','00:00:00','Abandoned','incoming','Other',NULL,0,0,NULL,NULL),(331,0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00','00:00:00','123456','33333','0','','','00:00:00','00:00:00','Queued','incoming','Other',NULL,0,0,NULL,NULL),(332,0,NULL,'0000-00-00 00:00:00','0000-00-00 00:00:00','00:00:00','123456','33333','0','','','00:00:00','00:00:00','Queued','incoming','Other',NULL,0,0,NULL,NULL),(333,1,4000,'2016-11-14 17:51:20','0000-00-00 00:00:00','00:00:00','123456','33333','0','','','00:10:00','00:00:00','Answered','incoming','Other',NULL,0,0,NULL,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
