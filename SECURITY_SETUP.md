# 🔒 SECURITY SETUP GUIDE

## ⚠️ CRITICAL SECURITY NOTICE

**NEVER commit appsettings.json files to GitHub!** They contain sensitive information.

## 🛠️ Setup Instructions

### 1. Copy Template Files
```bash
# Copy templates to create your local config files
cp AuthApi/appsettings.Template.json AuthApi/appsettings.json
cp AppointmentApi/appsettings.Template.json AppointmentApi/appsettings.json
```

### 2. Configure AuthApi/appsettings.json
Replace the following placeholders:

```json
{
    "ConnectionStrings": {
        "DefaultConnection": "Host=YOUR_DB_HOST;Port=YOUR_DB_PORT;Database=YOUR_DB_NAME;Username=YOUR_DB_USER;Password=YOUR_DB_PASSWORD;Pooling=true;"
    },
    "JwtSettings": {
        "SecretKey": "YOUR_JWT_SECRET_KEY_HERE_MINIMUM_32_CHARACTERS"
    },
    "EmailSettings": {
        "SmtpUser": "YOUR_EMAIL@gmail.com",
        "SmtpPass": "YOUR_APP_PASSWORD_HERE",
        "FromEmail": "YOUR_EMAIL@gmail.com"
    }
}
```

### 3. Configure AppointmentApi/appsettings.json
Replace the following placeholders:

```json
{
    "ConnectionStrings": {
        "DefaultConnection": "Host=YOUR_DB_HOST;Port=YOUR_DB_PORT;Database=YOUR_DB_NAME;Username=YOUR_DB_USER;Password=YOUR_DB_PASSWORD;Pooling=true;"
    },
    "JwtSettings": {
        "Key": "YOUR_JWT_SECRET_KEY_HERE_MINIMUM_32_CHARACTERS",
        "SecretKey": "YOUR_JWT_SECRET_KEY_HERE_MINIMUM_32_CHARACTERS"
    }
}
```

## 🔑 How to Get Credentials

### Database (Railway PostgreSQL)
1. Go to Railway dashboard
2. Select your project
3. Copy connection details

### Email App Password
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate App Password for "Mail"
4. Use this password in SmtpPass

### JWT Secret Key
Generate a secure random string (minimum 32 characters):
```bash
# Example secure key generation
openssl rand -base64 32
```

## ✅ Verification
After setup, verify your files are ignored:
```bash
git status
# Should NOT show appsettings.json files
```

## 🚨 If You Already Committed Sensitive Data
1. Remove from repository:
   ```bash
   git rm --cached AuthApi/appsettings.json
   git rm --cached AppointmentApi/appsettings.json
   git commit -m "Remove sensitive config files"
   ```

2. Change all passwords immediately:
   - Database password
   - Email app password  
   - JWT secret key

3. Update .gitignore and commit:
   ```bash
   git add .gitignore
   git commit -m "Add security protection to gitignore"
   ```
