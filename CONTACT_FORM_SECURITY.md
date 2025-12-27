# Contact Form Security Documentation

## Overview

The contact form implements multiple layers of security to prevent abuse, spam, and attacks.

## Security Features

### 1. Rate Limiting

**Contact-Specific Rate Limiting**:
- **Limit**: 3 submissions per hour per IP
- **Window**: 60 minutes
- **Response**: HTTP 429 with retry time
- **Storage**: In-memory with automatic cleanup

**Global Rate Limiting** (via middleware):
- **Limit**: 100 requests per hour per IP
- Applies to all routes including contact form

### 2. Input Sanitization

All inputs undergo **double sanitization**:

```typescript
// Layer 1: Basic sanitization
sanitizeInput(value, maxLength)
  - Trims whitespace
  - Removes null bytes
  - Removes control characters
  - Enforces length limits

// Layer 2: HTML sanitization
sanitizeHTML(value)
  - Strips ALL HTML tags
  - Prevents XSS attacks
  - Uses DOMPurify library
```

**Field Limits**:
- Name: 100 characters
- Email: 254 characters (RFC 5321)
- Subject: 200 characters
- Message: 5000 characters

### 3. Input Validation

**Email Validation**:
- Format validation using `validator.isEmail()`
- Lowercase normalization
- RFC 5321 compliant

**Minimum Length Requirements**:
- Name: ≥ 2 characters
- Subject: ≥ 3 characters
- Message: ≥ 10 characters

**Pattern Detection**:
Automatically rejects submissions containing:
- `<script>` tags
- `javascript:` URLs
- Event handlers (onclick, onerror, etc.)
- Template injection patterns
- Null bytes
- Path traversal attempts
- And more...

**Field-Specific Validation**:
- Name cannot contain URLs
- Email must be valid format
- All fields checked for suspicious patterns

### 4. Anti-Spam Protection

**Honeypot Field**:
```html
<!-- Hidden field that bots auto-fill -->
<input type="text" name="website" style="display:none" />
```

Features:
- Invisible to humans
- `tabIndex={-1}` - no keyboard access
- `autoComplete="off"` - no autofill
- `aria-hidden="true"` - hidden from screen readers
- Silent rejection if filled

### 5. Security Headers

Configured globally in `middleware.ts`:

```typescript
Content-Security-Policy
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security (production only)
Permissions-Policy (restrictive)
```

## Implementation Details

### Rate Limit Check Flow

1. Extract client IP from headers
2. Check submission count in time window
3. If exceeded: return 429 with retry time
4. If allowed: increment counter and proceed

### Sanitization Flow

1. Receive raw input
2. Apply basic sanitization (trim, remove dangerous chars)
3. Apply HTML sanitization (strip all tags)
4. Validate length constraints
5. Check for suspicious patterns
6. Validate field-specific rules

### Honeypot Check

```typescript
if (body.website || body.url || body.honeypot) {
  // Silent success - likely a bot
  return success response
}
```

## Security Best Practices

### ✅ Implemented

- [x] Rate limiting (global + contact-specific)
- [x] Input sanitization (double layer)
- [x] HTML stripping (XSS prevention)
- [x] Email validation
- [x] Honeypot anti-spam
- [x] Suspicious pattern detection
- [x] Security headers
- [x] IP-based tracking
- [x] Length validation
- [x] HTTPS enforcement (production)

### 🔄 Recommended Additions

For high-traffic production:
- [ ] CAPTCHA (hCaptcha/reCAPTCHA)
- [ ] Email verification
- [ ] Webhook signature verification
- [ ] Database logging of submissions
- [ ] Alert system for abuse detection

## Testing

### Manual Testing

```bash
# Test rate limiting
for i in {1..4}; do
  curl -X POST http://localhost:3000/api/contact \
    -H "Content-Type: application/json" \
    -d '{"name":"Test","email":"test@example.com","subject":"Test","message":"Test message"}'
done
# Fourth request should return 429
```

### Security Audit

```bash
# Check for vulnerabilities
npm audit

# Update dependencies
npm update

# Check outdated packages
npm outdated
```

## Monitoring

### What to Monitor

1. **Rate limit hits**: Unusual spikes may indicate attack
2. **Honeypot catches**: Track bot activity
3. **Validation failures**: Pattern of failures may indicate probing
4. **Email delivery**: Ensure legitimate emails are sent

### Logs to Review

- Rate limit rejections
- Honeypot triggers
- Suspicious pattern detections
- API errors

## Incident Response

If abuse detected:

1. **Immediate**:
   - Check logs for attack patterns
   - Identify malicious IPs
   - Block via Vercel/Cloudflare if needed

2. **Short-term**:
   - Reduce rate limits temporarily
   - Add CAPTCHA if spam continues
   - Review and update patterns

3. **Long-term**:
   - Analyze attack vectors
   - Update security measures
   - Document findings

## Contact

Security concerns: promptllmbench@gmail.com
