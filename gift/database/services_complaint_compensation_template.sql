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
/*Table structure for table `services_complaint_compensation_template` */

DROP TABLE IF EXISTS `services_complaint_compensation_template`;

CREATE TABLE `services_complaint_compensation_template` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `template` text,
  `modified_by` int(10) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `services_complaint_compensation_template` */

insert  into `services_complaint_compensation_template`(`id`,`property_id`,`template`,`modified_by`,`created_at`) values (1,4,'<p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\" class=\"ql-size-large\">{{guest_address}}</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Dear </span><strong style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{salutation}}. {{guest_name}}</strong><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">,</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Thank you for taking your time to speak with me in reference to your concern with us. </span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">I recognize that your holiday experience was diminished by the inconvenience you encountered, </span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">I also wish to reassure you that this is not reflective of our standards and as a gesture of goodwill, </span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">and without accepting liability we would like to offer you:</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{compensations}} </span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">during your future stay at </span><strong style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{property_name}}</strong></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">The gesture is made in full and final settlement of any claim you and your traveling party may otherwise bring, as a result of the inconvenience caused.</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">If this offer is acceptable to you, please indicate your agreement by signing in the space provided below.</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">As a valued guest of our hotel I sincerely hope that this experience will not deter you from returning, and look forward to welcoming you back to </span><strong style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{property_name}}</strong><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\"> in the near future.</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Yours Sincerely,</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{username}}</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{job_role}}</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">Agreed and accepted:</span></p><p><br></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">By _____________________________</span></p><p>{{guest_name}}</p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{room_number}}</span></p><p><span style=\"color: rgb(51, 51, 51); background-color: rgb(255, 255, 255);\">{{property_name}}</span></p>',1,'2017-04-21 22:24:48');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
