# Role-Based Authentication System

## Overview

This system implements role-based authentication and authorization for the application. There are four roles supported:

1. **Patient** - Regular users who can book appointments and access personal health information
2. **Doctor** - Medical professionals who can view patient records and manage appointments
3. **Staff** - Support staff who assist with check-ins and basic patient management
4. **Admin** - System administrators with full access to all features

## Implementation Details

### Authentication Flow

1. User logs in with email and password
2. Backend validates credentials and returns user data with role
3. Frontend stores token and role in localStorage
4. User is redirected to appropriate interface based on role
5. Navigation and UI elements are conditionally rendered based on role

### Role-Based Routing

The application uses React Router and guards to protect routes based on roles:

- `/app/*` - Patient routes (appointments, profile, etc.)
- `/doctor/*` - Doctor routes (patient management, schedules)
- `/staff/*` - Staff routes (check-in, appointment management)
- `/admin/*` - Admin routes (user management, system settings)

### Testing with Mock Services

For development and testing, you can use `mockAuthService.ts` which provides fake users with different roles:

- admin@example.com / password -> Admin role
- doctor@example.com / password -> Doctor role
- staff@example.com / password -> Staff role
- patient@example.com / password -> Patient role

## Implementation Components

1. `AuthGuard.tsx` - Protects routes requiring authentication
2. `RoleGuard.tsx` - Protects routes requiring specific roles
3. `ConditionalMenu.tsx` - Shows navigation options based on user role
4. `authService.ts` - Handles authentication API calls and localStorage
5. `authSlice.ts` - Redux state management for auth features

## Usage

To conditionally render UI elements based on role:

```tsx
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const MyComponent = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  return (
    <div>
      {user?.role === 'admin' && <AdminPanel />}
      {user?.role === 'doctor' && <DoctorTools />}
      {user?.role === 'staff' && <StaffTools />}
      {user?.role === 'patient' && <PatientView />}
    </div>
  );
}
```

To check role in a component or service:

```tsx
import { authService } from '../services/authService';

// Check if user has a specific role
const isAdmin = authService.hasRole('admin');

// Get current user's role
const userRole = authService.getUserRole();
``` 