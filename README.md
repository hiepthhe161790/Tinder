# Tinder-like app

## Describe project
This project is a web application similar to Tinder, allowing users to search, connect and contact each other.

## Technology used
- Laravel (Backend Framework): Used to build server-side parts, handle business logic, and manage databases.
- Next.js (Frontend Framework): Used to build interactive, responsive user interfaces, and interact with backend APIs.
- MySQL (Database): Used to store user information, personal profiles, and data related to the connection between users.

## Install and Run the project

### Backend (Laravel)
1. Make sure you have Composer and PHP installed on your computer.
2. Clone project from repository.
3. Move into the project's backend directory.
4. Copy the `.env.example` file to `.env` and configure the MySQL database connection.
5. Run the following commands: composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
6. Backend will run on `http://localhost:8000`.

### Frontend (Next.js)
1. Make sure you have Node.js installed on your computer.
2. Move into the project's frontend folder.
3. Run the following commands:npm install
npm run dev
4. Frontend will run on `http://localhost:3000`.

## Directory structure

- `backend/`: Contains the source code of the Laravel backend.
- `frontend/`: Contains the source code of the frontend Next.js.
- `docs/`: Contains project documentation, instructions, and reports.

## Contribute
If you would like to contribute to the project, please create a pull request or contact us below.

## Contact
Email: hiepthhe161790@fpt.edu.vn
