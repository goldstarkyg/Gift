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
/*Table structure for table `parser` */

DROP TABLE IF EXISTS `parser`;

CREATE TABLE `parser` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `protocol_id` int(10) DEFAULT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dest` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `checker` text COLLATE utf8_unicode_ci,
  `keys` text COLLATE utf8_unicode_ci,
  `state` int(2) DEFAULT '0' COMMENT '2: init, 1: handshake, 0: ready',
  `response` text COLLATE utf8_unicode_ci,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*Data for the table `parser` */

insert  into `parser`(`id`,`protocol_id`,`name`,`dest`,`checker`,`keys`,`state`,`response`) values (1,3,'callchargeincoming','HOTLYNC','(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2}) {2}(\\d{4}:\\d{2}:\\d{2}) (ATT\\d|\\d{4}) {4}\\* {4}(\\d{10}) {11}(\\d+) {2}T(\\d{3}) {26}(\\d{3})','',0,NULL),(2,1,'linkstart','','LS\\|DA(\\d{6})\\|TI(\\d{6})\\|','',1,NULL),(3,1,'checkin','HOTLYNC','^GI\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GV(\\d{1,5})\\|GG(\\d+)\\|GS([YN])\\|GA(\\d{6})\\|GD(\\d{6})\\|$','',0,NULL),(4,1,'checkout','HOTLYNC','^GO\\|RN(\\d+)\\|G#(\\d+)\\|GS([YN])\\|$','',0,NULL),(5,1,'guestinfo','HOTLYNC','^GC\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|$','',0,NULL),(6,1,'roomchange','HOTLYNC','^GC\\|RN(\\d+)\\|GS([YN])\\|G#(\\d+)\\|RO(\\d+)\\|GS([YN])\\|$','',0,NULL),(7,1,'donotdisturb','HOTLYNC','^RE\\|RN(\\d+)\\|DN([YN])\\|$','',0,NULL),(8,1,'classofservice','HOTLYNC','^RE\\|RN(\\d+)\\|CS(\\d+)\\|$','',0,NULL),(9,1,'messagelamp','HOTLYNC','^RE\\|RN(\\d+)\\|ML([YN])\\|G#(\\d+)\\|$','',0,NULL),(10,1,'nightaudit','HOTLYNC','^N(S|E)\\|DA(\\d{6})\\|TI(\\d{6})\\|$','',0,NULL),(11,1,'wakeupcall','HOTLYNC','^W(R|C)\\|RN(\\d+)\\|DA(\\d{6})\\|TI(\\d{6})\\|$','',0,NULL),(12,1,'databaseswap','HOTLYNC','^D(S|E)\\|DA(\\d{6})\\|TI(\\d{6})\\|$','',0,NULL),(13,5,'checkin','PBX','\\|CHK1\\|ET(\\d+)\\|','',0,NULL),(14,5,'nameadd','PBX','\\|NAM1\\|GN([a-z A-Z.0-9]+)\\|ET(\\d+)\\|','',0,NULL),(15,5,'checkout','PBX','\\|CHK0\\|ET(\\d+)\\|','',0,NULL),(16,5,'namedelete','PBX','\\|NAM3\\|GN([a-z A-Z.0-9]+)\\|ET(\\d+)\\|','',0,NULL),(17,5,'namechange','PBX','\\|NAM2\\|GN([a-z A-Z.0-9]+)\\|ET(\\d+)\\|',NULL,0,NULL),(18,5,'donotdisturb','PBX','\\|DND(\\d)\\|ET(\\d+)\\|',NULL,0,NULL),(19,5,'classofservice','PBX','\\|RST(\\d+)\\|ET(\\d+)\\|',NULL,0,NULL),(20,5,'messagelamp','PBX','\\|MW(\\d)\\|ET(\\d+)\\|',NULL,0,NULL),(21,5,'callcharge','PMS','PS\\|RN(\\d+)\\|PT(C|Y)\\|DA(\\d{6})\\|TI(\\d{6})\\|P#(\\d+)\\|DD(\\d{10})\\|DU(\\d{6})\\|PC(I)\\|TA(\\d+)\\|SO(\\d+)',NULL,0,NULL),(22,3,'roomstatus','HOTLYNC','STS(\\d+) (\\d+)','',0,''),(23,5,'roomstatus','PMS','RE\\|RN(\\d+)\\|RS(\\d+)','',0,NULL),(24,5,'itempost','PMS','PS\\|RN(\\d+)\\|PT([A-Z])\\|P#(\\d+)\\|M#(\\d+)\\|MA(\\d+)\\|DA(\\d{6})\\|TI(\\d{6})\\|SO(\\d+)','',0,NULL),(25,5,'totalitempost','PMS','PS\\|RN(\\d+)\\|PT([A-Z])\\|P#(\\d+)\\|TA(\\d+)\\|SO([A-Z0-9]+)\\|DA(\\d{6})\\|TI(\\d{6})','',0,NULL),(26,1,'linkalive','HOTLYNC','LA\\|DA(\\d{6})\\|TI(\\d{6})\\|',NULL,0,NULL),(27,5,'databaseswap','PMS','DR\\|DA(\\d{6})\\|TI(\\d{6})\\|',NULL,0,NULL),(28,1,'checkin_swap','HOTLYNC','^GI\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GV(\\d{1,5})\\|GG(\\d+)\\|GS([YN])\\|GA(\\d{6})\\|GD(\\d{6})\\|SF\\|$',NULL,0,NULL),(29,1,'checkout_swap','HOTLYNC','^GO\\|RN(\\d+)\\|G#(\\d+)\\|GS([YN])\\|SF\\|$',NULL,0,NULL),(30,6,'callcharge_incoming','HOTLYNC','(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2}) {2}(\\d{2}:\\d{2}:\\d{2}) T(\\d+) {2}(\\d+) (\\d+) {22}T (\\d+)X (\\d+) {14}(\\d+) {3}(\\d+) (\\d+) {6}\\[13\\]\\[10\\]','1 2 3 10 6 4 7',0,NULL),(31,6,'callcharge_internal','HOTLYNC','(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2}) {2}(\\d{2}:\\d{2}:\\d{2}) (\\d+) {2}(\\d+) (\\d+) {22}I (\\d+) {20}(\\d+) {24}\\[13\\]\\[10\\]','1 2 3 7 6 4',0,NULL),(32,6,'callcharge_outgoing','HOTLYNC','(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2}) {2}(\\d{2}:\\d{2}:\\d{2}) (\\d+) {6}(\\d+) {11}(\\d+)A T(\\d+) {20}(\\d+) {24}\\[13\\]\\[10\\]','1 2 3 5 4 7',0,NULL),(33,6,'callcharge_incoming','HOTLYNC','(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2}) {2}(\\d{2}:\\d{2}:\\d{2}) T(\\d+) {2}(\\d+) (\\d+) {24}(\\d+) {20}(\\d+) {3}(\\d+) (\\d+) {6}\\[13\\]\\[10\\]','1 2 3 9 6 4',0,NULL),(34,1,'guestinfo','HOTLYNC','^GC\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GA(\\d+)\\|GD(\\d+)\\|$',NULL,0,NULL),(35,1,'mlcsdn_checkin','HOTLYNC','RE\\|RN(\\d+)\\|G#(\\d+)\\|ML([YN])\\|CS(\\d+)\\|DN([YN])\\|',NULL,0,NULL),(36,1,'mlcsdn_checkout','HOTLYNC','RE\\|RN(\\d+)\\|ML([YN])\\|CS(\\d+)\\|DN([YN])\\|',NULL,0,NULL),(37,1,'checkoutnoguest_swap','HOTLYNC','GO\\|RN(\\d+)\\|GS([YN])\\|SF\\|',NULL,0,NULL),(38,1,'checkinnogvgg','HOTLYNC','GI\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GS([YN])\\|GA(\\d{6})\\|GD(\\d{6})\\|',NULL,0,NULL);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
