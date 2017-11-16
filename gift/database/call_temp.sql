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
/*Table structure for table `call_temp` */

DROP TABLE IF EXISTS `call_temp`;

CREATE TABLE `call_temp` (
  `id` int(11) NOT NULL DEFAULT '0',
  `call_date` date NOT NULL,
  `start_time` time NOT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `extension` varchar(20) DEFAULT NULL,
  `called_no` varchar(20) NOT NULL,
  `trunk` varchar(10) DEFAULT NULL,
  `call_direction` int(2) DEFAULT '0' COMMENT '0: internal, 1: received, 2: missed, 3: outgoing'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*Data for the table `call_temp` */

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
