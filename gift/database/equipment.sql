/*
SQLyog Ultimate v11.33 (32 bit)
MySQL - 5.6.24 : Database - ennovatech_client2
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`ennovatech_client2` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `ennovatech_client2`;

/*Table structure for table `eng_equip_group` */

DROP TABLE IF EXISTS `eng_equip_group`;

CREATE TABLE `eng_equip_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_list` */

DROP TABLE IF EXISTS `eng_equip_list`;

CREATE TABLE `eng_equip_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `critical_flag` int(2) DEFAULT '0',
  `external_maintenance` text,
  `dept_id` int(10) DEFAULT '0',
  `life` int(10) DEFAULT '0',
  `life_unit` enum('days','months','years') DEFAULT NULL,
  `equip_group_id` int(10) DEFAULT '0',
  `part_group_id` int(10) DEFAULT '0',
  `location_group_member_id` int(10) DEFAULT '0',
  `purchase_cost` float DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `manufacture` text,
  `status_id` int(2) DEFAULT NULL,
  `model` text,
  `barcode` text,
  `warranty_start` date DEFAULT NULL,
  `warranty_end` date DEFAULT NULL,
  `supplier_id` int(10) DEFAULT '0',
  `image_url` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_part_group` */

DROP TABLE IF EXISTS `eng_equip_part_group`;

CREATE TABLE `eng_equip_part_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_supplier` */

DROP TABLE IF EXISTS `eng_supplier`;

CREATE TABLE `eng_supplier` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplier` varchar(100) DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
