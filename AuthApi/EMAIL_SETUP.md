# Email Configuration Setup

## 🔒 Security Notice
Email configuration files containing real credentials are excluded from Git to prevent credential exposure.

## 📧 Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account Settings](https://myaccount.google.com/)
2. Navigate to Security → 2-Step Verification
3. Enable 2-Factor Authentication

### Step 2: Generate App Password
1. Go to Security → App passwords
2. Select app: "Mail"
3. Select device: "Other (custom name)"
4. Enter name: "HIV System"
5. Copy the 16-character app password

### Step 3: Configure Email Settings

#### For Development Environment:
1. Copy `appsettings.Development.Example.json` to `appsettings.Development.json`
2. Replace placeholders:
   ```json
   {
     "EmailSettings": {
       "SmtpUser": "your-email@gmail.com",
       "SmtpPass": "your 16 digit app password",
       "FromEmail": "your-email@gmail.com"
     }
   }
   ```

#### For Production Environment:
1. Copy `appsettings.Example.json` to `appsettings.json`
2. Configure all settings including database and email

## 🚫 Files Excluded from Git:
- `appsettings.json`
- `appsettings.Development.json`
- `appsettings.Production.json`
- Any file matching `**/appsettings.*.json` (except Example files)

## ✅ Email Features:
- Password reset verification codes
- Welcome emails for new users
- Appointment confirmations
- System notifications

## 🔧 Testing:
```bash
curl -X POST "http://localhost:5000/api/Auth/send-reset-code" \
-H "Content-Type: application/json" \
-d '{"email":"test@example.com"}'
```

## 📝 Notes:
- App passwords are specific to Gmail accounts with 2FA enabled
- Never commit real credentials to version control
- Use environment variables for production deployments
