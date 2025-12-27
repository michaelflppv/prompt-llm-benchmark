# Contact Form Setup

The contact form is configured to send emails to: **promptllmbench@gmail.com**

## Email Service Setup (Required for Production)

The contact form uses [Web3Forms](https://web3forms.com/) - a free service that doesn't require a backend server.

### Setup Steps:

1. **Get Free Access Key**
   - Visit https://web3forms.com/
   - Enter your email: `promptllmbench@gmail.com`
   - Click "Create Access Key"
   - Copy the access key you receive

2. **Add to Vercel Environment Variables**
   - Go to your Vercel project dashboard
   - Navigate to **Settings** → **Environment Variables**
   - Add new variable:
     - Name: `WEB3FORMS_ACCESS_KEY`
     - Value: Your access key from step 1
   - Click **Save**

3. **Redeploy**
   - Vercel will automatically redeploy with the new environment variable
   - Or manually redeploy from the dashboard

## Alternative Email Services

If you prefer a different email service, update `/app/api/contact/route.ts`:

### Option 1: Resend (Recommended for Vercel)
```bash
npm install resend
```

Add to `.env.local` and Vercel:
```
RESEND_API_KEY=your_api_key
```

### Option 2: SendGrid
```bash
npm install @sendgrid/mail
```

Add to `.env.local` and Vercel:
```
SENDGRID_API_KEY=your_api_key
```

### Option 3: Nodemailer (Self-hosted SMTP)
```bash
npm install nodemailer
```

Add to `.env.local` and Vercel:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## Testing Locally

Without the access key, submissions will be logged to console but not sent via email.

To test locally:
1. Copy the access key to `.env.local`:
   ```
   WEB3FORMS_ACCESS_KEY=your_key_here
   ```
2. Run `npm run dev`
3. Submit the contact form
4. Check your email inbox

## Form Features

- ✅ Client-side validation
- ✅ Rate limiting (via middleware)
- ✅ Input sanitization
- ✅ Email validation
- ✅ Success/error feedback
- ✅ Spam protection (honeypot field can be added)
- ✅ Mobile responsive
