# API Services Documentation

This directory contains service files for making API calls to the backend .NET API.

## Overview

The services are organized as follows:

- `api.ts`: Base API configuration with axios
- `authService.ts`: Authentication and user management APIs
- `appointmentService.ts`: Appointment booking and management APIs
- `reminderService.ts`: Medication and appointment reminder APIs
- `consultationService.ts`: Q&A consultation APIs
- `index.ts`: Export all services for easy import

## Usage

Import services where needed:

```typescript
import { authService, appointmentService } from '../services';

// Authentication
const login = async () => {
  try {
    const result = await authService.login({ 
      email: 'user@example.com', 
      password: 'password' 
    });
    // Handle successful login
  } catch (error) {
    // Handle error
  }
};

// Appointments
const loadAppointments = async () => {
  try {
    const userId = '123';
    const appointments = await appointmentService.getUserAppointments(userId);
    // Update state with appointments
  } catch (error) {
    // Handle error
  }
};
```

## API Base URL Configuration

The API base URL is configured in `api.ts` using the `VITE_API_URL` environment variable. Set this in your `.env` file:

```
VITE_API_URL=https://localhost:7090/api
```

For production, update the URL in your build environment.

## Authentication

Authentication is handled automatically by the API service. When a user logs in, the JWT token is stored in localStorage and automatically included in subsequent API requests.

## Error Handling

Errors are handled centrally in the `api.ts` file:

- 401 errors (unauthorized): User is logged out automatically
- 500+ errors (server errors): Logged to console
- Other errors: Returned to be handled by the component

Each service method returns a Promise that resolves with the data or rejects with an error. 