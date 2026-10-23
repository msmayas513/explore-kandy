CREATE DATABASE  IF NOT EXISTS `explore_kandy` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `explore_kandy`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: explore_kandy
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attractions`
--

DROP TABLE IF EXISTS `attractions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attractions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `category` varchar(50) NOT NULL,
  `distance` decimal(5,1) NOT NULL,
  `description` text,
  `latitude` decimal(10,7) DEFAULT NULL,
  `longitude` decimal(10,7) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attractions`
--

LOCK TABLES `attractions` WRITE;
/*!40000 ALTER TABLE `attractions` DISABLE KEYS */;
INSERT INTO `attractions` VALUES (1,'Sri Dalada Maligawa','Religious',6.5,'A historic Buddhist temple that houses the Sacred Tooth Relic of the Buddha.',7.2936000,80.6413000),(2,'Dunumadalawa Forest Reserve','Nature',7.8,'A forest reserve known for its biodiversity, wildlife, and importance as a watershed.',7.2810160,80.6428891),(3,'Hanthana International Bird Park','Nature',13.0,'A bird park in the Hanthana area featuring a variety of bird species.',7.2687901,80.6351852),(4,'Ceylon Tea Museum','Historical',13.0,'A museum located in the former Hantane Tea Factory showcasing Sri Lanka\'s tea history.',7.2686000,80.6338000),(5,'Sembuwatta Lake','Nature',23.0,'A scenic lake surrounded by the Elkaduwa tea plantation.',7.4370444,80.6997809),(6,'Kalabokka 360 Upper Division View Point','Nature',25.0,'A panoramic viewpoint near Panwila offering views of the surrounding mountains.',7.4347384,80.7124608),(7,'Hunasgiriya Waterfall','Nature',15.0,'A waterfall near Hunasgiriya surrounded by natural scenery.',7.4037122,80.6897594),(8,'Nelligala International Buddhist Centre','Religious',22.0,'A Buddhist religious centre located in the Muruthalawa area.',7.3024108,80.5603734),(9,'Embekka Dewalaya','Historical',23.0,'A historic temple renowned for its intricate wooden carvings.',7.2181466,80.5681295),(10,'Gadaladeniya Raja Maha Viharaya','Historical',20.0,'An ancient Buddhist monastery built on a rock, with an inscription dating its construction to 1344.',7.2576471,80.5563758);
/*!40000 ALTER TABLE `attractions` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-24  3:42:29
