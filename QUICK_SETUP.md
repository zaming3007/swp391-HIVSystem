# ⚡ QUICK SETUP GUIDE

## 🚨 IMPORTANT: Setup Required Before Running

**The project will NOT run without proper configuration!**

### 1. Create Configuration Files
```bash
# Copy templates to create your config files
copy AuthApi\appsettings.Template.json AuthApi\appsettings.json
copy AppointmentApi\appsettings.Template.json AppointmentApi\appsettings.json
```

### 2. Update Database Connection
Edit both `AuthApi/appsettings.json` and `AppointmentApi/appsettings.json`:

Replace:
```json
"DefaultConnection": "Host=YOUR_DB_HOST;Port=YOUR_DB_PORT;Database=YOUR_DB_NAME;Username=YOUR_DB_USER;Password=YOUR_DB_PASSWORD;Pooling=true;"
```

With your actual Railway PostgreSQL connection string.

### 3. Update JWT Secret
Replace in both files:
```json
"SecretKey": "YOUR_JWT_SECRET_KEY_HERE_MINIMUM_32_CHARACTERS"
```

### 4. Update Email Settings (AuthApi only)
Replace in `AuthApi/appsettings.json`:
```json
"SmtpUser": "YOUR_EMAIL@gmail.com",
"SmtpPass": "YOUR_APP_PASSWORD_HERE",
"FromEmail": "YOUR_EMAIL@gmail.com"
```

### 5. Run the Application
```bash
# Install frontend dependencies
npm install

# Run all services
npm run dev:all
```

### 🔗 Access URLs
- **Frontend**: http://localhost:5175
- **AuthApi**: http://localhost:5000
- **AppointmentApi**: http://localhost:5002

### 🔑 Test Accounts
- **Admin**: admin@gmail.com / admin123
- **Staff**: staff@gmail.com / staff123  
- **Doctor**: doctor@gmail.com / doctor123
- **Customer**: customer1@gmail.com / customer123

---
**⚠️ NEVER commit appsettings.json files to GitHub!**
