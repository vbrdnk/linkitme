/**
 * Username validation rules:
 * - 3-30 characters long
 * - Only alphanumeric characters, hyphens, and underscores
 * - Cannot start or end with hyphen or underscore
 * - Case insensitive
 */

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 30;
const USERNAME_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]*[a-zA-Z0-9]$/;
const SINGLE_CHAR_PATTERN = /^[a-zA-Z0-9]$/; // For single character usernames

export type ValidationResult = {
  isValid: boolean;
  error: string | null;
};

/**
 * Validates username format
 */
export function validateUsername(username: string): ValidationResult {
  // Empty check
  if (!username || username.trim() === '') {
    return {
      isValid: false,
      error: 'Username is required',
    };
  }

  // Length check
  if (username.length < USERNAME_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Username must be at least ${USERNAME_MIN_LENGTH} characters`,
    };
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    return {
      isValid: false,
      error: `Username must be less than ${USERNAME_MAX_LENGTH} characters`,
    };
  }

  // Pattern check
  // Special case for 1-2 character usernames (only alphanumeric)
  if (username.length <= 2) {
    if (!SINGLE_CHAR_PATTERN.test(username)) {
      return {
        isValid: false,
        error: 'Username can only contain letters and numbers',
      };
    }
  } else {
    // For 3+ characters, check full pattern
    if (!USERNAME_PATTERN.test(username)) {
      return {
        isValid: false,
        error: 'Username can only contain letters, numbers, hyphens, and underscores',
      };
    }
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Normalizes username to lowercase for comparison
 */
export function normalizeUsername(username: string): string {
  return username.toLowerCase().trim();
}

/**
 * Email validation using a simple regex pattern
 */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return {
      isValid: false,
      error: 'Please enter a valid email address',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Password requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 */
const PASSWORD_MIN_LENGTH = 8;

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  if (password.length < PASSWORD_MIN_LENGTH) {
    return {
      isValid: false,
      error: `Password must be at least ${PASSWORD_MIN_LENGTH} characters`,
    };
  }

  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    };
  }

  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    };
  }

  if (!/[0-9]/.test(password)) {
    return {
      isValid: false,
      error: 'Password must contain at least one number',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validates that confirm password matches password
 */
export function validateConfirmPassword(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword) {
    return {
      isValid: false,
      error: 'Please confirm your password',
    };
  }

  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match',
    };
  }

  return {
    isValid: true,
    error: null,
  };
}
