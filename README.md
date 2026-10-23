# explore-kandy
A web-based tourist attraction information and one-day visit planning system for Kandy, Sri Lanka.


## Project Overview

Explore Kandy is a web-based tourist attraction information and one-day visit planning system designed for visitors to Kandy, Sri Lanka.

The system allows tourists to explore local attractions, view detailed information, discover attraction locations on an interactive map, and create a personalized one-day visit plan.

It also includes a secure administrator login and dashboard for managing tourist attraction information.

## Main Features

- Browse tourist attractions in Kandy.
- Filter attractions by Nature, Religious, and Historical categories.
- View attraction descriptions and distances.
- Explore attraction locations on an interactive map.
- Add and remove attractions from a one-day trip plan.
- View estimated total visiting time.
- Administrator login with password authentication.
- Administrator dashboard displaying attraction statistics.
- Add, edit, and delete attractions through the administrator dashboard.
- Store and retrieve attraction information using MySQL.


## Technologies Used

### Frontend
- React.js
- Vite
- HTML5
- CSS3
- JavaScript
- React Leaflet and OpenStreetMap

### Backend
- Node.js
- Express.js
- REST API
- JWT Authentication
- bcrypt Password Hashing

### Database
- MySQL

### Development Tools
- Visual Studio Code
- MySQL Workbench
- Git and GitHub


## Prerequisites

Before running Explore Kandy, make sure the following software is installed:

- Node.js and npm
- MySQL Server
- MySQL Workbench (recommended)
- Visual Studio Code (recommended)

## Project Structure

explore-kandy/
- frontend/ — React frontend application
- backend/ — Node.js and Express backend API
- explore_kandy_database.sql — Attraction database backup
- admin_table_setup.sql — Administrator table structure
- README.md — Project documentation

## Database Setup

1. Open MySQL Workbench and connect to your MySQL Server.

2. Create a database named `explore_kandy` if it does not already exist:

   ```sql
   CREATE DATABASE IF NOT EXISTS explore_kandy;
   ```

3. Open `explore_kandy_database.sql` in MySQL Workbench and execute the script to create and populate the attractions table.

4. Open `admin_table_setup.sql` and execute it to create the administrators table.

5. Verify that the database contains the following tables:
   - `attractions`
   - `admins`

**Note:** The administrator table setup creates the table structure only. An administrator account must be created separately with a bcrypt-hashed password.



## Backend Setup

1. Open a terminal in the project folder and navigate to the backend:

   ```bash
   cd backend
   ```

2. Install the required packages:

   ```bash
   npm install
   ```

3. Create a `.env` file inside the `backend` folder.

4. Add the following configuration to `.env`, replacing the example values with your own MySQL credentials:

   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=explore_kandy
   JWT_SECRET=replace_with_a_long_random_secret
   ```

5. Start the backend server:

   ```bash
   node server.js
   ```

The backend API runs at:

`http://localhost:5000`

**Security Note:** Never upload the `.env` file or database passwords to GitHub. The `.env` file is excluded using `.gitignore`.



## Frontend Setup

1. Open a new terminal in the project folder.

2. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

3. Install the required packages:

   ```bash
   npm install
   ```

4. Start the React development server:

   ```bash
   npm run dev
   ```

5. Open the following address in your browser:

   http://localhost:5173

**Note:** The backend server must also be running for attraction information, admin login, and database operations to work.



## Administrator Account

Explore Kandy includes a protected administrator dashboard for managing tourist attractions.

The administrator can:
- Add new attractions.
- Edit existing attraction information.
- Delete attractions.
- View the total number of attractions.

Administrator passwords are securely hashed using bcrypt, and login authentication uses JSON Web Tokens (JWT).

For security reasons, administrator credentials and password hashes are not included in the database backup.

An administrator account must be created separately by inserting a username and a bcrypt-generated password hash into the `admins` table.

**Note:** Do not store administrator passwords in the README or upload them to GitHub.
