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
/*Table structure for table `ivr_caller_profile` */

DROP TABLE IF EXISTS `ivr_caller_profile`;

CREATE TABLE `ivr_caller_profile` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `callerid` varchar(20) DEFAULT NULL,
  `national` varchar(50) DEFAULT NULL,
  `mobile` varchar(20) DEFAULT NULL,
  `company` tinyint(1) DEFAULT '0',
  `companyname` varchar(50) DEFAULT NULL,
  `address` text,
  `salutation` varchar(10) DEFAULT NULL,
  `firstname` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) DEFAULT NULL,
  `email` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `spam` tinyint(1) DEFAULT '0',
  `image` blob,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `ivr_caller_profile` */

insert  into `ivr_caller_profile`(`id`,`callerid`,`national`,`mobile`,`company`,`companyname`,`address`,`salutation`,`firstname`,`lastname`,`email`,`phone`,`spam`,`image`) values (8,'1234','Afghanistan','123213',1,'12312','21321321','Mr.','11212','123','123','123123213',1,NULL),(9,'0','India','234',1,'2343','23432','Mr.','32423432','4324','3223432','23432432',0,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
