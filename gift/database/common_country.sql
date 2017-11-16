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
/*Table structure for table `common_country` */

DROP TABLE IF EXISTS `common_country`;

CREATE TABLE `common_country` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=256 DEFAULT CHARSET=utf8;

/*Data for the table `common_country` */

insert  into `common_country`(`id`,`name`) values (1,'Afghanistan'),(2,'Albania'),(3,'Algeria'),(4,'American Samoa'),(5,'Andorra'),(6,'Angola'),(7,'Anguilla'),(8,'Antigua and Barbuda'),(9,'Argentina'),(10,'Armenia'),(11,'Aruba'),(12,'Australia'),(13,'Austria'),(14,'Azerbaijan'),(15,'Bahamas'),(16,'Bahrain'),(17,'Bangladesh'),(18,'Barbados'),(19,'Belarus'),(20,'Belgium'),(21,'Belize'),(22,'Benin'),(23,'Bermuda'),(24,'Bhutan'),(25,'Bolivia'),(26,'Bonaire'),(27,'Bosnia-Herzegovina'),(28,'Botswana'),(29,'Bouvet Island'),(30,'Brazil'),(31,'Brunei'),(32,'Bulgaria'),(33,'Burkina Faso'),(34,'Burundi'),(35,'Cambodia'),(36,'Cameroon'),(37,'Canada'),(38,'Cape Verde'),(39,'Cayman Islands'),(40,'Central African Republic'),(41,'Chad'),(42,'Chile'),(43,'China'),(44,'Christmas Island'),(45,'Cocos (Keeling) Islands'),(46,'Colombia'),(47,'Comoros'),(48,'\"Congo, Democratic Republic of the (Zaire)\"'),(49,'\"Congo, Republic of\"'),(50,'Cook Islands'),(51,'Costa Rica'),(52,'Croatia'),(53,'Cuba'),(54,'Curacao'),(55,'Cyprus'),(56,'Czech Republic'),(57,'Denmark'),(58,'Djibouti'),(59,'Dominica'),(60,'Dominican Republic'),(61,'Ecuador'),(62,'Egypt'),(63,'El Salvador'),(64,'Equatorial Guinea'),(65,'Eritrea'),(66,'Estonia'),(67,'Ethiopia'),(68,'Falkland Islands'),(69,'Faroe Islands'),(70,'Fiji'),(71,'Finland'),(72,'France'),(73,'French Guiana'),(74,'Gabon'),(75,'Gambia'),(76,'Georgia'),(77,'Germany'),(78,'Ghana'),(79,'Gibraltar'),(80,'Greece'),(81,'Greenland'),(82,'Grenada'),(83,'Guadeloupe (French)'),(84,'Guam (USA)'),(85,'Guatemala'),(86,'Guinea'),(87,'Guinea Bissau'),(88,'Guyana'),(89,'Haiti'),(90,'Holy See'),(91,'Honduras'),(92,'Hong Kong'),(93,'Hungary'),(94,'Iceland'),(95,'India'),(96,'Indonesia'),(97,'Iran'),(98,'Iraq'),(99,'Ireland'),(100,'Israel'),(101,'Italy'),(102,'Ivory Coast (Cote D`Ivoire)'),(103,'Jamaica'),(104,'Japan'),(105,'Jordan'),(106,'Kazakhstan'),(107,'Kenya'),(108,'Kiribati'),(109,'Kosovo'),(110,'Kuwait'),(111,'Kyrgyzstan'),(112,'Laos'),(113,'Latvia'),(114,'Lebanon'),(115,'Lesotho'),(116,'Liberia'),(117,'Libya'),(118,'Liechtenstein'),(119,'Lithuania'),(120,'Luxembourg'),(121,'Macau'),(122,'Macedonia'),(123,'Madagascar'),(124,'Malawi'),(125,'Malaysia'),(126,'Maldives'),(127,'Mali'),(128,'Malta'),(129,'Marshall Islands'),(130,'Martinique (French)'),(131,'Mauritania'),(132,'Mauritius'),(133,'Mayotte'),(134,'Mexico'),(135,'Micronesia'),(136,'Moldova'),(137,'Monaco'),(138,'Mongolia'),(139,'Montenegro'),(140,'Montserrat'),(141,'Morocco'),(142,'Mozambique'),(143,'Myanmar'),(144,'Namibia'),(145,'Nauru'),(146,'Nepal'),(147,'Netherlands'),(148,'Netherlands Antilles'),(149,'New Caledonia (French)'),(150,'New Zealand'),(151,'Nicaragua'),(152,'Niger'),(153,'Nigeria'),(154,'Niue'),(155,'Norfolk Island'),(156,'North Korea'),(157,'Northern Mariana Islands'),(158,'Norway'),(159,'Oman'),(160,'Pakistan'),(161,'Palau'),(162,'Panama'),(163,'Papua New Guinea'),(164,'Paraguay'),(165,'Peru'),(166,'Philippines'),(167,'Pitcairn Island'),(168,'Poland'),(169,'Polynesia (French)'),(170,'Portugal'),(171,'Puerto Rico'),(172,'Qatar'),(173,'Reunion'),(174,'Romania'),(175,'Russia'),(176,'Rwanda'),(177,'Saint Helena'),(178,'Saint Kitts and Nevis'),(179,'Saint Lucia'),(180,'Saint Pierre and Miquelon'),(181,'Saint Vincent and Grenadines'),(182,'Samoa'),(183,'San Marino'),(184,'Sao Tome and Principe'),(185,'Saudi Arabia'),(186,'Senegal'),(187,'Serbia'),(188,'Seychelles'),(189,'Sierra Leone'),(190,'Singapore'),(191,'Sint Maarten'),(192,'Slovakia'),(193,'Slovenia'),(194,'Solomon Islands'),(195,'Somalia'),(196,'South Africa'),(197,'South Georgia and South Sandwich Islands'),(198,'South Korea'),(199,'South Sudan'),(200,'South Sudan'),(201,'Spain'),(202,'Sri Lanka'),(203,'Sudan'),(204,'Suriname'),(205,'Svalbard and Jan Mayen Islands'),(206,'Swaziland'),(207,'Sweden'),(208,'Switzerland'),(209,'Syria'),(210,'Taiwan'),(211,'Tajikistan'),(212,'Tanzania'),(213,'Thailand'),(214,'Timor-Leste (East Timor)'),(215,'Togo'),(216,'Tokelau'),(217,'Tonga'),(218,'Trinidad and Tobago'),(219,'Tunisia'),(220,'Turkey'),(221,'Turkmenistan'),(222,'Turks and Caicos Islands'),(223,'Tuvalu'),(224,'Uganda'),(225,'Ukraine'),(226,'United Arab Emirates'),(227,'United Kingdom'),(228,'United States'),(229,'Uruguay'),(230,'Uzbekistan'),(231,'Vanuatu'),(232,'Venezuela'),(233,'Vietnam'),(234,'Virgin Islands'),(235,'Wallis and Futuna Islands'),(236,'Yemen'),(237,'Zambia'),(238,'Zimbabwe');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
