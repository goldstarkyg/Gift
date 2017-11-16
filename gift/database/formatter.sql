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
/*Table structure for table `formatter` */

DROP TABLE IF EXISTS `formatter`;

CREATE TABLE `formatter` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `protocol_id` int(10) DEFAULT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `formatter` text COLLATE utf8_unicode_ci,
  `url` varchar(200) COLLATE utf8_unicode_ci DEFAULT '/interface/process/',
  `mode` varchar(10) COLLATE utf8_unicode_ci DEFAULT 'GET',
  `verify` text COLLATE utf8_unicode_ci,
  `priority` int(2) DEFAULT '0' COMMENT '0: low, 1: medium, 2: high',
  `duplex_verify` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=47 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `formatter` */

insert  into `formatter`(`id`,`protocol_id`,`name`,`formatter`,`url`,`mode`,`verify`,`priority`,`duplex_verify`) values (1,5,'checkin','%d|%d|%s|%s|%d|%d|%s|%06d|%06d','/interface/process/','GET',NULL,0,NULL),(2,3,'checkin','CHK1 %5d','/interface/process/','GET',NULL,0,'R%1$d    JA'),(3,3,'nameadd','NAM1 %-20.20s %5.5d','/interface/process/','GET',NULL,0,NULL),(4,5,'checkout','%d|%d','/interface/process/','GET',NULL,0,NULL),(5,3,'checkout','CHK0 %5.5d','/interface/process/','GET',NULL,0,NULL),(6,3,'namedelete','NAM3 %-20.20s %5.5d','/interface/process/','GET',NULL,0,NULL),(7,5,'guestinfo','%d|%d|%s|%s','/interface/process/','GET',NULL,0,NULL),(8,5,'roomchange','%d|%s|%d|%d|%s','/interface/process/','GET',NULL,0,NULL),(9,5,'donotdisturb','%d|%s','/interface/process/','GET',NULL,0,NULL),(10,5,'classofservice','%d|%d','/interface/process/','GET',NULL,0,NULL),(11,5,'messagelamp','%d|%s|%d','/interface/process/','GET',NULL,0,NULL),(12,5,'nightaudit','%s|%06d|%06d','/interface/process/','GET',NULL,0,NULL),(13,5,'wakeupcall','%s|%d|%06d|%06d','/interface/process/','GET',NULL,0,NULL),(14,5,'databaseswap','%s|%06d|%06d','/interface/process/','GET',NULL,0,NULL),(15,3,'namechange','NAM2 %-20.20s %5.5d','/interface/process/','GET',NULL,0,NULL),(16,3,'donotdisturb','DND%1.1d %5.5d','/interface/process/','GET',NULL,0,NULL),(17,3,'classofservice','RST%1.1d %5.5d','/interface/process/','GET',NULL,0,NULL),(18,3,'messagelamp','MW %1.1d %5.5d','/interface/process/','GET',NULL,0,NULL),(19,5,'callcharge_incoming','%05s|%05s|%010s|%s|%s|%s|I','/interface/process/','GET',NULL,0,NULL),(20,1,'callcharge','PS|RN%d|PT%s|DA%06d|TI%06d|P#%d|DD%010d|DU%06d|PC%s|TA%d|SO%d|','/interface/process/','GET','PA\\|RN%1$d\\|ASOK\\|DA\\d{6}\\|TI\\d{6}\\|P#%5$d|',0,NULL),(21,5,'roomstatus','%d|%d','/interface/process/','GET','',0,NULL),(22,1,'roomstatus','RE|RN%d|RS%d|','','GET','',0,NULL),(23,1,'itempost','PS|RN%d|PT%s|P#%d|M#%d|MA%d|DA%06d|TI%06d|SO%d|','','GET','',0,NULL),(24,1,'totalitempost','PS|RN%d|PT%s|P#%d|TA%d|SO%s|DA%06d|TI%06d|','','GET','',0,NULL),(25,1,'linkstart','LD|DA%06d|TI%06d|V#8|IFPB|','','GET','',2,NULL),(26,1,'linkstart','LR|RINS|FLDATI|','','GET','',2,NULL),(27,1,'linkstart','LR|RINE|FLDATI|','/interface/process/','GET',NULL,2,NULL),(28,1,'linkstart','LR|RIGI|FLRNG#GNGLGGGAGDGVGSSF|','/interface/process/','GET',NULL,2,NULL),(29,1,'linkstart','LR|RIGO|FLRNG#GSSF|','/interface/process/','GET',NULL,2,NULL),(30,1,'linkstart','LR|RIGC|FLRNG#GNGLGGGAGDGVRO|','/interface/process/','GET',NULL,2,NULL),(31,1,'linkstart','LR|RIRE|FLRNG#MLRSCSDN|','/interface/process/','GET',NULL,2,NULL),(32,1,'linkstart','LR|RIWR|FLRNDATI|','/interface/process/','GET',NULL,2,NULL),(33,1,'linkstart','LR|RIWA|FLRNDATIAS|','/interface/process/','GET',NULL,2,NULL),(34,1,'linkstart','LR|RIWC|FLRNDATI|','/interface/process/','GET',NULL,2,NULL),(35,1,'linkstart','LR|RIPS|FLRNPTDATIDDDUP#TAMAM#PC|','/interface/process/','GET',NULL,2,NULL),(36,1,'linkstart','LR|RIPA|FLRNASDATIP#|','/interface/process/','GET',NULL,2,NULL),(37,1,'linkstart','LA|DA%06d|TI%06d|','/interface/process/','GET',NULL,2,NULL),(38,1,'databaseswap','DR|DA%06d|TI%06d|','/interface/process/','GET',NULL,0,NULL),(39,5,'checkin_swap','%d|%d|%s|%s|%d|%d|%s|%06d|%06d','/interface/process/','GET',NULL,0,NULL),(40,5,'checkout_swap','%d|%d','/interface/process/','GET',NULL,0,NULL),(41,5,'callcharge_internal','%05s|%05s|%010s|%s|%s|%s|IH','/interface/process/','GET',NULL,0,NULL),(42,5,'callcharge_outgoing','%05s|%05s|%010s|%s|%s|%s|O','/interface/process/','GET',NULL,0,NULL),(43,5,'mlcsdn_checkin','%d|%s|%s|%d|%s','/interface/process/','GET',NULL,0,NULL),(44,5,'mlcsdn_checkout','%d|%s|%d|%s','/interface/process/','GET',NULL,0,NULL),(45,5,'checkoutnoguest_swap','%d','/interface/process/','GET',NULL,0,NULL),(46,5,'checkinnogvgg','%d|%d|%s|%s|0|0|%s|%06d|%06d','/interface/process/','GET',NULL,0,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
