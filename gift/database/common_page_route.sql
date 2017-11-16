/*
SQLyog Ultimate v11.33 (32 bit)
MySQL - 5.6.24 : Database - ennovatech
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

/*Table structure for table `common_page_route` */

DROP TABLE IF EXISTS `common_page_route`;

CREATE TABLE `common_page_route` (
  `id` int(8) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8;

/*Data for the table `common_page_route` */

insert  into `common_page_route`(`id`,`name`) values (1,'access'),(2,'access.signin'),(3,'access.signup'),(4,'access.forgotpwd'),(5,'access.guestanswer'),(6,'app.mytask'),(7,'app.guestservice'),(8,'app.guestservice.dashboard'),(9,'app.guestservice.ticket'),(10,'app.guestservice.reservation'),(11,'app.guestservice.shift'),(12,'app.guestservice.alarm'),(13,'app.guestservice.guestinfo'),(14,'app.callaccounting'),(15,'app.callaccounting.dashboard'),(16,'app.callaccounting.livedata'),(17,'app.minibar'),(18,'app.minibar.dashboard'),(19,'app.minibar.logs'),(20,'app.housekeeping'),(21,'app.housekeeping.dashboard'),(22,'app.housekeeping.logs'),(23,'app.housekeeping.workflow'),(24,'app.housekeeping.assignment'),(25,'app.calldistribution'),(26,'app.calldistribution.dashboard'),(27,'app.calls'),(28,'app.calls.dashboard'),(29,'app.calls.logger'),(30,'app.engineering'),(31,'app.engineering.dashboard'),(32,'app.guestsurvey'),(33,'app.guestsurvey.dashboard'),(34,'app.guestsurvey.setting'),(35,'app.guestsurvey.answer'),(36,'app.reports'),(37,'app.housekeeping.realtime'),(38,'app.calls.agentstatus'),(39,'app.guestservice.notify'),(40,'app.calls.managecall');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
