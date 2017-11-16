/*
SQLyog Ultimate v11.33 (32 bit)
MySQL - 5.6.24 : Database - ennovatech_g
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


/*Table structure for table `property_setting` */

DROP TABLE IF EXISTS `property_setting`;

CREATE TABLE `property_setting` (
  `id` int(5) unsigned NOT NULL AUTO_INCREMENT,
  `property_id` int(10) DEFAULT NULL,
  `settings_key` varchar(50) DEFAULT NULL,
  `value` varchar(200) DEFAULT NULL,
  `comment` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8;

/*Data for the table `property_setting` */

insert  into `property_setting`(`id`,`property_id`,`settings_key`,`value`,`comment`) values (1,4,'minibar_posting_type','Item','Item/total this is the way the minibar items would be sent to opera'),(2,4,'minibar_posting_checkout_allow','true','True/False this is to allow or diallow minibar posting for checkout rooms'),(3,4,'smtp_server','send.one.com',NULL),(4,4,'smtp_user','reports@myhotlync.com',NULL),(5,4,'smtp_send_address','reports@myhotlync.com',NULL),(6,4,'smtp_port','465',NULL),(7,4,'smtp_tls','ssl',NULL),(8,4,'last_night_audit','2016-10-17 18:35:20','this is the date & time the last night audit request came from opera. This will be updated when a new one comes in. This will be used for the report period. Previous night audit to current night audit'),(9,4,'night_audit_report_type','Detailed report by Extension','same as the report types available on system'),(10,4,'night_audit_report_extensions','admin',NULL),(11,4,'night_audit_recipients','audit@goldensands.ae,johnny.mathias@goldensands.ae,itsupport@goldensands.ae,support@ennovatech.ae',NULL),(12,4,'login_session_timeout','465',NULL),(13,4,'password_lock_attempts','5',NULL),(14,4,'mobile_allow_manual_post','true',NULL),(15,4,'sms_gateway_settings',NULL,'this can be a blob datatype where the code for the SMS is saved and can be changed to change the gateway'),(16,4,'services_reminder','true',NULL),(17,4,'services_reminder_duration','80','this is in percentage and is the time elapsed after which the the reminder message will be sent to the attendant'),(18,4,'hskp_inspection','true','this is to enable/disable inspection requirement after room is cleaned'),(19,4,'services_allow_manual_attendant','true','this is to enable/disable selection of runners manually while creating tasks'),(20,4,'smtp_password','Hotlync_2@16',NULL),(21,0,'interface_host','http://192.168.1.253:3000/','interface url.'),(22,0,'hotlync_host','http://192.168.1.91:8894/','hotlync url.'),(23,0,'live_host','http://192.168.1.91:8001/','Live url.'),(24,4,'idle_duration','100','Idle timeout duration'),(25,4,'max_wrapup_time','20','max wrapup time.'),(26,4,'no_avail_time','20','No Available Time'),(27,4,'no_avail_email','50','No Available Email');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
