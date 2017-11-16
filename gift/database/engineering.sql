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


/*Table structure for table `eng_checklist` */

DROP TABLE IF EXISTS `eng_checklist`;

CREATE TABLE `eng_checklist` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(5) DEFAULT '0',
  `name` varchar(100) DEFAULT '',
  `equip_group_id` int(11) unsigned DEFAULT '0',
  `work_order_type` enum('Repairs','Requests','Preventive','Upgrade','New') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_checklist_item` */

DROP TABLE IF EXISTS `eng_checklist_item`;

CREATE TABLE `eng_checklist_item` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_checklist_location` */

DROP TABLE IF EXISTS `eng_checklist_location`;

CREATE TABLE `eng_checklist_location` (
  `checklist_id` int(11) unsigned NOT NULL DEFAULT '0',
  `location_id` int(11) DEFAULT '0',
  `lg_id` int(11) DEFAULT '0',
  `location_grp` int(11) DEFAULT '0',
  `name` varchar(50) DEFAULT '',
  `property_id` int(5) DEFAULT '0',
  `type` varchar(50) DEFAULT '',
  `type_id` int(11) DEFAULT '0',
  KEY `id` (`checklist_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_checklist_pivot` */

DROP TABLE IF EXISTS `eng_checklist_pivot`;

CREATE TABLE `eng_checklist_pivot` (
  `checklist_id` int(11) unsigned NOT NULL DEFAULT '0',
  `item_id` int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_file` */

DROP TABLE IF EXISTS `eng_equip_file`;

CREATE TABLE `eng_equip_file` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `equip_id` int(11) unsigned DEFAULT '0',
  `name` varchar(200) DEFAULT '',
  `description` text,
  `path` varchar(200) DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_group` */

DROP TABLE IF EXISTS `eng_equip_group`;

CREATE TABLE `eng_equip_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_group_member` */

DROP TABLE IF EXISTS `eng_equip_group_member`;

CREATE TABLE `eng_equip_group_member` (
  `group_id` int(11) DEFAULT '0' COMMENT 'equipment group id',
  `equip_id` int(11) DEFAULT '0' COMMENT 'equipment id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_list` */

DROP TABLE IF EXISTS `eng_equip_list`;

CREATE TABLE `eng_equip_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `equip_id` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `critical_flag` int(2) DEFAULT '0',
  `external_maintenance` int(2) DEFAULT '0',
  `external_maintenance_id` int(10) DEFAULT NULL,
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
  `maintenance_date` datetime DEFAULT NULL,
  `property_id` int(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_part_group_member` */

DROP TABLE IF EXISTS `eng_equip_part_group_member`;

CREATE TABLE `eng_equip_part_group_member` (
  `equip_id` int(11) DEFAULT '0' COMMENT 'equip_id',
  `part_group_id` int(11) DEFAULT '0' COMMENT 'part_group_id',
  `type` enum('group','no group') DEFAULT 'group' COMMENT 'group  or no grpup'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_external_maintenance` */

DROP TABLE IF EXISTS `eng_external_maintenance`;

CREATE TABLE `eng_external_maintenance` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `external_maintenance` varchar(100) DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_part_group` */

DROP TABLE IF EXISTS `eng_part_group`;

CREATE TABLE `eng_part_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_part_group_member` */

DROP TABLE IF EXISTS `eng_part_group_member`;

CREATE TABLE `eng_part_group_member` (
  `part_id` int(11) unsigned DEFAULT NULL,
  `part_group_id` int(11) unsigned DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_part_list` */

DROP TABLE IF EXISTS `eng_part_list`;

CREATE TABLE `eng_part_list` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `part_id` varchar(50) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `part_group_id` int(10) DEFAULT '0',
  `purchase_cost` float DEFAULT NULL,
  `purchase_date` date DEFAULT NULL,
  `model` text,
  `barcode` text,
  `warranty_start` date DEFAULT NULL,
  `warranty_end` date DEFAULT NULL,
  `supplier_id` int(10) DEFAULT '0',
  `image_url` varchar(255) DEFAULT '',
  `property_id` int(10) DEFAULT NULL,
  `quantity` int(10) DEFAULT NULL,
  `minquantity` int(10) DEFAULT NULL,
  `manufacture` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_workorder` */

DROP TABLE IF EXISTS `eng_workorder`;

CREATE TABLE `eng_workorder` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT '0',
  `name` varchar(50) DEFAULT '',
  `description` text,
  `checklist_id` int(11) DEFAULT '0',
  `priority` enum('Low','Medium','High','Urgent') DEFAULT 'Low',
  `equipment_id` int(11) DEFAULT '0',
  `frequency` int(5) DEFAULT '0',
  `frequency_unit` enum('Days','Weeks','Months','Years') DEFAULT 'Days',
  `created_date` datetime DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `duration` int(11) DEFAULT '0',
  `staff_id` int(11) DEFAULT '0',
  `staff_cost` float(10,2) DEFAULT '0.00',
  `part_cost` float(10,2) DEFAULT '0.00',
  `critical_flag` int(2) DEFAULT '0',
  `status` enum('Pending','On Hold','In Progress','Completed') DEFAULT 'Pending',
  `work_order_type` enum('Repairs','Requests','Preventive','Upgrade','New') DEFAULT 'Repairs',
  `property_id` int(5) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_workorder_part` */

DROP TABLE IF EXISTS `eng_workorder_part`;

CREATE TABLE `eng_workorder_part` (
  `workorder_id` int(11) unsigned NOT NULL DEFAULT '0',
  `part_id` int(11) unsigned NOT NULL DEFAULT '0',
  `part_name` varchar(100) DEFAULT '',
  `part_number` int(5) DEFAULT '0',
  `part_cost` float(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_workorder_status_log` */

DROP TABLE IF EXISTS `eng_workorder_status_log`;

CREATE TABLE `eng_workorder_status_log` (
  `workorder_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `status` enum('Pending','On Hold','In Progress','Completed') DEFAULT 'Pending',
  `setdate` datetime DEFAULT NULL,
  PRIMARY KEY (`workorder_id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
