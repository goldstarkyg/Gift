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
/*Table structure for table `common_perm_group` */

DROP TABLE IF EXISTS `common_perm_group`;

CREATE TABLE `common_perm_group` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `property_id` int(4) NOT NULL,
  `name` varchar(25) NOT NULL,
  `home_route_id` int(5) DEFAULT NULL,
  `description` varchar(256) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `common_perm_group` */

insert  into `common_perm_group`(`id`,`property_id`,`name`,`home_route_id`,`description`) values (1,4,'Department Managers',15,'Reporting access, Monitor Tickets, Approve Calls, Dashboard, view department calls'),(2,4,'Agents',15,'Reporting, View all Calls, create ticket'),(3,4,'Call Accounting',15,'');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
