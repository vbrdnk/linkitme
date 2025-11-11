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
