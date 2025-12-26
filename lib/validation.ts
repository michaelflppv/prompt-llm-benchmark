import { z } from 'zod';
import validator from 'validator';
import DOMPurify from 'isomorphic-dompurify';

// ============================================================================
// SANITIZATION FUNCTIONS
// ============================================================================

/**
 * Sanitize HTML to prevent XSS attacks
 * Strips all HTML tags and dangerous content
 */
export function sanitizeHTML(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [] });
}

/**
 * Sanitize user input for safe display
 * - Trims whitespace
 * - Removes null bytes
 * - Limits length
 */
export function sanitizeInput(input: string, maxLength: number = 1000): string {
  if (typeof input !== 'string') {
    return '';
  }

  return input
    .trim()
    .replace(/\0/g, '') // Remove null bytes
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .slice(0, maxLength);
}

/**
 * Sanitize URL to prevent javascript: and data: URLs
 */
export function sanitizeURL(url: string): string {
  const sanitized = sanitizeInput(url, 2048);

  // Block dangerous protocols
  if (/^(javascript|data|vbscript|file):/i.test(sanitized)) {
    return '';
  }

  try {
    const parsed = new URL(sanitized);
    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return '';
    }
    return sanitized;
  } catch {
    return '';
  }
}

/**
 * Sanitize email address
 */
export function sanitizeEmail(email: string): string {
  const sanitized = sanitizeInput(email, 254); // RFC 5321 max length
  return validator.normalizeEmail(sanitized) || '';
}

/**
 * Sanitize filename to prevent path traversal
 */
export function sanitizeFilename(filename: string): string {
  return sanitizeInput(filename, 255)
    .replace(/[^a-zA-Z0-9._-]/g, '') // Only allow safe characters
    .replace(/^\.+/, '') // Remove leading dots
    .replace(/\.{2,}/g, '.'); // Remove multiple consecutive dots
}

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

/**
 * Email validation schema
 * - Must be valid email format
 * - Max 254 characters (RFC 5321)
 * - Automatically sanitized
 */
export const emailSchema = z
  .string()
  .min(1, 'Email is required')
  .max(254, 'Email too long')
  .transform(sanitizeEmail)
  .refine((email) => validator.isEmail(email), {
    message: 'Invalid email address'
  });

/**
 * URL validation schema
 * - Must be valid HTTP/HTTPS URL
 * - Max 2048 characters
 * - Automatically sanitized
 */
export const urlSchema = z
  .string()
  .min(1, 'URL is required')
  .max(2048, 'URL too long')
  .transform(sanitizeURL)
  .refine((url) => url !== '' && validator.isURL(url, {
    protocols: ['http', 'https'],
    require_protocol: true
  }), {
    message: 'Invalid URL'
  });

/**
 * Text input validation schema
 * - Max length configurable
 * - Automatically sanitized
 * - No HTML allowed
 */
export function textSchema(maxLength: number = 1000) {
  return z
    .string()
    .max(maxLength, `Text must be ${maxLength} characters or less`)
    .transform((input) => sanitizeInput(input, maxLength))
    .refine((text) => text.length > 0, {
      message: 'Text cannot be empty after sanitization'
    });
}

/**
 * Name validation schema (for personal names)
 * - 1-100 characters
 * - No numbers or special characters except spaces, hyphens, apostrophes
 */
export const nameSchema = z
  .string()
  .min(1, 'Name is required')
  .max(100, 'Name too long')
  .transform((input) => sanitizeInput(input))
  .refine((name) => /^[a-zA-Z\s'-]+$/.test(name), {
    message: 'Name can only contain letters, spaces, hyphens, and apostrophes'
  });

/**
 * Slug validation schema (for URLs, filenames)
 * - Lowercase letters, numbers, hyphens only
 * - No spaces or special characters
 */
export const slugSchema = z
  .string()
  .min(1, 'Slug is required')
  .max(100, 'Slug too long')
  .transform((input) => sanitizeInput(input))
  .refine((slug) => /^[a-z0-9-]+$/.test(slug), {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens'
  });

// ============================================================================
// FORM VALIDATION SCHEMAS
// ============================================================================

/**
 * Newsletter subscription form
 */
export const newsletterSchema = z.object({
  email: emailSchema,
});

/**
 * Contact form
 */
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  message: textSchema(5000),
});

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Validate and sanitize unknown input
 * Returns validated data or throws error
 */
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  return schema.parse(data);
}

/**
 * Safe validate - returns result object instead of throwing
 */
export function safeValidateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: string[] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.issues.map((err) => err.message)
  };
}

/**
 * Validate query parameters from URL
 * Never trust URL params - always validate
 */
export function validateQueryParams(
  params: Record<string, string | string[] | undefined>,
  schema: z.ZodSchema
): z.infer<typeof schema> | null {
  try {
    return schema.parse(params);
  } catch {
    return null;
  }
}

/**
 * Check if string contains potential injection attacks
 */
export function containsSuspiciousPatterns(input: string): boolean {
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // Event handlers like onclick=
    /eval\(/i,
    /expression\(/i,
    /import\s/i,
    /\{\{.*\}\}/i, // Template injection
    /\$\{.*\}/i, // Template literals
    /<iframe/i,
    /<object/i,
    /<embed/i,
    /\.\.\//, // Path traversal
    /\x00/, // Null bytes
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(input));
}

/**
 * Rate limit key generation (for IP-based limiting)
 */
export function generateRateLimitKey(ip: string, resource?: string): string {
  const sanitizedIP = sanitizeInput(ip, 45); // IPv6 max length
  const sanitizedResource = resource ? sanitizeInput(resource, 100) : '';
  return `${sanitizedIP}:${sanitizedResource}`;
}
