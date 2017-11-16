/*
SQLyog Ultimate v11.33 (64 bit)
MySQL - 10.1.9-MariaDB : Database - ennovatech_interface
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
/*Table structure for table `protocol` */

DROP TABLE IF EXISTS `protocol`;

CREATE TABLE `protocol` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` enum('PBX','PMS','HOTLYNC') COLLATE utf8_unicode_ci DEFAULT NULL,
  `checksum_flag` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `checksum_type` enum('BCC','CRC-32') COLLATE utf8_unicode_ci DEFAULT NULL,
  `checksum_pos` int(11) DEFAULT NULL,
  `handshake` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT NULL,
  `duplex` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `protocol` */

insert  into `protocol`(`id`,`name`,`type`,`checksum_flag`,`checksum_type`,`checksum_pos`,`handshake`,`duplex`) values (1,'Opera','PMS','No',NULL,NULL,'Yes','No'),(2,'Alcatel','PBX','No',NULL,NULL,'No','Yes'),(3,'Mitel','PBX','No',NULL,1,'No','Yes'),(4,'Nortel','PBX','No',NULL,NULL,'No','No'),(5,'Hotlync','HOTLYNC','No',NULL,NULL,'No','No'),(6,'MitelCDR','PBX','No',NULL,NULL,'No','No');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
