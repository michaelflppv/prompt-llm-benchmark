import { z } from 'zod';
import { sanitizeInput, containsSuspiciousPatterns } from './validation';

/**
 * Safely extract and validate URL search parameters
 * NEVER trust URL parameters - always validate and sanitize
 */

export type SafeParams<T> = {
  success: true;
  data: T;
} | {
  success: false;
  errors: string[];
};

/**
 * Get a single URL parameter, sanitized
 * Returns null if parameter doesn't exist or is invalid
 */
export function getSafeParam(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
  maxLength: number = 1000
): string | null {
  const value = searchParams instanceof URLSearchParams
    ? searchParams.get(key)
    : searchParams[key];

  if (!value || typeof value !== 'string') {
    return null;
  }

  // Check for injection attacks
  if (containsSuspiciousPatterns(value)) {
    return null;
  }

  return sanitizeInput(value, maxLength);
}

/**
 * Get multiple URL parameters, sanitized
 * Returns empty array if parameter doesn't exist or is invalid
 */
export function getSafeParamArray(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  key: string,
  maxLength: number = 1000
): string[] {
  let values: string[];

  if (searchParams instanceof URLSearchParams) {
    values = searchParams.getAll(key);
  } else {
    const param = searchParams[key];
    if (!param) {
      return [];
    }
    values = Array.isArray(param) ? param : [param];
  }

  return values
    .filter((v): v is string => typeof v === 'string')
    .filter(v => !containsSuspiciousPatterns(v))
    .map(v => sanitizeInput(v, maxLength))
    .filter(v => v.length > 0);
}

/**
 * Validate all URL parameters against a schema
 * Use this to ensure URL params match expected types
 */
export function validateParams<T extends z.ZodTypeAny>(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  schema: T
): SafeParams<z.infer<T>> {
  // Convert URLSearchParams to object
  const params: Record<string, string | string[]> = {};

  if (searchParams instanceof URLSearchParams) {
    for (const [key, value] of searchParams.entries()) {
      const all = searchParams.getAll(key);
      params[key] = all.length > 1 ? all : value;
    }
  } else {
    // Filter out undefined values
    for (const [key, value] of Object.entries(searchParams)) {
      if (value !== undefined) {
        params[key] = value;
      }
    }
  }

  // First check for suspicious patterns in all values
  for (const value of Object.values(params)) {
    const values = Array.isArray(value) ? value : [value];
    if (values.some(v => containsSuspiciousPatterns(v))) {
      return {
        success: false,
        errors: ['Invalid parameter detected']
      };
    }
  }

  // Validate with schema
  const result = schema.safeParse(params);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error.issues.map(err => err.message)
  };
}

/**
 * Common URL parameter schemas
 */

// Pagination params
export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().max(10000).default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// Search params
export const searchParamsSchema = z.object({
  q: z.string().max(200).optional(),
  sort: z.enum(['asc', 'desc']).default('desc'),
  filter: z.string().max(100).optional(),
});

// ID param (for dynamic routes)
export const idParamSchema = z.object({
  id: z.string().regex(/^[a-zA-Z0-9-_]+$/).max(100),
});

/**
 * Example usage in a Next.js page:
 *
 * export default function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
 *   const result = validateParams(searchParams, paginationParamsSchema);
 *
 *   if (!result.success) {
 *     return <div>Invalid parameters</div>;
 *   }
 *
 *   const { page, limit } = result.data;
 *   // Safe to use page and limit
 * }
 */

/**
 * Sanitize and validate a redirect URL
 * Prevents open redirect vulnerabilities
 */
export function getSafeRedirectUrl(
  searchParams: URLSearchParams | Record<string, string | string[] | undefined>,
  allowedDomains: string[] = []
): string | null {
  const redirectParam = getSafeParam(searchParams, 'redirect') || getSafeParam(searchParams, 'returnUrl');

  if (!redirectParam) {
    return null;
  }

  // Only allow relative URLs or URLs from allowed domains
  try {
    // If it's a relative URL, it's safe
    if (redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      return redirectParam;
    }

    // If it's an absolute URL, check the domain
    const url = new URL(redirectParam);

    // Only allow http/https
    if (!['http:', 'https:'].includes(url.protocol)) {
      return null;
    }

    // Check if domain is allowed
    if (allowedDomains.length === 0) {
      // If no allowed domains specified, only allow relative URLs
      return null;
    }

    const hostname = url.hostname.toLowerCase();
    const isAllowed = allowedDomains.some(domain => {
      const normalizedDomain = domain.toLowerCase();
      return hostname === normalizedDomain || hostname.endsWith(`.${normalizedDomain}`);
    });

    return isAllowed ? redirectParam : null;
  } catch {
    return null;
  }
}
