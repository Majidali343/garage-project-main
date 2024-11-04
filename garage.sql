-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 03, 2024 at 06:38 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `garage`
--

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `contact` int(25) NOT NULL,
  `amount` int(255) NOT NULL,
  `location` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `vehicle`, `description`, `date`, `contact`, `amount`, `location`) VALUES
(1, 'mjadh', 'Forklift: 3-Ton, Forklift: 5-Ton', 'manjsieownsac', '2024-11-03', 2147483647, 123, 'q'),
(2, 'mansd', 'Crane: 25-Ton, Crane: 50-Ton', 'aurhej fbciew', '2024-11-03T10:44:47.592Z', 98765432, 1234, 'kajndkiwe');

-- --------------------------------------------------------

--
-- Table structure for table `employeesalaary`
--

CREATE TABLE `employeesalaary` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `salary` decimal(10,2) NOT NULL,
  `salary_status` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employeesalaary`
--

INSERT INTO `employeesalaary` (`id`, `name`, `job_title`, `date`, `salary`, `salary_status`) VALUES
(1, 'asdasd', 'Forklift operator', '2024-09-10', 34234.00, 'online'),
(3, 'tets name', 'Mechanic', '2024-09-13T07:05:57.000Z', 23427.00, 'online'),
(4, 'testing', 'Forklift operator', '2024-09-03T15:08:21.000Z', 2323.00, 'online'),
(5, 'sad', 'Forklift operator', '2024-09-12T15:29:47.000Z', 345.00, 'cash'),
(6, 'assad', 'Forklift operator', '2024-09-12', 234.00, 'cash'),
(7, 'BIN Shahid', 'Crane operator', '2024-10-20T14:42:54.000Z', 912.00, 'online'),
(8, 'bisadfe', 'Crane operator', '2024-10-20T15:01:03.522Z', 321.00, 'cash'),
(9, 'Ashbah', 'Crane operator', '2024-10-27T14:03:02.728Z', 1234.00, 'online'),
(10, 'adsf', 'Forklift operator', '2024-11-03T11:00:21.482Z', 1234.00, 'cash');

-- --------------------------------------------------------

--
-- Table structure for table `employee_task`
--

CREATE TABLE `employee_task` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(50) NOT NULL,
  `task` varchar(50) NOT NULL,
  `date` varchar(255) NOT NULL,
  `charges` varchar(255) NOT NULL,
  `work_hours` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_task`
--

INSERT INTO `employee_task` (`id`, `name`, `company`, `location`, `task`, `date`, `charges`, `work_hours`) VALUES
(5, 'ass', 'asdas', 'asasdasd', 'asdasd', '2024-11-03', '2309', 2),
(6, 'ass', 'asdas', 'asasdasd', 'asdasd', '2024-10-04', '24535', 0),
(7, 'ass', 'asdas', 'asasdasd', 'asdasa', '2024-09-13T15:11:25.000Z', '4245', 0),
(8, 'mnsh', 'qwwr', 'udnscn c', 'oiopi', '2024-11-03', '12', 2);

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `amount` int(50) NOT NULL,
  `payment_status` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `name`, `vehicle`, `description`, `date`, `amount`, `payment_status`) VALUES
(3, 'sdsd', 'Crane: 25-Ton, Forklift: 5-Ton', 'qweqwew', '2024-09-01T12:36:56.000Z', 344, 'Online'),
(5, 'aadad', 'Crane: 50-Ton, Forklift: 5-Ton', 'qwdasd', '2024-10-03', 234, 'Online'),
(6, 'nhjkma', 'Crane: 25-Ton, Crane: 50-Ton', 'poiuy', '2024-11-03T14:19:03.161Z', 985, 'Cash'),
(7, 'jkj', 'Crane: 25-Ton, Crane: 50-Ton', 'poiuyt', '2024-11-03T14:37:48.421Z', 976, 'Online');

-- --------------------------------------------------------

--
-- Table structure for table `income`
--

CREATE TABLE `income` (
  `id` int(11) NOT NULL,
  `name` varchar(11) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `salary` int(50) NOT NULL,
  `salary_status` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `income`
--

INSERT INTO `income` (`id`, `name`, `description`, `date`, `salary`, `salary_status`) VALUES
(1, 'asdasd', 'asdasd', '2024-09-03T12:50:51.000Z', 234234, 'online'),
(2, 'asdasd', 'asdasd', '2024-09-06', 234234, 'online'),
(4, 'asd', 'asdas', '2024-09-04T15:56:54.553Z', 342, 'cash'),
(5, 'asd', 'asdd', '2024-11-03T13:00:46.841Z', 33, 'cash');

-- --------------------------------------------------------

--
-- Table structure for table `invoice`
--

CREATE TABLE `invoice` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(50) NOT NULL,
  `Location` varchar(255) NOT NULL,
  `date` varchar(255) NOT NULL,
  `advance` int(50) NOT NULL,
  `amount` varchar(255) NOT NULL,
  `pending` int(50) NOT NULL,
  `project_status` varchar(20) NOT NULL,
  `time` time NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `invoice`
--

INSERT INTO `invoice` (`id`, `name`, `vehicle`, `description`, `Location`, `date`, `advance`, `amount`, `pending`, `project_status`, `time`) VALUES
(1, 'asd', 'Crane: 50-Ton', '234234', '234234', '2024-09-05T16:04:16.000Z', 23432, '123', 234234, 'Pending', '00:00:00'),
(2, 'Dive Sol', 'Forklift: 5-Ton', 'fix solutions', 'usa', '2024-11-03T15:05:27.461Z', 499, '3,000', 2501, 'Pending', '00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `pending`
--

CREATE TABLE `pending` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `location` varchar(50) NOT NULL,
  `date` varchar(255) NOT NULL,
  `advance` int(50) NOT NULL,
  `pending` int(50) NOT NULL,
  `total` int(50) NOT NULL,
  `payment_status` varchar(30) NOT NULL,
  `receiveDate` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pending`
--

INSERT INTO `pending` (`id`, `name`, `location`, `date`, `advance`, `pending`, `total`, `payment_status`, `receiveDate`) VALUES
(1, 'xccx', 'zxc', '2024-09-04T15:24:14.357Z', 234, 234, 234234, 'Successful', '2024-12-03'),
(2, 'xccx', 'zxc', '2024-09-04T15:24:14.357Z', 234, 234, 234234, 'Pending', '2024-11-11'),
(3, 'nmn', 'bjkkl', '2024-10-21T11:52:36.738Z', 654, 5678, 89786756, 'Pending', '2024-11-04'),
(4, 'bmxcnzm', 'asdmnsdk', '2024-11-03T15:00:57.848Z', 234245, 2434, 432, 'Pending', '2024-11-04'),
(5, 'assdsd', 'asadad', '2024-11-03T15:23:12.975Z', 13224, 12324, 243546, 'Pending', '2024-11-03'),
(6, 'sdansda', 'amdksnd1223', '2024-11-03', 21426, 13432, 124342, 'Successful', '2024-11-04');

-- --------------------------------------------------------

--
-- Table structure for table `vehicles`
--

CREATE TABLE `vehicles` (
  `id` int(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `vehicle` varchar(50) NOT NULL,
  `description` varchar(100) NOT NULL,
  `date` varchar(255) NOT NULL,
  `location` varchar(50) NOT NULL,
  `charges` int(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vehicles`
--

INSERT INTO `vehicles` (`id`, `name`, `vehicle`, `description`, `date`, `location`, `charges`) VALUES
(1, 'asdasd', 'Crane: 70-Ton', 'asdasd', '2024-09-05T15:21:45.000Z', 'asdasd', 324236),
(2, 'asdasd', 'Crane: 70-Ton', 'asdasd', '2024-09-05T15:21:45.000Z', 'asdasd', 324236),
(3, 'asdasd', 'Crane: 70-Ton', 'asdasd', '2024-09-05T15:21:45.000Z', 'asdasd', 324236),
(4, 'asdasd', 'Crane: 70-Ton', 'asdasd', '2024-09-05T15:21:45.000Z', 'asdasd', 324236),
(5, 'mjhikk', 'Forklift: 5-Ton, Forklift: 7-Ton', 'oiuee', '2024-11-03T14:58:43.392Z', 'iiwrn', 987);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employeesalaary`
--
ALTER TABLE `employeesalaary`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `employee_task`
--
ALTER TABLE `employee_task`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `income`
--
ALTER TABLE `income`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `invoice`
--
ALTER TABLE `invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pending`
--
ALTER TABLE `pending`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employeesalaary`
--
ALTER TABLE `employeesalaary`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `employee_task`
--
ALTER TABLE `employee_task`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `income`
--
ALTER TABLE `income`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `invoice`
--
ALTER TABLE `invoice`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `pending`
--
ALTER TABLE `pending`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
