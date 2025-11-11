import { Sparkles, Palette, BarChart3, Smartphone, Zap, Heart } from 'lucide-react';

import type { Feature, ExamplePage } from '@/types/landing';

/**
 * Features displayed on the landing page
 */
export const FEATURES: Feature[] = [
  {
    id: 'unlimited-links',
    title: 'Unlimited Links',
    description: 'Share all your important links in one place. No limits, no restrictions.',
    icon: Sparkles,
  },
  {
    id: 'customizable',
    title: 'Fully Customizable',
    description: 'Design your page exactly how you want it. Colors, themes, and layouts.',
    icon: Palette,
  },
  {
    id: 'analytics',
    title: 'Track Performance',
    description: 'See how your links perform with built-in analytics and insights.',
    icon: BarChart3,
  },
  {
    id: 'mobile-first',
    title: 'Mobile Optimized',
    description: 'Looks perfect on any device. Built with mobile-first design.',
    icon: Smartphone,
  },
  {
    id: 'lightning-fast',
    title: 'Lightning Fast',
    description: 'Optimized for speed. Your page loads instantly, every time.',
    icon: Zap,
  },
  {
    id: 'easy-to-use',
    title: 'Easy to Use',
    description: 'Set up your page in minutes. No technical skills required.',
    icon: Heart,
  },
];

/**
 * Example user pages for the gallery section
 * Note: In production, these would be real user screenshots
 */
export const EXAMPLE_PAGES: ExamplePage[] = [
  {
    id: '1',
    username: 'alexking',
    displayName: 'Alex King',
    theme: 'dark',
    category: 'Fitness Creator',
    previewImageUrl: '/examples/fitness-creator.png',
  },
  {
    id: '2',
    username: 'zaydante',
    displayName: 'Zay Dante',
    theme: 'gradient',
    category: 'Music Artist',
    previewImageUrl: '/examples/music-artist.png',
  },
  {
    id: '3',
    username: 'sarahwinter',
    displayName: 'Sarah Winter',
    theme: 'light',
    category: 'Designer',
    previewImageUrl: '/examples/designer.png',
  },
  {
    id: '4',
    username: 'techreview',
    displayName: 'Tech Reviews',
    theme: 'dark',
    category: 'YouTuber',
    previewImageUrl: '/examples/youtuber.png',
  },
];

/**
 * Navigation links for the header
 */
export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Examples', href: '#examples' },
  { label: 'Pricing', href: '#pricing' },
];

/**
 * Footer links
 */
export const FOOTER_LINKS = {
  product: [
    { label: 'Features', href: '#features' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Contact', href: '/contact' },
  ],
};
