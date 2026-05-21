-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2026 at 05:02 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.0.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `uav_id_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `dronecategories`
--

CREATE TABLE `dronecategories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dronecategories`
--

INSERT INTO `dronecategories` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'Nông nghiệp', 'UAV phục vụ phun thuốc, tưới tiêu nông nghiệp', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(2, 'Quay phim / Chụp ảnh', 'UAV camera chuyên nghiệp', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(3, 'Giải trí', 'UAV dành cho mục đích cá nhân, giải trí', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(4, 'Khảo sát địa hình', 'UAV đo đạc, lập bản đồ địa hình', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(5, 'Quân sự', 'UAV phục vụ mục đích quốc phòng', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(6, 'Tìm kiếm cứu nạn', 'UAV hỗ trợ tìm kiếm cứu hộ', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(7, 'Nông nghiệp', 'UAV phun thuốc, tưới tiêu', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(8, 'Quay phim / Chụp ảnh', 'UAV camera chuyên nghiệp', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(9, 'Giải trí', 'UAV cá nhân, giải trí', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(10, 'Khảo sát địa hình', 'UAV đo đạc, lập bản đồ', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(11, 'Quân sự', 'UAV quốc phòng', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(12, 'Tìm kiếm cứu nạn', 'UAV hỗ trợ cứu hộ', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(13, 'Vận chuyển hàng hóa', 'UAV giao nhận, logistics', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(14, 'Nông nghiệp', 'UAV phun thuốc, tưới tiêu', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(15, 'Quay phim / Chụp ảnh', 'UAV camera chuyên nghiệp', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(16, 'Giải trí', 'UAV cá nhân, giải trí', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(17, 'Khảo sát địa hình', 'UAV đo đạc, lập bản đồ', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(18, 'Quân sự', 'UAV quốc phòng', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(19, 'Tìm kiếm cứu nạn', 'UAV hỗ trợ cứu hộ', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(20, 'Vận chuyển hàng hóa', 'UAV giao nhận, logistics', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(21, 'Nông nghiệp', 'UAV phun thuốc, tưới tiêu', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(22, 'Quay phim / Chụp ảnh', 'UAV camera chuyên nghiệp', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(23, 'Giải trí', 'UAV cá nhân, giải trí', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(24, 'Khảo sát địa hình', 'UAV đo đạc, lập bản đồ', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(25, 'Quân sự', 'UAV quốc phòng', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(26, 'Tìm kiếm cứu nạn', 'UAV hỗ trợ cứu hộ', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(27, 'Vận chuyển hàng hóa', 'UAV giao nhận, logistics', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(28, 'Nông nghiệp', 'UAV phun thuốc, tưới tiêu', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(29, 'Quay phim / Chụp ảnh', 'UAV camera chuyên nghiệp', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(30, 'Giải trí', 'UAV cá nhân, giải trí', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(31, 'Khảo sát địa hình', 'UAV đo đạc, lập bản đồ', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(32, 'Quân sự', 'UAV quốc phòng', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(33, 'Tìm kiếm cứu nạn', 'UAV hỗ trợ cứu hộ', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(34, 'Vận chuyển hàng hóa', 'UAV giao nhận, logistics', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(35, 'Nông nghiệp', 'UAV phun thuốc, tưới tiêu', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(36, 'Quay phim / Chụp ảnh', 'UAV camera chuyên nghiệp', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(37, 'Giải trí', 'UAV cá nhân, giải trí', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(38, 'Khảo sát địa hình', 'UAV đo đạc, lập bản đồ', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(39, 'Quân sự', 'UAV quốc phòng', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(40, 'Tìm kiếm cứu nạn', 'UAV hỗ trợ cứu hộ', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(41, 'Vận chuyển hàng hóa', 'UAV giao nhận, logistics', '2026-05-19 20:32:18', '2026-05-19 20:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `drones`
--

CREATE TABLE `drones` (
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `manufacturer_id` int(11) DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `model_name` varchar(150) NOT NULL,
  `serial_number` varchar(100) NOT NULL,
  `weight` decimal(10,2) DEFAULT NULL COMMENT 'Trọng lượng (kg)',
  `max_flight_height` decimal(10,2) DEFAULT NULL COMMENT 'Độ cao bay tối đa (m)',
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `drones`
--

INSERT INTO `drones` (`id`, `owner_id`, `manufacturer_id`, `category_id`, `model_name`, `serial_number`, `weight`, `max_flight_height`, `images`, `createdAt`, `updatedAt`) VALUES
(1, 4, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1778143752089', -1.00, 120.00, '[]', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(2, 6, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1778143856804', 0.25, 120.00, '[]', '2026-05-07 15:50:56', '2026-05-07 15:50:56'),
(3, 8, NULL, NULL, 'DJI Air', 'SN-U1-1778144208228', NULL, NULL, '[]', '2026-05-07 15:56:48', '2026-05-07 15:56:49'),
(4, 8, NULL, NULL, 'Parrot', 'SN-U2-1778144208228', NULL, NULL, '[]', '2026-05-07 15:56:48', '2026-05-07 15:56:48'),
(5, 7, NULL, NULL, 'Del Test', 'SN-DEL-1778144209389', NULL, NULL, '[]', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(6, 10, NULL, NULL, 'DJI Air', 'SN-U1-1778145700207', NULL, NULL, '[]', '2026-05-07 16:21:40', '2026-05-07 16:21:41'),
(7, 10, NULL, NULL, 'Parrot', 'SN-U2-1778145700207', NULL, NULL, '[]', '2026-05-07 16:21:40', '2026-05-07 16:21:40'),
(8, 9, NULL, NULL, 'Del Test', 'SN-DEL-1778145701561', NULL, NULL, '[]', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(9, 11, NULL, NULL, 'Updated Model Name', 'SN-FV1-1778145769230', NULL, NULL, '[]', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(10, 12, NULL, NULL, 'Fix Drone 2', 'SN-FV2-1778145769230', NULL, NULL, '[]', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(11, 15, 1, 2, 'DJI Mini 3 Pro', 'DJI-SEED-001', 0.25, 120.00, '[]', '2026-05-07 16:29:59', '2026-05-07 16:29:59'),
(12, 15, 3, 1, 'Parrot Bluegrass Fields', 'PARROT-SEED-002', 1.90, 100.00, '[]', '2026-05-07 16:29:59', '2026-05-07 16:29:59'),
(13, 15, 12, 15, 'DJI Mini 3 Pro', 'DJI-001-2024', 0.25, 120.00, '[\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400\",\"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400\"]', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(14, 15, 12, 14, 'DJI Agras T40', 'DJI-002-2024', 24.80, 50.00, '[\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400\",\"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400\"]', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(15, 16, 14, 17, 'Parrot ANAFI USA', 'PAR-001-2024', 0.50, 150.00, '[\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400\",\"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400\"]', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(16, 16, 13, 15, 'Autel EVO II Pro', 'AUT-001-2024', 1.19, 100.00, '[\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400\",\"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400\"]', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(17, 17, 16, 19, 'Skydio X2', 'SKY-001-2024', 0.80, 200.00, '[\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400\",\"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400\"]', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(18, 17, 15, 16, 'Yuneec Typhoon H3', 'YUN-001-2024', 1.95, 80.00, '[\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400\",\"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400\"]', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(19, 15, 17, 20, 'Viettel VA-01', 'VTT-001-2024', 5.00, 60.00, '[\"https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400\",\"https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=400\"]', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(20, 19, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779197557682', 0.25, 120.00, '[]', '2026-05-19 20:32:37', '2026-05-19 20:32:37'),
(21, 21, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779197579641', 0.25, 120.00, '[]', '2026-05-19 20:32:59', '2026-05-19 20:32:59'),
(22, 23, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779197597127', 0.25, 120.00, '[]', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(23, 23, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779197597364', 0.25, 120.00, '[]', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(24, 25, NULL, NULL, 'DJI Air', 'SN-U1-1779197600069', NULL, NULL, '[]', '2026-05-19 20:33:20', '2026-05-19 20:33:21'),
(25, 25, NULL, NULL, 'Parrot', 'SN-U2-1779197600069', NULL, NULL, '[]', '2026-05-19 20:33:20', '2026-05-19 20:33:20'),
(26, 24, NULL, NULL, 'Del Test', 'SN-DEL-1779197601131', NULL, NULL, '[]', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(27, 27, NULL, NULL, 'DJI Air', 'SN-U1-1779197617284', NULL, NULL, '[]', '2026-05-19 20:33:37', '2026-05-19 20:33:39'),
(28, 27, NULL, NULL, 'Parrot', 'SN-U2-1779197617284', NULL, NULL, '[]', '2026-05-19 20:33:37', '2026-05-19 20:33:37'),
(29, 26, NULL, NULL, 'Revoke Test', 'SN-REV-1779197618688', NULL, NULL, '[]', '2026-05-19 20:33:38', '2026-05-19 20:33:38'),
(30, 26, NULL, NULL, 'Del Test', 'SN-DEL-1779197618882', NULL, NULL, '[]', '2026-05-19 20:33:38', '2026-05-19 20:33:38'),
(31, 28, NULL, NULL, 'Updated Model Name', 'SN-FV1-1779197622475', NULL, NULL, '[]', '2026-05-19 20:33:42', '2026-05-19 20:33:43'),
(32, 29, NULL, NULL, 'Fix Drone 2', 'SN-FV2-1779197622475', NULL, NULL, '[]', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(33, 31, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779198772887', 0.25, 120.00, '[]', '2026-05-19 20:52:52', '2026-05-19 20:52:52'),
(34, 31, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779198773217', 0.25, 120.00, '[]', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(35, 33, NULL, NULL, 'DJI Air', 'SN-U1-1779198778570', NULL, NULL, '[]', '2026-05-19 20:52:58', '2026-05-19 20:53:00'),
(36, 33, NULL, NULL, 'Parrot', 'SN-U2-1779198778570', NULL, NULL, '[]', '2026-05-19 20:52:58', '2026-05-19 20:52:58'),
(37, 32, NULL, NULL, 'Revoke Test', 'SN-REV-1779198779708', NULL, NULL, '[]', '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(38, 32, NULL, NULL, 'Del Test', 'SN-DEL-1779198779862', NULL, NULL, '[]', '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(39, 34, NULL, NULL, 'Updated Model Name', 'SN-FV1-1779198784441', NULL, NULL, '[]', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(40, 35, NULL, NULL, 'Fix Drone 2', 'SN-FV2-1779198784441', NULL, NULL, '[]', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(41, 37, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779199077583', 0.25, 120.00, '[]', '2026-05-19 20:57:57', '2026-05-19 20:57:57'),
(42, 37, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779199077966', 0.25, 120.00, '[]', '2026-05-19 20:57:57', '2026-05-19 20:57:57'),
(43, 39, NULL, NULL, 'DJI Air', 'SN-U1-1779199082184', NULL, NULL, '[]', '2026-05-19 20:58:02', '2026-05-19 20:58:03'),
(44, 39, NULL, NULL, 'Parrot', 'SN-U2-1779199082184', NULL, NULL, '[]', '2026-05-19 20:58:02', '2026-05-19 20:58:02'),
(45, 38, NULL, NULL, 'Revoke Test', 'SN-REV-1779199083216', NULL, NULL, '[]', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(46, 38, NULL, NULL, 'Del Test', 'SN-DEL-1779199083301', NULL, NULL, '[]', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(47, 40, NULL, NULL, 'Updated Model Name', 'SN-FV1-1779199085830', NULL, NULL, '[]', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(48, 41, NULL, NULL, 'Fix Drone 2', 'SN-FV2-1779199085830', NULL, NULL, '[]', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(49, 43, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779200555051', 0.25, 120.00, '[]', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(50, 43, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779200555379', 0.25, 120.00, '[]', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(51, 45, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779266161274', 0.25, 120.00, '[]', '2026-05-20 15:36:01', '2026-05-20 15:36:01'),
(52, 45, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779266161694', 0.25, 120.00, '[]', '2026-05-20 15:36:01', '2026-05-20 15:36:01'),
(53, 47, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779266374409', 0.25, 120.00, '[]', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(54, 47, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779266374645', 0.25, 120.00, '[]', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(55, 49, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779266720507', 0.25, 120.00, '[]', '2026-05-20 15:45:20', '2026-05-20 15:45:20'),
(56, 49, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779266720941', 0.25, 120.00, '[]', '2026-05-20 15:45:20', '2026-05-20 15:45:20'),
(57, 51, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779267006359', 0.25, 120.00, '[]', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(58, 51, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779267006559', 0.25, 120.00, '[]', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(59, 53, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779267972060', 0.25, 120.00, '[]', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(60, 53, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779267972329', 0.25, 120.00, '[]', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(61, 55, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779268606606', 0.25, 120.00, '[]', '2026-05-20 16:16:46', '2026-05-20 16:16:46'),
(62, 55, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779268606891', 0.25, 120.00, '[]', '2026-05-20 16:16:46', '2026-05-20 16:16:46'),
(63, 57, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779268634228', 0.25, 120.00, '[]', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(64, 57, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779268634482', 0.25, 120.00, '[]', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(65, 59, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779271197923', 0.25, 120.00, '[]', '2026-05-20 16:59:57', '2026-05-20 16:59:58'),
(66, 59, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779271198255', 0.25, 120.00, '[]', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(67, 61, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779271230732', 0.25, 120.00, '[]', '2026-05-20 17:00:30', '2026-05-20 17:00:30'),
(68, 61, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779271230986', 0.25, 120.00, '[]', '2026-05-20 17:00:30', '2026-05-20 17:00:30'),
(69, 63, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779373780501', 0.25, 120.00, '[]', '2026-05-21 21:29:40', '2026-05-21 21:29:40'),
(70, 63, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779373781203', 0.25, 120.00, '[]', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(71, 65, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779373799371', 0.25, 120.00, '[]', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(72, 65, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779373799628', 0.25, 120.00, '[]', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(73, 67, NULL, NULL, 'DJI Mini 3 Pro (Updated)', 'SN-TEST-1779373858659', 0.25, 120.00, '[]', '2026-05-21 21:30:58', '2026-05-21 21:30:58'),
(74, 67, NULL, NULL, 'DJI Mini Temp', 'SN-TEMP-1779373859140', 0.25, 120.00, '[]', '2026-05-21 21:30:59', '2026-05-21 21:30:59');

-- --------------------------------------------------------

--
-- Table structure for table `flightlogs`
--

CREATE TABLE `flightlogs` (
  `id` int(11) NOT NULL,
  `drone_id` int(11) NOT NULL,
  `permit_id` int(11) DEFAULT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime DEFAULT NULL,
  `max_altitude` decimal(10,2) DEFAULT NULL COMMENT 'Độ cao tối đa đạt được (m)',
  `distance` decimal(10,2) DEFAULT NULL COMMENT 'Khoảng cách bay (km)',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flightlogs`
--

INSERT INTO `flightlogs` (`id`, `drone_id`, `permit_id`, `start_time`, `end_time`, `max_altitude`, `distance`, `createdAt`, `updatedAt`) VALUES
(1, 9, NULL, '2026-05-07 16:22:49', NULL, 100.00, NULL, '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(2, 10, NULL, '2026-05-07 16:22:49', NULL, 50.00, NULL, '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(3, 13, NULL, '2026-05-05 14:39:18', '2026-05-05 16:39:18', 80.00, 2.50, '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(4, 13, NULL, '2026-05-03 12:39:18', '2026-05-03 14:39:18', 60.00, 1.80, '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(5, 14, NULL, '2026-05-06 16:39:18', '2026-05-06 18:39:18', 30.00, 5.20, '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(6, 15, NULL, '2026-05-04 16:39:18', '2026-05-04 18:39:18', 120.00, 8.10, '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(7, 17, NULL, '2026-05-07 06:39:18', '2026-05-07 07:39:18', 150.00, 3.00, '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(8, 13, NULL, '2026-05-17 18:22:55', '2026-05-17 20:22:55', 80.00, 2.50, '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(9, 13, NULL, '2026-05-15 16:22:55', '2026-05-15 18:22:55', 60.00, 1.80, '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(10, 14, NULL, '2026-05-18 20:22:55', '2026-05-18 22:22:55', 30.00, 5.20, '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(11, 15, NULL, '2026-05-16 20:22:55', '2026-05-16 22:22:55', 120.00, 8.10, '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(12, 17, NULL, '2026-05-19 10:22:55', '2026-05-19 11:22:55', 150.00, 3.00, '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(13, 13, NULL, '2026-05-17 18:24:54', '2026-05-17 20:24:54', 80.00, 2.50, '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(14, 13, NULL, '2026-05-15 16:24:54', '2026-05-15 18:24:54', 60.00, 1.80, '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(15, 14, NULL, '2026-05-18 20:24:54', '2026-05-18 22:24:54', 30.00, 5.20, '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(16, 15, NULL, '2026-05-16 20:24:54', '2026-05-16 22:24:54', 120.00, 8.10, '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(17, 17, NULL, '2026-05-19 10:24:54', '2026-05-19 11:24:54', 150.00, 3.00, '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(18, 13, NULL, '2026-05-17 18:32:18', '2026-05-17 20:32:18', 80.00, 2.50, '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(19, 13, NULL, '2026-05-15 16:32:18', '2026-05-15 18:32:18', 60.00, 1.80, '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(20, 14, NULL, '2026-05-18 20:32:18', '2026-05-18 22:32:18', 30.00, 5.20, '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(21, 15, NULL, '2026-05-16 20:32:18', '2026-05-16 22:32:18', 120.00, 8.10, '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(22, 17, NULL, '2026-05-19 10:32:18', '2026-05-19 11:32:18', 150.00, 3.00, '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(23, 31, NULL, '2026-05-19 20:33:43', NULL, 100.00, NULL, '2026-05-19 20:33:43', '2026-05-19 20:33:43'),
(24, 32, NULL, '2026-05-19 20:33:43', NULL, 50.00, NULL, '2026-05-19 20:33:43', '2026-05-19 20:33:43'),
(25, 39, NULL, '2026-05-19 20:53:04', NULL, 100.00, NULL, '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(26, 40, NULL, '2026-05-19 20:53:04', NULL, 50.00, NULL, '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(27, 47, NULL, '2026-05-19 20:58:06', NULL, 100.00, NULL, '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(28, 48, NULL, '2026-05-19 20:58:06', NULL, 50.00, NULL, '2026-05-19 20:58:06', '2026-05-19 20:58:06');

-- --------------------------------------------------------

--
-- Table structure for table `flightpermits`
--

CREATE TABLE `flightpermits` (
  `id` int(11) NOT NULL,
  `drone_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `zone_id` int(11) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `purpose` text DEFAULT NULL,
  `status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flightpermits`
--

INSERT INTO `flightpermits` (`id`, `drone_id`, `user_id`, `zone_id`, `start_time`, `end_time`, `purpose`, `status`, `createdAt`, `updatedAt`) VALUES
(1, 1, 4, 1, '2026-05-08 15:49:12', '2026-05-08 17:49:12', 'Quay phim test', 'approved', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(2, 1, 4, 1, '2020-01-01 15:00:00', '2020-01-01 17:00:00', 'Test', 'pending', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(3, 2, 6, 3, '2026-05-08 15:50:57', '2026-05-08 17:50:57', 'Quay phim test', 'approved', '2026-05-07 15:50:57', '2026-05-07 15:50:57'),
(6, 13, 15, 19, '2026-05-08 16:39:18', '2026-05-08 18:39:18', 'Quay phim sự kiện', 'approved', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(7, 13, 15, 20, '2026-05-09 16:39:18', '2026-05-09 18:39:18', 'Chụp ảnh du lịch', 'pending', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(8, 14, 15, 21, '2026-05-08 02:39:18', '2026-05-08 04:39:18', 'Phun thuốc nông nghiệp', 'approved', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(9, 15, 16, 17, '2026-05-10 16:39:18', '2026-05-10 18:39:18', 'Khảo sát địa hình', 'rejected', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(10, 17, 17, 21, '2026-05-07 21:39:18', '2026-05-07 23:39:18', 'Tìm kiếm cứu nạn', 'approved', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(11, 13, 15, 19, '2026-05-20 20:22:55', '2026-05-20 22:22:55', 'Quay phim sự kiện', 'approved', '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(12, 13, 15, 20, '2026-05-21 20:22:55', '2026-05-21 22:22:55', 'Chụp ảnh du lịch', 'pending', '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(13, 14, 15, 21, '2026-05-20 06:22:55', '2026-05-20 08:22:55', 'Phun thuốc nông nghiệp', 'approved', '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(14, 15, 16, 17, '2026-05-22 20:22:55', '2026-05-22 22:22:55', 'Khảo sát địa hình', 'rejected', '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(15, 17, 17, 21, '2026-05-20 01:22:55', '2026-05-20 03:22:55', 'Tìm kiếm cứu nạn', 'approved', '2026-05-19 20:22:55', '2026-05-19 20:22:55'),
(16, 13, 15, 19, '2026-05-20 20:24:54', '2026-05-20 22:24:54', 'Quay phim sự kiện', 'approved', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(17, 13, 15, 20, '2026-05-21 20:24:54', '2026-05-21 22:24:54', 'Chụp ảnh du lịch', 'approved', '2026-05-19 20:24:55', '2026-05-20 17:22:52'),
(18, 14, 15, 21, '2026-05-20 06:24:54', '2026-05-20 08:24:54', 'Phun thuốc nông nghiệp', 'approved', '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(19, 15, 16, 17, '2026-05-22 20:24:54', '2026-05-22 22:24:54', 'Khảo sát địa hình', 'rejected', '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(20, 17, 17, 21, '2026-05-20 01:24:54', '2026-05-20 03:24:54', 'Tìm kiếm cứu nạn', 'approved', '2026-05-19 20:24:55', '2026-05-19 20:24:55'),
(21, 13, 15, 19, '2026-05-20 20:32:18', '2026-05-20 22:32:18', 'Quay phim sự kiện', 'approved', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(22, 13, 15, 20, '2026-05-21 20:32:18', '2026-05-21 22:32:18', 'Chụp ảnh du lịch', 'approved', '2026-05-19 20:32:18', '2026-05-20 15:47:29'),
(23, 14, 15, 21, '2026-05-20 06:32:18', '2026-05-20 08:32:18', 'Phun thuốc nông nghiệp', 'approved', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(24, 15, 16, 17, '2026-05-22 20:32:18', '2026-05-22 22:32:18', 'Khảo sát địa hình', 'rejected', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(25, 17, 17, 21, '2026-05-20 01:32:18', '2026-05-20 03:32:18', 'Tìm kiếm cứu nạn', 'approved', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(26, 22, 23, 24, '2026-05-20 20:33:17', '2026-05-20 22:33:17', 'Quay phim test', 'approved', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(28, 33, 31, 30, '2026-05-20 20:52:53', '2026-05-20 22:52:53', 'Quay phim test', 'approved', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(30, 41, 37, 34, '2026-05-20 20:57:58', '2026-05-20 22:57:58', 'Quay phim test', 'approved', '2026-05-19 20:57:58', '2026-05-19 20:57:58'),
(32, 49, 43, 38, '2026-05-20 21:22:35', '2026-05-20 23:22:35', 'Quay phim test', 'approved', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(33, 51, 45, 39, '2026-05-21 15:36:01', '2026-05-21 17:36:01', 'Quay phim test', 'approved', '2026-05-20 15:36:01', '2026-05-20 15:36:01'),
(34, 53, 47, 40, '2026-05-21 15:39:34', '2026-05-21 17:39:34', 'Quay phim test', 'approved', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(35, 55, 49, 41, '2026-05-21 15:45:21', '2026-05-21 17:45:21', 'Quay phim test', 'approved', '2026-05-20 15:45:21', '2026-05-20 15:45:21'),
(36, 57, 51, 42, '2026-05-21 15:50:06', '2026-05-21 17:50:06', 'Quay phim test', 'approved', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(37, 59, 53, 43, '2026-05-21 16:06:12', '2026-05-21 18:06:12', 'Quay phim test', 'approved', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(38, 61, 55, 44, '2026-05-21 16:16:47', '2026-05-21 18:16:47', 'Quay phim test', 'approved', '2026-05-20 16:16:47', '2026-05-20 16:16:47'),
(39, 63, 57, 45, '2026-05-21 16:17:14', '2026-05-21 18:17:14', 'Quay phim test', 'approved', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(40, 65, 59, 46, '2026-05-21 16:59:58', '2026-05-21 18:59:58', 'Quay phim test', 'approved', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(41, 67, 61, 47, '2026-05-21 17:00:31', '2026-05-21 19:00:31', 'Quay phim test', 'approved', '2026-05-20 17:00:31', '2026-05-20 17:00:31'),
(42, 69, 63, 48, '2026-05-22 21:29:41', '2026-05-22 23:29:41', 'Quay phim test', 'approved', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(43, 71, 65, 49, '2026-05-22 21:29:59', '2026-05-22 23:29:59', 'Quay phim test', 'approved', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(44, 73, 67, 50, '2026-05-22 21:30:59', '2026-05-22 23:30:59', 'Quay phim test', 'approved', '2026-05-21 21:30:59', '2026-05-21 21:30:59');

-- --------------------------------------------------------

--
-- Table structure for table `flightzones`
--

CREATE TABLE `flightzones` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `zone_type` enum('forbidden','restricted','free') NOT NULL,
  `coordinates` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'GeoJSON polygon hoặc mảng tọa độ [lat, lng]' CHECK (json_valid(`coordinates`)),
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `zone_map_url` varchar(500) DEFAULT NULL COMMENT 'Ảnh bản đồ / sơ đồ khu vực bay'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `flightzones`
--

INSERT INTO `flightzones` (`id`, `name`, `zone_type`, `coordinates`, `description`, `createdAt`, `updatedAt`, `zone_map_url`) VALUES
(1, 'Khu vực test 1778143752334', 'free', NULL, 'Khu vực hạn chế test', '2026-05-07 15:49:12', '2026-05-07 15:49:12', NULL),
(2, 'Zone bad', '', NULL, NULL, '2026-05-07 15:49:12', '2026-05-07 15:49:12', NULL),
(3, 'Khu vực test 1778143857154', 'free', NULL, 'Khu vực hạn chế test', '2026-05-07 15:50:57', '2026-05-07 15:50:57', NULL),
(4, 'Zone-1778144208228', 'restricted', NULL, NULL, '2026-05-07 15:56:48', '2026-05-07 15:56:48', NULL),
(5, 'Forbidden-1778144209389', 'forbidden', NULL, NULL, '2026-05-07 15:56:49', '2026-05-07 15:56:49', NULL),
(6, 'Zone-1778145700207', 'restricted', NULL, NULL, '2026-05-07 16:21:40', '2026-05-07 16:21:40', NULL),
(7, 'Forbidden-1778145701561', 'forbidden', NULL, NULL, '2026-05-07 16:21:41', '2026-05-07 16:21:41', NULL),
(8, 'FV-Zone-1778145769230', 'restricted', NULL, NULL, '2026-05-07 16:22:49', '2026-05-07 16:22:49', NULL),
(9, 'Sân bay Nội Bài - Vùng cấm', 'forbidden', NULL, 'Vùng cấm bay xung quanh sân bay quốc tế Nội Bài (bán kính 8km)', '2026-05-07 16:29:59', '2026-05-07 16:29:59', NULL),
(10, 'Sân bay Tân Sơn Nhất - Vùng cấm', 'forbidden', NULL, 'Vùng cấm bay xung quanh sân bay Tân Sơn Nhất (bán kính 8km)', '2026-05-07 16:29:59', '2026-05-07 16:29:59', NULL),
(11, 'Khu vực Hồ Tây - Hạn chế', 'restricted', NULL, 'Khu vực bay hạn chế quanh Hồ Tây, cần xin phép', '2026-05-07 16:29:59', '2026-05-07 16:29:59', NULL),
(12, 'Công viên Thống Nhất - Tự do', 'free', NULL, 'Khu vực được phép bay tự do dưới 30m', '2026-05-07 16:29:59', '2026-05-07 16:29:59', NULL),
(13, 'Bãi biển Mỹ Khê - Tự do', 'free', NULL, 'Khu vực bay tự do tại bãi biển Mỹ Khê, Đà Nẵng', '2026-05-07 16:29:59', '2026-05-07 16:29:59', NULL),
(14, 'Sân bay Nội Bài', 'forbidden', NULL, 'Vùng cấm tuyệt đối, bán kính 8km', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(15, 'Sân bay Tân Sơn Nhất', 'forbidden', NULL, 'Vùng cấm tuyệt đối, bán kính 8km', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(16, 'Sân bay Đà Nẵng', 'forbidden', NULL, 'Vùng cấm tuyệt đối, bán kính 8km', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(17, 'Khu Hồ Tây - Hà Nội', 'restricted', NULL, 'Khu hạn chế, cần xin phép trước 24h', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(18, 'Khu Ba Đình - Hà Nội', 'restricted', NULL, 'Khu vực nhạy cảm chính trị', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(19, 'Công viên Thống Nhất', 'free', NULL, 'Bay tự do dưới 30m', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(20, 'Bãi biển Mỹ Khê', 'free', NULL, 'Khu vực bay tự do Đà Nẵng', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(21, 'Đồng bằng Cửu Long', 'restricted', NULL, 'Khu nông nghiệp, cần phép bay phun thuốc', '2026-05-07 16:39:18', '2026-05-07 16:39:18', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600'),
(22, 'Khu vực test 1779197558221', 'free', NULL, 'Khu vực hạn chế test', '2026-05-19 20:32:38', '2026-05-19 20:32:38', NULL),
(23, 'Khu vực test 1779197580050', 'free', NULL, 'Khu vực hạn chế test', '2026-05-19 20:33:00', '2026-05-19 20:33:00', NULL),
(24, 'Khu vực test 1779197597469', 'free', NULL, 'Khu vực hạn chế test', '2026-05-19 20:33:17', '2026-05-19 20:33:17', NULL),
(25, 'Zone-1779197600069', 'restricted', NULL, NULL, '2026-05-19 20:33:20', '2026-05-19 20:33:20', NULL),
(26, 'Forbidden-1779197601131', 'forbidden', NULL, NULL, '2026-05-19 20:33:21', '2026-05-19 20:33:21', NULL),
(27, 'Zone-1779197617284', 'restricted', NULL, NULL, '2026-05-19 20:33:37', '2026-05-19 20:33:37', NULL),
(28, 'Forbidden-1779197618882', 'forbidden', NULL, NULL, '2026-05-19 20:33:39', '2026-05-19 20:33:39', NULL),
(29, 'FV-Zone-1779197622475', 'restricted', NULL, NULL, '2026-05-19 20:33:42', '2026-05-19 20:33:42', NULL),
(30, 'Khu vực test 1779198773345', 'free', NULL, 'Khu vực hạn chế test', '2026-05-19 20:52:53', '2026-05-19 20:52:53', NULL),
(31, 'Zone-1779198778570', 'restricted', NULL, NULL, '2026-05-19 20:52:58', '2026-05-19 20:52:58', NULL),
(32, 'Forbidden-1779198779862', 'forbidden', NULL, NULL, '2026-05-19 20:52:59', '2026-05-19 20:52:59', NULL),
(33, 'FV-Zone-1779198784441', 'restricted', NULL, NULL, '2026-05-19 20:53:04', '2026-05-19 20:53:04', NULL),
(34, 'Khu vực test 1779199078133', 'free', NULL, 'Khu vực hạn chế test', '2026-05-19 20:57:58', '2026-05-19 20:57:58', NULL),
(35, 'Zone-1779199082184', 'restricted', NULL, NULL, '2026-05-19 20:58:02', '2026-05-19 20:58:02', NULL),
(36, 'Forbidden-1779199083301', 'forbidden', NULL, NULL, '2026-05-19 20:58:03', '2026-05-19 20:58:03', NULL),
(37, 'FV-Zone-1779199085830', 'restricted', NULL, NULL, '2026-05-19 20:58:06', '2026-05-19 20:58:06', NULL),
(38, 'Khu vực test 1779200555460', 'free', NULL, 'Khu vực hạn chế test', '2026-05-19 21:22:35', '2026-05-19 21:22:35', NULL),
(39, 'Khu vực test 1779266161824', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 15:36:01', '2026-05-20 15:36:01', NULL),
(40, 'Khu vực test 1779266374723', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 15:39:34', '2026-05-20 15:39:34', NULL),
(41, 'Khu vực test 1779266721109', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 15:45:21', '2026-05-20 15:45:21', NULL),
(42, 'Khu vực test 1779267006660', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 15:50:06', '2026-05-20 15:50:06', NULL),
(43, 'Khu vực test 1779267972437', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 16:06:12', '2026-05-20 16:06:12', NULL),
(44, 'Khu vực test 1779268606999', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 16:16:47', '2026-05-20 16:16:47', NULL),
(45, 'Khu vực test 1779268634570', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 16:17:14', '2026-05-20 16:17:14', NULL),
(46, 'Khu vực test 1779271198399', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 16:59:58', '2026-05-20 16:59:58', NULL),
(47, 'Khu vực test 1779271231079', 'free', NULL, 'Khu vực hạn chế test', '2026-05-20 17:00:31', '2026-05-20 17:00:31', NULL),
(48, 'Khu vực test 1779373781424', 'free', NULL, 'Khu vực hạn chế test', '2026-05-21 21:29:41', '2026-05-21 21:29:41', NULL),
(49, 'Khu vực test 1779373799739', 'free', NULL, 'Khu vực hạn chế test', '2026-05-21 21:29:59', '2026-05-21 21:29:59', NULL),
(50, 'Khu vực test 1779373859370', 'free', NULL, 'Khu vực hạn chế test', '2026-05-21 21:30:59', '2026-05-21 21:30:59', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `inspections`
--

CREATE TABLE `inspections` (
  `id` int(11) NOT NULL,
  `drone_id` int(11) NOT NULL,
  `inspector_id` int(11) NOT NULL COMMENT 'User with role=police',
  `inspection_date` date NOT NULL,
  `result` enum('pass','fail') NOT NULL,
  `notes` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `inspection_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Danh sách ảnh biên bản kiểm tra' CHECK (json_valid(`inspection_images`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inspections`
--

INSERT INTO `inspections` (`id`, `drone_id`, `inspector_id`, `inspection_date`, `result`, `notes`, `createdAt`, `updatedAt`, `inspection_images`) VALUES
(1, 2, 2, '2026-05-07', 'pass', 'Đã cập nhật ghi chú', '2026-05-07 15:50:57', '2026-05-07 15:50:57', NULL),
(2, 3, 2, '2026-05-07', 'pass', NULL, '2026-05-07 15:56:49', '2026-05-07 15:56:49', NULL),
(3, 6, 2, '2026-05-07', 'pass', NULL, '2026-05-07 16:21:41', '2026-05-07 16:21:41', NULL),
(4, 13, 13, '2026-05-06', 'pass', 'Máy bay đạt tiêu chuẩn, đầy đủ giấy tờ', '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400\"]'),
(5, 15, 14, '2026-05-06', 'fail', 'Camera chưa đăng ký, thiếu đèn hiệu', '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400\"]'),
(6, 17, 13, '2026-05-07', 'pass', 'Đạt, trang bị đầy đủ thiết bị cứu nạn', '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400\"]'),
(7, 13, 13, '2026-05-18', 'pass', 'Máy bay đạt tiêu chuẩn, đầy đủ giấy tờ', '2026-05-19 20:22:55', '2026-05-19 20:22:55', '[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400\"]'),
(8, 15, 14, '2026-05-18', 'fail', 'Camera chưa đăng ký, thiếu đèn hiệu', '2026-05-19 20:22:55', '2026-05-19 20:22:55', '[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400\"]'),
(9, 17, 13, '2026-05-19', 'pass', 'Đạt, trang bị đầy đủ thiết bị cứu nạn', '2026-05-19 20:22:55', '2026-05-19 20:22:55', '[\"https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=400\"]'),
(10, 20, 2, '2026-05-19', 'pass', 'Đã cập nhật ghi chú', '2026-05-19 20:32:38', '2026-05-19 20:32:38', '[]'),
(11, 21, 2, '2026-05-19', 'pass', 'Đã cập nhật ghi chú', '2026-05-19 20:33:00', '2026-05-19 20:33:00', '[]'),
(12, 22, 2, '2026-05-19', 'pass', 'Đã cập nhật ghi chú', '2026-05-19 20:33:17', '2026-05-19 20:33:17', '[]'),
(13, 24, 2, '2026-05-19', 'pass', NULL, '2026-05-19 20:33:21', '2026-05-19 20:33:21', '[]'),
(14, 27, 2, '2026-05-19', 'pass', NULL, '2026-05-19 20:33:39', '2026-05-19 20:33:39', '[]'),
(15, 33, 2, '2026-05-19', 'pass', 'Đã cập nhật ghi chú', '2026-05-19 20:52:53', '2026-05-19 20:52:53', '[]'),
(16, 35, 2, '2026-05-19', 'pass', NULL, '2026-05-19 20:53:00', '2026-05-19 20:53:00', '[]'),
(17, 41, 2, '2026-05-19', 'pass', 'Đã cập nhật ghi chú', '2026-05-19 20:57:58', '2026-05-19 20:57:58', '[]'),
(18, 43, 2, '2026-05-19', 'pass', NULL, '2026-05-19 20:58:03', '2026-05-19 20:58:03', '[]'),
(19, 49, 2, '2026-05-19', 'pass', 'Đã cập nhật ghi chú', '2026-05-19 21:22:35', '2026-05-19 21:22:35', '[]'),
(20, 51, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 15:36:02', '2026-05-20 15:36:02', '[]'),
(21, 53, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 15:39:34', '2026-05-20 15:39:35', '[]'),
(22, 55, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 15:45:21', '2026-05-20 15:45:21', '[]'),
(23, 57, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 15:50:06', '2026-05-20 15:50:06', '[]'),
(24, 59, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 16:06:12', '2026-05-20 16:06:12', '[]'),
(25, 61, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 16:16:47', '2026-05-20 16:16:47', '[]'),
(26, 63, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 16:17:14', '2026-05-20 16:17:14', '[]'),
(27, 65, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 16:59:58', '2026-05-20 16:59:58', '[]'),
(28, 67, 2, '2026-05-20', 'pass', 'Đã cập nhật ghi chú', '2026-05-20 17:00:31', '2026-05-20 17:00:31', '[]'),
(29, 69, 2, '2026-05-21', 'pass', 'Đã cập nhật ghi chú', '2026-05-21 21:29:42', '2026-05-21 21:29:42', '[]'),
(30, 71, 2, '2026-05-21', 'pass', 'Đã cập nhật ghi chú', '2026-05-21 21:29:59', '2026-05-21 21:30:00', '[]'),
(31, 73, 2, '2026-05-21', 'pass', 'Đã cập nhật ghi chú', '2026-05-21 21:30:59', '2026-05-21 21:31:00', '[]');

-- --------------------------------------------------------

--
-- Table structure for table `lookuphistory`
--

CREATE TABLE `lookuphistory` (
  `id` int(11) NOT NULL,
  `identification_code` varchar(50) NOT NULL COMMENT 'Mã định danh được tra cứu',
  `ip_address` varchar(50) DEFAULT NULL,
  `device_info` text DEFAULT NULL COMMENT 'User-Agent hoặc thông tin thiết bị',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `lookuphistory`
--

INSERT INTO `lookuphistory` (`id`, `identification_code`, `ip_address`, `device_info`, `createdAt`, `updatedAt`) VALUES
(1, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(2, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-07 15:50:57', '2026-05-07 15:50:57'),
(3, 'UAV-NOTEXIST-0000', '::1', 'node', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(4, 'UAV-FAKE-CHECK', '::1', 'node', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(5, 'UAV-NOTEXIST-0000', '::1', 'node', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(6, 'UAV-FAKE-CHECK', '::1', 'node', '2026-05-07 16:21:42', '2026-05-07 16:21:42'),
(7, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-19 20:32:38', '2026-05-19 20:32:38'),
(8, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-19 20:33:00', '2026-05-19 20:33:00'),
(9, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(10, 'UAV-NOTEXIST-0000', '::1', 'node', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(11, 'UAV-FAKE-CHECK', '::1', 'node', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(12, 'UAV-NOTEXIST-0000', '::1', 'node', '2026-05-19 20:33:39', '2026-05-19 20:33:39'),
(13, 'UAV-FAKE-CHECK', '::1', 'node', '2026-05-19 20:33:39', '2026-05-19 20:33:39'),
(14, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(15, 'UAV-NOTEXIST-0000', '::1', 'node', '2026-05-19 20:53:00', '2026-05-19 20:53:00'),
(16, 'UAV-FAKE-CHECK', '::1', 'node', '2026-05-19 20:53:00', '2026-05-19 20:53:00'),
(17, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-19 20:57:58', '2026-05-19 20:57:58'),
(18, 'UAV-NOTEXIST-0000', '::1', 'node', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(19, 'UAV-FAKE-CHECK', '::1', 'node', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(20, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(21, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 15:36:02', '2026-05-20 15:36:02'),
(22, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 15:39:35', '2026-05-20 15:39:35'),
(23, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 15:45:21', '2026-05-20 15:45:21'),
(24, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(25, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(26, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 16:16:47', '2026-05-20 16:16:47'),
(27, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(28, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(29, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-20 17:00:31', '2026-05-20 17:00:31'),
(30, 'UAV-INVALID-CODE', '::ffff:192.168.1.9', 'okhttp/4.12.0', '2026-05-20 17:22:39', '2026-05-20 17:22:39'),
(31, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-21 21:29:42', '2026-05-21 21:29:42'),
(32, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-21 21:30:00', '2026-05-21 21:30:00'),
(33, 'UAV-INVALID-CODE', '::1', 'node', '2026-05-21 21:31:00', '2026-05-21 21:31:00');

-- --------------------------------------------------------

--
-- Table structure for table `manufacturers`
--

CREATE TABLE `manufacturers` (
  `id` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `country` varchar(100) DEFAULT NULL,
  `support_email` varchar(100) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `manufacturers`
--

INSERT INTO `manufacturers` (`id`, `name`, `country`, `support_email`, `createdAt`, `updatedAt`) VALUES
(1, 'DJI', 'Trung Quốc', 'support@dji.com', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(2, 'Autel Robotics', 'Mỹ', 'support@autelrobotics.com', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(3, 'Parrot', 'Pháp', 'support@parrot.com', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(4, 'Yuneec', 'Trung Quốc', 'support@yuneec.com', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(5, 'Skydio', 'Mỹ', 'support@skydio.com', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(6, 'DJI', 'Trung Quốc', 'support@dji.com', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(7, 'Autel Robotics', 'Mỹ', 'support@autelrobotics.com', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(8, 'Parrot', 'Pháp', 'support@parrot.com', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(9, 'Yuneec', 'Trung Quốc', 'support@yuneec.com', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(10, 'Skydio', 'Mỹ', 'support@skydio.com', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(11, 'Viettel Aero', 'Việt Nam', 'aero@viettel.com.vn', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(12, 'DJI', 'Trung Quốc', 'support@dji.com', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(13, 'Autel Robotics', 'Mỹ', 'support@autelrobotics.com', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(14, 'Parrot', 'Pháp', 'support@parrot.com', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(15, 'Yuneec', 'Trung Quốc', 'support@yuneec.com', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(16, 'Skydio', 'Mỹ', 'support@skydio.com', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(17, 'Viettel Aero', 'Việt Nam', 'aero@viettel.com.vn', '2026-05-07 16:39:17', '2026-05-07 16:39:17'),
(18, 'DJI', 'Trung Quốc', 'support@dji.com', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(19, 'Autel Robotics', 'Mỹ', 'support@autelrobotics.com', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(20, 'Parrot', 'Pháp', 'support@parrot.com', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(21, 'Yuneec', 'Trung Quốc', 'support@yuneec.com', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(22, 'Skydio', 'Mỹ', 'support@skydio.com', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(23, 'Viettel Aero', 'Việt Nam', 'aero@viettel.com.vn', '2026-05-19 20:22:54', '2026-05-19 20:22:54'),
(24, 'DJI', 'Trung Quốc', 'support@dji.com', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(25, 'Autel Robotics', 'Mỹ', 'support@autelrobotics.com', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(26, 'Parrot', 'Pháp', 'support@parrot.com', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(27, 'Yuneec', 'Trung Quốc', 'support@yuneec.com', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(28, 'Skydio', 'Mỹ', 'support@skydio.com', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(29, 'Viettel Aero', 'Việt Nam', 'aero@viettel.com.vn', '2026-05-19 20:24:54', '2026-05-19 20:24:54'),
(30, 'DJI', 'Trung Quốc', 'support@dji.com', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(31, 'Autel Robotics', 'Mỹ', 'support@autelrobotics.com', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(32, 'Parrot', 'Pháp', 'support@parrot.com', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(33, 'Yuneec', 'Trung Quốc', 'support@yuneec.com', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(34, 'Skydio', 'Mỹ', 'support@skydio.com', '2026-05-19 20:32:18', '2026-05-19 20:32:18'),
(35, 'Viettel Aero', 'Việt Nam', 'aero@viettel.com.vn', '2026-05-19 20:32:18', '2026-05-19 20:32:18');

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT 0,
  `type` enum('system','registration','permit') NOT NULL DEFAULT 'system',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `is_read`, `type`, `createdAt`, `updatedAt`) VALUES
(1, 4, 'Hồ sơ được duyệt', 'Hồ sơ định danh máy bay #1 đã được phê duyệt', 0, 'registration', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(2, 4, 'Giấy phép bay được cấp', 'Yêu cầu cấp phép bay #1 đã được phê duyệt', 0, 'permit', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(3, 4, 'Ghi nhận vi phạm mới', 'Máy bay của bạn bị ghi nhận vi phạm: Bay vào vùng cấm. Mức phạt: 5000000 VND', 0, 'system', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(4, 4, 'Ghi nhận vi phạm mới', 'Máy bay của bạn bị ghi nhận vi phạm: Test. Mức phạt: -1000 VND', 0, 'system', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(5, 6, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-C13BAC4B-MOV8XX0X', 0, 'registration', '2026-05-07 15:50:57', '2026-05-07 15:50:57'),
(6, 6, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-C13BAC4B-MOV8XX0X của máy bay DJI Mini 3 Pro (Updated) đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-07 15:50:57', '2026-05-07 15:50:57'),
(7, 6, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1778143857154\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-07 15:50:57', '2026-05-07 15:50:57'),
(8, 6, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-07 15:50:57', '2026-05-07 15:50:57'),
(9, 6, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-07 15:50:57', '2026-05-07 15:50:57'),
(10, 7, '❌ Hồ sơ định danh bị từ chối', 'Hồ sơ định danh máy bay DJI Air bị từ chối. Lý do: Thiếu thông tin', 0, 'registration', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(11, 7, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Air đã được cấp mã định danh: UAV-CC2D5732-MOV95GUF', 0, 'registration', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(12, 7, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-CC2D5732-MOV95GUF của máy bay DJI Air đã bị thu hồi. Lý do: Vi phạm', 0, 'registration', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(13, 7, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Del Test đã được cấp mã định danh: UAV-21B07D05-MOV95GYB', 0, 'registration', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(14, 7, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Air bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 3.000.000 VND', 0, 'system', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(15, 7, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay trái phép\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-07 15:56:49', '2026-05-07 15:56:49'),
(16, 9, '❌ Hồ sơ định danh bị từ chối', 'Hồ sơ định danh máy bay DJI Air bị từ chối. Lý do: Thiếu thông tin', 0, 'registration', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(17, 9, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Air đã được cấp mã định danh: UAV-FF0C3BE4-MOVA1G3F', 0, 'registration', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(18, 9, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-FF0C3BE4-MOVA1G3F của máy bay DJI Air đã bị thu hồi. Lý do: Vi phạm', 0, 'registration', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(19, 9, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Del Test đã được cấp mã định danh: UAV-D4EBBE37-MOVA1GBJ', 0, 'registration', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(20, 9, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Air bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 3.000.000 VND', 0, 'system', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(21, 9, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay trái phép\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-07 16:21:41', '2026-05-07 16:21:41'),
(22, 2, 'Test', 'Nội dung test', 1, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(23, 1, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(24, 3, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(25, 4, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(26, 5, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(27, 6, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(28, 7, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(29, 8, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(30, 9, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(31, 10, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(32, 11, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(33, 12, 'Test', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(34, 2, 'Thông báo toàn hệ thống', 'Nội dung test', 1, 'system', '2026-05-07 16:22:49', '2026-05-19 20:33:42'),
(35, 1, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(36, 3, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(37, 4, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(38, 5, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(39, 6, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(40, 7, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(41, 8, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(42, 9, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(43, 10, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(44, 11, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(45, 12, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(46, 1, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(47, 3, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(48, 4, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(49, 5, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(50, 6, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(51, 7, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(52, 8, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(53, 9, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(54, 10, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(55, 11, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(56, 12, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(57, 11, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Fix Drone 1 đã được cấp mã định danh: UAV-D2D92DED-MOVA2WSH', 0, 'registration', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(58, 11, '⚠️ Bạn có vi phạm mới', 'Máy bay Updated Model Name bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 2.000.000 VND', 0, 'system', '2026-05-07 16:22:49', '2026-05-07 16:22:49'),
(59, 15, '✅ Hồ sơ DJI Mini 3 Pro được phê duyệt', 'Máy bay của bạn đã được cấp mã định danh UAV', 0, 'registration', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(60, 15, '⚠️ Cảnh báo vi phạm', 'Máy bay DJI Mini 3 Pro bị ghi nhận vượt độ cao quy định', 0, 'system', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(61, 16, '❌ Hồ sơ bị từ chối', 'Autel EVO II Pro: thiếu giấy phép nhập khẩu', 1, 'registration', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(62, 16, '✅ Đã nộp phạt thành công', 'Vi phạm bay đêm không phép đã được xác nhận hoàn thành', 1, 'system', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(63, 17, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại Đồng bằng Cửu Long đã được phê duyệt', 0, 'permit', '2026-05-07 16:39:18', '2026-05-07 16:39:18'),
(64, 3, '⚠️ Bạn có vi phạm mới', 'Máy bay Updated Model Name bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-07 16:53:49', '2026-05-07 16:53:49'),
(65, 3, '⚠️ Bạn có vi phạm mới', 'Máy bay Updated Model Name bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-07 17:08:13', '2026-05-07 17:08:13'),
(66, 3, '⚠️ Bạn có vi phạm mới', 'Máy bay Updated Model Name bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-07 17:08:15', '2026-05-07 17:08:15'),
(67, 19, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-13F7A2C9-MPCOADY3', 0, 'registration', '2026-05-19 20:32:38', '2026-05-19 20:32:38'),
(68, 19, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-13F7A2C9-MPCOADY3 của máy bay DJI Mini 3 Pro (Updated) đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-19 20:32:38', '2026-05-19 20:32:38'),
(69, 19, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-19 20:32:38', '2026-05-19 20:32:38'),
(70, 19, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:32:38', '2026-05-19 20:32:38'),
(71, 21, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-52807C01-MPCOAUTQ', 0, 'registration', '2026-05-19 20:32:59', '2026-05-19 20:32:59'),
(72, 21, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-52807C01-MPCOAUTQ của máy bay DJI Mini 3 Pro (Updated) đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-19 20:33:00', '2026-05-19 20:33:00'),
(73, 21, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-19 20:33:00', '2026-05-19 20:33:00'),
(74, 21, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:33:00', '2026-05-19 20:33:00'),
(75, 23, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-80ACC89B-MPCOB891', 0, 'registration', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(76, 23, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-EB9C3B4F-MPCOB8BL', 0, 'registration', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(77, 23, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-EB9C3B4F-MPCOB8BL của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(78, 23, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779197597469\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(79, 23, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(80, 23, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:33:17', '2026-05-19 20:33:17'),
(81, 24, '❌ Hồ sơ định danh bị từ chối', 'Hồ sơ định danh máy bay DJI Air bị từ chối. Lý do: Thiếu thông tin', 0, 'registration', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(82, 24, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Air đã được cấp mã định danh: UAV-DD8F6964-MPCOBB4N', 0, 'registration', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(83, 24, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-DD8F6964-MPCOBB4N của máy bay DJI Air đã bị thu hồi. Lý do: Vi phạm', 0, 'registration', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(84, 24, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Del Test đã được cấp mã định danh: UAV-8D074506-MPCOBB7Y', 0, 'registration', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(85, 24, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Air bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 3.000.000 VND', 0, 'system', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(86, 24, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay trái phép\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:33:21', '2026-05-19 20:33:21'),
(87, 26, '❌ Hồ sơ định danh bị từ chối', 'Hồ sơ định danh máy bay DJI Air bị từ chối. Lý do: Thiếu thông tin', 0, 'registration', '2026-05-19 20:33:38', '2026-05-19 20:33:38'),
(88, 26, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Air đã được cấp mã định danh: UAV-30A07A80-MPCOBON4', 0, 'registration', '2026-05-19 20:33:38', '2026-05-19 20:33:38'),
(89, 26, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Revoke Test đã được cấp mã định danh: UAV-69752F07-MPCOBOSF', 0, 'registration', '2026-05-19 20:33:38', '2026-05-19 20:33:38'),
(90, 26, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-69752F07-MPCOBOSF của máy bay Revoke Test đã bị thu hồi. Lý do: Vi phạm', 0, 'registration', '2026-05-19 20:33:38', '2026-05-19 20:33:38'),
(91, 26, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Del Test đã được cấp mã định danh: UAV-6C6BD96D-MPCOBOY7', 0, 'registration', '2026-05-19 20:33:39', '2026-05-19 20:33:39'),
(92, 26, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Air bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 3.000.000 VND', 0, 'system', '2026-05-19 20:33:39', '2026-05-19 20:33:39'),
(93, 26, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay trái phép\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:33:39', '2026-05-19 20:33:39'),
(94, 2, 'Test', 'Nội dung test', 1, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(95, 13, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(96, 14, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(97, 1, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(98, 3, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(99, 4, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(100, 5, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(101, 6, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(102, 7, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(103, 8, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(104, 9, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(105, 10, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(106, 11, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(107, 12, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(108, 15, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(109, 16, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(110, 17, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(111, 18, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(112, 19, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(113, 20, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(114, 21, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(115, 22, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(116, 23, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(117, 24, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(118, 25, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(119, 26, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(120, 27, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(121, 28, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(122, 29, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(123, 2, 'Thông báo toàn hệ thống', 'Nội dung test', 1, 'system', '2026-05-19 20:33:42', '2026-05-19 20:53:04'),
(124, 13, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(125, 14, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(126, 1, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(127, 3, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(128, 4, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(129, 5, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(130, 6, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(131, 7, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(132, 8, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(133, 9, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(134, 10, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(135, 11, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(136, 12, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(137, 15, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(138, 16, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(139, 17, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(140, 18, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(141, 19, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(142, 20, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(143, 21, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(144, 22, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(145, 23, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(146, 24, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(147, 25, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(148, 26, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(149, 27, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(150, 28, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(151, 29, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(152, 1, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(153, 3, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(154, 4, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(155, 5, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(156, 6, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(157, 7, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(158, 8, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(159, 9, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(160, 10, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(161, 11, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(162, 12, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(163, 15, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(164, 16, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(165, 17, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(166, 18, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(167, 19, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(168, 20, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(169, 21, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(170, 22, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(171, 23, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(172, 24, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(173, 25, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(174, 26, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(175, 27, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(176, 28, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(177, 29, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(178, 28, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Fix Drone 1 đã được cấp mã định danh: UAV-0723FDCD-MPCOBS0I', 0, 'registration', '2026-05-19 20:33:42', '2026-05-19 20:33:42'),
(179, 28, '⚠️ Bạn có vi phạm mới', 'Máy bay Updated Model Name bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 2.000.000 VND', 0, 'system', '2026-05-19 20:33:43', '2026-05-19 20:33:43'),
(180, 31, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-C18CA281-MPCP0FI8', 0, 'registration', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(181, 31, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-05251AC0-MPCP0FM1', 0, 'registration', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(182, 31, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-05251AC0-MPCP0FM1 của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(183, 31, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779198773345\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(184, 31, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(185, 31, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:52:53', '2026-05-19 20:52:53'),
(186, 32, '❌ Hồ sơ định danh bị từ chối', 'Hồ sơ định danh máy bay DJI Air bị từ chối. Lý do: Thiếu thông tin', 0, 'registration', '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(187, 32, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Air đã được cấp mã định danh: UAV-1C068D52-MPCP0KJ3', 0, 'registration', '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(188, 32, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Revoke Test đã được cấp mã định danh: UAV-01B80BB5-MPCP0KMR', 0, 'registration', '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(189, 32, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-01B80BB5-MPCP0KMR của máy bay Revoke Test đã bị thu hồi. Lý do: Vi phạm', 0, 'registration', '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(190, 32, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Del Test đã được cấp mã định danh: UAV-F2DF377B-MPCP0KQY', 0, 'registration', '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(191, 32, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Air bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 3.000.000 VND', 0, 'system', '2026-05-19 20:53:00', '2026-05-19 20:53:00'),
(192, 32, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay trái phép\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:53:00', '2026-05-19 20:53:00'),
(193, 2, 'Test', 'Nội dung test', 1, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(194, 13, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(195, 14, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(196, 1, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(197, 3, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(198, 4, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(199, 5, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(200, 6, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(201, 7, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(202, 8, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(203, 9, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(204, 10, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(205, 11, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(206, 12, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(207, 15, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(208, 16, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(209, 17, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(210, 18, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(211, 19, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(212, 20, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(213, 21, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(214, 22, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(215, 23, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(216, 24, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(217, 25, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(218, 26, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(219, 27, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(220, 28, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(221, 29, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(222, 30, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(223, 31, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(224, 32, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(225, 33, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(226, 34, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(227, 35, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(228, 2, 'Thông báo toàn hệ thống', 'Nội dung test', 1, 'system', '2026-05-19 20:53:04', '2026-05-19 20:58:06'),
(229, 13, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(230, 14, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(231, 1, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(232, 3, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(233, 4, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(234, 5, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(235, 6, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(236, 7, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(237, 8, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(238, 9, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(239, 10, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(240, 11, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(241, 12, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(242, 15, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(243, 16, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(244, 17, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(245, 18, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(246, 19, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(247, 20, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(248, 21, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(249, 22, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(250, 23, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(251, 24, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(252, 25, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(253, 26, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(254, 27, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(255, 28, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(256, 29, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(257, 30, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(258, 31, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(259, 32, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(260, 33, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(261, 34, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(262, 35, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(263, 1, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(264, 3, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(265, 4, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(266, 5, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(267, 6, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(268, 7, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(269, 8, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(270, 9, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(271, 10, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(272, 11, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(273, 12, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(274, 15, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(275, 16, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(276, 17, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(277, 18, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(278, 19, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(279, 20, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(280, 21, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(281, 22, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(282, 23, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(283, 24, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(284, 25, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(285, 26, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(286, 27, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(287, 28, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(288, 29, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(289, 30, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(290, 31, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(291, 32, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(292, 33, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(293, 34, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(294, 35, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(295, 34, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Fix Drone 1 đã được cấp mã định danh: UAV-6622EA6D-MPCP0OK4', 0, 'registration', '2026-05-19 20:53:04', '2026-05-19 20:53:04'),
(296, 34, '⚠️ Bạn có vi phạm mới', 'Máy bay Updated Model Name bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 2.000.000 VND', 0, 'system', '2026-05-19 20:53:05', '2026-05-19 20:53:05'),
(297, 37, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-8F724698-MPCP6YN7', 0, 'registration', '2026-05-19 20:57:57', '2026-05-19 20:57:57'),
(298, 37, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-57643213-MPCP6YRP', 0, 'registration', '2026-05-19 20:57:58', '2026-05-19 20:57:58'),
(299, 37, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-57643213-MPCP6YRP của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-19 20:57:58', '2026-05-19 20:57:58'),
(300, 37, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779199078133\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-19 20:57:58', '2026-05-19 20:57:58'),
(301, 37, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-19 20:57:58', '2026-05-19 20:57:58'),
(302, 37, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:57:58', '2026-05-19 20:57:58'),
(303, 38, '❌ Hồ sơ định danh bị từ chối', 'Hồ sơ định danh máy bay DJI Air bị từ chối. Lý do: Thiếu thông tin', 0, 'registration', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(304, 38, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Air đã được cấp mã định danh: UAV-33FA70BD-MPCP72QU', 0, 'registration', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(305, 38, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Revoke Test đã được cấp mã định danh: UAV-A6170280-MPCP72SY', 0, 'registration', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(306, 38, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-A6170280-MPCP72SY của máy bay Revoke Test đã bị thu hồi. Lý do: Vi phạm', 0, 'registration', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(307, 38, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Del Test đã được cấp mã định danh: UAV-85A8129D-MPCP72VA', 0, 'registration', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(308, 38, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Air bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 3.000.000 VND', 0, 'system', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(309, 38, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay trái phép\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 20:58:03', '2026-05-19 20:58:03'),
(310, 2, 'Test', 'Nội dung test', 1, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(311, 13, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(312, 14, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(313, 1, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(314, 3, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(315, 4, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(316, 5, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(317, 6, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(318, 7, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(319, 8, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(320, 9, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(321, 10, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(322, 11, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(323, 12, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(324, 15, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(325, 16, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(326, 17, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(327, 18, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(328, 19, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(329, 20, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(330, 21, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(331, 22, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(332, 23, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(333, 24, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(334, 25, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(335, 26, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(336, 27, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(337, 28, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(338, 29, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(339, 30, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(340, 31, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(341, 32, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(342, 33, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(343, 34, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(344, 35, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(345, 36, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(346, 37, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(347, 38, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(348, 39, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(349, 40, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(350, 41, 'Test', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(351, 2, 'Thông báo toàn hệ thống', 'Nội dung test', 1, 'system', '2026-05-19 20:58:06', '2026-05-20 15:44:05'),
(352, 13, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(353, 14, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(354, 1, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(355, 3, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(356, 4, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(357, 5, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(358, 6, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(359, 7, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(360, 8, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(361, 9, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(362, 10, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(363, 11, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(364, 12, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(365, 15, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(366, 16, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(367, 17, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(368, 18, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(369, 19, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(370, 20, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(371, 21, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(372, 22, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(373, 23, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(374, 24, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(375, 25, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(376, 26, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(377, 27, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(378, 28, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(379, 29, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(380, 30, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(381, 31, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(382, 32, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(383, 33, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(384, 34, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(385, 35, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(386, 36, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(387, 37, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(388, 38, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(389, 39, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(390, 40, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(391, 41, 'Thông báo toàn hệ thống', 'Nội dung test', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(392, 1, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(393, 3, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(394, 4, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(395, 5, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(396, 6, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(397, 7, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(398, 8, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(399, 9, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(400, 10, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(401, 11, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(402, 12, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(403, 15, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(404, 16, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(405, 17, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(406, 18, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(407, 19, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(408, 20, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(409, 21, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(410, 22, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(411, 23, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(412, 24, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(413, 25, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(414, 26, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(415, 27, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(416, 28, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(417, 29, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(418, 30, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(419, 31, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(420, 32, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(421, 33, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(422, 34, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(423, 35, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(424, 36, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(425, 37, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(426, 38, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(427, 39, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(428, 40, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(429, 41, 'Gửi user', 'Nội dung', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(430, 40, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Fix Drone 1 đã được cấp mã định danh: UAV-BAFAB0FE-MPCP752Q', 0, 'registration', '2026-05-19 20:58:06', '2026-05-19 20:58:06');
INSERT INTO `notifications` (`id`, `user_id`, `title`, `content`, `is_read`, `type`, `createdAt`, `updatedAt`) VALUES
(431, 40, '⚠️ Bạn có vi phạm mới', 'Máy bay Updated Model Name bị ghi nhận vi phạm: \"Bay trái phép\". Mức phạt: 2.000.000 VND', 0, 'system', '2026-05-19 20:58:06', '2026-05-19 20:58:06'),
(432, 43, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-130341E3-MPCQ2MNU', 0, 'registration', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(433, 43, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-5D1E7CC9-MPCQ2MQC', 0, 'registration', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(434, 43, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-5D1E7CC9-MPCQ2MQC của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(435, 43, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779200555460\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(436, 43, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(437, 43, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-19 21:22:35', '2026-05-19 21:22:35'),
(438, 45, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-C7D4F7A1-MPDT4SQW', 0, 'registration', '2026-05-20 15:36:01', '2026-05-20 15:36:01'),
(439, 45, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-227E91E5-MPDT4SWA', 0, 'registration', '2026-05-20 15:36:01', '2026-05-20 15:36:01'),
(440, 45, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-227E91E5-MPDT4SWA của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 15:36:01', '2026-05-20 15:36:01'),
(441, 45, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779266161824\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 15:36:01', '2026-05-20 15:36:01'),
(442, 45, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 15:36:02', '2026-05-20 15:36:02'),
(443, 45, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 15:36:02', '2026-05-20 15:36:02'),
(444, 47, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-C3FC4742-MPDT9D5C', 0, 'registration', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(445, 47, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-07F0A239-MPDT9D79', 0, 'registration', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(446, 47, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-07F0A239-MPDT9D79 của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(447, 47, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779266374723\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(448, 47, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(449, 47, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 15:39:34', '2026-05-20 15:39:34'),
(450, 49, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-C5DF9636-MPDTGSBF', 0, 'registration', '2026-05-20 15:45:20', '2026-05-20 15:45:20'),
(451, 49, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-F92AD5FA-MPDTGSFR', 0, 'registration', '2026-05-20 15:45:21', '2026-05-20 15:45:21'),
(452, 49, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-F92AD5FA-MPDTGSFR của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 15:45:21', '2026-05-20 15:45:21'),
(453, 49, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779266721109\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 15:45:21', '2026-05-20 15:45:21'),
(454, 49, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 15:45:21', '2026-05-20 15:45:21'),
(455, 49, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 15:45:21', '2026-05-20 15:45:21'),
(456, 15, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Bãi biển Mỹ Khê\" cho máy bay DJI Mini 3 Pro đã được phê duyệt', 0, 'permit', '2026-05-20 15:47:29', '2026-05-20 15:47:29'),
(457, 51, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-9CB02C35-MPDTMWQM', 0, 'registration', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(458, 51, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-B4F0E454-MPDTMWSG', 0, 'registration', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(459, 51, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-B4F0E454-MPDTMWSG của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(460, 51, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779267006660\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(461, 51, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(462, 51, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 15:50:06', '2026-05-20 15:50:06'),
(463, 53, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-89001643-MPDU7LWO', 0, 'registration', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(464, 53, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-2274F192-MPDU7LZV', 0, 'registration', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(465, 53, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-2274F192-MPDU7LZV của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(466, 53, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779267972437\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(467, 53, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(468, 53, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 16:06:12', '2026-05-20 16:06:12'),
(469, 55, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-B503B416-MPDUL7JU', 0, 'registration', '2026-05-20 16:16:46', '2026-05-20 16:16:46'),
(470, 55, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-A62244BF-MPDUL7MH', 0, 'registration', '2026-05-20 16:16:46', '2026-05-20 16:16:46'),
(471, 55, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-A62244BF-MPDUL7MH của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 16:16:46', '2026-05-20 16:16:46'),
(472, 55, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779268606999\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 16:16:47', '2026-05-20 16:16:47'),
(473, 55, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 16:16:47', '2026-05-20 16:16:47'),
(474, 55, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 16:16:47', '2026-05-20 16:16:47'),
(475, 57, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-77858184-MPDULSUF', 0, 'registration', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(476, 57, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-1CC58608-MPDULSWM', 0, 'registration', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(477, 57, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-1CC58608-MPDULSWM của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(478, 57, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779268634570\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(479, 57, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(480, 57, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 16:17:14', '2026-05-20 16:17:14'),
(481, 16, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay Parrot ANAFI USA đã được cấp mã định danh: UAV-8AB49F0E-MPDW1L5U', 0, 'registration', '2026-05-20 16:57:30', '2026-05-20 16:57:30'),
(482, 59, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-BD9903BD-MPDW4R1V', 0, 'registration', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(483, 59, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-31954599-MPDW4R51', 0, 'registration', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(484, 59, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-31954599-MPDW4R51 của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(485, 59, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779271198399\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(486, 59, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(487, 59, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 16:59:58', '2026-05-20 16:59:58'),
(488, 61, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-E12193BA-MPDW5GBB', 0, 'registration', '2026-05-20 17:00:30', '2026-05-20 17:00:30'),
(489, 61, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-50488E70-MPDW5GDV', 0, 'registration', '2026-05-20 17:00:31', '2026-05-20 17:00:31'),
(490, 61, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-50488E70-MPDW5GDV của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-20 17:00:31', '2026-05-20 17:00:31'),
(491, 61, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779271231079\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-20 17:00:31', '2026-05-20 17:00:31'),
(492, 61, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-20 17:00:31', '2026-05-20 17:00:31'),
(493, 61, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-20 17:00:31', '2026-05-20 17:00:31'),
(494, 15, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Bãi biển Mỹ Khê\" cho máy bay DJI Mini 3 Pro đã được phê duyệt', 0, 'permit', '2026-05-20 17:22:52', '2026-05-20 17:22:52'),
(495, 63, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-83295FFB-MPFL7GBU', 0, 'registration', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(496, 63, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-DFD3CDF0-MPFL7GNS', 0, 'registration', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(497, 63, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-DFD3CDF0-MPFL7GNS của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(498, 63, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779373781424\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(499, 63, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(500, 63, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-21 21:29:41', '2026-05-21 21:29:41'),
(501, 65, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-81FEEE90-MPFL7US0', 0, 'registration', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(502, 65, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-4E446E38-MPFL7UUN', 0, 'registration', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(503, 65, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-4E446E38-MPFL7UUN của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(504, 65, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779373799739\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(505, 65, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(506, 65, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-21 21:29:59', '2026-05-21 21:29:59'),
(507, 67, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini 3 Pro (Updated) đã được cấp mã định danh: UAV-CA275E41-MPFL94M2', 0, 'registration', '2026-05-21 21:30:59', '2026-05-21 21:30:59'),
(508, 67, '✅ Hồ sơ định danh được phê duyệt', 'Máy bay DJI Mini Temp đã được cấp mã định danh: UAV-E72BF66B-MPFL94SP', 0, 'registration', '2026-05-21 21:30:59', '2026-05-21 21:30:59'),
(509, 67, '⚠️ Mã định danh bị thu hồi', 'Mã định danh UAV-E72BF66B-MPFL94SP của máy bay DJI Mini Temp đã bị thu hồi. Lý do: Vi phạm quy định bay', 0, 'registration', '2026-05-21 21:30:59', '2026-05-21 21:30:59'),
(510, 67, '✅ Giấy phép bay được cấp', 'Giấy phép bay tại khu vực \"Khu vực test 1779373859370\" cho máy bay DJI Mini 3 Pro (Updated) đã được phê duyệt', 0, 'permit', '2026-05-21 21:30:59', '2026-05-21 21:30:59'),
(511, 67, '⚠️ Bạn có vi phạm mới', 'Máy bay DJI Mini 3 Pro (Updated) bị ghi nhận vi phạm: \"Bay vào vùng cấm\". Mức phạt: 5.000.000 VND', 0, 'system', '2026-05-21 21:30:59', '2026-05-21 21:30:59'),
(512, 67, '✅ Xác nhận đã nộp phạt', 'Vi phạm \"Bay vào vùng cấm\" đã được xác nhận hoàn thành nộp phạt', 0, 'system', '2026-05-21 21:30:59', '2026-05-21 21:30:59');

-- --------------------------------------------------------

--
-- Table structure for table `otpcodes`
--

CREATE TABLE `otpcodes` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `otp_code` varchar(10) NOT NULL,
  `expires_at` datetime NOT NULL,
  `type` enum('register','forgot_password') NOT NULL,
  `is_used` tinyint(1) NOT NULL DEFAULT 0,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `otpcodes`
--

INSERT INTO `otpcodes` (`id`, `user_id`, `otp_code`, `expires_at`, `type`, `is_used`, `createdAt`, `updatedAt`) VALUES
(1, 2, '458526', '2026-05-07 16:06:48', 'forgot_password', 1, '2026-05-07 15:56:48', '2026-05-07 15:56:48'),
(2, 2, '685647', '2026-05-07 16:31:40', 'forgot_password', 1, '2026-05-07 16:21:40', '2026-05-07 16:21:40'),
(3, 2, '783131', '2026-05-19 20:43:20', 'forgot_password', 1, '2026-05-19 20:33:20', '2026-05-19 20:33:20'),
(4, 2, '282467', '2026-05-19 20:43:37', 'forgot_password', 1, '2026-05-19 20:33:37', '2026-05-19 20:33:38'),
(5, 2, '536837', '2026-05-19 21:02:59', 'forgot_password', 1, '2026-05-19 20:52:59', '2026-05-19 20:52:59'),
(6, 2, '378819', '2026-05-19 21:08:02', 'forgot_password', 1, '2026-05-19 20:58:02', '2026-05-19 20:58:02');

-- --------------------------------------------------------

--
-- Table structure for table `registrations`
--

CREATE TABLE `registrations` (
  `id` int(11) NOT NULL,
  `drone_id` int(11) NOT NULL,
  `identification_code` varchar(50) DEFAULT NULL COMMENT 'Mã định danh / biển số UAV',
  `qr_code_url` varchar(500) DEFAULT NULL,
  `status` enum('pending','approved','rejected','revoked') NOT NULL DEFAULT 'pending',
  `issue_date` date DEFAULT NULL,
  `admin_note` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `documents` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Hồ sơ / giấy tờ đính kèm (URL ảnh)' CHECK (json_valid(`documents`)),
  `signature` text DEFAULT NULL COMMENT 'Chữ ký điện tử của cán bộ phê duyệt (Base64)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registrations`
--

INSERT INTO `registrations` (`id`, `drone_id`, `identification_code`, `qr_code_url`, `status`, `issue_date`, `admin_note`, `createdAt`, `updatedAt`, `documents`, `signature`) VALUES
(1, 1, 'UAV-95344CBA', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALQAAAC0CAYAAAA9zQYyAAAAAklEQVR4AewaftIAAAdTSURBVO3BQW4ER3AAwcwG///ltI518QCDXVJyuyLsH6x1icNaFzmsdZHDWhc5rHWRw1oXOax1kcNaFzmsdZHDWhc5rHWRw1oXOax1kcNaFzmsdZHDWhf54UMqf6niDZWp4g2VT1RMKk8qJpUnFZPKVPFEZaqYVP5SxScOa13ksNZFDmtd5Icvq/gmlScqb6g8qZgq3lB5UjGpTCpvqEwVk8pU8YmKb1L5psNaFzmsdZHDWhf54ZepvFHxiYpvUnlSMVVMKlPFVDGpTBWTylQxqfwllTcqftNhrYsc1rrIYa2L/HAZlTcqJpUnFU9U3lCZKt5QmSomlf9PDmtd5LDWRQ5rXeSH/+MqJpWpYlKZVKaKSWVSmSq+SWWqmComlScVk8rNDmtd5LDWRQ5rXeSHX1bxX1', 'revoked', '2026-05-07', 'Vi phạm quy định bay', '2026-05-07 15:49:12', '2026-05-07 15:49:12', NULL, NULL),
(2, 2, 'UAV-C13BAC4B-MOV8XX0X', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHxSURBVO3BQZIcu7YkQTdI7X/L1hzinwmSIZF1ideuin+kquoCK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xE9eBOS/pGYCcqLmCSCTmhMgOzUTkEnNDsikZgdkUvMEkBM1bwGyUzMBeYOaTwD5W2qeAHKi5hNA/ktq3rBSVXWJlaqqS6xUVV1iparqEj/5MjXfAuREzQ7IBGRSswPyBJBJzQ7IpGYC8rfUvEXNtwB5g5oJyBNAJjU7ICdAJjUTkJ2aCcgb1HwLkG9Zqaq6xEpV1SVWqqou8ZNfBuQJNW9Q84SaCcgE5ATIE2p2QCYgJ2qeADKpeYOaCciJmifU7I', 'revoked', '2026-05-07', 'Vi phạm quy định bay', '2026-05-07 15:50:56', '2026-05-07 15:50:57', NULL, NULL),
(3, 3, NULL, NULL, 'rejected', NULL, 'Thiếu thông tin', '2026-05-07 15:56:49', '2026-05-07 15:56:49', NULL, NULL),
(4, 3, 'UAV-CC2D5732-MOV95GUF', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABINSURBVO3BQZIcu7YkQTdI7X/L1hzinwmSIZHFi9euin+kquoCK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xE9eBORfUvMEkBM1TwA5UfMtQJ5Q8wSQt6g5AfIGNROQEzVPAJnU7ICcqPkEkH9JzRtWqqousVJVdYmVqqpLrFRVXeInX6bmW4D8LSCTmhMgk5oJyE7NBGQH5BNqdkBO1HwCyA7IE2omIE8A2amZ1OyATGr+JSCfALJTMwF5g5pvAfItK1VVl1ipqrrESlXVJX7yy4A8oeZbgExqdmomIJOav6VmAjIB2ak5AfIJNf+rgJyomdRMQH4LkN8E5Ak1v2', 'revoked', '2026-05-07', 'Vi phạm', '2026-05-07 15:56:49', '2026-05-07 15:56:49', NULL, NULL),
(5, 5, 'UAV-21B07D05-MOV95GYB', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHYSURBVO3BQZIcu7YkQTdI7X/L1hyizwTJkMjixfuuin+kquoCK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xE9eBORfUnMC5BNqdkAmNROQv6XmE0DeoOZbgExqToBMav4WkE+oOQEyqXkDkEnNDsiJmk8A+ZfUvGGlquoSK1VVl1ipqrrESlXVJX7yZWq+Bcgb1DwBZFKzAzKp2QF5Qs0JkE8AeYOaEyCfALJTMwE5UTMB2amZ1ExAdmpOgDyhZgLyBjXfAuRbVqqqLrFSVXWJlaqqS/zklwF5Qs23AHkLkBMgJ2omIDsgTwCZ1JwA+a9RcwLkLWp+C5DfBOQJNb', 'approved', '2026-05-07', NULL, '2026-05-07 15:56:49', '2026-05-07 15:56:49', NULL, NULL),
(6, 6, NULL, NULL, 'rejected', NULL, 'Thiếu thông tin', '2026-05-07 16:21:41', '2026-05-07 16:21:41', NULL, NULL),
(7, 6, 'UAV-FF0C3BE4-MOVA1G3F', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABH+SURBVO3BQZIcu7YkQTdI7X/L1neIPhMkQyKLxPuuiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYEyCfU7IB8Qs0OyFvU/CkgT6h5Ashb1JwAeYOaCcgTat4A5ETNJ4D8TWresFJVdYmVqqpLrFRVXWKlquoSP/kyNd8C5A1qJiA7NZ8AslMzAXkCyE7NBGSnZgIyqdkBeULNBOQJIDs1k5odkEnNt6h5AsiJmgnIG9R8C5BvWamqusRKVdUlVqqqLvGTXwbkCTXfAmRSswPyCTU7IJOaEyCTmhM1OyCTmreoOVGzA/IJNd8CZKdmUjMB+V', 'revoked', '2026-05-07', 'Vi phạm', '2026-05-07 16:21:41', '2026-05-07 16:21:41', NULL, NULL),
(8, 8, 'UAV-D4EBBE37-MOVA1GBJ', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHYSURBVO3BQZIcu7YkQTcI979law7RZ4KskMjixfuuin+lquoCK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xJ+8CMi/pOYJICdqngByouYTQHZqJiAnaiYgT6g5AbJT8wkgOzUTkJ2aCci3qDkB8i1qPgHkX1LzhpWqqkusVFVdYqWq6hIrVVWX+JMvU/MtQE6AnKiZgOyAvEXNCZBJzQ7IpGYHZAIyqdkBmdRMQHZqToB8Qs0b1ExATtRMQHZAJjU7NZ8AslMzAXmDmm8B8i0rVVWXWKmqusRKVdUl/uSXAXlCzRvUTEAmNTsgn1BzAmSn5hNAvgXITs0n1LxBzQ', 'approved', '2026-05-07', NULL, '2026-05-07 16:21:41', '2026-05-07 16:21:41', NULL, NULL),
(9, 9, 'UAV-D2D92DED-MOVA2WSH', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHZSURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dW8Y+J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qXkLkBM1bwAyqZmAnKjZAZnUnAD5hJoTIDs1bwGyUzMB+ZvUTEDeoOYTQP4mNW9Yqaq6xEpV1SVWqqousVJVdYmffJmabwFyAuREzYmaTwD5U2omIE8A2amZgExqTtRMQHZqToB8Qs0b1ExATtRMQHZqJiAnaiYgOzUTkDeo+RYg37JSVXWJlaqqS6xUVV3iJ78MyBNq3qBmAnIC5BNqdkDeomYH5Ak1E5CdmgnIpOZEzQ7IpOYEyKRmB2', 'approved', '2026-05-07', NULL, '2026-05-07 16:22:49', '2026-05-07 16:22:49', NULL, NULL),
(10, 13, 'UAV-4F05E218-MOVAO3QB', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAAAo0SURBVO3BQZLrUHIEwYwy3v/KqW+mLd4CFIRmzYQ7/SeStMBEkpaYSNISE0laYiJJS0wkaYmJJC0xkaQlJpK0xESSlphI0hITSVpiIklLTCRpiYkkLTGRpCUmkrTERJKWmEjSEhNJWmIiSUtMJGmJiSQtMZGkJSaStMREkpaYSNISn7wIyFZtcxeQJ7XNCZA3tM0JkJO2uQLkSW1zAuSkbf4akK3a5g0TSVpiIklLTCRpiYkkLTGRpCUmkrTEJz+ibf4akCe1zVva5klArgD5BpArbXMC5C4gJ21zAuRK2/yCtvlrQP7aRJKWmEjSEhNJWmIiSUtMJGmJiSQt8ckCQJ7UNk8CcqVtToCctM0VIN9om7va5klArgA5aZsTIFfa5gTIW4BcaZsnAXlS2/yyiSQtMZ', 'approved', '2026-05-07', NULL, '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1568667256549-094345857637?w=400\"]', NULL),
(11, 14, 'UAV-F5FB3844-MOVAO3SM', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAAApGSURBVO3BQW7E2JIEwfCE7n/lGAEfmBXfgtUES9ntZvRXJGmBiSQtMZGkJSaStMREkpaYSNISE0laYiJJS0wkaYmJJC0xkaQlJpK0xESSlphI0hITSVpiIklLTCRpiYkkLTGRpCUmkrTERJKWmEjSEhNJWmIiSUtMJGmJiSQtMZGkJX7yIiBbtc0JkLva5gTIlbY5AXLSNleAfFvbPAnIW9rmBMiVtjkBslXbvGEiSUtMJGmJiSQtMZGkJSaStMREkpb4yR/RNt8G5EltcwLkpG2+rW2uAPlE21wB8om2uattngTkpG2e1DbfBuTbJpK0xESSlphI0hITSVpiIklLTCRpiZ8sAORJbfMGICdt86S2OQFypW3uapu/rG1OgDypbb4NyJPa5i+bSNISE0laYiJJS0', 'approved', '2026-05-07', NULL, '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1568667256549-094345857637?w=400\"]', NULL),
(12, 15, 'UAV-8AB49F0E-MPDW1L5U', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAAA/3SURBVO3BQY5ju5YEwXAi979l7xoKpwciiCtl8r8ww39SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hI/eRiQv0LNBOQdNROQSc0EZFKzA8ik5hSQV2p2ADmlZgeQSc0OIO+omYBMaiYgO9TsAHJKzQkgf4Wap6xUVV1iparqEitVVZdYqaq6xE++QM2nAXkKkEnNBGRSc0rNKSAngExqdgDZAeRJaiYg76jZoWYCMgHZoWYHkAnIpOaEmk8D8kkrVVWXWKmqusRKVdUlVqqqLvGTXwLklJqnqJmA7FCzA8ikZgJySs07QCY1p9RMQHao2QHkKUAmNR', 'approved', '2026-05-20', NULL, '2026-05-07 16:39:18', '2026-05-20 16:57:30', '[\"https://images.unsplash.com/photo-1568667256549-094345857637?w=400\"]', NULL),
(13, 16, NULL, NULL, 'rejected', NULL, 'Thiếu giấy phép nhập khẩu', '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1568667256549-094345857637?w=400\"]', NULL),
(14, 17, 'UAV-2E121220-MOVAO3TZ', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAAAokSURBVO3BUY7D2LIkwYiE9r9lnwbeL88AVBMsZV83K/+IJC0wkaQlJpK0xESSlphI0hITSVpiIklLTCRpiYkkLTGRpCUmkrTERJKWmEjSEhNJWmIiSUtMJGmJiSQtMZGkJSaStMREkpaYSNISE0laYiJJS0wkaYmJJC0xkaQlJpK0xCcvaputgJy0zZOAvKFt7gJy0jYnQK60zZOAnLTNCZC/1jZbAXnDRJKWmEjSEhNJWmIiSUtMJGmJiSQt8cmPAPLX2uYtQO5qm7cAuQvISdvcBeQtbXMFyEnbnAB5EpC/1jZ/bSJJS0wkaYmJJC0xkaQlJpK0xESSlvhkgbZ5EpAnAbmrbU6A3AXkr7XNCZArbXPSNidA7gJyV9v8srZ5EpBfNpGkJSaStMREkpaYSNISE0', 'approved', '2026-05-07', NULL, '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1568667256549-094345857637?w=400\"]', NULL),
(15, 20, 'UAV-13F7A2C9-MPCOADY3', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIYSURBVO3BQZIcu7YkQTdI7X/L1neIfyZIhkQWideuiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpGYC8oSaHZBJzQRkp+YJICdqToBMaiYgOzUTkBM1J0CeUPObgJyoeQLIG9R8AsjfpOYNK1VVl1ipqrrESlXVJVaqqi7xky9T8y1ATtS8Qc0n1OyAPKFmArIDMqn5FjVvUDMBmdTsgJyo+QSQEzVvADKpmYDs1ExA3qDmW4B8y0pV1SVWqqousVJVdYmf/DIgT6h5A5BPqDkB8oSaHZAn1ExAnlBzAmRSswNyomZSMwHZqTkB8k1AdmomID', 'revoked', '2026-05-19', 'Vi phạm quy định bay', '2026-05-19 20:32:37', '2026-05-19 20:32:38', '[]', NULL),
(16, 21, 'UAV-52807C01-MPCOAUTQ', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABG6SURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dW8Y+J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qZmA7NRMQCY1TwDZqfmbgExqJiA7NROQEzUnQCY1/xogJ2qeAPIGNZ8A8jepecNKVdUlVqqqLrFSVXWJlaqqS/zky9R8C5ATNSdqJiA7NROQSc0OyBNqToBMar5FzRNAngDyp9R8AsiJmhMgT6iZgOzUTEDeoOZbgHzLSlXVJVaqqi6xUlV1iZ/8MiBPqHkDkCeATGqeULMD8gkgOzUnaj6hZgdkUnMCZFLzBjVPADlR8wkgOzUTkJ2aJ4', 'revoked', '2026-05-19', 'Vi phạm quy định bay', '2026-05-19 20:32:59', '2026-05-19 20:33:00', '[]', NULL),
(17, 22, 'UAV-80ACC89B-MPCOB891', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABH5SURBVO3BQY4kuZYEQVMi739lnVoSb8Moh0d28Y+J4B+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ZMXAfkvqTkB8hY1J0CeUPMEkJ2aTwDZqXkCyKTmCSB/S80TQCY1J0AmNW8AcqLmE0D+S2resFJVdYmVqqpLrFRVXWKlquoSP/kyNd8C5A1qJiA7NU+omYB8i5odkEnNCZAn1ExAnlBzAuQNaiYgk5o3AJnU7NRMQN6g5luAfMtKVdUlVqqqLrFSVXWJn/wyIE+o+RYgk5odkLeo2QGZgJyomYDs1HyTmh2QSc0JkCfUPAHkRM0EZKfmBMgngPyXgD', 'approved', '2026-05-19', NULL, '2026-05-19 20:33:17', '2026-05-19 20:33:17', '[]', NULL),
(18, 23, 'UAV-EB9C3B4F-MPCOB8BL', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHQSURBVO3BUY4kuxYcwXCi979l1/0kDgSxJpHVM3wKM/xPqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JjUnQJ5QMwF5Qs0JkEnNCZDfpOYEyE7NJ4CcqNkBmdRMQHZqPgFkp+YEyCfU7ICcqPkEkL9JzRtWqqousVJVdYmVqqpLrFRVXeInX6bmW4C8Qc0Tap4AslPzCSAnanZAPqHmBMgEZKfmBMgTaiYgJ0CeADKpOQHyBjUTkDeo+RYg37JSVXWJlaqqS6xUVV3iJ78MyBNqngCyUzMBmdR8i5odkEnNE0BO1JwAeQLIpOYEyKRmB2RSswMyqT', 'revoked', '2026-05-19', 'Vi phạm quy định bay', '2026-05-19 20:33:17', '2026-05-19 20:33:17', '[]', NULL),
(19, 24, NULL, NULL, 'rejected', NULL, 'Thiếu thông tin', '2026-05-19 20:33:20', '2026-05-19 20:33:21', '[]', NULL),
(20, 24, 'UAV-DD8F6964-MPCOBB4N', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIlSURBVO3BQZIcu7YkQTdI7X/L1hyizwTJkMjixfuuin+kquoCK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xE9eBORfUjMBOVEzAdmpeQLIpOYEyKTmW4Ds1ExATtRMQE7UnACZ1OyAfELNDsik5gTIpOYEyBvUfALIv6TmDStVVZdYqaq6xEpV1SVWqqou8ZMvU/MtQE7U7IBMQCY1OyCTmgnITs0JkCeAnKj5hJoTNW9QMwF5AsiJmgnITs23AJnUTEB2aiYgb1DzLUC+ZaWq6hIrVVWXWKmqusRPfhmQJ9S8Qc0E5ETNBGRScwJkp+YJNROQHZBPqPktQD6h5m', 'revoked', '2026-05-19', 'Vi phạm', '2026-05-19 20:33:21', '2026-05-19 20:33:21', '[]', NULL),
(21, 26, 'UAV-8D074506-MPCOBB7Y', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGjSURBVO3BQZIcu7YkQTdI7X/L1ncIOYNGMiSySLzvqvifVFVdYKWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl/jJi4D8TWpOgDyhZgJyomYCslMzAXlCzRNA/iY1E5CdmgnIt6g5ATKp2QH5hJodkBM1nwDyN6l5w0pV1SVWqqousVJVdYmVqqpL/OTL1HwLkBMgOzVvUfMGIN8C5BNqToCcqHkCyKRmB2RSswPyCTU7IBOQSc1OzQTkCSA7NROQN6j5FiDfslJVdYmVqqpLrFRVXeInvwzIE2qeUPMGIJ9Qc6JmB2RSMwHZqXkLkDcAeULNG9RMQE7UfALIiZoTIJ', 'approved', '2026-05-19', NULL, '2026-05-19 20:33:21', '2026-05-19 20:33:21', '[]', NULL),
(22, 27, NULL, NULL, 'rejected', NULL, 'Thiếu thông tin', '2026-05-19 20:33:38', '2026-05-19 20:33:38', '[]', NULL),
(23, 27, 'UAV-30A07A80-MPCOBON4', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHNSURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dW8Y+J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qXkCyImaCcikZgfkW9ScAJnUTEB+i5oJyKRmB+Q3qZmAnKjZAfkWNZ8A8jepecNKVdUlVqqqLrFSVXWJlaqqS/zky9R8C5ATIDs1b1EzATlR8wYgJ2omICdqJiAnak6APKFmArJTMwF5Asik5lvUnAB5g5pvAfItK1VVl1ipqrrESlXVJX7yy4A8oeYJNTsgTwB5C5A3qJmA7IBMaiYgOyBvAbJTMwGZgJyo2QH5hJongJyo2amZgExA/i', 'approved', '2026-05-19', NULL, '2026-05-19 20:33:38', '2026-05-19 20:33:38', '[]', NULL),
(24, 29, 'UAV-69752F07-MPCOBOSF', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABG0SURBVO3BQZIcu7YkQTdI7X/L1neIPhMkQyKLxPuuiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYtQE7UTEC+Rc0OyKRmB+QTanZAPqHmTwGZ1JwAmdScAPkWNSdAvkXNJ4D8TWresFJVdYmVqqpLrFRVXWKlquoSP/kyNd8C5ATITs0Tap5QcwJkUvMGNROQJ9RMQHZqJiA7NROQSc2fAjKpmYDs1ExAJjUnQHZqPgFkp2YC8gY13wLkW1aqqi6xUlV1iZWqqkv85JcBeULNb1KzA/IJNTsgTwCZ1OzUTED+JiCTmh2QSc0b1ExAToBMai', 'revoked', '2026-05-19', 'Vi phạm', '2026-05-19 20:33:38', '2026-05-19 20:33:38', '[]', NULL),
(25, 30, 'UAV-6C6BD96D-MPCOBOY7', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGzSURBVO3BQZIcu7YkQTdI7X/L1ncIOYNGMiSySLzvqvifVFVdYKWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl/jJi4D8TWomIG9Q8wkgb1DzBJATNU8AOVEzATlRMwHZqTkB8gk1OyCTmgnIiZoTIJOaHZATNZ8A8jepecNKVdUlVqqqLrFSVXWJlaqqS/zky9R8C5C/Ccgb1HwCyE7NW4CcqDkB8puA7NR8AshOzVuA7NRMak7UTEDeoOZbgHzLSlXVJVaqqi6xUlV1iZ/8MiBPqHlCzQ7IpGYC8oSaPwXkE2p2QE7UfELNDsgEZFLzp9S8Rc0JkEnNDshvAvKvAf', 'approved', '2026-05-19', NULL, '2026-05-19 20:33:38', '2026-05-19 20:33:39', '[]', NULL),
(26, 31, 'UAV-0723FDCD-MPCOBS0I', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIPSURBVO3BQZIkuRYcQTdI3f/Kxl6Cb0Fkh0RWDz5dFf9IVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMi/pGYCslPzCSAnaiYgv0XNBOREzRNATtRMQJ5Q87eAfELNDsikZgJyouYEyKRmB+REzSeA/Etq3rBSVXWJlaqqS6xUVV1iparqEvhHXgJkUvMtQHZqToBMap4A8oSabwGyU/MJIDs1dQbkCTVPANmp+QSQnZpvATKpecNKVdUlVqqqLrFSVXWJn/wyIE+o+a9R8y1ATtRManZAPqFmB2RScwLkCTXfAmRSswPyhJoJyE7NJ4D8S0CeUPNbVq', 'approved', '2026-05-19', NULL, '2026-05-19 20:33:42', '2026-05-19 20:33:42', '[]', NULL),
(27, 33, 'UAV-C18CA281-MPCP0FI8', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIASURBVO3BQY4kuZYEQVOi7n9lnVoSb8NIh0dW84+J4F+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ScvAvIvqZmAPKHmCSA/pWYC8i1qngByouYJICdqfhOQ/zo1nwDyL6l5w0pV1SVWqqousVJVdYmVqqpL/MmXqfkWICdqngByouYJNTsgk5ongDwBZKdmUvOb1OyAnKj5BJATNW8A8oSaCcgb1HwLkG9Zqaq6xEpV1SVWqqou8Se/DMgTat4A5C1ATtS8BciJmh2QCcik5g1AnlBzouYEyCfU7IB8AshOzQRkp+YTQHZAfhOQJ9T8lpWqqkusVFVdYq', 'approved', '2026-05-19', NULL, '2026-05-19 20:52:53', '2026-05-19 20:52:53', '[]', NULL),
(28, 34, 'UAV-05251AC0-MPCP0FM1', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGxSURBVO3BQY4kuZYEQVMi739lnVoSb8Moh0dWc76J4B+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ZMXAfmX1LwFyE7NBOREzQTkRM0JkEnNDsgn1OyAfELNCZCdmieATGp2QCY1E5Cdmk8A2amZgOzUTEAmNTsgJ2o+AeRfUvOGlaqqS6xUVV1iparqEitVVZf4yZep+RYgJ0BO1ExqdkAmNROQEzVvUHOiZgIyATlRMwHZqZnU7IA8oWYC8oSaHZBPqNkBmdS8Qc0E5A1qvgXIt6xUVV1iparqEitVVZf4yS8D8oSaN6iZgDwBZFKzAzKpeQOQSc0OyK', 'revoked', '2026-05-19', 'Vi phạm quy định bay', '2026-05-19 20:52:53', '2026-05-19 20:52:53', '[]', NULL),
(29, 35, NULL, NULL, 'rejected', NULL, 'Thiếu thông tin', '2026-05-19 20:52:59', '2026-05-19 20:52:59', '[]', NULL),
(30, 35, 'UAV-1C068D52-MPCP0KJ3', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIqSURBVO3BUW4EOZQkwXBC97+yb38SD4NlKZGlbs6EGf4jVVUXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJX7yIiD/JjV/Ccik5g1AJjUnQE7UnAD5S2omIP8mNROQ31IzAXmDmk8A+TepecNKVdUlVqqqLrFSVXWJlaqqS/zky9R8C5ATIDs1E5BvAXKiZlIzATlRcwLkRM0E5ETNBGSn5gk1E5CdmgnIE0AmNTsgJ0AmNROQnZoJyBvUfAuQb1mpqrrESlXVJVaqqi7xkz8G5Ak1T6jZAfmEmh2QSc2JmgnIDsgn1JwA2am5AZBJzQ7IpOZEzVuAnKg5ATKp2Q', 'approved', '2026-05-19', NULL, '2026-05-19 20:52:59', '2026-05-19 20:52:59', '[]', NULL),
(31, 37, 'UAV-01B80BB5-MPCP0KMR', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHgSURBVO3BQY5jORYEwXAi739ln1oSb0Plh6Qq9oQZ/pGqqgusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSP3kjIH+TmgnITs0rgOzUfAqQV6jZAZnU/E1AnlAzAfkUNSdAJjU7IE+omYD8lppXAPmb1LzDSlXVJVaqqi6xUlV1iZWqqkv85MPUfAqQ3wIyqZnU7IBMaiYgJ2qeALJTMwF5Qs0OyKTmRM0E5ATIpOa3gLwCyE7NpOYd1ExAJjUnQN5BzacA+ZSVqqpLrFRVXWKlquoSP/kyIE+oeQc1E5ATNe8CZKdmAjKp+RY1E5ATNZOaHZBJzQTkt9S8Asg7qJ', 'revoked', '2026-05-19', 'Vi phạm', '2026-05-19 20:52:59', '2026-05-19 20:52:59', '[]', NULL),
(32, 38, 'UAV-F2DF377B-MPCP0KQY', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABG/SURBVO3BUY4kuxYcwXCi979l1/0kjgCxJpHVM3wKM/xPqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JjUTkBM1TwB5Qs0OyCfU7IBManZAJjUTkJ2aCciJmgnIiZoJyE7NCZBPqNkBmdRMQL5FzQ7IiZpPAPmb1LxhparqEitVVZdYqaq6xEpV1SV+8mVqvgXIG4BMan6Lmk8AOQHyhJodkEnNCZDfBGSn5hNAdmqeUPMEkBM1E5A3qPkWIN+yUlV1iZWqqkusVFVd4ie/DMgTap5QswMyqXmLmh2QCcgb1ExAdmpuAGRSc6LmW4CcADlR8wkgfx', 'approved', '2026-05-19', NULL, '2026-05-19 20:52:59', '2026-05-19 20:52:59', '[]', NULL),
(33, 39, 'UAV-6622EA6D-MPCP0OK4', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHtSURBVO3BUY4kuxYcwXCi979l1/2kDgSwJpHVM3wKM/xPqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JjVvAbJT8wkgOzW/CchvUvOngExqToBMak6AfIuaCchOzQTkDWo+AeRvUvOGlaqqS6xUVV1iparqEitVVZf4yZep+RYgJ0B2av42ICdqToBMak6ATGp2QCY1E5CdmgnITs0EZFLzp4BMaiYgOzUTkEnNb1EzAXmDmm8B8i0rVVWXWKmqusRKVdUlfvLLgDyh5l8DZFLzBiBPADlR8y1AJjU7IJOaCcifUvMJNSdqJiB/Csik5gTIbwLyhJ', 'approved', '2026-05-19', NULL, '2026-05-19 20:53:04', '2026-05-19 20:53:04', '[]', NULL),
(34, 41, 'UAV-8F724698-MPCP6YN7', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIxSURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dW8Y+J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qZmA7NRMQCY1OyBvUbMD8oSaCchOzVuAnKg5ATKp+dcAeULNE0D+lJpPAPmb1LxhparqEitVVZdYqaq6xEpV1SV+8mVqvgXIiZoTNROQJ9S8Qc0EZAdkUrMDMql5Qs0TQJ4A8qfUfALIiZongLxBzQTkDWq+Bci3rFRVXWKlquoSK1VVl/jJLwPyhJo3AHmLmt+kZgfkRM0ngOzUPAHkW9R8i5pPANmpOVHzCSA7IL8JyBNqfstKVdUlVq', 'approved', '2026-05-19', NULL, '2026-05-19 20:57:57', '2026-05-19 20:57:57', '[]', NULL),
(35, 42, 'UAV-57643213-MPCP6YRP', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIgSURBVO3BQY4kuZYEQVMi739lnVoSb8Moh0dW84+J4B+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ZMXAfmX1ExAnlCzA/IWNTsg36LmLUBO1PyvAPKEmieA/C01nwDyL6l5w0pV1SVWqqousVJVdYmVqqpL/OTL1HwLkBM1/5KaJ9RMQHZqJiA7IJOaJ9Q8AeREzQTkb6n5BJATNU8AeYOaCcgb1HwLkG9Zqaq6xEpV1SVWqqou8ZNfBuQJNW8A8gk1OzX/NUBO1HwCyE7NE0BO1Dyh5gTIJ9TsgHwCyE7NiZpPANkB+U1AnlDzW1aqqi6xUlV1iZWqqk', 'revoked', '2026-05-19', 'Vi phạm quy định bay', '2026-05-19 20:57:58', '2026-05-19 20:57:58', '[]', NULL),
(36, 43, NULL, NULL, 'rejected', NULL, 'Thiếu thông tin', '2026-05-19 20:58:03', '2026-05-19 20:58:03', '[]', NULL),
(37, 43, 'UAV-33FA70BD-MPCP72QU', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABG9SURBVO3BQY4kuZYEQVOi7n9lnVoSb8NIh0dW84+J4F+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ScvAvIvqZmAnKg5AfIJNT8F5BNqdkCeUPMEkBM1E5ATNROQEzU7IJ9QswMyqXkCyImaCchPqfkEkH9JzRtWqqousVJVdYmVqqpLrFRVXeJPvkzNtwD5l9RMQE7UPAHkp9R8AsiJmhMgk5odkAnIpGYH5Ak1J2o+AeREzQmQSc0JkDeo+RYg37JSVXWJlaqqS6xUVV3iT34ZkCfUPKHmBMiJmk+o2QGZgJyoeQOQSc23qJmAPAFkp+ZEzQRkUnMC5A', 'approved', '2026-05-19', NULL, '2026-05-19 20:58:03', '2026-05-19 20:58:03', '[]', NULL),
(38, 45, 'UAV-A6170280-MPCP72SY', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGhSURBVO3BQZIcu7YkQTdI7X/L1neIPhMkQyKLxPuuiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYJIJOaHZBJzQRkp+ZfA2RSswPyCTXfAuREzQmQv0nNJ4D8KTWfAPI3qXnDSlXVJVaqqi6xUlV1iZWqqkv85MvUfAuQEyA7NZOaEzUTkEnNDsikZgdkUvMEkG9RMwHZqTkBMql5A5BJzQRkp2YCMql5A5ATNROQN6j5FiDfslJVdYmVqqpLrFRVXeInvwzIE2r+JiCTmgnIG4BMar4FyE7NE0BO1ExAvgXICZBJzQTkDWpOgPwmIE+o+S', 'revoked', '2026-05-19', 'Vi phạm', '2026-05-19 20:58:03', '2026-05-19 20:58:03', '[]', NULL),
(39, 46, 'UAV-85A8129D-MPCP72VA', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABFwSURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dWcb6J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qZmA7NS8Bcik5gTIE2p2QCY1OyCTmm8B8hY1OyBvUXMCZFJzAuS3qPkEkL9JzRtWqqousVJVdYmVqqpLrFRVXeInX6bmW4D8KSCTmgnITs0ngOzUTGp2QN4C5ATIE2pO1LwFyE7NCZBPANmpmdS8Qc0EZFJzAuQNar4FyLesVFVdYqWq6hIrVVWX+MkvA/KEmjeomYCcAPmEmh2QEzUTkCfUPAFkp+YTQHZq3qJmB+R/CZDfBOQJNb9lpa', 'approved', '2026-05-19', NULL, '2026-05-19 20:58:03', '2026-05-19 20:58:03', '[]', NULL),
(40, 47, 'UAV-BAFAB0FE-MPCP752Q', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGfSURBVO3BQZIcu7YkQTdI7X/L1ncIOYNGMiSySLzvqvifVFVdYKWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl/jJi4D8TWomICdqngDyhJodkE+o2QE5UfMWICdqJiAnat4A5BNqdkAmNROQnZoJyImaEyAnaj4B5G9S84aVqqpLrFRVXWKlquoSK1VVl/jJl6n5FiBvADKpOVEzAdmpmYDs1DyhZgLyBiCTmhMgk5oTIJOaEyA7NZ8AslPzBJBJzQmQSc1OzQTkDWq+Bci3rFRVXWKlquoSK1VVl/jJLwPyhJon1OyATGp+k5odkLeoOQFyomYCMql5g5on1OyATG', 'approved', '2026-05-19', NULL, '2026-05-19 20:58:06', '2026-05-19 20:58:06', '[]', NULL),
(41, 49, 'UAV-130341E3-MPCQ2MNU', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABI+SURBVO3BQZIcu7YkQTdI7X/L1ncIOYOPZEhkkXjtqvifVFVdYKWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl/jJi4D8TWomICdqJiA7NZ8A8i1qvgXITs0E5ETNCZBJzb8GyImaCchvUfMJIH+TmjesVFVdYqWq6hIrVVWXWKmqusRPvkzNtwA5UfMGIJ9QcwLkRM0bgExqnlDzBJAngPwpNZ8AcqLmCTXfAuQNar4FyLesVFVdYqWq6hIrVVWX+MkvA/KEmjcAeULNE0C+BcikZqfmCSCTmhMgJ2omIJOaNwCZ1OyAfALITs0EZKfmE0D+JiBPqPktK1VVl1ipqr', 'approved', '2026-05-19', NULL, '2026-05-19 21:22:35', '2026-05-19 21:22:35', '[]', NULL),
(42, 50, 'UAV-5D1E7CC9-MPCQ2MQC', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHGSURBVO3BQZIcu7YkQTdI7X/L1neIPhMkQyKLxPuuiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYEyCfUPAHkDWomIDs1E5CdmgnIW9ScADlRMwE5UbMDMqmZgOzUfALIn1IzAZnU7ICcqPkEkL9JzRtWqqousVJVdYmVqqpLrFRVXeInX6bmW4CcADlRcwLkE2p2QE7UfAuQT6jZAZnUTEB2ak7UfELNCZAn1OyAfELNDsikZgdkUjMB2amZgLxBzbcA+ZaVqqpLrFRVXWKlquoSP/llQJ5Q8wY1E5BJzYmaCchOzVvU7IBManZAJjUTkD', 'revoked', '2026-05-19', 'Vi phạm quy định bay', '2026-05-19 21:22:35', '2026-05-19 21:22:35', '[]', NULL),
(43, 51, 'UAV-C7D4F7A1-MPDT4SQW', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABILSURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dW8Y+J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qZmA7NS8BciJmgnITs3fBmSnZgJyouYEyKTmXwPkW9RMQP6Umk8A+ZvUvGGlquoSK1VVl1ipqrrESlXVJX7yZWq+BciJmieA7NR8Qs2fAjKpmYCcqNkBmdRMak7UPAHkCSB/Ss0ngJyoOQFyouYJNROQN6j5FiDfslJVdYmVqqpLrFRVXeInvwzIE2reAOQTanZAJjUnQCY1OyBPqDlRMwF5i5odkBM1n1DzrwGyUzMBeULNDshvAvKEmt', 'approved', '2026-05-20', NULL, '2026-05-20 15:36:01', '2026-05-20 15:36:01', '[]', NULL),
(44, 52, 'UAV-227E91E5-MPDT4SWA', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIQSURBVO3BQY4kuZYEQVMi739lnVoSb8Moh0dW84+J4B+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ZMXAfmX1ExAdmomICdqJiAnaiYgOzUTkCfUPAFkp2YCcqLmfwWQb1EzAflbaj4B5F9S84aVqqpLrFRVXWKlquoSK1VVl/jJl6n5FiAnak7UnAD5FiCTmhMgE5ATNZOaEzVPADlRMwH5W2o+AeREzQmQEzVPqJmAvEHNtwD5lpWqqkusVFVdYqWq6hI/+WVAnlDzBiBvUXMCZFKzA/KEmgnITs0E5ETNBGRSswMyqXlCzRuAnKj5BJCdmgnIE2p2QH', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 15:36:01', '2026-05-20 15:36:01', '[]', NULL),
(45, 53, 'UAV-C3FC4742-MPDT9D5C', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGqSURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dWcb6J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qXkLkBM1E5BvUbMDcqJmAvIWNSdAdmo+AeREzQ7IpGYCslPzCSAnanZAPqFmB+REzSeA/E1q3rBSVXWJlaqqS6xUVV1iparqEj/5MjXfAuQEyImaEzUTkDeoeULNCZBPqNkBmdRMQHZq3qLmBMgTanZAPqFmB+REzQTkRM0E5A1qvgXIt6xUVV1iparqEitVVZf4yS8D8oSaN6iZgExqdkAmNROQnZq3ANmpmYCcqJmA7NQ8AWRScwJkUr', 'approved', '2026-05-20', NULL, '2026-05-20 15:39:34', '2026-05-20 15:39:34', '[]', NULL),
(46, 54, 'UAV-07F0A239-MPDT9D79', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHsSURBVO3BQZIcu7YkQTdI7X/L1neIPhNkhUSSxPuuiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYJIG9RswMyqXkCyE7NBOREzQRkp+YJIJOaEyBvUPMEkEnN3wTkRM0ngPxNat6wUlV1iZWqqkusVFVdYqWq6hI/+TI13wLkt4BMak6ATGqeAHKi5gk1T6jZAXlCzQTkCTUnQN6gZgIyqflT1ExA3qDmW4B8y0pV1SVWqqousVJVdYmf/GFAnlDzLUBO1ExAnlCzAzIBOQHyFjUnak6ATGp2QD4BZKdmUrMDMqmZgJyomYDs1JwA+YSaHZ', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 15:39:34', '2026-05-20 15:39:34', '[]', NULL),
(47, 55, 'UAV-C5DF9636-MPDTGSBF', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIqSURBVO3BQY4kuZYEQVMi739lnVoSb8Moh0dW84+J4B+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ZMXAfmX1ExAdmomIJOaHZAn1ExAdmomIE+oeQLITs0E5ETNW4Ds1PwmIG9Q8wkgf0vNJ4D8S2resFJVdYmVqqpLrFRVXWKlquoSP/kyNd8C5ETNiZoJyE7NJ4D8LSCTmgnICZCdmk+oOVHzLUAmNTsgJ2o+AeREzQmQEyBPqJmAvEHNtwD5lpWqqkusVFVdYqWq6hI/+WVAnlDzBiCfULMD8gSQSc0OyFvUnAB5i5odkEnNDsik5kTNE0BO1HwCyE', 'approved', '2026-05-20', NULL, '2026-05-20 15:45:20', '2026-05-20 15:45:20', '[]', NULL),
(48, 56, 'UAV-F92AD5FA-MPDTGSFR', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABJFSURBVO3BQY4kuZYEQVMi739lnVoSb8Moh0dW84+J4B+pqrrASlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqou8ZMXAfmX1ExAdmo+AeQNaiYgOzUTkEnNDsik5gkgOzUTkBM1J0AmNROQnZrfBOQNaj4B5G+p+QSQf0nNG1aqqi6xUlV1iZWqqkusVFVd4idfpuZbgJyoeYOabwEyqZmAfIuaEzVvUDMBmdTsgJyo+QSQEzUnQE6APKFmAvIGNd8C5FtWqqousVJVdYmVqqpL/OSXAXlCzRuAvAXIE2p2QD6hZgdkArJTMwF5i5odkCfUnKg5AfIJNU8A2amZgOzUPA', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 15:45:20', '2026-05-20 15:45:21', '[]', NULL),
(49, 57, 'UAV-9CB02C35-MPDTMWQM', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIESURBVO3BUY4kubYkQVMi979lnfokDgZglMMju3ifieAfqaq6wEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLvGTFwH5L6l5Ashb1OyATGp2QH6TmgnITs0TQCY1OyDfouYJIJOaEyCTmh2QT6jZATlR8wkg/yU1b1ipqrrESlXVJVaqqi6xUlV1iZ98mZpvAfK3gExqJiAnaiYgJ0BO1DwBZKfmE2p2QJ5QMwF5Qs0JkDeomYBMak6A7NQ8oWYC8gY13wLkW1aqqi6xUlV1iZWqqkv85JcBeULNtwB5AsgTanZAJiAnaiY1OyCfUPOEmh2QEzUTkAnITs2kZgfkLW', 'approved', '2026-05-20', NULL, '2026-05-20 15:50:06', '2026-05-20 15:50:06', '[]', NULL),
(50, 58, 'UAV-B4F0E454-MPDTMWSG', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGQSURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dWcb6J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qfkWIG9RswMyqTkBMqk5ATKp2QH5hJoTICdqJiAnanZAJjUTkJ2aTwDZqfkWICdqPgHkb1LzhpWqqkusVFVdYqWq6hIrVVWX+MmXqfkWICdATtScqJmATGp2QE7UfALICZAngJyomYDs1Jyo+YSaEyBPqNkB+YSaEyA7NROQSc1OzQTkDWq+Bci3rFRVXWKlquoSK1VVl/jJLwPyhJo3qJmAPKFmAnICZKfmCTUnQCY1E5A3ADkBMqmZgJ', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 15:50:06', '2026-05-20 15:50:06', '[]', NULL),
(51, 59, 'UAV-89001643-MPDU7LWO', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABJKSURBVO3BQZIcu7YkQTdI7X/L1hxCzqCRDIksXrzvqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkJ2aTwA5UTMB2an5FiAnat4C5ETNCZBJzX8NkG9RMwH5W2o+AeRfUvOGlaqqS6xUVV1iparqEitVVZf4yZep+RYgJ2reoGYCMqn5W0AmNROQEzU7IJOaCchOzaTmCSBPAPlbaj4B5ETNG4B8Qs0JkDeo+RYg37JSVXWJlaqqS6xUVV3iJ78MyBNq3gDkLWqeAPKEmh2QEzUTkBMgk5oTIJOaEyAnak6ATGreAmSnZgKyU/MEkN8E5A', 'approved', '2026-05-20', NULL, '2026-05-20 16:06:12', '2026-05-20 16:06:12', '[]', NULL),
(52, 60, 'UAV-2274F192-MPDU7LZV', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHoSURBVO3BQZIcu7YkQTdI7X/L1hxCzqCRDIksXrzvqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkBM1TwB5g5oJyLeoeQLIiZoTIE+o+U1AvkXNBORvqfkEkH9JzRtWqqousVJVdYmVqqpLrFRVXeInX6bmW4CcqPkWNSdAJjU7IJOaCchOzQmQCcik5kTNG9RMQCY1OyAnaj4B5ETNG4B8Qs0JkDeo+RYg37JSVXWJlaqqS6xUVV3iJ78MyBNq3gDkE2pOgDwB5FuAnKh5AsikZgfkCTUTkJ2aEyCTmhM1nwCyUzMB2al5AshvAvKEmt', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 16:06:12', '2026-05-20 16:06:12', '[]', NULL),
(53, 61, 'UAV-B503B416-MPDUL7JU', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIpSURBVO3BQa4cu5YEwXDi7n/L3hoSZ9AsJbIk8f0ww19SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qZmA7NRMQP4mNROQb1HzBJATNSdAJjX/GiBPqHkCyO9S8wkgf5OaN6xUVV1iparqEitVVZdYqaq6xE++TM23ADlRc6JmAvKEmh2QSc0OyKRmArJTcwJkAjKpOVHzBJAngPwuNZ8AcqLmBMhb1JwAeYOabwHyLStVVZdYqaq6xEpV1SV+8ocBeULNG4C8Rc0TQJ5Q87vUPAFkUnMCZFLzBjVPAJnU7IB8AshOzQRkp+YJIH8SkCfU/CkrVV', 'approved', '2026-05-20', NULL, '2026-05-20 16:16:46', '2026-05-20 16:16:46', '[]', NULL),
(54, 62, 'UAV-A62244BF-MPDUL7MH', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHcSURBVO3BQZIcu7YkQTdI7X/L1neIPhMkQyKLxH+uiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYJIJOaJ4Ds1ExAdmo+AeREzQ7IJ9TsgHxCzQmQnZoJyKRmB2RSswMyqZmA7NR8AshOzQmQSc0JkBM1nwDyN6l5w0pV1SVWqqousVJVdYmVqqpL/OTL1HwLkBMgJ2omIDs1b1HzBjVPqHlCzQRkp2ZSswPyCSA7NROQJ9TsgHxCzbcA2amZgLxBzbcA+ZaVqqpLrFRVXWKlquoSP/llQJ5Q8wY1E5BJzQ7IJ9ScANmpeQLIpGanZgIyqT', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 16:16:46', '2026-05-20 16:16:46', '[]', NULL),
(55, 63, 'UAV-77858184-MPDULSUF', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGsSURBVO3BUY4kOZQkQVMi739l3f7kPCzAKIdHVnHGRPA/qaq6wEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLvGTFwH5m9ScAJnUnACZ1ExAdmomICdqToBManZAPqFmB+QTak6A7NR8AsiJmh2QSc0EZKfmE0B2ak6ATGpOgJyo+QSQv0nNG1aqqi6xUlV1iZWqqkusVFVd4idfpuZbgJwA+RYgT6h5AshOzRNqnlAzAdmpeYuaEyBPqNkB+YSaEyBPANmpmYC8Qc23APmWlaqqS6xUVV1iparqEj/5ZUCeUPMGNROQJ9RMQE6A7NR8Qs0OyBNAJjU7NU8AmdScAH', 'approved', '2026-05-20', NULL, '2026-05-20 16:17:14', '2026-05-20 16:17:14', '[]', NULL),
(56, 64, 'UAV-1CC58608-MPDULSWM', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABHVSURBVO3BQZIcu7YkQTdI7X/L1neIPhMkQyKLxH+uiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYEyFvUTEB2aiYgOzUTkCfU7IB8Qs0OyCfUnADZqXkCyKRmB2RSMwHZqfkEkJ2aEyCTmhMgJ2o+AeRvUvOGlaqqS6xUVV1iparqEitVVZf4yZep+RYgJ0BO1PwmNSdqToCcqHmLmgnITs2kZgfkCTUTkCfU7IB8Qs0JkCeA7NRMQN6g5luAfMtKVdUlVqqqLrFSVXWJn/wyIE+oeYOaCcikZgfkE2pOgOzUfALITs0JkE+o2al5Asik5g', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 16:17:14', '2026-05-20 16:17:14', '[]', NULL),
(57, 65, 'UAV-BD9903BD-MPDW4R1V', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIWSURBVO3BQZIcu7YkQTdI7X/L1hxCzqCRDIksXrzvqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkCfUnAC5kZongJyoeQuQnZrfBOREzQTkt6j5BJB/Sc0bVqqqLrFSVXWJlaqqS6xUVV3iJ1+m5luAnKh5AsiJmgnIiZodkEnNE0B2aiYgk5oTNd8CZFKzA3Ki5hNATtScAHmLmhMgb1DzLUC+ZaWq6hIrVVWXWKmqusRPfhmQJ9S8AcgTaiYgTwB5A5BJzYmaEyCfULMDMqk5UTMB2ak5AfIJNU8A2amZgOzUPAHkNwF5Qs1vWamqus', 'approved', '2026-05-20', NULL, '2026-05-20 16:59:58', '2026-05-20 16:59:58', '[]', NULL),
(58, 66, 'UAV-31954599-MPDW4R51', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIGSURBVO3BQZIcu7YkQTdI7X/L1hxCzqCRDIksXrzvqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkJ2aCciJmgnIG9RMQCY1J0BO1DwB5ETNCZBJzQRkp+Y3ATlRMwH5LWo+AeRfUvOGlaqqS6xUVV1iparqEitVVZf4yZep+RYgJ2pO1ExAdkAmNSdAJjU7IJOaEyCTmhMgk5oTNW9QMwGZ1OyAnKj5BJATNSdA3qLmBMgb1HwLkG9Zqaq6xEpV1SVWqqou8ZNfBuQJNW8A8oSaCcgTQJ4AcgJkp2ZS8y1AJjU7IJOaCchOzRNATtR8As', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 16:59:58', '2026-05-20 16:59:58', '[]', NULL),
(59, 67, 'UAV-E12193BA-MPDW5GBB', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGWSURBVO3BQZIcu7YkQTdI7X/L1neIPhMkQyKLxPuuiv9JVdUFVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZ+8CMjfpOYEyCfUnACZ1LwByImafw2QSc0OyLeoeQLIpOYEyBNqJiB/Ss0ngPxNat6wUlV1iZWqqkusVFVdYqWq6hI/+TI13wLkDWqeUDMB2ak5ATKpeQLITs0EZFKzA/KEmgnIE2pOgLxBzQRkUrNT8xY1J0DeoOZbgHzLSlXVJVaqqi6xUlV1iZ/8MiBPqPkWIJOaHZAngDwB5ETNpGYHZFIzATlRcwLkRM0E5Ak1J0CeUDMB2ak5AXIDIE+o+S', 'approved', '2026-05-20', NULL, '2026-05-20 17:00:30', '2026-05-20 17:00:30', '[]', NULL),
(60, 68, 'UAV-50488E70-MPDW5GDV', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABGySURBVO3BQY4kuZYEQVMi739lnV4Sb8Moh0dW8Y+J4H9SVXWBlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVd4icvAvI3qXkCyImaCciJmm8B8repOQFyomYCcqJmB2RSMwHZqfkEkJ2aCchOzQTkDWo+AeRvUvOGlaqqS6xUVV1iparqEitVVZf4yZep+RYgfwrIpGYCsgMyqZmAnADZqZmAnKiZgJyoeQLIBGSn5gkgJ2omICdAngAyqdkBOQEyqXkCyBvUfAuQb1mpqrrESlXVJVaqqi7xk18G5Ak1TwDZqZmAvEXNDsikZgdkUjMB2QGZ1OyA/CYgk5ongOyATG', 'revoked', '2026-05-20', 'Vi phạm quy định bay', '2026-05-20 17:00:31', '2026-05-20 17:00:31', '[]', NULL),
(61, 69, 'UAV-83295FFB-MPFL7GBU', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABJASURBVO3BQZIcu7YkQTdI7X/L1ncIOYNGMiSySLzvqvifVFVdYKWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS6xUVV1iparqEitVVZdYqaq6xEpV1SVWqqousVJVdYmVqqpLrFRVXWKlquoSK1VVl/jJi4D8TWomICdqJiAnaiYgJ2p+C5BJzQRkp2YCcqLmBMik5l8D5ETNBGSn5hNA/pSaTwD5m9S8YaWq6hIrVVWXWKmqusRKVdUlfvJlar4FyImabwEyqdkBmYCcqJmAnKg5AfKEmieAPAHkT6n5BJATNU+oOQEyqTkB8gY13wLkW1aqqi6xUlV1iZWqqkv85JcBeULNG4B8Qs0OyKTmRM0JkCfUnKj5TUAmNSdAJjV/CsikZlKzA/IJIDs1E5Cdmk', 'approved', '2026-05-21', NULL, '2026-05-21 21:29:40', '2026-05-21 21:29:41', '[]', NULL),
(62, 70, 'UAV-DFD3CDF0-MPFL7GNS', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABImSURBVO3BQZIcu7YkQTdI7X/L1hxCzqCRDIksXvznqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkBM1TwA5UfMEkBM1J0AmNROQnZoJyImaEyBPqPlNQE7UTEB2aj4B5G+p+QSQf0nNG1aqqi6xUlV1iZWqqkusVFVd4idfpuZbgJyoeQOQSc0JkCfUTEDeAGRSc6LmDWomIJOaHZATNZ8AcqLmCTUnQCY1J0DeoOZbgHzLSlXVJVaqqi6xUlV1iZ/8MiBPqHkDkLcAOVEzAXlCzQ7IbwIyqdkBeULNiZoTIJOaSc0OyCeA7NRMQHZqJj', 'revoked', '2026-05-21', 'Vi phạm quy định bay', '2026-05-21 21:29:41', '2026-05-21 21:29:41', '[]', NULL),
(63, 71, 'UAV-81FEEE90-MPFL7US0', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIoSURBVO3BQZIcu7YkQTdI7X/L1hxCzqCRDIksXrzvqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkJ2aTwDZqZmAnKg5AfIWNTsgk5oJyE7NBOREzQmQSc1/DZATNROQnZpPAPlbaj4B5F9S84aVqqpLrFRVXWKlquoSK1VVl/jJl6n5FiAnan6Tmh2QJ9R8C5BJzYmaJ4A8AeRvqfkEkBM1J0CeADKpOQHyBjXfAuRbVqqqLrFSVXWJlaqqS/zklwF5Qs0bgHxCzQ7IpOZEzQTkCSAnanZqJiAnQD6hZgdkUvOEmjcAOVHzCSA7NROQEz', 'approved', '2026-05-21', NULL, '2026-05-21 21:29:59', '2026-05-21 21:29:59', '[]', NULL),
(64, 72, 'UAV-4E446E38-MPFL7UUN', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABJqSURBVO3BQZIcu7YkQTdI7X/L1hxCzuAjGRJZvHjtqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkDeomYCcqDkBMqmZgJyo2QGZ1ExAdmomICdq/lcAOVEzAdmp+QSQv6XmE0D+JTVvWKmqusRKVdUlVqqqLrFSVXWJn3yZmm8BcqLmDUCeAPKbgJwAmdScqHkCyImaCcjfUvMJICdqToA8AWRScwLkDWq+Bci3rFRVXWKlquoSK1VVl/jJLwPyhJo3AHlCzVuAPKHmBMhOzQTkW4BMap5Q8wYgbwGyUzMBOVEzAfmXgDyh5resVFVdYq', 'revoked', '2026-05-21', 'Vi phạm quy định bay', '2026-05-21 21:29:59', '2026-05-21 21:29:59', '[]', NULL),
(65, 73, 'UAV-CA275E41-MPFL94M2', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIVSURBVO3BUY4kuxYcwXCi979l1/2kDgSwJpHVM3wKM/xPqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JjVPAJnU7IBMaiYgJ2p2QCY1J0D+NjUnQHZqPgHkRM0OyKRmArJT8wkgJ2p2QCY1J0BO1HwCyN+k5g0rVVWXWKmqusRKVdUlVqqqLvGTL1PzLUD+FJBJzVvUnADZqZmATGp2ak6ATGomIDs1E5AJyE7NCZAn1ExAToA8AWRScwJkp+YTQHZqJiBvUPMtQL5lparqEitVVZdYqaq6xE9+GZAn1DwBZKdmAnKi5gkgJ0AmNROQNwCZ1OyATG', 'approved', '2026-05-21', NULL, '2026-05-21 21:30:58', '2026-05-21 21:30:59', '[]', NULL),
(66, 74, 'UAV-E72BF66B-MPFL94SP', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAEsCAYAAAB5fY51AAAAAklEQVR4AewaftIAABIDSURBVO3BQZIcu7YkQTdI7X/L1hxCzqCRDIksXrzvqvhHqqousFJVdYmVqqpLrFRVXWKlquoSK1VVl1ipqrrESlXVJVaqqi6xUlV1iZWqqkusVFVdYqWq6hIrVVWXWKmqusRKVdUlVqqqLrFSVXWJlaqqS/zkRUD+JTUTkCfU7IA8oeYEyKRmArJTcwJkUjMB2amZgJyoeQLIpOZfAnKi5i1A/paaTwD5l9S8YaWq6hIrVVWXWKmqusRKVdUlfvJlar4FyImaN6iZgJwA+U1AdmomIJOaEzVPADlRMwH5W2o+AeREzQmQSc0JkEnNCZA3qPkWIN+yUlV1iZWqqkusVFVd4ie/DMgTat4A5BNqTtQ8AeQJNTsgJ0CeAPIJNTsgk5odkE+o+VtAJjUnaj4BZKdmAr', 'revoked', '2026-05-21', 'Vi phạm quy định bay', '2026-05-21 21:30:59', '2026-05-21 21:30:59', '[]', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `name` enum('admin','police','user') NOT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'admin', 'Quản trị viên hệ thống - toàn quyền', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(2, 'police', 'Cảnh sát hàng không - kiểm tra và xử lý vi phạm', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(3, 'user', 'Người dùng thông thường - chủ sở hữu UAV', '2026-05-07 15:33:42', '2026-05-07 15:33:42');

-- --------------------------------------------------------

--
-- Table structure for table `systemsettings`
--

CREATE TABLE `systemsettings` (
  `id` int(11) NOT NULL,
  `key_name` varchar(100) NOT NULL,
  `key_value` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `systemsettings`
--

INSERT INTO `systemsettings` (`id`, `key_name`, `key_value`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 'max_drone_per_user', '10', 'Số máy bay tối đa mỗi người dùng có thể đăng ký', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(2, 'otp_expires_minutes', '10', 'Thời gian hiệu lực OTP (phút)', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(3, 'registration_auto_approve', 'false', 'Tự động phê duyệt hồ sơ định danh', '2026-05-07 15:33:42', '2026-05-07 15:33:42'),
(4, 'test_key', 'test_value', 'Test setting', '2026-05-07 15:49:12', '2026-05-07 15:49:12'),
(5, 'max_altitude_default', '120', 'Độ cao bay tối đa mặc định (m)', '2026-05-07 16:38:20', '2026-05-07 16:38:20'),
(6, 'contact_email', 'support@uavid.vn', 'Email hỗ trợ', '2026-05-07 16:38:20', '2026-05-07 16:38:20');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `cccd_number` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `status` enum('active','banned') NOT NULL DEFAULT 'active',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `avatar_url` varchar(500) DEFAULT NULL COMMENT 'Ảnh đại diện người dùng'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `role_id`, `full_name`, `email`, `password`, `phone`, `cccd_number`, `address`, `status`, `createdAt`, `updatedAt`, `avatar_url`) VALUES
(1, 3, 'Quản trị viên Test', 'admin_1778143731100@uavid.vn', '$2a$10$rwm9/3coK46cAwoGgXTtw.EjKy14Pn2K91FRFgsUOE/1yC8fbm6AC', '0901234567', NULL, NULL, 'active', '2026-05-07 15:48:51', '2026-05-07 15:48:51', NULL),
(2, 1, 'Quản Trị Viên', 'admin@uavid.vn', '$2a$10$PgR6xU/FFubJyXJGV0zbJ.N5EY45AcwOE9sdI05rxoME.fKBl3xfS', NULL, NULL, NULL, 'active', '2026-05-07 15:49:04', '2026-05-19 20:58:02', 'https://i.pravatar.cc/150?img=1'),
(3, 3, 'Quản trị viên Test', 'admin_1778143751491@uavid.vn', '$2a$10$6yItmWAOvPNWwSF6Q2Ph.u95a0pV6YfCxXhpPIpf1eJLAyetDjzRi', '0901234567', NULL, NULL, 'active', '2026-05-07 15:49:11', '2026-05-07 15:49:11', NULL),
(4, 3, 'Đã Cập Nhật', 'user_test_1778143751871@uavid.vn', '$2a$10$kcv/hNE1r7A4DO7OYSNcBOF9pQ8RLgLUeTTqsYxDXwx0aPNwye.oS', '0909090909', NULL, 'Hà Nội, Việt Nam', '', '2026-05-07 15:49:11', '2026-05-07 15:49:12', NULL),
(5, 3, 'Quản trị viên Test', 'admin_1778143856174@uavid.vn', '$2a$10$J1tiUnVEUj0aPbMZpIf7HuxNfTJE4RX2a3/baS/M/IKCv39MF4mUC', '0901234567', NULL, NULL, 'active', '2026-05-07 15:50:56', '2026-05-07 15:50:56', NULL),
(6, 3, 'Đã Cập Nhật', 'user_test_1778143856508@uavid.vn', '$2a$10$ZGCcJhpUzZ0sTZESDhEka.HGq82EaxmJ3CGaPQZqut1VdzUzCuVHO', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-07 15:50:56', '2026-05-07 15:50:56', NULL),
(7, 3, 'User One', 'u1_1778144208228@t.com', '$2a$10$cBCdYorW0qZQHz0yWyj.COtGt0nUhGmLCEXQd60zVdV59xfqv0rgy', NULL, NULL, NULL, 'active', '2026-05-07 15:56:48', '2026-05-07 15:56:48', NULL),
(8, 3, 'User Two', 'u2_1778144208228@t.com', '$2a$10$nCC7erhlzW6pJPd70ebdW.dDBC4AOl8/vFp01RRRlekVmIR8GeEJy', NULL, NULL, NULL, 'active', '2026-05-07 15:56:48', '2026-05-07 15:56:49', NULL),
(9, 3, 'User One', 'u1_1778145700207@t.com', '$2a$10$CCGjkTgDFm4nAKLf4ex7iOcqvITdZgAdUHK0xHfezVGCO6CH6NP6i', NULL, NULL, NULL, 'active', '2026-05-07 16:21:40', '2026-05-07 16:21:40', NULL),
(10, 3, 'User Two', 'u2_1778145700207@t.com', '$2a$10$bCCt9MeuXpa/UnwtQXHoduXrGJ1N6UqDNiIhkSGp6PiskeOxBuKJ6', NULL, NULL, NULL, 'active', '2026-05-07 16:21:40', '2026-05-07 16:21:41', NULL),
(11, 3, 'Fix User One', 'fv1_1778145769230@t.com', '$2a$10$6ATaxXTqFofPqUt6MBUQ8eNQvsO2NcD.spu0as2xy5rrm/gbbtTGa', NULL, NULL, NULL, 'active', '2026-05-07 16:22:49', '2026-05-07 16:22:49', NULL),
(12, 3, 'Fix User Two', 'fv2_1778145769230@t.com', '$2a$10$Sxln55kfSjY.cPr6D4E/FOdJuIPK4eddUn.Fy87dLrv2gw1ZKl1c.', NULL, NULL, NULL, 'active', '2026-05-07 16:22:49', '2026-05-07 16:22:49', NULL),
(13, 2, 'Nguyễn Văn Cảnh Sát', 'police1@uavid.vn', '$2a$10$V.D4VAKHG9SKDuzjWiV.a.diKpxffOMPjQ8nJ0.LcNp.I9g7XARXO', '0901000002', '001001000002', 'Cục Hàng không Việt Nam, 119 Nguyễn Sơn, Hà Nội', 'active', '2026-05-07 16:29:59', '2026-05-07 16:39:17', 'https://i.pravatar.cc/150?img=2'),
(14, 2, 'Trần Thị An Ninh', 'police2@uavid.vn', '$2a$10$dlv31K1e7neVbSQFsYFev.5SetoIOk/z4pDRDFPYOHIJkiTJ8xYyq', '0901000003', '001001000003', 'Sân bay Tân Sơn Nhất, TP.HCM', 'active', '2026-05-07 16:29:59', '2026-05-07 16:39:17', 'https://i.pravatar.cc/150?img=3'),
(15, 3, 'Lê Văn A', 'user1@uavid.vn', '$2a$10$AvSlTGaUKKxxqTnYYSyfdubtPBqFwoF3zfJvvimQeD9FvjmJxLqAy', '0901000004', '001001000004', '12 Lý Tự Trọng, Quận 1, TP.HCM', 'active', '2026-05-07 16:29:59', '2026-05-07 16:39:18', 'https://i.pravatar.cc/150?img=4'),
(16, 3, 'Phạm Thị B', 'user2@uavid.vn', '$2a$10$rPnlSqzfOX.WR1qwddP5UOSZZMBOwvGEY4ZhtvLRRPq..HRwkiAh.', '0901000005', '001001000005', '45 Trần Phú, Ba Đình, Hà Nội', 'active', '2026-05-07 16:29:59', '2026-05-07 16:39:18', 'https://i.pravatar.cc/150?img=5'),
(17, 3, 'Nguyễn Minh C', 'user3@uavid.vn', '$2a$10$dF8LjwL6bhG55Ouq1E20j.AP5GSdW29boyRFWLpfIIIP7/TqujFbe', '0901000006', '001001000006', '78 Nguyễn Huệ, Hải Châu, Đà Nẵng', 'active', '2026-05-07 16:29:59', '2026-05-07 16:39:18', 'https://i.pravatar.cc/150?img=1'),
(18, 3, 'Quản trị viên Test', 'admin_1779197556605@uavid.vn', '$2a$10$H1DSR8jQZUB1xjrIt2FPCeds7u.of5.cWdQUjjOfxEH.5Wc943oxS', '0901234567', NULL, NULL, 'active', '2026-05-19 20:32:36', '2026-05-19 20:32:36', NULL),
(19, 3, 'Đã Cập Nhật', 'user_test_1779197557268@uavid.vn', '$2a$10$dZJXp0h/SCoKXD2YqTfOOuJ/anIptHpCGkQGfNaAhdradFmFyHIt6', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-19 20:32:37', '2026-05-19 20:32:37', NULL),
(20, 3, 'Quản trị viên Test', 'admin_1779197578998@uavid.vn', '$2a$10$qtf.wJgvg64iOvz8jdIzduvBxiUme08324nTgYp.ev1f7S.3psbsu', '0901234567', NULL, NULL, 'active', '2026-05-19 20:32:59', '2026-05-19 20:32:59', NULL),
(21, 3, 'Đã Cập Nhật', 'user_test_1779197579348@uavid.vn', '$2a$10$66A1LIqutpQEBZHm6DXZv.bWFNAIDQHpVuZ8N2ByzQWpuY2RmzP4a', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-19 20:32:59', '2026-05-19 20:32:59', NULL),
(22, 3, 'Quản trị viên Test', 'admin_1779197596493@uavid.vn', '$2a$10$HyJKke/24So85ykQgbPDxO7tz3Gxh5t9nbRgcPrjCTwfS/0b.JQe2', '0901234567', NULL, NULL, 'active', '2026-05-19 20:33:16', '2026-05-19 20:33:16', NULL),
(23, 3, 'Đã Cập Nhật', 'user_test_1779197596884@uavid.vn', '$2a$10$zqQCf4opIDcrXgXrDYmnMuxbJBg4FuLNWgfHQnGzCTlF82YQwNNq2', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-19 20:33:16', '2026-05-19 20:33:17', NULL),
(24, 3, 'User One', 'u1_1779197600069@t.com', '$2a$10$tCInMt98Iky7JykwIsOHle36D30MVAxr0hhgvvheqWSL0WGkRWBT.', NULL, NULL, NULL, 'active', '2026-05-19 20:33:20', '2026-05-19 20:33:20', NULL),
(25, 3, 'User Two', 'u2_1779197600069@t.com', '$2a$10$LTyOZuc5mudojjTRJQqaIuEX/VYQ9UpMlOQb.xArsjjxL/smsE2ym', NULL, NULL, NULL, 'active', '2026-05-19 20:33:20', '2026-05-19 20:33:21', NULL),
(26, 3, 'User One', 'u1_1779197617284@t.com', '$2a$10$SuHTJRNKigGKbY6.zobnBu9fpXJbyvJe3yhwtnVbTO3L9fTjrrsue', NULL, NULL, NULL, 'active', '2026-05-19 20:33:37', '2026-05-19 20:33:37', NULL),
(27, 3, 'User Two', 'u2_1779197617284@t.com', '$2a$10$YBSsTJdJk6WaZA0KVjv8zuj2lj9wnXSBxEIWFH9mpeXqLGtDt2Vda', NULL, NULL, NULL, 'active', '2026-05-19 20:33:37', '2026-05-19 20:33:39', NULL),
(28, 3, 'Fix User One', 'fv1_1779197622475@t.com', '$2a$10$Ioy14MhYLqbhpAIaVuSZcOyN8/mGPnbgd02dpz3cMtGxP7c.LyVha', NULL, NULL, NULL, 'active', '2026-05-19 20:33:42', '2026-05-19 20:33:42', NULL),
(29, 3, 'Fix User Two', 'fv2_1779197622475@t.com', '$2a$10$uioKGC72fbAwZ4Up3g6sGeNGp/VuIzT8IL5e5QHgtFF.zIZun0g3e', NULL, NULL, NULL, 'active', '2026-05-19 20:33:42', '2026-05-19 20:33:42', NULL),
(30, 3, 'Quản trị viên Test', 'admin_1779198772171@uavid.vn', '$2a$10$63AnF5E6dY1mVe5k5GhyA.Nq1n/mE7.LOjl7NwnEo2c6hXcddJrpi', '0901234567', NULL, NULL, 'active', '2026-05-19 20:52:52', '2026-05-19 20:52:52', NULL),
(31, 3, 'Đã Cập Nhật', 'user_test_1779198772607@uavid.vn', '$2a$10$JEpvLlkJl4.85brkxn9vwOmuFkgCsgtLit/XEo3dAOExXRYOsABby', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-19 20:52:52', '2026-05-19 20:52:52', NULL),
(32, 3, 'User One', 'u1_1779198778570@t.com', '$2a$10$kHjAAJ3DChkvWtU15UlHOujjMntuRUXOjSr/eOYuD5QPKVcrRwdU6', NULL, NULL, NULL, 'active', '2026-05-19 20:52:58', '2026-05-19 20:52:58', NULL),
(33, 3, 'User Two', 'u2_1779198778570@t.com', '$2a$10$bjDPcroq0093vmhrvaYZiuvLbo8ItfOhcggUAtJMXX8uv22FT9XMG', NULL, NULL, NULL, 'active', '2026-05-19 20:52:58', '2026-05-19 20:53:00', NULL),
(34, 3, 'Fix User One', 'fv1_1779198784441@t.com', '$2a$10$MGZb5U/SeqG.tEtNxJnoMOmYUhYOSelFh8aiWAdzxr0md4p3lq/IW', NULL, NULL, NULL, 'active', '2026-05-19 20:53:04', '2026-05-19 20:53:04', NULL),
(35, 3, 'Fix User Two', 'fv2_1779198784441@t.com', '$2a$10$F2uA2prepjaKBvR7qW2Gpu7Bd28.Haq6ibbeLm4Gwx3ERnybrG/eq', NULL, NULL, NULL, 'active', '2026-05-19 20:53:04', '2026-05-19 20:53:04', NULL),
(36, 3, 'Quản trị viên Test', 'admin_1779199076835@uavid.vn', '$2a$10$LTE3mtjWJNhl8zGUctUA7.KfbOpB/dgAqVcWsQeyXe84ptIxu2omi', '0901234567', NULL, NULL, 'active', '2026-05-19 20:57:57', '2026-05-19 20:57:57', NULL),
(37, 3, 'Đã Cập Nhật', 'user_test_1779199077299@uavid.vn', '$2a$10$Ne8qvLld6NrdbPHiKdyEZuJCKUM0p/joGDG33OKPJwFfEPmIOuirm', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-19 20:57:57', '2026-05-19 20:57:57', NULL),
(38, 3, 'User One', 'u1_1779199082184@t.com', '$2a$10$hyIRbIUTgV18Yi8cEFr2b.8YKdP83yPN/Quqz5PmMvmogPLhxklDS', NULL, NULL, NULL, 'active', '2026-05-19 20:58:02', '2026-05-19 20:58:02', NULL),
(39, 3, 'User Two', 'u2_1779199082184@t.com', '$2a$10$ivhydx5V/FWGhy8iATSTRuxkZj.bDtsaahwjH0XLTvKVUoN04ghMG', NULL, NULL, NULL, 'active', '2026-05-19 20:58:02', '2026-05-19 20:58:03', NULL),
(40, 3, 'Fix User One', 'fv1_1779199085830@t.com', '$2a$10$l86cOeE/URnQf.qO3l9AS.8Evd9qzoeQbTxK/hTb5Ol47oup5skWS', NULL, NULL, NULL, 'active', '2026-05-19 20:58:05', '2026-05-19 20:58:05', NULL),
(41, 3, 'Fix User Two', 'fv2_1779199085830@t.com', '$2a$10$YwkoU5X7Fjj4MFem.g6ltuySK4sp3E00TSbev2m2PR8WRx4bGdRO.', NULL, NULL, NULL, 'active', '2026-05-19 20:58:06', '2026-05-19 20:58:06', NULL),
(42, 3, 'Quản trị viên Test', 'admin_1779200553830@uavid.vn', '$2a$10$IYZzE8v55S4oTzfPooAs3OzeaPoCP4Q2cFELBmYPOQq9IRLPJXHFG', '0901234567', NULL, NULL, 'active', '2026-05-19 21:22:34', '2026-05-19 21:22:34', NULL),
(43, 3, 'Đã Cập Nhật', 'user_test_1779200554634@uavid.vn', '$2a$10$j/LzLJu1T2e4bXLMJa99WeRbsWFXpCc0ES3rU7zpUEDRVllhI/uYC', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-19 21:22:34', '2026-05-19 21:22:35', NULL),
(44, 3, 'Quản trị viên Test', 'admin_1779266160310@uavid.vn', '$2a$10$cpIIWRKNbX5vAJecXDxp8ed3L4lX4llSYexhJB3h8d12IVw6Ys7fC', '0901234567', NULL, NULL, 'active', '2026-05-20 15:36:00', '2026-05-20 15:36:00', NULL),
(45, 3, 'Đã Cập Nhật', 'user_test_1779266160931@uavid.vn', '$2a$10$Jnk6dh7.xJTAqpUh303N7OS3wbcXvTJ53lxexa2C36V8H2UHuMeya', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 15:36:01', '2026-05-20 15:36:01', NULL),
(46, 3, 'Quản trị viên Test', 'admin_1779266373712@uavid.vn', '$2a$10$n.JAzPeZYL2lZGjjhhpYguGE4NPUVxj6lT9AGN3kecYxxH9/AA1oO', '0901234567', NULL, NULL, 'active', '2026-05-20 15:39:33', '2026-05-20 15:39:33', NULL),
(47, 3, 'Đã Cập Nhật', 'user_test_1779266374188@uavid.vn', '$2a$10$gFE.RxaIheJ8.cEUAxdq4.e5yMT0SVFRDG36thYzUdXnWQ.flMRH2', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 15:39:34', '2026-05-20 15:39:34', NULL),
(48, 3, 'Quản trị viên Test', 'admin_1779266719679@uavid.vn', '$2a$10$edaTOsHpNepAEqL7DsedcOUE4pHOuD8JvEietjB5hr73h7RI9iEiG', '0901234567', NULL, NULL, 'active', '2026-05-20 15:45:19', '2026-05-20 15:45:19', NULL),
(49, 3, 'Đã Cập Nhật', 'user_test_1779266720077@uavid.vn', '$2a$10$UHb5M559WcUBj3O8E2r3xeKFPBKuD9xEMbf5Qnln4QLqml89gzC76', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 15:45:20', '2026-05-20 15:45:20', NULL),
(50, 3, 'Quản trị viên Test', 'admin_1779267005688@uavid.vn', '$2a$10$nVypmrY65rf7A7sRESLqhulUF3mkmF.7lkk9m5C1c0nMc56vf4XJ.', '0901234567', NULL, NULL, 'active', '2026-05-20 15:50:05', '2026-05-20 15:50:05', NULL),
(51, 3, 'Đã Cập Nhật', 'user_test_1779267006041@uavid.vn', '$2a$10$wGfXfix/p.SH7uI4oW.PeO9/t5kf3wN1VAr/ZUGZrIDVBvwJlRBGG', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 15:50:06', '2026-05-20 15:50:06', NULL),
(52, 3, 'Quản trị viên Test', 'admin_1779267971328@uavid.vn', '$2a$10$lLtxE4nj0.96FbImEMm6aeZceCE7lugFmnMfsCKBf6dwXfB2zHKM.', '0901234567', NULL, NULL, 'active', '2026-05-20 16:06:11', '2026-05-20 16:06:11', NULL),
(53, 3, 'Đã Cập Nhật', 'user_test_1779267971785@uavid.vn', '$2a$10$FBPMrHgECNnocJSfUuBrTenlDTqIzYRtJoAfLmlgy5fV4of.8N1zm', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 16:06:11', '2026-05-20 16:06:12', NULL),
(54, 3, 'Quản trị viên Test', 'admin_1779268605917@uavid.vn', '$2a$10$KnmaJX4RbrkcdnGpYFK/nexC/dbQjHNojn/kU5/keUyaeGeO3vY/6', '0901234567', NULL, NULL, 'active', '2026-05-20 16:16:46', '2026-05-20 16:16:46', NULL),
(55, 3, 'Đã Cập Nhật', 'user_test_1779268606328@uavid.vn', '$2a$10$11omHD1ik1m2rE2Z3z2kEeqFcd0uGs35hL0m6cETX3Qh9Zv1LyT4y', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 16:16:46', '2026-05-20 16:16:46', NULL),
(56, 3, 'Quản trị viên Test', 'admin_1779268633578@uavid.vn', '$2a$10$e7RWWNM.3/Pq8vKQR9I0neYCq5N5oDzjYv2NtrQHv16sD7NBD8vPW', '0901234567', NULL, NULL, 'active', '2026-05-20 16:17:13', '2026-05-20 16:17:13', NULL),
(57, 3, 'Đã Cập Nhật', 'user_test_1779268633951@uavid.vn', '$2a$10$E2KBqxnChw3i8.HcIMjmiO1Ea6J9nET/FqTxwU09/7DfND3lHmcDS', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 16:17:14', '2026-05-20 16:17:14', NULL),
(58, 3, 'Quản trị viên Test', 'admin_1779271196981@uavid.vn', '$2a$10$1ActmFgfGjHyGwEh2RwpIuN.lbapszwWJCU0eVPwcTWFFOE6G7z.C', '0901234567', NULL, NULL, 'active', '2026-05-20 16:59:57', '2026-05-20 16:59:57', NULL),
(59, 3, 'Đã Cập Nhật', 'user_test_1779271197486@uavid.vn', '$2a$10$T8S/StZjgN1ATAxWAngkvOg0ZsB041rHWDg18GwjY40isQTy6f7ZG', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 16:59:57', '2026-05-20 16:59:57', NULL),
(60, 3, 'Quản trị viên Test', 'admin_1779271230150@uavid.vn', '$2a$10$cdOqf7jqU8psNTZ3qibK4.4gkYet56GC4lNZOhp.2HX.HlK3mTjb6', '0901234567', NULL, NULL, 'active', '2026-05-20 17:00:30', '2026-05-20 17:00:30', NULL),
(61, 3, 'Đã Cập Nhật', 'user_test_1779271230459@uavid.vn', '$2a$10$aXVe/rjxU9GhfZJxNU47a.X7NThltHkQqbmK.zc5DRzN.cXyJW0pG', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-20 17:00:30', '2026-05-20 17:00:30', NULL),
(62, 3, 'Quản trị viên Test', 'admin_1779373779437@uavid.vn', '$2a$10$UcztsDuwzzl1wB45DvR1x.3gNVdFY4kH8ivXf.Eh7TytHMS9kynMK', '0901234567', NULL, NULL, 'active', '2026-05-21 21:29:39', '2026-05-21 21:29:39', NULL),
(63, 3, 'Đã Cập Nhật', 'user_test_1779373780056@uavid.vn', '$2a$10$miU9zTSBEzrumYB3DxrxJulJojjAGZZC3fnuev/Xih3nAhyXbu6UW', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-21 21:29:40', '2026-05-21 21:29:40', NULL),
(64, 3, 'Quản trị viên Test', 'admin_1779373798695@uavid.vn', '$2a$10$DP7d/e6l74Cq/FJTnOSNguBviD71nx0wQ92jNoKmAI4qSxS5QFuue', '0901234567', NULL, NULL, 'active', '2026-05-21 21:29:58', '2026-05-21 21:29:58', NULL),
(65, 3, 'Đã Cập Nhật', 'user_test_1779373799086@uavid.vn', '$2a$10$7PH/T.bnU2c7mJ38rameeeBOCePa00v42aqfe852oAgrTUvGMrlD.', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-21 21:29:59', '2026-05-21 21:29:59', NULL),
(66, 3, 'Quản trị viên Test', 'admin_1779373857873@uavid.vn', '$2a$10$iBYML5TNToE/r7EoKSmhWeXhZW6G4pknv28XbkM2YVBgp9q1aIHXq', '0901234567', NULL, NULL, 'active', '2026-05-21 21:30:58', '2026-05-21 21:30:58', NULL),
(67, 3, 'Đã Cập Nhật', 'user_test_1779373858329@uavid.vn', '$2a$10$oUBmxXKJmFvi9brJpCi8P.UG5wJuqHvKTMjRnSpkK06qyNUltE9na', '0909090909', NULL, 'Hà Nội, Việt Nam', 'active', '2026-05-21 21:30:58', '2026-05-21 21:30:58', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `violations`
--

CREATE TABLE `violations` (
  `id` int(11) NOT NULL,
  `drone_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `violation_type` varchar(100) NOT NULL COMMENT 'Loại vi phạm: bay vào vùng cấm, bay đêm không phép...',
  `description` text DEFAULT NULL,
  `fine_amount` decimal(15,2) DEFAULT 0.00 COMMENT 'Mức phạt (VND)',
  `status` enum('unpaid','paid') NOT NULL DEFAULT 'unpaid',
  `date_recorded` date NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `evidence_images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL COMMENT 'Danh sách ảnh bằng chứng vi phạm' CHECK (json_valid(`evidence_images`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `violations`
--

INSERT INTO `violations` (`id`, `drone_id`, `user_id`, `violation_type`, `description`, `fine_amount`, `status`, `date_recorded`, `createdAt`, `updatedAt`, `evidence_images`) VALUES
(2, 1, 4, 'Test', NULL, -1000.00, 'unpaid', '2026-05-07', '2026-05-07 15:49:12', '2026-05-07 15:49:12', NULL),
(3, 2, 6, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-07', '2026-05-07 15:50:57', '2026-05-07 15:50:57', NULL),
(4, 3, 7, 'Bay trái phép', NULL, 3000000.00, 'paid', '2026-05-07', '2026-05-07 15:56:49', '2026-05-07 15:56:49', NULL),
(5, 6, 9, 'Bay trái phép', NULL, 3000000.00, 'paid', '2026-05-07', '2026-05-07 16:21:41', '2026-05-07 16:21:41', NULL),
(6, 9, 11, 'Bay vào vùng cấm', 'Mô tả ban đầu', 2000000.00, 'unpaid', '2026-05-07', '2026-05-07 16:22:49', '2026-05-07 16:22:49', NULL),
(7, 15, 16, 'Bay vào vùng cấm', 'Phát hiện bay vào vùng cấm sân bay Nội Bài', 15000000.00, 'unpaid', '2026-04-27', '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?w=400\"]'),
(8, 16, 16, 'Bay đêm không có phép', 'Bay lúc 22h không xin phép', 5000000.00, 'paid', '2026-04-17', '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?w=400\"]'),
(9, 13, 15, 'Vượt độ cao quy định', 'Bay vượt 150m trong khu dân cư', 3000000.00, 'unpaid', '2026-05-05', '2026-05-07 16:39:18', '2026-05-07 16:39:18', '[\"https://images.unsplash.com/photo-1583244685026-d8519b5e3d21?w=400\"]'),
(10, 9, 3, 'Bay vào vùng cấm', 'string', 5000000.00, 'unpaid', '2026-05-07', '2026-05-07 16:53:49', '2026-05-07 16:53:49', '[]'),
(11, 9, 3, 'Bay vào vùng cấm', 'string', 5000000.00, 'unpaid', '2026-05-07', '2026-05-07 17:08:13', '2026-05-07 17:08:13', '[]'),
(12, 9, 3, 'Bay vào vùng cấm', 'string', 5000000.00, 'unpaid', '2026-05-07', '2026-05-07 17:08:15', '2026-05-07 17:08:15', '[]'),
(13, 20, 19, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-19', '2026-05-19 20:32:38', '2026-05-19 20:32:38', '[]'),
(14, 21, 21, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-19', '2026-05-19 20:33:00', '2026-05-19 20:33:00', '[]'),
(15, 22, 23, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-19', '2026-05-19 20:33:17', '2026-05-19 20:33:17', '[]'),
(16, 24, 24, 'Bay trái phép', NULL, 3000000.00, 'paid', '2026-05-19', '2026-05-19 20:33:21', '2026-05-19 20:33:21', '[]'),
(17, 27, 26, 'Bay trái phép', NULL, 3000000.00, 'paid', '2026-05-19', '2026-05-19 20:33:39', '2026-05-19 20:33:39', '[]'),
(18, 31, 28, 'Bay vào vùng cấm', 'Mô tả ban đầu', 2000000.00, 'unpaid', '2026-05-19', '2026-05-19 20:33:43', '2026-05-19 20:33:43', '[]'),
(19, 33, 31, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-19', '2026-05-19 20:52:53', '2026-05-19 20:52:53', '[]'),
(20, 35, 32, 'Bay trái phép', NULL, 3000000.00, 'paid', '2026-05-19', '2026-05-19 20:53:00', '2026-05-19 20:53:00', '[]'),
(21, 39, 34, 'Bay vào vùng cấm', 'Mô tả ban đầu', 2000000.00, 'unpaid', '2026-05-19', '2026-05-19 20:53:05', '2026-05-19 20:53:05', '[]'),
(22, 41, 37, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-19', '2026-05-19 20:57:58', '2026-05-19 20:57:58', '[]'),
(23, 43, 38, 'Bay trái phép', NULL, 3000000.00, 'paid', '2026-05-19', '2026-05-19 20:58:03', '2026-05-19 20:58:03', '[]'),
(24, 47, 40, 'Bay vào vùng cấm', 'Mô tả ban đầu', 2000000.00, 'unpaid', '2026-05-19', '2026-05-19 20:58:06', '2026-05-19 20:58:06', '[]'),
(25, 49, 43, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-19', '2026-05-19 21:22:35', '2026-05-19 21:22:35', '[]'),
(26, 51, 45, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 15:36:02', '2026-05-20 15:36:02', '[]'),
(27, 53, 47, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 15:39:34', '2026-05-20 15:39:34', '[]'),
(28, 55, 49, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 15:45:21', '2026-05-20 15:45:21', '[]'),
(29, 57, 51, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 15:50:06', '2026-05-20 15:50:06', '[]'),
(30, 59, 53, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 16:06:12', '2026-05-20 16:06:12', '[]'),
(31, 61, 55, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 16:16:47', '2026-05-20 16:16:47', '[]'),
(32, 63, 57, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 16:17:14', '2026-05-20 16:17:14', '[]'),
(33, 65, 59, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 16:59:58', '2026-05-20 16:59:58', '[]'),
(34, 67, 61, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-20', '2026-05-20 17:00:31', '2026-05-20 17:00:31', '[]'),
(35, 69, 63, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-21', '2026-05-21 21:29:41', '2026-05-21 21:29:41', '[]'),
(36, 71, 65, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-21', '2026-05-21 21:29:59', '2026-05-21 21:29:59', '[]'),
(37, 73, 67, 'Bay vào vùng cấm', 'Phát hiện lúc 14:30 ngày test', 5000000.00, 'paid', '2026-05-21', '2026-05-21 21:30:59', '2026-05-21 21:30:59', '[]');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dronecategories`
--
ALTER TABLE `dronecategories`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `drones`
--
ALTER TABLE `drones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `serial_number` (`serial_number`),
  ADD UNIQUE KEY `serial_number_2` (`serial_number`),
  ADD UNIQUE KEY `serial_number_3` (`serial_number`),
  ADD UNIQUE KEY `serial_number_4` (`serial_number`),
  ADD UNIQUE KEY `serial_number_5` (`serial_number`),
  ADD UNIQUE KEY `serial_number_6` (`serial_number`),
  ADD UNIQUE KEY `serial_number_7` (`serial_number`),
  ADD UNIQUE KEY `serial_number_8` (`serial_number`),
  ADD UNIQUE KEY `serial_number_9` (`serial_number`),
  ADD UNIQUE KEY `serial_number_10` (`serial_number`),
  ADD UNIQUE KEY `serial_number_11` (`serial_number`),
  ADD UNIQUE KEY `serial_number_12` (`serial_number`),
  ADD UNIQUE KEY `serial_number_13` (`serial_number`),
  ADD UNIQUE KEY `serial_number_14` (`serial_number`),
  ADD UNIQUE KEY `serial_number_15` (`serial_number`),
  ADD UNIQUE KEY `serial_number_16` (`serial_number`),
  ADD UNIQUE KEY `serial_number_17` (`serial_number`),
  ADD UNIQUE KEY `serial_number_18` (`serial_number`),
  ADD UNIQUE KEY `serial_number_19` (`serial_number`),
  ADD UNIQUE KEY `serial_number_20` (`serial_number`),
  ADD KEY `owner_id` (`owner_id`),
  ADD KEY `manufacturer_id` (`manufacturer_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indexes for table `flightlogs`
--
ALTER TABLE `flightlogs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `drone_id` (`drone_id`),
  ADD KEY `permit_id` (`permit_id`);

--
-- Indexes for table `flightpermits`
--
ALTER TABLE `flightpermits`
  ADD PRIMARY KEY (`id`),
  ADD KEY `drone_id` (`drone_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `zone_id` (`zone_id`);

--
-- Indexes for table `flightzones`
--
ALTER TABLE `flightzones`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inspections`
--
ALTER TABLE `inspections`
  ADD PRIMARY KEY (`id`),
  ADD KEY `drone_id` (`drone_id`),
  ADD KEY `inspector_id` (`inspector_id`);

--
-- Indexes for table `lookuphistory`
--
ALTER TABLE `lookuphistory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_identification_code` (`identification_code`);

--
-- Indexes for table `manufacturers`
--
ALTER TABLE `manufacturers`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `otpcodes`
--
ALTER TABLE `otpcodes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `registrations`
--
ALTER TABLE `registrations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `identification_code` (`identification_code`),
  ADD UNIQUE KEY `identification_code_2` (`identification_code`),
  ADD UNIQUE KEY `identification_code_3` (`identification_code`),
  ADD UNIQUE KEY `identification_code_4` (`identification_code`),
  ADD UNIQUE KEY `identification_code_5` (`identification_code`),
  ADD UNIQUE KEY `identification_code_6` (`identification_code`),
  ADD UNIQUE KEY `identification_code_7` (`identification_code`),
  ADD UNIQUE KEY `identification_code_8` (`identification_code`),
  ADD UNIQUE KEY `identification_code_9` (`identification_code`),
  ADD UNIQUE KEY `identification_code_10` (`identification_code`),
  ADD UNIQUE KEY `identification_code_11` (`identification_code`),
  ADD UNIQUE KEY `identification_code_12` (`identification_code`),
  ADD UNIQUE KEY `identification_code_13` (`identification_code`),
  ADD UNIQUE KEY `identification_code_14` (`identification_code`),
  ADD UNIQUE KEY `identification_code_15` (`identification_code`),
  ADD UNIQUE KEY `identification_code_16` (`identification_code`),
  ADD UNIQUE KEY `identification_code_17` (`identification_code`),
  ADD UNIQUE KEY `identification_code_18` (`identification_code`),
  ADD UNIQUE KEY `identification_code_19` (`identification_code`),
  ADD UNIQUE KEY `identification_code_20` (`identification_code`),
  ADD KEY `idx_identification_code` (`identification_code`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `drone_id` (`drone_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD UNIQUE KEY `name_2` (`name`),
  ADD UNIQUE KEY `name_3` (`name`),
  ADD UNIQUE KEY `name_4` (`name`),
  ADD UNIQUE KEY `name_5` (`name`),
  ADD UNIQUE KEY `name_6` (`name`),
  ADD UNIQUE KEY `name_7` (`name`),
  ADD UNIQUE KEY `name_8` (`name`),
  ADD UNIQUE KEY `name_9` (`name`),
  ADD UNIQUE KEY `name_10` (`name`),
  ADD UNIQUE KEY `name_11` (`name`),
  ADD UNIQUE KEY `name_12` (`name`),
  ADD UNIQUE KEY `name_13` (`name`),
  ADD UNIQUE KEY `name_14` (`name`),
  ADD UNIQUE KEY `name_15` (`name`),
  ADD UNIQUE KEY `name_16` (`name`),
  ADD UNIQUE KEY `name_17` (`name`),
  ADD UNIQUE KEY `name_18` (`name`),
  ADD UNIQUE KEY `name_19` (`name`),
  ADD UNIQUE KEY `name_20` (`name`);

--
-- Indexes for table `systemsettings`
--
ALTER TABLE `systemsettings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key_name` (`key_name`),
  ADD UNIQUE KEY `key_name_2` (`key_name`),
  ADD UNIQUE KEY `key_name_3` (`key_name`),
  ADD UNIQUE KEY `key_name_4` (`key_name`),
  ADD UNIQUE KEY `key_name_5` (`key_name`),
  ADD UNIQUE KEY `key_name_6` (`key_name`),
  ADD UNIQUE KEY `key_name_7` (`key_name`),
  ADD UNIQUE KEY `key_name_8` (`key_name`),
  ADD UNIQUE KEY `key_name_9` (`key_name`),
  ADD UNIQUE KEY `key_name_10` (`key_name`),
  ADD UNIQUE KEY `key_name_11` (`key_name`),
  ADD UNIQUE KEY `key_name_12` (`key_name`),
  ADD UNIQUE KEY `key_name_13` (`key_name`),
  ADD UNIQUE KEY `key_name_14` (`key_name`),
  ADD UNIQUE KEY `key_name_15` (`key_name`),
  ADD UNIQUE KEY `key_name_16` (`key_name`),
  ADD UNIQUE KEY `key_name_17` (`key_name`),
  ADD UNIQUE KEY `key_name_18` (`key_name`),
  ADD UNIQUE KEY `key_name_19` (`key_name`),
  ADD UNIQUE KEY `key_name_20` (`key_name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `email_5` (`email`),
  ADD UNIQUE KEY `email_6` (`email`),
  ADD UNIQUE KEY `email_7` (`email`),
  ADD UNIQUE KEY `email_8` (`email`),
  ADD UNIQUE KEY `email_9` (`email`),
  ADD UNIQUE KEY `email_10` (`email`),
  ADD UNIQUE KEY `email_11` (`email`),
  ADD UNIQUE KEY `email_12` (`email`),
  ADD UNIQUE KEY `email_13` (`email`),
  ADD UNIQUE KEY `email_14` (`email`),
  ADD UNIQUE KEY `email_15` (`email`),
  ADD UNIQUE KEY `email_16` (`email`),
  ADD UNIQUE KEY `email_17` (`email`),
  ADD UNIQUE KEY `email_18` (`email`),
  ADD UNIQUE KEY `email_19` (`email`),
  ADD UNIQUE KEY `email_20` (`email`),
  ADD UNIQUE KEY `cccd_number` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_2` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_3` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_4` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_5` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_6` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_7` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_8` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_9` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_10` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_11` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_12` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_13` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_14` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_15` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_16` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_17` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_18` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_19` (`cccd_number`),
  ADD UNIQUE KEY `cccd_number_20` (`cccd_number`),
  ADD KEY `role_id` (`role_id`);

--
-- Indexes for table `violations`
--
ALTER TABLE `violations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `drone_id` (`drone_id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dronecategories`
--
ALTER TABLE `dronecategories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT for table `drones`
--
ALTER TABLE `drones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=75;

--
-- AUTO_INCREMENT for table `flightlogs`
--
ALTER TABLE `flightlogs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `flightpermits`
--
ALTER TABLE `flightpermits`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- AUTO_INCREMENT for table `flightzones`
--
ALTER TABLE `flightzones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- AUTO_INCREMENT for table `inspections`
--
ALTER TABLE `inspections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `lookuphistory`
--
ALTER TABLE `lookuphistory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `manufacturers`
--
ALTER TABLE `manufacturers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=513;

--
-- AUTO_INCREMENT for table `otpcodes`
--
ALTER TABLE `otpcodes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `registrations`
--
ALTER TABLE `registrations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=67;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `systemsettings`
--
ALTER TABLE `systemsettings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `violations`
--
ALTER TABLE `violations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `drones`
--
ALTER TABLE `drones`
  ADD CONSTRAINT `drones_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `drones_ibfk_10` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_11` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_12` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_13` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_14` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_15` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_16` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_17` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_18` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_19` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_2` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `drones_ibfk_20` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_21` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_22` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_23` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_24` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_25` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_26` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_27` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_28` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_29` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_3` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `drones_ibfk_30` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_31` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_32` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_33` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_34` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_35` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_36` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_37` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_38` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_39` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_4` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_40` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_41` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_42` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_43` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_44` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_45` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_46` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_47` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_48` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_49` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_5` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_50` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_51` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_52` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_53` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_54` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_55` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_56` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_57` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_58` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_59` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_6` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_60` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_7` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_8` FOREIGN KEY (`manufacturer_id`) REFERENCES `manufacturers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `drones_ibfk_9` FOREIGN KEY (`category_id`) REFERENCES `dronecategories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `flightlogs`
--
ALTER TABLE `flightlogs`
  ADD CONSTRAINT `flightlogs_ibfk_1` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_10` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_11` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_12` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_13` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_14` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_15` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_16` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_17` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_18` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_19` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_2` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `flightlogs_ibfk_20` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_21` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_22` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_23` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_24` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_25` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_26` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_27` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_28` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_29` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_3` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_30` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_31` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_32` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_33` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_34` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_35` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_36` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_37` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_38` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_39` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_4` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_40` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_5` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_6` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_7` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_8` FOREIGN KEY (`permit_id`) REFERENCES `flightpermits` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `flightlogs_ibfk_9` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `flightpermits`
--
ALTER TABLE `flightpermits`
  ADD CONSTRAINT `flightpermits_ibfk_1` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_10` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_12` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_13` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_15` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_16` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_18` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_19` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_21` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_22` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_23` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_24` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_25` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_26` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_27` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_28` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_29` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_3` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_30` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_31` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_32` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_33` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_34` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_35` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_36` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_37` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_38` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_39` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_4` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_40` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_41` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_42` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_43` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_44` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_45` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_46` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_47` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_48` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_49` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_50` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_51` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_52` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_53` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_54` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_55` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_56` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_57` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_58` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_59` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_6` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_60` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_7` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `flightpermits_ibfk_9` FOREIGN KEY (`zone_id`) REFERENCES `flightzones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `inspections`
--
ALTER TABLE `inspections`
  ADD CONSTRAINT `inspections_ibfk_1` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_10` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_11` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_12` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_13` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_14` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_15` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_16` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_17` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_18` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_19` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_2` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_20` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_21` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_22` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_23` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_24` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_25` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_26` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_27` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_28` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_29` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_3` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_30` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_31` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_32` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_33` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_34` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_35` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_36` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_37` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_38` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_39` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_4` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_40` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_5` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_6` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_7` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_8` FOREIGN KEY (`inspector_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `inspections_ibfk_9` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `notifications_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `otpcodes`
--
ALTER TABLE `otpcodes`
  ADD CONSTRAINT `otpcodes_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_11` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_13` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_15` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_17` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_19` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_5` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_7` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `otpcodes_ibfk_9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `registrations`
--
ALTER TABLE `registrations`
  ADD CONSTRAINT `registrations_ibfk_1` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_10` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_11` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_12` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_13` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_14` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_15` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_16` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_17` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_18` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_19` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_2` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_20` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_3` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_4` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_5` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_6` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_7` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_8` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `registrations_ibfk_9` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  ADD CONSTRAINT `users_ibfk_10` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_11` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_12` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_13` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_14` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_15` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_16` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_17` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_18` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_19` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_20` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_3` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_4` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_5` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_6` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_7` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_8` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_ibfk_9` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `violations`
--
ALTER TABLE `violations`
  ADD CONSTRAINT `violations_ibfk_1` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `violations_ibfk_10` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_11` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_12` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_13` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_14` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_15` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_16` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_17` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_18` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_19` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `violations_ibfk_20` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_21` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_22` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_23` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_24` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_25` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_26` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_27` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_28` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_29` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_3` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_30` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_31` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_32` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_33` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_34` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_35` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_36` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_37` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_38` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_39` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_4` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_40` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_5` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_6` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_7` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `violations_ibfk_9` FOREIGN KEY (`drone_id`) REFERENCES `drones` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
