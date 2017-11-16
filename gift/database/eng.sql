/*
SQLyog Ultimate v11.33 (32 bit)
MySQL - 5.6.24 : Database - ennovatech_client3
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
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(5) DEFAULT '0',
  `name` varchar(100) DEFAULT '',
  `equip_group_id` int(11) unsigned DEFAULT '0',
  `work_order_type` enum('Repairs','Requests','Preventive','Upgrade','New') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_checklist_item` */

DROP TABLE IF EXISTS `eng_checklist_item`;

CREATE TABLE `eng_checklist_item` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

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
  `checklist_id` int(20) unsigned NOT NULL DEFAULT '0',
  `item_id` int(11) unsigned NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_file` */

DROP TABLE IF EXISTS `eng_equip_file`;

CREATE TABLE `eng_equip_file` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_group_member` */

DROP TABLE IF EXISTS `eng_equip_group_member`;

CREATE TABLE `eng_equip_group_member` (
  `group_id` int(11) DEFAULT '0' COMMENT 'equipment group id',
  `equip_id` int(11) DEFAULT '0' COMMENT 'equipment id'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_list` */

DROP TABLE IF EXISTS `eng_equip_list`;

CREATE TABLE `eng_equip_list` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `equip_id` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `description` text,
  `critical_flag` int(2) DEFAULT '0',
  `external_maintenance` int(2) DEFAULT '0' COMMENT 'maintenance flag',
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `equip_id` (`equip_id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_part_group` */

DROP TABLE IF EXISTS `eng_equip_part_group`;

CREATE TABLE `eng_equip_part_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_equip_part_group_member` */

DROP TABLE IF EXISTS `eng_equip_part_group_member`;

CREATE TABLE `eng_equip_part_group_member` (
  `equip_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT 'equip_id',
  `part_group_id` int(11) DEFAULT '0' COMMENT 'part_group_id',
  `type` enum('group','no group') DEFAULT 'group' COMMENT 'group  or no grpup'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_external_maintenance` */

DROP TABLE IF EXISTS `eng_external_maintenance`;

CREATE TABLE `eng_external_maintenance` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `external_maintenance` varchar(100) NOT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `phone` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `external_maintenance` (`external_maintenance`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_part_group` */

DROP TABLE IF EXISTS `eng_part_group`;

CREATE TABLE `eng_part_group` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `code` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_part_group_member` */

DROP TABLE IF EXISTS `eng_part_group_member`;

CREATE TABLE `eng_part_group_member` (
  `part_id` int(11) unsigned NOT NULL,
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
  PRIMARY KEY (`id`),
  UNIQUE KEY `part_id` (`part_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_preventive` */

DROP TABLE IF EXISTS `eng_preventive`;

CREATE TABLE `eng_preventive` (
  `id` int(20) unsigned NOT NULL AUTO_INCREMENT,
  `type` enum('Major','Minor','Check') DEFAULT 'Major',
  `name` varchar(50) DEFAULT '',
  `equip_id` int(11) DEFAULT '0' COMMENT 'equip_id or equip_group_id',
  `equip_type` varchar(30) DEFAULT '' COMMENT 'equip(single) or equip group(group)',
  `checklist_id` int(11) DEFAULT '0',
  `frequency` int(3) DEFAULT '0' COMMENT 'frequency',
  `frequency_unit` varchar(30) DEFAULT '' COMMENT 'frequency unit(days, months, years)',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `inspection` int(2) DEFAULT '1',
  `sms` int(2) DEFAULT '1' COMMENT 'message or email to staff or staff grooup',
  `email` int(2) DEFAULT '1',
  `property_id` int(5) DEFAULT '0',
  `approver` int(11) DEFAULT '0' COMMENT 'writer',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_preventive_part` */

DROP TABLE IF EXISTS `eng_preventive_part`;

CREATE TABLE `eng_preventive_part` (
  `preventive_id` int(11) DEFAULT '0',
  `part_id` int(11) DEFAULT '0' COMMENT 'part_id or part group_id',
  `part_type` varchar(20) DEFAULT '' COMMENT 'group or single'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_preventive_staff` */

DROP TABLE IF EXISTS `eng_preventive_staff`;

CREATE TABLE `eng_preventive_staff` (
  `preventive_id` int(11) DEFAULT '0',
  `staff_id` int(11) DEFAULT '0' COMMENT 'stff_id or staff_group_id',
  `staff_type` varchar(20) DEFAULT '' COMMENT 'staff (single) or staff group (group)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_supplier` */

DROP TABLE IF EXISTS `eng_supplier`;

CREATE TABLE `eng_supplier` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `supplier` varchar(100) DEFAULT NULL,
  `contact` varchar(100) DEFAULT NULL,
  `phone` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `url` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `supplier` (`supplier`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

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
  `staff_type` varchar(20) DEFAULT '',
  `staff_cost` float(10,2) DEFAULT '0.00',
  `part_cost` float(10,2) DEFAULT '0.00',
  `critical_flag` int(2) DEFAULT '0',
  `status` enum('Pending','On Hold','In Progress','Completed') DEFAULT 'Pending',
  `work_order_type` enum('Repairs','Requests','Preventive','Upgrade','New') DEFAULT 'Repairs',
  `property_id` int(5) DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_workorder_part` */

DROP TABLE IF EXISTS `eng_workorder_part`;

CREATE TABLE `eng_workorder_part` (
  `workorder_id` int(11) unsigned NOT NULL DEFAULT '0',
  `part_id` int(11) unsigned NOT NULL DEFAULT '0',
  `part_name` varchar(100) DEFAULT '',
  `part_number` int(5) DEFAULT '0',
  `part_cost` float(10,2) DEFAULT '0.00',
  `part_stock` int(5) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Table structure for table `eng_workorder_staff_status` */

DROP TABLE IF EXISTS `eng_workorder_staff_status`;

CREATE TABLE `eng_workorder_staff_status` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `workorder_id` int(11) DEFAULT '0',
  `user_id` int(11) DEFAULT '0',
  `status` enum('Pending','Working','Hold','Finished') DEFAULT 'Pending',
  `status_flag` int(2) DEFAULT '0' COMMENT '1= hold  0 = no hold',
  `start_date` datetime DEFAULT '0000-00-00 00:00:00',
  `end_date` datetime DEFAULT '0000-00-00 00:00:00',
  `staff_id` int(11) DEFAULT '0',
  `staff_cost` float(10,2) DEFAULT '0.00',
  `duration` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

/*Table structure for table `eng_workorder_status_log` */

DROP TABLE IF EXISTS `eng_workorder_status_log`;

CREATE TABLE `eng_workorder_status_log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT '0',
  `workorder_id` int(11) unsigned NOT NULL,
  `status` enum('Pending','On Hold','In Progress','Completed','Custom','Working','Hold') DEFAULT 'Pending' COMMENT 'work order = Pending,On Hold,In Progress,Completed, Custom   staff stuts= Working, Hold, Finished',
  `setdate` datetime DEFAULT CURRENT_TIMESTAMP,
  `staff_id` int(11) DEFAULT '0',
  `description` text,
  `log_kind` enum('workorder','staff') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
