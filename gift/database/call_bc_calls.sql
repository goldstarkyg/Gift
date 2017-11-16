-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2
-- http://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: Jan 12, 2017 at 12:37 PM
-- Server version: 5.7.16-0ubuntu0.16.04.1
-- PHP Version: 7.0.8-0ubuntu0.16.04.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ennovatech`
--

-- --------------------------------------------------------

--
-- Table structure for table `call_bc_calls`
--

CREATE TABLE `call_bc_calls` (
  `id` int(11) NOT NULL,
  `extension_id` varchar(6) NOT NULL,
  `user_id` int(4) DEFAULT NULL,
  `call_date` date NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time DEFAULT NULL,
  `duration` int(11) NOT NULL COMMENT 'duration in seconds',
  `pulse` int(4) NOT NULL,
  `called_no` varchar(16) NOT NULL,
  `trunk` varchar(8) DEFAULT NULL,
  `transfer` varchar(256) DEFAULT NULL,
  `call_type` enum('Internal','Received','International','Local','Mobile','National','Toll Free','Missed') NOT NULL,
  `destination_id` int(4) NOT NULL,
  `carrier_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `hotel_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `tax` float(10,2) NOT NULL DEFAULT '0.00',
  `total_charges` float(10,2) NOT NULL DEFAULT '0.00',
  `classify` enum('Business','Personal','Unclassified') DEFAULT 'Unclassified',
  `approval` enum('Waiting For Approval','Pre-Approved','Approved','Rejected','Returned','Closed') DEFAULT NULL,
  `submitter` int(4) DEFAULT NULL COMMENT 'ID of user submitting for approval',
  `approver` int(4) DEFAULT NULL COMMENT 'User ID of approver',
  `comment` text,
  `guest_charge_rate_id` int(5) DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=latin1;

--
-- Dumping data for table `call_bc_calls`
--

INSERT INTO `call_bc_calls` (`id`, `extension_id`, `user_id`, `call_date`, `start_time`, `end_time`, `duration`, `pulse`, `called_no`, `trunk`, `transfer`, `call_type`, `destination_id`, `carrier_charges`, `hotel_charges`, `tax`, `total_charges`, `classify`, `approval`, `submitter`, `approver`, `comment`, `guest_charge_rate_id`) VALUES
(17, '200', NULL, '2017-01-12', '10:46:00', '10:56:05', 605, 0, '0010564100038', 'T310', '0', 'International', 16, 23.32, 93.28, 0.00, 116.60, 'Unclassified', NULL, NULL, NULL, NULL, 1),
(18, '199', NULL, '2017-01-11', '17:06:00', '17:07:05', 65, 0, '0010564100038', 'T310', '0', 'International', 16, 4.24, 16.96, 0.00, 21.20, 'Unclassified', NULL, NULL, NULL, NULL, 1),
(19, '199', NULL, '2017-01-12', '11:06:00', '11:07:05', 65, 0, '0010564100038', 'T310', '0', 'International', 16, 4.24, 16.96, 0.00, 21.20, 'Unclassified', NULL, NULL, NULL, NULL, 1),
(20, '201', NULL, '2017-01-12', '10:46:00', '10:56:05', 605, 0, '0010564100038', 'T310', '0', 'International', 16, 23.32, 93.28, 0.00, 116.60, 'Unclassified', NULL, NULL, NULL, NULL, 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `call_bc_calls`
--
ALTER TABLE `call_bc_calls`
  ADD PRIMARY KEY (`id`),
  ADD KEY `extension` (`extension_id`),
  ADD KEY `calldate` (`call_date`),
  ADD KEY `updatedatetime` (`called_no`,`call_type`,`duration`,`start_time`,`end_time`,`trunk`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `call_bc_calls`
--
ALTER TABLE `call_bc_calls`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
