# Gmail SMTP Setup for Nodemailer - Complete Guide

## 🎯 Problem Summary

Error: `535-5.7.8 Username and Password not accepted` = Gmail is rejecting credentials

## ✅ Step-by-Step Solution

### 1️⃣ CHECK YOUR GMAIL SECURITY SETTINGS

#### Option A: Use App Password (RECOMMENDED - More Secure)

**Requirement:** 2-Step Verification must be ENABLED

Steps:

1. Go to https://myaccount.google.com/security
2. Enable "2-Step Verification" (if not already enabled)
3. Go to https://myaccount.google.com/apppasswords
4. Select "Mail" and "Windows Computer"
5. Google generates a 16-character password (e.g., `abcd efgh ijkl mnop`)
6. Copy and paste (without spaces) into `.env`: `EMAIL_PASS=abcdefghijklmnop`

#### Option B: Enable Less Secure Apps (For Development Only)

**Only if you don't want to enable 2FA:**

1. Go to https://myaccount.google.com/lesssecureapps
2. Toggle ON
3. Use your regular Gmail password in `.env`

### 2️⃣ CONFIGURE YOUR .ENV FILE

```env
# Gmail SMTP Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-actual-email@gmail.com
EMAIL_PASS=your16charapppassword
```

**Key Points:**

- `EMAIL_USER`: Must be your full Gmail address (with @gmail.com)
- `EMAIL_PASS`: Use 16-char App Password (if 2FA) OR regular password (if Less Secure)
- `EMAIL_PORT`: Use 587 (TLS/STARTTLS) instead of 465 (more compatible)

### 3️⃣ VERIFY YOUR NODEMAILER CONFIG

Your current config in `routes/auth.js`:

```javascript
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT, 10) || 587,
  secure: parseInt(process.env.EMAIL_PORT, 10) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
```

**Port & Security Summary:**
| Port | TLS Type | secure flag | Use case |
|------|----------|-------------|----------|
| 587 | STARTTLS | false | ✅ Recommended for Gmail |
| 465 | Implicit TLS | true | ✅ Also works with Gmail |

### 4️⃣ TEST YOUR CONFIGURATION

```bash
cd backend
node test-gmail-smtp.js
```

This script will:

- ✅ Verify SMTP connection
- ✅ Optionally send a test email
- ❌ Show detailed errors if something is wrong

### 5️⃣ COMMON ERRORS & FIXES

| Error                      | Cause                             | Fix                                         |
| -------------------------- | --------------------------------- | ------------------------------------------- |
| `EAUTH`                    | Wrong credentials                 | Use App Password or enable Less Secure Apps |
| `Invalid credentials`      | EMAIL_USER or EMAIL_PASS is blank | Check `.env` file values                    |
| `ENOTFOUND smtp.gmail.com` | Network issue                     | Check internet connection                   |
| `ETIMEDOUT`                | Port blocked (firewall)           | Try port 587 instead of 465                 |

### 6️⃣ SECURITY BEST PRACTICES

✅ **DO:**

- Use 16-char App Passwords with 2FA enabled (most secure)
- Store credentials in `.env` (never commit to Git)
- Add `.env` to `.gitignore`

❌ **DON'T:**

- Use your actual Gmail password in production
- Enable "Less Secure Apps" in production
- Commit `.env` to version control

### 7️⃣ PRODUCTION SETUP (OPTIONAL)

For better security in production:

1. Create a separate Gmail account for emails
2. Enable 2FA on that account
3. Generate App Password
4. Use that email + App Password

---

## 📝 Example: Full Setup

**.env file:**

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=support@example.com
EMAIL_PASS=abcdefghijklmnop
```

**Test sending OTP:**

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```

**Expected Response:**

```json
{ "msg": "Verification OTP sent to your email." }
```

---

## 🆘 Still Having Issues?

1. Enable debug logging:

   ```javascript
   const transporter = nodemailer.createTransport({
     // ... your config ...
     logger: true,
     debug: true,
   });
   ```

2. Check detailed error logs in console

3. Verify `.env` values are exactly as shown above (no extra spaces)

4. Restart server after updating `.env`

5. Try test script: `node test-gmail-smtp.js`
