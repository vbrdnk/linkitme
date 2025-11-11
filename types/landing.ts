import { ReactNode } from 'react';

/**
 * Feature card displayed in the Features section
 */
export type Feature = {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
};

/**
 * Example user page mockup for the gallery
 */
export type ExamplePage = {
  id: string;
  username: string;
  displayName: string;
  theme: 'light' | 'dark' | 'gradient';
  category: string; // e.g., "Creator", "Business", "Artist"
  previewImageUrl: string;
};

/**
 * Username validation and availability state
 */
export type UsernameState = {
  value: string;
  isValid: boolean;
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
};

/**
 * API response for username availability check
 */
export type CheckUsernameResponse = {
  available: boolean;
  message?: string;
};
