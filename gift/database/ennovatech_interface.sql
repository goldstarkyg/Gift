-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Dec 10, 2016 at 12:01 PM
-- Server version: 5.7.16-0ubuntu0.16.04.1
-- PHP Version: 7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ennovatech_interface`
--

-- --------------------------------------------------------

--
-- Table structure for table `alarm`
--

CREATE TABLE `alarm` (
  `id` int(10) UNSIGNED NOT NULL,
  `property_id` int(10) DEFAULT NULL,
  `email` varchar(40) COLLATE utf8_unicode_ci DEFAULT 'alarms@ennovatech.ae',
  `password` varchar(50) COLLATE utf8_unicode_ci DEFAULT 'EnnovaTech2@16',
  `smtp_server` varchar(50) COLLATE utf8_unicode_ci DEFAULT 'send.one.com',
  `smtp_port` int(5) DEFAULT '465',
  `auth` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'Yes',
  `ssl` enum('true','false') COLLATE utf8_unicode_ci DEFAULT 'true'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `alarm`
--

INSERT INTO `alarm` (`id`, `property_id`, `email`, `password`, `smtp_server`, `smtp_port`, `auth`, `ssl`) VALUES
(1, 4, 'gsha.alarms@myhotlync.com', 'Hotlync_2@16', 'send.one.com', 465, 'Yes', 'true');

-- --------------------------------------------------------

--
-- Table structure for table `channel`
--

CREATE TABLE `channel` (
  `id` int(10) UNSIGNED NOT NULL,
  `property_id` int(10) DEFAULT NULL,
  `src_build_id` int(10) DEFAULT '0',
  `accept_build_id` varchar(20) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `active` enum('','Yes','No') COLLATE utf8_unicode_ci DEFAULT NULL,
  `alarm` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `mobile` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `com_mode` enum('TCP Client','TCP Server','Web Service') COLLATE utf8_unicode_ci DEFAULT NULL,
  `tcpip` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `tcpport` int(6) DEFAULT NULL,
  `protocol_id` int(11) DEFAULT NULL,
  `duration` int(11) DEFAULT '0',
  `complete_flag` tinyint(1) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `channel`
--

INSERT INTO `channel` (`id`, `property_id`, `src_build_id`, `accept_build_id`, `name`, `active`, `alarm`, `email`, `mobile`, `com_mode`, `tcpip`, `tcpport`, `protocol_id`, `duration`, `complete_flag`) VALUES
(4, 4, 6, '6', 'Opera3', 'Yes', 'Yes', 'support@ennovatech.ae', '+8618841568752', 'TCP Client', '200.5.7.10', 5016, 1, 45, 1),
(6, 4, 0, '6,7,8', 'MitelPMS', 'Yes', 'Yes', 'support@ennovatech.ae', '', 'TCP Client', '200.5.7.2', 15374, 3, 45, 1),
(7, 4, 0, '6,7,8,9', 'Ennovatec_hotlync', 'Yes', 'Yes', 'support@ennovatech.ae', '+8618841568752', 'Web Service', '200.5.6.6', 80, 5, 45, 1),
(9, 4, 7, '7', 'Opera5', 'Yes', 'Yes', 'support@ennovatech.ae', '+8618841568615', 'TCP Client', '200.5.7.10', 5020, 1, 45, 1),
(10, 4, 8, '8', 'Opera10', 'Yes', 'Yes', 'support@ennovatech.ae', '+8618841567654', 'TCP Client', '200.5.7.10', 5018, 1, 60, 1),
(11, 4, 0, '-1', 'MitelCDR_3_10', 'Yes', 'Yes', 'support@ennovatech.ae', '+8617823342231', 'TCP Client', '200.5.7.2', 1752, 6, 45, 1),
(12, 4, 0, '-1', 'MitelCDR_5', 'Yes', 'Yes', 'support@ennovatech.ae', '+861821321321', 'TCP Client', '200.5.7.16', 1752, 6, 45, 1);

-- --------------------------------------------------------

--
-- Table structure for table `channel_state`
--

CREATE TABLE `channel_state` (
  `id` int(10) UNSIGNED NOT NULL,
  `protocol_id` int(11) DEFAULT NULL,
  `state` enum('close','init','handshake','wait','keepalive','active') COLLATE utf8_unicode_ci DEFAULT NULL,
  `enter` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `timeout` int(11) DEFAULT '3',
  `timeout_state` enum('close','init','handshake','wait','keepalive','active') COLLATE utf8_unicode_ci DEFAULT NULL,
  `duration` int(11) NOT NULL DEFAULT '3'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `channel_state`
--

INSERT INTO `channel_state` (`id`, `protocol_id`, `state`, `enter`, `timeout`, `timeout_state`, `duration`) VALUES
(1, 3, 'close', NULL, 0, 'close', 0),
(2, 3, 'init', '', 3, 'init', 3),
(3, 3, 'handshake', 'AREYOUTHERE', 3, 'init', 3),
(4, 3, 'wait', '', 3, 'init', 3),
(5, 3, 'active', NULL, 0, 'init', 3);

-- --------------------------------------------------------

--
-- Table structure for table `formatter`
--

CREATE TABLE `formatter` (
  `id` int(10) UNSIGNED NOT NULL,
  `protocol_id` int(10) DEFAULT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `formatter` text COLLATE utf8_unicode_ci,
  `url` varchar(200) COLLATE utf8_unicode_ci DEFAULT '/interface/process/',
  `mode` varchar(10) COLLATE utf8_unicode_ci DEFAULT 'GET',
  `verify` text COLLATE utf8_unicode_ci,
  `priority` int(2) DEFAULT '0' COMMENT '0: low, 1: medium, 2: high',
  `duplex_verify` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `formatter`
--

INSERT INTO `formatter` (`id`, `protocol_id`, `name`, `formatter`, `url`, `mode`, `verify`, `priority`, `duplex_verify`) VALUES
(1, 5, 'checkin', '%d|%d|%s|%s|0|0|%s|%06d|%06d', '/interface/process/', 'GET', NULL, 0, NULL),
(2, 3, 'checkin', 'CHK1 %5d', '/interface/process/', 'GET', NULL, 0, 'R%1$d    JA'),
(3, 3, 'nameadd', 'NAM1 %-20.20s %5.5d', '/interface/process/', 'GET', NULL, 0, NULL),
(4, 5, 'checkout', '%d|%d', '/interface/process/', 'GET', NULL, 0, NULL),
(5, 3, 'checkout', 'CHK0 %5.5d', '/interface/process/', 'GET', NULL, 0, NULL),
(6, 3, 'namedelete', 'NAM3 %-20.20s %5.5d', '/interface/process/', 'GET', NULL, 0, NULL),
(7, 5, 'guestinfo', '%d|%d|%s|%s', '/interface/process/', 'GET', NULL, 0, NULL),
(8, 5, 'roomchange', '%d|%s|%d|%d|%s', '/interface/process/', 'GET', NULL, 0, NULL),
(9, 5, 'donotdisturb', '%d|%s', '/interface/process/', 'GET', NULL, 0, NULL),
(10, 5, 'classofservice', '%d|%d', '/interface/process/', 'GET', NULL, 0, NULL),
(11, 5, 'messagelamp', '%d|%s|%d', '/interface/process/', 'GET', NULL, 0, NULL),
(12, 5, 'nightaudit', '%s|%06d|%06d', '/interface/process/', 'GET', NULL, 0, NULL),
(13, 5, 'wakeupcall', '%s|%d|%06d|%06d', '/interface/process/', 'GET', NULL, 0, NULL),
(14, 5, 'databaseswap', '%s|%06d|%06d', '/interface/process/', 'GET', NULL, 0, NULL),
(15, 3, 'namechange', 'NAM2 %-20.20s %5.5d', '/interface/process/', 'GET', NULL, 0, NULL),
(16, 3, 'donotdisturb', 'DND%1.1d %5.5d', '/interface/process/', 'GET', NULL, 0, NULL),
(17, 3, 'classofservice', 'RST%1.1d %5.5d', '/interface/process/', 'GET', NULL, 0, NULL),
(18, 3, 'messagelamp', 'MW %1.1d %5.5d', '/interface/process/', 'GET', NULL, 0, NULL),
(19, 5, 'callcharge_incoming', '%05s|%05s|T%s|%s|%s|%s|I', '/interface/process/', 'GET', NULL, 0, NULL),
(20, 1, 'callcharge', 'PS|RN%d|PT%s|DA%06d|TI%06d|P#%d|DD%010d|DU%06d|PC%s|TA%d|SO%d|', '/interface/process/', 'GET', 'PA\\|RN%1$d\\|ASOK\\|DA\\d{6}\\|TI\\d{6}\\|P#%5$d|', 0, NULL),
(21, 5, 'roomstatus', '%d|%d', '/interface/process/', 'GET', '', 0, NULL),
(22, 1, 'roomstatus', 'RE|RN%d|RS%d|', '', 'GET', '', 0, NULL),
(23, 1, 'itempost', 'PS|RN%d|PT%s|P#%d|M#%d|MA%d|DA%06d|TI%06d|SO%d|', '', 'GET', '', 0, NULL),
(24, 1, 'totalitempost', 'PS|RN%d|PT%s|P#%d|TA%d|SO%s|DA%06d|TI%06d|', '', 'GET', '', 0, NULL),
(25, 1, 'linkstart', 'LD|DA%06d|TI%06d|V#8|IFPB|', '', 'GET', '', 2, NULL),
(26, 1, 'linkstart', 'LR|RINS|FLDATI|', '', 'GET', '', 2, NULL),
(27, 1, 'linkstart', 'LR|RINE|FLDATI|', '/interface/process/', 'GET', NULL, 2, NULL),
(28, 1, 'linkstart', 'LR|RIGI|FLRNG#GNGLGAGDGSSF|', '/interface/process/', 'GET', NULL, 2, NULL),
(29, 1, 'linkstart', 'LR|RIGO|FLRNG#GSSF|', '/interface/process/', 'GET', NULL, 2, NULL),
(30, 1, 'linkstart', 'LR|RIGC|FLRNG#GNGLGAGDROGS|', '/interface/process/', 'GET', NULL, 2, NULL),
(31, 1, 'linkstart', 'LR|RIRE|FLRNG#MLRSCSDN|', '/interface/process/', 'GET', NULL, 2, NULL),
(32, 1, 'linkstart', 'LR|RIWR|FLRNDATI|', '/interface/process/', 'GET', NULL, 2, NULL),
(33, 1, 'linkstart', 'LR|RIWA|FLRNDATIAS|', '/interface/process/', 'GET', NULL, 2, NULL),
(34, 1, 'linkstart', 'LR|RIWC|FLRNDATI|', '/interface/process/', 'GET', NULL, 2, NULL),
(35, 1, 'linkstart', 'LR|RIPS|FLRNPTDATIDDDUP#TAMAM#PC|', '/interface/process/', 'GET', NULL, 2, NULL),
(36, 1, 'linkstart', 'LR|RIPA|FLRNASDATIP#|', '/interface/process/', 'GET', NULL, 2, NULL),
(37, 1, 'linkstart', 'LA|DA%06d|TI%06d|', '/interface/process/', 'GET', NULL, 2, NULL),
(38, 1, 'databaseswap', 'DR|DA%06d|TI%06d|', '/interface/process/', 'GET', NULL, 0, NULL),
(39, 5, 'checkin_swap', '%d|%d|%s|%s|0|0|%s|%06d|%06d', '/interface/process/', 'GET', NULL, 0, NULL),
(40, 5, 'checkout_swap', '%d|%d', '/interface/process/', 'GET', NULL, 0, NULL),
(41, 5, 'callcharge_internal', '%05s|%05s|T%s|%s|%s|%s|IH', '/interface/process/', 'GET', NULL, 0, NULL),
(42, 5, 'callcharge_outgoing', '%05s|%05s|T%s|%s|%s|%s|0|O', '/interface/process/', 'GET', NULL, 0, NULL),
(43, 5, 'mlcsdn_checkin', '%d|%s|%s|%d|%s', '/interface/process/', 'GET', NULL, 0, NULL),
(44, 5, 'mlcsdn_checkout', '%d|%s|%d|%s', '/interface/process/', 'GET', NULL, 0, NULL),
(45, 5, 'checkoutnoguest_swap', '%d', '/interface/process/', 'GET', NULL, 0, NULL),
(46, 5, 'checkinnogvgg', '%d|%d|%s|%s|0|0|%s|%06d|%06d', '/interface/process/', 'GET', NULL, 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `parser`
--

CREATE TABLE `parser` (
  `id` int(10) UNSIGNED NOT NULL,
  `protocol_id` int(10) DEFAULT NULL,
  `name` varchar(30) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dest` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `checker` text COLLATE utf8_unicode_ci,
  `keys` text COLLATE utf8_unicode_ci,
  `state` int(2) DEFAULT '0' COMMENT '2: init, 1: handshake, 0: ready',
  `response` text COLLATE utf8_unicode_ci
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `parser`
--

INSERT INTO `parser` (`id`, `protocol_id`, `name`, `dest`, `checker`, `keys`, `state`, `response`) VALUES
(2, 1, 'linkstart', '', 'LS\\|DA(\\d{6})\\|TI(\\d{6})\\|', '', 1, NULL),
(3, 1, 'checkin', 'HOTLYNC', '^GI\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GA(\\d{6})\\|GD(\\d{6})\\|GS([YN])\\|$', '1 2 3 4 7 5 6', 0, NULL),
(4, 1, 'checkout', 'HOTLYNC', '^GO\\|RN(\\d+)\\|G#(\\d+)\\|GS([YN])\\|$', '', 0, NULL),
(5, 1, 'guestinfo', 'HOTLYNC', '^GC\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|$', '', 0, NULL),
(6, 1, 'roomchange', 'HOTLYNC', '^GC\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GA(\\d{6})\\|GD(\\d{6})\\|RO(\\d+)\\|GS([YN])\\|$', '1 8 2 7 3', 0, NULL),
(7, 1, 'donotdisturb', 'HOTLYNC', '^RE\\|RN(\\d+)\\|DN([YN])\\|$', '', 0, NULL),
(8, 1, 'classofservice', 'HOTLYNC', '^RE\\|RN(\\d+)\\|CS(\\d+)\\|$', '', 0, NULL),
(9, 1, 'messagelamp', 'HOTLYNC', '^RE\\|RN(\\d+)\\|ML([YN])\\|$', '', 0, NULL),
(10, 1, 'nightaudit', 'HOTLYNC', '^N(S|E)\\|DA(\\d{6})\\|TI(\\d{6})\\|$', '', 0, NULL),
(11, 1, 'wakeupcall', 'HOTLYNC', '^W(R|C)\\|RN(\\d+)\\|DA(\\d{6})\\|TI(\\d{6})\\|$', '', 0, NULL),
(12, 1, 'databaseswap', 'HOTLYNC', '^D(S|E)\\|DA(\\d{6})\\|TI(\\d{6})\\|$', '', 0, NULL),
(13, 5, 'checkin', 'PBX', '\\|CHK1\\|ET(\\d+)\\|', '', 0, NULL),
(14, 5, 'nameadd', 'PBX', '\\|NAM1\\|GN([a-z A-Z.0-9]+)\\|ET(\\d+)\\|', '', 0, NULL),
(15, 5, 'checkout', 'PBX', '\\|CHK0\\|ET(\\d+)\\|', '', 0, NULL),
(16, 5, 'namedelete', 'PBX', '\\|NAM3\\|GN([a-z A-Z.0-9]+)\\|ET(\\d+)\\|', '', 0, NULL),
(17, 5, 'namechange', 'PBX', '\\|NAM2\\|GN([a-z A-Z.0-9]+)\\|ET(\\d+)\\|', NULL, 0, NULL),
(18, 5, 'donotdisturb', 'PBX', '\\|DND(\\d)\\|ET(\\d+)\\|', NULL, 0, NULL),
(19, 5, 'classofservice', 'PBX', '\\|RST(\\d+)\\|ET(\\d+)\\|', NULL, 0, NULL),
(20, 5, 'messagelamp', 'PBX', '\\|MW(\\d)\\|ET(\\d+)\\|', NULL, 0, NULL),
(21, 5, 'callcharge', 'PMS', 'PS\\|RN(\\d+)\\|PT(C|Y)\\|DA(\\d{6})\\|TI(\\d{6})\\|P#(\\d+)\\|DD(\\d+)\\|DU(\\d+)\\|PC(I)\\|TA(\\d+)\\|SO(\\d+)', NULL, 0, NULL),
(22, 3, 'roomstatus', 'HOTLYNC', 'STS(\\d+) (\\d+)', '', 0, ''),
(23, 5, 'roomstatus', 'PMS', 'RE\\|RN(\\d+)\\|RS(\\d+)', '', 0, NULL),
(24, 5, 'itempost', 'PMS', 'PS\\|RN(\\d+)\\|PT([A-Z])\\|P#(\\d+)\\|M#(\\d+)\\|MA(\\d+)\\|DA(\\d{6})\\|TI(\\d{6})\\|SO(\\d+)', '', 0, NULL),
(25, 5, 'totalitempost', 'PMS', 'PS\\|RN(\\d+)\\|PT([A-Z])\\|P#(\\d+)\\|TA(\\d+)\\|SO([A-Z0-9]+)\\|DA(\\d{6})\\|TI(\\d{6})', '', 0, NULL),
(26, 1, 'linkalive', 'HOTLYNC', 'LA\\|DA(\\d{6})\\|TI(\\d{6})\\|', NULL, 0, NULL),
(27, 5, 'databaseswap', 'PMS', 'DR\\|DA(\\d{6})\\|TI(\\d{6})\\|', NULL, 0, NULL),
(28, 1, 'checkin_swap', 'HOTLYNC', '^GI\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GA(\\d{6})\\|GD(\\d{6})\\|GS([YN])\\|SF\\|$', '1 2 3 4 7 5 6', 0, NULL),
(29, 1, 'checkout_swap', 'HOTLYNC', '^GO\\|RN(\\d+)\\|G#(\\d+)\\|GS([YN])\\|SF\\|$', NULL, 0, NULL),
(30, 6, 'callcharge_incoming', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\S{1,}) (?:\\S{1,}) (\\d{1,}) (?:\\S{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(?:\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 7 5 4', 0, NULL),
(31, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\d{1,})(?:\\s{1,})(?:(?:9)?(\\d{1,4}))(?:\\s{1,})(?:\\S{1,}) (T\\S{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 5 4 6', 0, NULL),
(32, 6, 'callcharge_outgoing', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\d{1,})(?:\\s{1,})(?:(?:9)?(\\d{1,}))(?:\\s{1,})(?:\\S{1,}) (T\\S{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 5 4 6', 0, NULL),
(33, 6, 'callcharge_incoming', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\S{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(?:\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 7 5 4', 0, NULL),
(34, 1, 'guestinfo', 'HOTLYNC', '^GC\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GA(\\d+)\\|GD(\\d+)\\|$', NULL, 0, NULL),
(35, 1, 'mlcsdn_checkin', 'HOTLYNC', 'RE\\|RN(\\d+)\\|G#(\\d+)\\|ML([YN])\\|CS(\\d+)\\|DN([YN])\\|', NULL, 0, NULL),
(36, 1, 'mlcsdn_checkout', 'HOTLYNC', 'RE\\|RN(\\d+)\\|ML([YN])\\|CS(\\d+)\\|DN([YN])\\|', NULL, 0, NULL),
(37, 1, 'checkoutnoguest_swap', 'HOTLYNC', 'GO\\|RN(\\d+)\\|GS([YN])\\|SF\\|', NULL, 0, NULL),
(38, 1, 'checkinnogvgg', 'HOTLYNC', 'GI\\|RN(\\d+)\\|G#(\\d+)\\|GN([a-z A-Z.0-9]+)\\|GL([A-Z]{2})\\|GS([YN])\\|GA(\\d{6})\\|GD(\\d{6})\\|', NULL, 0, NULL),
(39, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) ATT(\\d)(?:\\D{1,})(\\S{1,4})(?:\\s{1,})(?:\\S{1,}) (\\S{1,})(?:\\s{1,})(?:\\d{1,})', '1 2 3 5 4 6', 0, NULL),
(40, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (?:\\D{1,})(\\d) (?:\\S{1,}) (\\d{1,})(?:\\s{1,})I(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 5 4 6 7', 0, NULL),
(41, 6, 'callcharge_incoming', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\S{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})T (?:\\d{1,})(?:\\s{1,})(?:\\d{1,})(?:\\s{1,})(\\d{1,}) (\\d{1,})', '1 2 3 6 5 4 7', 0, NULL),
(42, 6, 'callcharge_incoming', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\d{1,}) (?:\\S{1,}) (\\d{1,})(?:\\s{1,})I(?:\\S{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 5 4 6', 0, NULL),
(43, 6, 'callcharge_incoming', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (T\\d{1,})(?:\\*|\\s{1,})(?:\\d{1,}|\\*\\*\\*) (\\d{1,})(?:\\s{1,})(?:\\T{1,} (?:\\d{1,})|(?:\\S{1,}))(?:(?:\\d{1,})(?:\\s{1,})|(?:\\s{1,})|(?:X\\s{1,})(?:\\d{1,}))(?:\\d{1,})(?:\\s{1,})(?:\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(?:\\d{1,})', '1 2 3 6 5 4', 0, NULL),
(44, 6, 'callcharge_outgoing', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) ATT(\\d)(?:\\D{1,})(\\S{1,})(?:\\s{1,})(?:\\S{1,}) (\\S{1,})(?:\\s{1,})(?:\\d{1,})', '1 2 3 5 4 6', 0, NULL),
(45, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,4})(?:\\s{1,})(\\d{1,})(?:\\s{1,})T(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 5 4 3 6', 0, NULL),
(46, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\d{1,})(?:\\s{1,})(?:\\D{1,})(\\d{1,}) (?:\\S{1,})(?:\\s{1,})I (?:\\D{1,})(\\d{1,})(?:\\D{1,})(\\d{1,})', '1 2 3 6 4 5', 0, NULL),
(47, 1, 'postingacknowledge', 'HOTLYNC', '^PA\\|RN(\\d{1,})\\|AS(\\w{1,})\\|DA(\\d{1,})\\|TI(\\d{1,})\\|P#(\\d{1,})\\|$', '', 0, NULL),
(48, 6, 'callcharge_incoming', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (T\\d{1,}) (?:\\*|\\s{1,})(?:\\d{1,}) (\\d{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})ATT(\\d{1,})(?:\\s{1,})(?:\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 7 5 4', 0, NULL),
(49, 6, 'callcharge_incoming', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (T\\d{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})#(\\d{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})', '1 2 3 7 5 4', 0, NULL),
(50, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\d{1,})(?:\\s{1,})(?:\\S{1,}) (?:\\s{4}|\\d{4})(?:\\s{1,})I (\\d{1,})(?:\\D{1,})(\\d{1,})', '1 2 3 5 4 6', 0, NULL),
(51, 6, 'callcharge_outgoing', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})T(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 5 4 3 6', 0, NULL),
(52, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (T\\d{1,})(?:\\s{1,})(?:\\S{1,}) (\\d{1,}) (\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 6 5 4', 0, NULL),
(53, 1, 'messagelamp', 'HOTLYNC', '^RE\\|RN(\\d+)\\|(?:G#(?:\\d+)\\|)ML([YN])\\|$', '', 0, NULL),
(54, 6, 'callcharge_internal', 'HOTLYNC', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2}) (\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})I(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 6 4 5 7', 0, NULL),
(55, 6, 'callcharge_incoming', 'PBX', '(?:\\S{1,})?(\\d{2}\\/\\d{2}) (\\d{2}:\\d{2})(?:\\s{1,})(\\d{2}:\\d{2}:\\d{2})(?:\\s{1,})(\\S{1,})(?:\\s{1,})(?:\\S{1,}) (\\d{1,}) (?:\\S{1,})(?:\\s{1,})(?:\\S{1,})(?:\\s{1,})(?:\\d{1,})(?:\\s{1,})(\\d{1,})(?:\\s{1,})(\\d{1,})', '1 2 3 6 5 7', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `protocol`
--

CREATE TABLE `protocol` (
  `id` int(10) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8_unicode_ci DEFAULT NULL,
  `type` enum('PBX','PMS','HOTLYNC') COLLATE utf8_unicode_ci DEFAULT NULL,
  `checksum_flag` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No',
  `checksum_type` enum('BCC','CRC-32') COLLATE utf8_unicode_ci DEFAULT NULL,
  `checksum_pos` int(11) DEFAULT NULL,
  `handshake` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT NULL,
  `duplex` enum('Yes','No') COLLATE utf8_unicode_ci DEFAULT 'No'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `protocol`
--

INSERT INTO `protocol` (`id`, `name`, `type`, `checksum_flag`, `checksum_type`, `checksum_pos`, `handshake`, `duplex`) VALUES
(1, 'Opera', 'PMS', 'No', NULL, NULL, 'Yes', 'No'),
(2, 'Alcatel', 'PBX', 'No', NULL, NULL, 'No', 'Yes'),
(3, 'Mitel', 'PBX', 'No', NULL, 1, 'No', 'Yes'),
(4, 'Nortel', 'PBX', 'No', NULL, NULL, 'No', 'No'),
(5, 'Hotlync', 'HOTLYNC', 'No', NULL, NULL, 'No', 'No'),
(6, 'MitelCDR', 'PBX', 'No', NULL, NULL, 'No', 'No');

-- --------------------------------------------------------

--
-- Table structure for table `state_transition`
--

CREATE TABLE `state_transition` (
  `id` int(11) UNSIGNED NOT NULL,
  `cur_state` int(11) DEFAULT NULL,
  `receive` varchar(30) COLLATE utf8_unicode_ci DEFAULT '',
  `next_state` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `alarm`
--
ALTER TABLE `alarm`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channel`
--
ALTER TABLE `channel`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `channel_state`
--
ALTER TABLE `channel_state`
  ADD PRIMARY KEY (`id`,`duration`);

--
-- Indexes for table `formatter`
--
ALTER TABLE `formatter`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `parser`
--
ALTER TABLE `parser`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `protocol`
--
ALTER TABLE `protocol`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `state_transition`
--
ALTER TABLE `state_transition`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `alarm`
--
ALTER TABLE `alarm`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
--
-- AUTO_INCREMENT for table `channel`
--
ALTER TABLE `channel`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT for table `channel_state`
--
ALTER TABLE `channel_state`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
--
-- AUTO_INCREMENT for table `formatter`
--
ALTER TABLE `formatter`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
--
-- AUTO_INCREMENT for table `parser`
--
ALTER TABLE `parser`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;
--
-- AUTO_INCREMENT for table `protocol`
--
ALTER TABLE `protocol`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
--
-- AUTO_INCREMENT for table `state_transition`
--
ALTER TABLE `state_transition`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
