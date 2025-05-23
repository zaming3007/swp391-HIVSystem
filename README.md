# HIV Treatment and Medical Services System

HIV Treatment and Medical Services System - Group 6 (SWP391)

## Overview

This is the repository for the HIV Treatment and Medical Services System developed by Group 6 for the SWP391 course. The system aims to provide a comprehensive solution for managing HIV treatment and medical services.

## Technology Stack

- **Backend**: .NET 8.0 Web API
- **Frontend**: React 18
- **Database**: SQL Server
- **Authentication**: JWT

## Project Structure

```
swp391-HIVSystem/
├── Backend/                  # .NET Backend
│   ├── HIVSystem.API/        # API layer
│   ├── HIVSystem.Core/       # Core business logic
│   ├── HIVSystem.Infrastructure/ # Data access and external services
│   └── HIVSystem.Tests/      # Unit and integration tests
├── Frontend/                 # React Frontend
│   ├── public/               # Static files
│   └── src/                  # React source code
└── Document-SWP391/          # Project documentation
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js 16+ and NPM
- SQL Server (Local or Express)
- Visual Studio 2022 / VS Code

### Backend Setup

1. Navigate to the Backend directory:
   ```
   cd swp391-HIVSystem/Backend
   ```

2. Restore dependencies:
   ```
   dotnet restore
   ```

3. Update the connection string in `appsettings.json` to point to your SQL Server instance.

4. Apply migrations to create the database:
   ```
   dotnet ef database update --project HIVSystem.Infrastructure --startup-project HIVSystem.API
   ```

5. Run the API:
   ```
   dotnet run --project HIVSystem.API
   ```

### Frontend Setup

1. Navigate to the Frontend directory:
   ```
   cd swp391-HIVSystem/Frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Development Workflow

1. Create feature branches from `development` branch
2. Implement features
3. Create pull requests to merge back to `development`
4. Regularly merge `development` to `main` for releases

## Team Members

- Member 1 - Role
- Member 2 - Role
- Member 3 - Role
- Member 4 - Role
- Member 5 - Role

## License

This project is licensed under the MIT License
