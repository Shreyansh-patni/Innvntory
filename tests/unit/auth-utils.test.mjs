import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Auth Utility & Redirection Security', () => {
  test('validates safe internal redirection URLs', () => {
    function sanitizeNextUrl(rawNext, defaultNext = '/app/dashboard') {
      if (!rawNext) return defaultNext;
      // Must start with '/' and NOT '//' (which would be protocol-relative external domain)
      if (rawNext.startsWith('/') && !rawNext.startsWith('//') && !rawNext.includes('\\')) {
        return rawNext;
      }
      return defaultNext;
    }

    assert.equal(sanitizeNextUrl('/app/inventory/stock'), '/app/inventory/stock');
    assert.equal(sanitizeNextUrl('/app/sales/orders'), '/app/sales/orders');
    assert.equal(sanitizeNextUrl('https://malicious-site.com'), '/app/dashboard');
    assert.equal(sanitizeNextUrl('//malicious-site.com'), '/app/dashboard');
    assert.equal(sanitizeNextUrl('/\\malicious.com'), '/app/dashboard');
    assert.equal(sanitizeNextUrl(null), '/app/dashboard');
  });

  test('normalizes authentication error messages safely', () => {
    function normalizeAuthError(msg) {
      if (!msg) return 'An unexpected error occurred. Please try again.';
      const lower = msg.toLowerCase();
      if (lower.includes('invalid login credentials') || lower.includes('invalid_credentials')) {
        return 'The email or password you entered is incorrect.';
      }
      if (lower.includes('user already registered') || lower.includes('already exists')) {
        return 'An account with this email address already exists. Please sign in instead.';
      }
      if (lower.includes('password should be at least')) {
        return 'Password must be at least 8 characters long.';
      }
      return 'Unable to authenticate. Please check your connection and credentials.';
    }

    assert.equal(
      normalizeAuthError('Invalid login credentials'),
      'The email or password you entered is incorrect.'
    );
    assert.equal(
      normalizeAuthError('User already registered'),
      'An account with this email address already exists. Please sign in instead.'
    );
    assert.equal(
      normalizeAuthError('Password should be at least 6 characters'),
      'Password must be at least 8 characters long.'
    );
    assert.equal(
      normalizeAuthError('Database connection error 500'),
      'Unable to authenticate. Please check your connection and credentials.'
    );
  });
});
