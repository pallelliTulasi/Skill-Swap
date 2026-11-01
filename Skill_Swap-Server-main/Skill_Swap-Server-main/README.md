# Skill Swap Server

This is the **backend server** for the Skill Swap project, built with **Spring Boot**, **Java**, and **MySQL**.  
It provides APIs for managing **users**, **skills**, and **messages** between users who want to learn or teach skills.

---

## Table of Contents

- [Technologies](#technologies)  
- [Features](#features)  
- [API Endpoints](#api-endpoints)  
- [Database Setup](#database-setup)  
- [Running Locally](#running-locally)  
- [Deployment](#deployment)  

---

## Technologies

- Java 17  
- Spring Boot 3.x  
- Spring Data JPA / Hibernate  
- MySQL / H2 (optional for testing)  
- Maven  
- Lombok  

---

## Features

- Register and manage **users**  
- Add and manage **skills to learn** and **skills to teach**  
- Send and view **messages** between users  
- RESTful APIs with JSON responses  
- CORS enabled for React frontend  

---

## API Endpoints

### Users

| Method | Endpoint | Description |
|--------|---------|------------|
| GET    | `/api/users` | Get all users with all fields |
| GET    | `/api/users/skills-to-learn` | Get all unique skills users want to learn |
| GET    | `/api/users/skills-to-teach` | Get all unique skills users can teach |

### Messages

| Method | Endpoint | Description |
|--------|---------|------------|
| GET    | `/api/messages/all` | Get all messages |
| GET    | `/api/messages/conversation/{userId1}/{userId2}` | Get conversation between two users |
| POST   | `/api/messages/send` | Send a message (pass JSON in body) |

---

## Database Setup

1. Create a MySQL database, e.g., `skillswap_db`.  
2. Update `application.properties` or `application.yml` with your MySQL credentials:  
Tables needed:
users → stores user info
user_skills_to_learn → skills user wants to learn
user_skills_to_teach → skills user can teach
messages → stores chat messages
## Live Backend Link

You can access the deployed backend here:

[Skill Swap Server - Live](https://skill-swap-server-pgca.onrender.com)
