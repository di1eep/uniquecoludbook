# Student-Teacher Meeting Assignment Project

## Project Overview
This project is a web-based application that manages student-teacher meetings. It is built using a modern full-stack approach, with React.js on the frontend, Node.js/Express.js on the backend, and MongoDB as the database. The application is deployed on an AWS instance.

---

## Technologies Used

### Frontend:
- **React.js**: The main JavaScript library used to build the user interface.
- **Vite**: Used to set up the development environment with fast build times.
- **Axios**: A promise-based HTTP client used to send requests to the backend API.
- **CORS**: Configured to resolve cross-origin resource sharing issues.
- **CSS**: Plain styling is used without any specific framework.

### Backend:
- **Node.js & Express.js**: Used to handle HTTP requests and manage the server-side logic.
- **Mongoose**: A MongoDB object modeling tool that helps interact with the database.
- **JWT (JSON Web Token)**: Used for secure token-based authentication.
- **Bcrypt**: A hashing library used to securely store user passwords.

### Database:
- **MongoDB**: Cloud-based NoSQL database used to store data.
  - **Collections:**
    - **Users**: Contains data about students and professors, including hashed passwords.
    - **Meetings**: Manages scheduled meetings between students and professors.

### Deployment:
- **AWS Instance**: Both the frontend and backend are deployed on an AWS instance.
- **Environment Variables**: Not yet implemented; sensitive details are currently hardcoded in the code.

---

## How to Run the Project

### Clone the Repository
```bash
git clone https://github.com/di1eep/uniquecoludbook.git
```

### Run the Frontend
```bash
cd frontend  # Navigate to the client
npm install  # Install dependencies
npm run dev  # Start the development server
```

### Run the Backend
```bash
cd backend  # Navigate to the server
npm install  # Install dependencies
npm run dev  # Start the backend server
```

---

## Project Repository
[GitHub Repository](https://github.com/di1eep/uniquecoludbook.git)

---

## Database Schema

### Users Collection:
Stores data for both students and professors.

```json
{
  "_id": ObjectId,
  "name": String,       // Name of the user (student or professor)
  "email": String,      // Email address (unique)
  "password": String,   // Hashed password
  "role": String,       // User role ('student' or 'professor')
  "__v": Number         // Version key (used by Mongoose)
}
```

**Example:**
```json
{
  "_id": "ObjectId(\"67714c3d72406a317cafcdd8\")",
  "name": "Professor one",
  "email": "professorone@gmail.com",
  "password": "$2b$10$ROUt7eyBrlAhwlzJruC4nePuzmKCxZBq28i..wO.pDcASDOjym1MG",
  "role": "professor",
  "__v": 0
}
```

### Availabilities Collection:
Stores the availability slots of professors.

```json
{
  "_id": ObjectId,
  "professorId": ObjectId,   // Reference to the professor's ID in Users
  "date": String,            // Date of availability (e.g., '2024-12-30')
  "slots": [String],         // Available time slots (e.g., ['10:00 AM', '11:00 AM'])
  "__v": Number              // Version key (used by Mongoose)
}
```

**Example:**
```json
{
  "_id": "ObjectId(\"6771540993a5fe8c8f78fdb6\")",
  "professorId": "ObjectId(\"67714c3d72406a317cafcdd8\")",
  "date": "2024-12-30",
  "slots": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "1:00 PM"],
  "__v": 2
}
```

### Appointments Collection:
Stores the scheduled appointments for students and professors.

```json
{
  "_id": ObjectId,
  "studentId": ObjectId,   // Reference to the student's ID in Users
  "professorId": ObjectId, // Reference to the professor's ID in Users
  "date": String,          // Date of the appointment (e.g., '2024-12-30')
  "time": String,          // Time of the appointment (e.g., '12:00 PM')
  "__v": Number            // Version key (used by Mongoose)
}
```

**Example:**
```json
{
  "_id": "ObjectId(\"67714e6672406a317cafcdec\")",
  "studentId": "ObjectId(\"67714c6572406a317cafcdda\")",
  "professorId": "ObjectId(\"67714c3d72406a317cafcdd8\")",
  "date": "2024-12-30",
  "time": "12:00 PM",
  "__v": 0
}
```

---

## Application Flow
1. **User Authentication:**
   - Users (students/professors) log in using their email and password.
   - The backend uses JWT to issue secure tokens for user authentication.
   - Passwords are hashed using bcrypt for secure storage.

2. **View Professor Availability:**
   - Students can view available time slots for professors.
   - Professors set their availability through the application.

3. **Scheduling Meetings:**
   - Students can select a professor's available slot and book an appointment.
   - The meeting is stored in the "Appointments" collection.

4. **AWS Deployment:**
   - The frontend (React.js) and backend (Node.js/Express.js) are deployed on AWS for full accessibility.

---

## Future Improvements
- Implement **environment variables** for better security.
- Add **notifications** for upcoming appointments.
- Implement a **rating/review system** for students and professors after meetings.
