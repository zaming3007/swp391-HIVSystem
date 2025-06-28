# Authentication API

This is a .NET Core API for handling user authentication for the Healthcare Platform.

## Features

- User login
- User registration
- JWT token generation and validation
- In-memory user storage (for demo purposes)

## API Endpoints

- POST `/api/Auth/login` - User login
- POST `/api/Auth/register` - User registration
- GET `/api/Auth/me` - Get current user info (requires authentication)

## Setup Instructions

1. Make sure you have .NET SDK installed (version 7.0 or later)

2. Restore dependencies:
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

## Authentication

The API uses JWT (JSON Web Token) for authentication. 

### How to authenticate:

1. Call the login or register endpoint to get a token
2. Include the token in subsequent requests:
   ```
   Authorization: Bearer <your-token>
   ```

## Demo Account

A default user is created for testing:
- Email: `demo@example.com`
- Password: `password` 