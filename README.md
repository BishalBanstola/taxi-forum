# Taxi Forum

Taxi Forum is a platform for taxi drivers to share news, road conditions, and important updates. The project features a full-stack application with a Spring Boot backend, React frontend, and supporting services for notifications and payments.

## Features

- **Community Forum:** Share and discuss news and road conditions.
- **Real-time Notifications:** Stay updated with Kafka-powered notifications.
- **Payment Integration:** Secure payment handling via AWS Lambda.

## Architecture

- **Backend (Spring Boot):** Manages forum operations, using MySQL and Kafka.
- **Payment Service (AWS Lambda):** Node.js service for payment processing.
- **Frontend (React + TypeScript):** User interface with Tailwind CSS.
- **Infrastructure:** Managed with Terraform and Jenkins.

## Getting Started

### Prerequisites

- **Java 17+**
- **Node.js & npm**
- **MySQL**
- **Kafka**
- **Terraform & AWS CLI**
- **Jenkins**

### Installation

1. **Clone the Repo:**
   ```bash
   git clone https://github.com/BishalBanstola/taxi-forum.git
   
Configure application-local.properties with your database and Kafka settings.

2. **Build and run the Spring Boot application:**
   ```bash
   ./mvnw clean install
   ./mvnw spring-boot:run

3. **Frontend (React):**
   ```bash
   npm install && npm run dev

4. **Infrastructure:**
   ```bash
   terraform init
   terraform apply
