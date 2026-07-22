# 🍽️ AURA Restaurant Ordering System

A cloud-based restaurant ordering and management system built using **HTML**, **CSS**, and **JavaScript**, and deployed on **Amazon Web Services (AWS)**. The application utilizes **Amazon S3**, **AWS Lambda**, **Amazon API Gateway**, and **Amazon DynamoDB** to deliver a scalable, serverless solution for restaurant operations.

---

## 🌐 Live Demo

**Website:**  
http://aura-restaurant-website-123-978557329643-ap-south-1-an.s3-website.ap-south-1.amazonaws.com/index.html

---

## 📖 Overview

AURA is a role-based restaurant management system designed to streamline restaurant operations through a cloud-native architecture. The application provides dedicated interfaces for customers, chefs, waiters, billing staff, and administrators, enabling efficient order management and processing.

The project demonstrates the integration of multiple AWS services to build and deploy a serverless web application.

---

## ✨ Features

- 🍽️ Customer ordering interface
- 👨‍🍳 Chef dashboard
- 🍴 Waiter dashboard
- 🧾 Billing management
- 👨‍💼 Administrator dashboard
- 🌐 Online and offline ordering modes
- ☁️ Serverless cloud deployment
- 📱 Responsive web interface

---

## 🛠️ Technologies Used

| Category | Technologies |
|-----------|--------------|
| Frontend | HTML5, CSS3, JavaScript |
| Cloud Platform | Amazon Web Services (AWS) |
| Storage | Amazon S3 |
| Backend | AWS Lambda |
| API Management | Amazon API Gateway |
| Database | Amazon DynamoDB |
| IDE | Visual Studio Code |

---

## ☁️ AWS Services Used

- **Amazon S3** – Static website hosting
- **AWS Lambda** – Serverless backend for order processing
- **Amazon API Gateway** – REST API integration
- **Amazon DynamoDB** – Storage for menu and order information

---

## 🏗️ System Architecture

```text
             Customer
                 │
                 ▼
      Amazon S3 Static Website
                 │
                 ▼
         Amazon API Gateway
                 │
                 ▼
           AWS Lambda Function
                 │
                 ▼
         Amazon DynamoDB Tables
         ├── MenuTable
         └── OrdersTable
```

---

## 📂 Project Structure

```text
AURA-Restaurant-Ordering-System/
│
├── web/
│   ├── index.html
│   ├── admin.html
│   ├── billing.html
│   ├── chef.html
│   ├── waiter.html
│   ├── online.html
│   ├── offline.html
│   ├── style.css
│   └── *.js
│
├── lambda/
│   └── placeOrderFunction.js
│
├── screenshots/
│
├── README.md
├── LICENSE
└── .gitignore
```

---

## ⚙️ Workflow

1. Customer accesses the restaurant website hosted on Amazon S3.
2. The customer selects online or offline ordering.
3. API Gateway receives requests from the frontend.
4. AWS Lambda processes menu retrieval and order placement.
5. Order and menu data are stored in Amazon DynamoDB.
6. Restaurant staff manage orders through dedicated dashboards.
7. The application delivers a complete serverless restaurant management workflow.

---

## 📊 Project Highlights

- Cloud-native serverless architecture
- Static website hosting using Amazon S3
- RESTful API integration with API Gateway
- Serverless backend using AWS Lambda
- NoSQL database using Amazon DynamoDB
- Role-based restaurant management system
- Modular frontend using HTML, CSS, and JavaScript

---

## 🎯 Learning Outcomes

This project demonstrates practical knowledge of:

- Cloud Computing with AWS
- Serverless Application Development
- REST API Development
- Static Website Hosting
- NoSQL Database Management
- Frontend Web Development
- Role-Based System Design
- Cloud Deployment

---

## 📷 Screenshots

Project screenshots can be found in the **screenshots/** directory.

Example screenshots include:

- Home Page
- Customer Interface
- Admin Dashboard
- Chef Dashboard
- Waiter Dashboard
- Billing Dashboard

---

## 🔮 Future Improvements

- User authentication and authorization
- Online payment gateway integration
- Real-time order tracking
- Push notifications
- Customer order history
- Mobile-friendly interface
- Analytics dashboard

---

## 👩‍💻 Author

**Bommisetty Nikhita**

B.Tech – Computer Science (Artificial Intelligence)

Amrita Vishwa Vidyapeetham

---

## 📄 License

This project is licensed under the MIT License.

---
