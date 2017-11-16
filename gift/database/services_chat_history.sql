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
/*Table structure for table `services_chat_history` */

DROP TABLE IF EXISTS `services_chat_history`;

CREATE TABLE `services_chat_history` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(11) DEFAULT NULL,
  `guest_id` int(11) DEFAULT NULL,
  `agent_id` int(11) DEFAULT NULL,
  `text` text,
  `direction` int(1) DEFAULT NULL,
  `type` int(1) DEFAULT NULL COMMENT '0: guest, 1: agent',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=215 DEFAULT CHARSET=utf8;

/*Data for the table `services_chat_history` */

insert  into `services_chat_history`(`id`,`property_id`,`guest_id`,`agent_id`,`text`,`direction`,`type`,`created_at`) values (1,4,2729798,0,'234324',1,0,'2017-02-14 10:17:07'),(2,4,2729798,0,'234324',0,1,'2017-02-14 10:17:07'),(3,4,2729798,0,'234234324',1,0,'2017-02-14 10:22:14'),(4,4,2729798,0,'234234324',0,1,'2017-02-14 10:22:14'),(5,4,2729798,0,'HHHH',1,0,'2017-02-14 10:40:04'),(6,4,2729798,0,'HHHH',0,1,'2017-02-14 10:40:04'),(7,4,2729798,0,'23432234324',1,0,'2017-02-14 11:33:44'),(8,4,2729798,0,'23432234324',0,1,'2017-02-14 11:33:44'),(9,4,2729798,0,'2343fgdg',1,0,'2017-02-14 12:54:38'),(10,4,2729798,0,'2343fgdg',0,1,'2017-02-14 12:54:38'),(11,4,2729798,0,'1',1,0,'2017-02-14 12:54:40'),(12,4,2729798,0,'1',0,1,'2017-02-14 12:54:40'),(13,4,2729798,0,'1',1,0,'2017-02-14 12:54:42'),(14,4,2729798,0,'1',0,1,'2017-02-14 12:54:42'),(15,4,2729798,0,'1',1,0,'2017-02-14 12:54:43'),(16,4,2729798,0,'1',0,1,'2017-02-14 12:54:43'),(17,4,2729798,0,'1',1,0,'2017-02-14 12:54:45'),(18,4,2729798,0,'1',0,1,'2017-02-14 12:54:45'),(19,4,2729798,0,'1',1,0,'2017-02-14 12:54:46'),(61,4,2729798,1,'HHHH',1,1,'2017-02-14 14:53:51'),(62,4,2729798,0,'HHHH',0,0,'2017-02-14 14:53:51'),(63,4,2729798,1,'234324',1,1,'2017-02-14 15:08:01'),(64,4,2729798,0,'234324',0,0,'2017-02-14 15:08:01'),(65,4,2729798,1,'2342444444',1,1,'2017-02-14 15:08:09'),(66,4,2729798,0,'2342444444',0,0,'2017-02-14 15:08:09'),(67,4,2729798,0,'2134234324',1,0,'2017-02-14 15:11:53'),(68,4,2729798,0,'2134234324',0,1,'2017-02-14 15:11:53'),(69,4,2729798,1,'HHHH',1,1,'2017-02-14 15:12:00'),(70,4,2729798,0,'HHHH',0,0,'2017-02-14 15:12:00'),(71,4,2729798,0,'Thank you',1,0,'2017-02-14 15:12:10'),(72,4,2729798,0,'Thank you',0,1,'2017-02-14 15:12:10'),(73,4,2729798,0,'Hello',1,0,'2017-02-14 15:16:49'),(74,4,2729798,0,'Hello',0,1,'2017-02-14 15:16:49'),(75,4,2729798,1,'Yes',1,1,'2017-02-14 15:16:58'),(76,4,2729798,0,'Yes',0,0,'2017-02-14 15:16:58'),(77,4,2729798,0,'kkkk',1,0,'2017-02-14 15:20:51'),(78,4,2729798,0,'kkkk',0,1,'2017-02-14 15:20:51'),(79,4,2729798,0,'qweqwew',1,0,'2017-02-14 15:21:15'),(80,4,2729798,0,'qweqwew',0,1,'2017-02-14 15:21:15'),(81,4,2729798,0,'2342343',1,0,'2017-02-14 15:24:27'),(82,4,2729798,0,'2342343',0,1,'2017-02-14 15:24:27'),(83,4,2729798,0,'234324',1,0,'2017-02-14 15:24:45'),(84,4,2729798,0,'234324',0,1,'2017-02-14 15:24:45'),(85,4,2729798,0,'Hello',1,0,'2017-02-14 15:26:05'),(86,4,2729798,0,'Hello',0,1,'2017-02-14 15:26:05'),(87,4,2729798,1,'Yes.',1,1,'2017-02-14 15:26:10'),(88,4,2729798,0,'Yes.',0,0,'2017-02-14 15:26:10'),(89,4,2729798,1,'OK',1,1,'2017-02-14 15:26:26'),(90,4,2729798,0,'OK',0,0,'2017-02-14 15:26:26'),(91,4,2729798,2,'2 number',1,1,'2017-02-14 15:29:21'),(92,4,2729798,0,'2 number',0,0,'2017-02-14 15:29:21'),(93,4,2729798,2,'2 n',1,1,'2017-02-14 15:29:48'),(94,4,2729798,0,'2 n',0,0,'2017-02-14 15:29:48'),(95,4,2729798,1,'HHHH',1,1,'2017-02-14 15:33:05'),(96,4,2729798,0,'HHHH',0,0,'2017-02-14 15:33:05'),(97,4,2729798,2,'JJJJ',1,1,'2017-02-14 15:50:56'),(98,4,2729798,0,'JJJJ',0,0,'2017-02-14 15:50:56'),(99,4,2729798,2,'22222',1,1,'2017-02-14 15:51:43'),(100,4,2729798,0,'22222',0,0,'2017-02-14 15:51:43'),(101,4,2729798,2,'5555',1,1,'2017-02-14 15:52:42'),(102,4,2729798,0,'5555',0,0,'2017-02-14 15:52:42'),(103,4,2729798,1,'OK',1,1,'2017-02-14 15:52:53'),(104,4,2729798,0,'OK',0,0,'2017-02-14 15:52:53'),(105,4,2729798,0,'gggg',1,0,'2017-02-14 15:53:14'),(106,4,2729798,0,'gggg',0,1,'2017-02-14 15:53:14'),(107,4,2729798,1,'Hello',1,1,'2017-02-14 18:51:05'),(108,4,2729798,0,'Hello',0,0,'2017-02-14 18:51:05'),(109,4,2729798,0,'Yes',1,0,'2017-02-14 18:51:11'),(110,4,2729798,0,'Yes',0,1,'2017-02-14 18:51:11'),(111,4,2729798,0,'gggg',1,0,'2017-02-14 18:55:36'),(112,4,2729798,0,'gggg',0,1,'2017-02-14 18:55:36'),(113,4,2729798,1,'werewrewr',1,1,'2017-02-14 18:55:49'),(114,4,2729798,0,'werewrewr',0,0,'2017-02-14 18:55:49'),(115,4,2729798,1,'',1,1,'2017-02-14 19:52:52'),(116,4,2729798,0,'',0,0,'2017-02-14 19:52:52'),(117,4,2729798,1,'12323213',1,1,'2017-02-14 19:54:19'),(118,4,2729798,0,'12323213',0,0,'2017-02-14 19:54:19'),(119,4,2729798,0,'k;lk;',1,0,'2017-02-14 19:54:44'),(120,4,2729798,0,'k;lk;',0,1,'2017-02-14 19:54:44'),(121,4,2729798,1,'34324324',1,1,'2017-02-14 19:55:17'),(122,4,2729798,0,'34324324',0,0,'2017-02-14 19:55:17'),(123,4,2729798,1,'234324',1,1,'2017-02-14 19:56:17'),(124,4,2729798,0,'234324',0,0,'2017-02-14 19:56:17'),(125,4,2729798,1,'123123213',1,1,'2017-02-14 19:56:43'),(126,4,2729798,0,'123123213',0,0,'2017-02-14 19:56:43'),(127,4,2729798,0,'4343243432',1,0,'2017-02-14 19:57:31'),(128,4,2729798,0,'4343243432',0,1,'2017-02-14 19:57:31'),(129,4,2729798,2,'Hello',1,1,'2017-02-14 21:52:13'),(130,4,2729798,0,'Hello',0,0,'2017-02-14 21:52:13'),(131,4,2729798,0,'Yes',1,0,'2017-02-14 21:52:20'),(132,4,2729798,0,'Yes',0,1,'2017-02-14 21:52:20'),(133,4,2729798,0,'He is incoming',1,0,'2017-02-14 21:52:32'),(134,4,2729798,0,'He is incoming',0,1,'2017-02-14 21:52:32'),(135,4,2729798,1,'3333',1,1,'2017-02-14 22:07:14'),(136,4,2729798,0,'3333',0,0,'2017-02-14 22:07:14'),(137,4,2729798,0,'rrrr55566 to',1,0,'2017-02-14 22:07:28'),(138,4,2729798,0,'rrrr55566 to',0,1,'2017-02-14 22:07:28'),(139,4,2729798,0,'I have been the most important things',1,0,'2017-02-14 22:07:56'),(140,4,2729798,0,'I have been the most important things',0,1,'2017-02-14 22:07:56'),(141,4,2783412,1,'Hello',1,1,'2017-02-14 22:11:12'),(142,4,2783412,0,'Hello',0,0,'2017-02-14 22:11:12'),(143,4,2783412,0,'Ues',1,0,'2017-02-14 22:11:18'),(144,4,2783412,0,'Ues',0,1,'2017-02-14 22:11:18'),(145,4,2729798,0,'What are you doing?',1,0,'2017-02-14 22:11:28'),(146,4,2729798,0,'What are you doing?',0,1,'2017-02-14 22:11:28'),(147,4,2729798,1,'Sorry to delay answer.',1,1,'2017-02-14 22:11:42'),(148,4,2729798,0,'Sorry to delay answer.',0,0,'2017-02-14 22:11:42'),(149,4,2729798,0,'Hello',1,0,'2017-02-14 22:14:05'),(150,4,2729798,0,'Hello',0,1,'2017-02-14 22:14:05'),(151,4,2729798,0,'What are you doingb',1,0,'2017-02-14 22:14:22'),(152,4,2729798,0,'What are you doingb',0,1,'2017-02-14 22:14:22'),(153,4,2729798,1,'33333',1,1,'2017-02-14 22:14:38'),(154,4,2729798,0,'33333',0,0,'2017-02-14 22:14:38'),(155,4,2729798,1,'6666',1,1,'2017-02-14 22:14:43'),(156,4,2729798,0,'6666',0,0,'2017-02-14 22:14:43'),(157,4,2729798,0,'number',1,0,'2017-02-14 22:14:50'),(158,4,2729798,0,'number',0,1,'2017-02-14 22:14:50'),(159,4,2729798,0,'99999',1,0,'2017-02-14 22:14:59'),(160,4,2729798,0,'99999',0,1,'2017-02-14 22:14:59'),(161,4,2729798,0,'kkkkkltu',1,0,'2017-02-14 22:16:16'),(162,4,2729798,0,'kkkkkltu',0,1,'2017-02-14 22:16:16'),(163,4,2729798,0,'wghj',1,0,'2017-02-14 22:16:40'),(164,4,2729798,0,'wghj',0,1,'2017-02-14 22:16:40'),(165,4,2729798,0,'Hijj',1,0,'2017-02-14 22:16:44'),(166,4,2729798,0,'Hijj',0,1,'2017-02-14 22:16:44'),(167,4,2729798,0,'fhghhb',1,0,'2017-02-14 22:16:52'),(168,4,2729798,0,'fhghhb',0,1,'2017-02-14 22:16:52'),(169,4,2729798,0,'gffbj',1,0,'2017-02-14 22:16:54'),(170,4,2729798,0,'gffbj',0,1,'2017-02-14 22:16:54'),(171,4,2729798,0,'gyfggh',1,0,'2017-02-14 22:16:56'),(172,4,2729798,0,'gyfggh',0,1,'2017-02-14 22:16:56'),(173,4,2729798,0,'fhcbj',1,0,'2017-02-14 22:16:58'),(174,4,2729798,0,'fhcbj',0,1,'2017-02-14 22:16:58'),(175,4,2729798,0,'gggg',1,0,'2017-02-14 22:17:31'),(176,4,2729798,0,'gggg',0,1,'2017-02-14 22:17:31'),(177,4,2729798,1,'PPPP',1,1,'2017-02-14 22:17:42'),(178,4,2729798,0,'PPPP',0,0,'2017-02-14 22:17:42'),(179,4,2729798,1,'qqqqq',1,1,'2017-02-14 22:17:54'),(180,4,2729798,0,'qqqqq',0,0,'2017-02-14 22:17:54'),(181,4,2783412,1,'3234324',1,1,'2017-02-14 22:18:05'),(182,4,2783412,0,'3234324',0,0,'2017-02-14 22:18:05'),(183,4,2729798,1,'24324324',1,1,'2017-02-14 22:18:11'),(184,4,2729798,0,'24324324',0,0,'2017-02-14 22:18:11'),(185,4,2783412,1,'324324324',1,1,'2017-02-14 22:18:28'),(186,4,2783412,0,'324324324',0,0,'2017-02-14 22:18:28'),(187,4,2783412,0,'pppp',1,0,'2017-02-14 22:20:20'),(188,4,2783412,0,'pppp',0,1,'2017-02-14 22:20:20'),(189,4,2783412,1,'2342343',1,1,'2017-02-14 22:20:24'),(190,4,2783412,0,'2342343',0,0,'2017-02-14 22:20:24'),(191,4,2783412,1,'4444',1,1,'2017-02-14 22:20:28'),(192,4,2783412,0,'4444',0,0,'2017-02-14 22:20:28'),(193,4,2783412,1,'234324324',1,1,'2017-02-14 22:20:46'),(194,4,2783412,0,'234324324',0,0,'2017-02-14 22:20:46'),(195,4,2783412,0,'234324',1,0,'2017-02-14 22:20:52'),(196,4,2783412,0,'234324',0,1,'2017-02-14 22:20:52'),(197,4,2783412,1,'324324',1,1,'2017-02-14 22:22:00'),(198,4,2783412,0,'324324',0,0,'2017-02-14 22:22:00'),(199,4,2783412,1,'2342343',1,1,'2017-02-14 22:22:03'),(200,4,2783412,0,'2342343',0,0,'2017-02-14 22:22:03'),(201,4,2783412,1,'11111',1,1,'2017-02-14 22:22:10'),(202,4,2783412,0,'11111',0,0,'2017-02-14 22:22:10'),(203,4,2729798,0,'Chhhhj',1,0,'2017-02-14 22:22:18'),(204,4,2729798,0,'Chhhhj',0,1,'2017-02-14 22:22:18'),(205,4,2729798,0,'ttgh',1,0,'2017-02-14 22:22:27'),(206,4,2729798,0,'ttgh',0,1,'2017-02-14 22:22:27'),(207,4,2729798,0,'tygggh',1,0,'2017-02-14 22:22:31'),(208,4,2729798,0,'tygggh',0,1,'2017-02-14 22:22:31'),(209,4,2729798,0,'fghj',1,0,'2017-02-14 22:23:02'),(210,4,2729798,0,'fghj',0,1,'2017-02-14 22:23:02'),(211,4,2729798,0,'fhhh',1,0,'2017-02-14 22:23:18'),(212,4,2729798,0,'fhhh',0,1,'2017-02-14 22:23:18'),(213,4,2729798,0,'dycgnk',1,0,'2017-02-14 22:24:42'),(214,4,2729798,0,'dycgnk',0,1,'2017-02-14 22:24:42');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;