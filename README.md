# Skill Swap – Student Skill Exchange Platform

## About the Project

Skill Swap is a student-focused platform designed to encourage peer-to-peer learning and knowledge sharing. It allows students to connect with others, exchange skills, and learn from each other through an interactive platform.

Instead of depending only on traditional learning methods, students can share their knowledge and gain new skills through collaboration.

## Features

### 1. Student Module
- Student registration and login.
- Students can showcase their skills.
- Skill-based assessments to evaluate their knowledge.
- Connect with other students based on skill requirements.
- Send and manage skill exchange requests.
- Chat with connected students for knowledge sharing.
- Manage personal profiles.

### 2. Admin Module
- Dedicated admin login and dashboard.
- Monitor student activities.
- Manage and monitor skill-related activities.
- Restrict students from teaching more than three skills without admin approval.
- Help prevent unauthorized activities.

## Technologies Used

**Frontend**
- React.js
- JavaScript
- HTML5
- CSS3

**Backend**
- Java
- Spring Boot
- REST APIs

**Database**
- [Add your database name]

**Tools**
- Visual Studio Code
- Git and GitHub
- Firebase (if used in the deployed application)

## Project Structure

```text
Skill-Swap/
│
├── skillswap-frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── Chats.js
│   │   │   ├── Explore.js
│   │   │   ├── Login.js
│   │   │   ├── Profile.js
│   │   │   ├── RequestPanel.js
│   │   │   └── Signup.js
│   │   └── styles/
│   ├── package.json
│   └── README.md
│
└── Skill_Swap-Server-main/
    └── Skill_Swap-Server-main/
        ├── src/
        ├── pom.xml
        └── README.md
```

## How It Works

1. Students register and log in to the platform.
2. They take assessments based on the skills they already know.
3. Students can explore and connect with other students.
4. Once connected, they can communicate through chat.
5. Students exchange knowledge by teaching each other.
6. Admin monitors activities and manages skill restrictions.

## Installation and Setup

### Frontend Setup

```bash
cd skillswap-frontend
npm install
npm start
```

### Backend Setup

Navigate to the Spring Boot project directory:

```bash
cd Skill_Swap-Server-main/Skill_Swap-Server-main
```

Run the backend using Maven:

```bash
mvn spring-boot:run
```

Make sure the database configuration and backend application properties are correctly configured before starting the application.

## Future Enhancements

- Improved skill recommendation system.
- Advanced student matching.
- Notifications for skill exchange requests.
- Enhanced admin analytics.
- Improved user experience.

## Project Purpose

The main objective of Skill Swap is to create a collaborative learning environment where students can learn new skills from their peers while sharing their own knowledge.

---

**Project:** Skill Swap  
**Category:** Student Learning and Skill Exchange Platform  
**Repository:** [GitHub – Skill Swap](https://github.com/pallelliTulasi/Skill-Swap)
