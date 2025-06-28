# Healthcare Platform

This project is a healthcare platform with user authentication (login/registration) features.

## Project Structure

The project consists of two parts:
1. Frontend React application (using TypeScript, Redux, and Material UI)
2. Backend .NET API for authentication

## Setup Instructions

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd SWR302-fe-homelanding
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`.

### Backend Setup

1. Navigate to the backend directory:
```bash
cd SWR302-fe-homelanding/AuthApi
```

2. Restore .NET packages:
```bash
dotnet restore
```

3. Run the API:
```bash
dotnet run
```

The API will be available at:
- HTTPS: `https://localhost:7090/api/Auth`
- HTTP: `http://localhost:5090/api/Auth`
- Swagger UI: `https://localhost:7090/swagger`

## Features

- User registration with validation
- User login
- JWT authentication
- Redux state management
- Material UI components
- Form validation
- Backend .NET API
- In-memory user storage (for demo purposes)

## Authentication Endpoints

- POST `/api/Auth/login` - User login
- POST `/api/Auth/register` - User registration
- GET `/api/Auth/me` - Get current user info (requires authentication)

## Demo Account

You can use the following demo account:
- Email: `demo@example.com`
- Password: `password`

# HIV Care Services Frontend

A React-based front-end application for HIV Care Services, providing patient tools for medication management, appointment booking, and consultations.

## Features

- **Authentication & User Management**
- **Appointment Booking**
  - Schedule in-person or telemedicine appointments
  - View appointment history
  - Manage upcoming appointments
- **Medication Reminders**
  - Set up ARV medication reminders
  - Track medication adherence
- **Online Consultations**
  - Ask questions to healthcare professionals
  - View consultation history
  - Get professional medical advice

## Technologies

- React 18
- TypeScript
- Material UI
- Redux Toolkit for state management
- Axios for API requests
- React Router for routing
- Vite for development and building

## Getting Started

### Prerequisites

- Node.js 16+ and npm

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd SWR302-fe-homelanding
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create an environment file
   ```bash
   cp src/env.sample .env
   ```

4. Update the `.env` file with your backend API URL:
   ```
   VITE_API_URL="https://localhost:7090/api"
   ```

5. Start the development server
   ```bash
   npm run dev
   ```

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

## Connecting to the .NET Backend

This frontend is designed to work with a .NET 8.0 Web API backend. The API services are configured in the `src/services` directory.

### API Services

All API interactions are handled through service modules:

- `authService`: User authentication and management
- `appointmentService`: Appointment booking and management
- `reminderService`: Medication reminders and appointments
- `consultationService`: Online consultations with healthcare professionals

See `src/services/README.md` for detailed API documentation.

### Backend Requirements

The .NET backend should implement the following API endpoints:

1. Authentication
   - POST /api/auth/login
   - POST /api/auth/register
   - GET /api/auth/me

2. Appointments
   - GET /api/appointments/user/{userId}
   - GET /api/appointments/user/{userId}/status/{status}
   - POST /api/appointments
   - PUT /api/appointments/{appointmentId}
   - PUT /api/appointments/{appointmentId}/cancel

3. Reminders
   - GET /api/reminders/medications/{userId}
   - POST /api/reminders/medications
   - PUT /api/reminders/medications/{reminderId}
   - DELETE /api/reminders/medications/{reminderId}
   - GET /api/reminders/appointments/{userId}
   - POST /api/reminders/appointments
   - PUT /api/reminders/appointments/{reminderId}
   - DELETE /api/reminders/appointments/{reminderId}

4. Consultations
   - GET /api/consultations/patient/{userId}
   - GET /api/consultations/{consultationId}
   - POST /api/consultations
   - PUT /api/consultations/{consultationId}/answer

## License

This project is licensed under the MIT License.
