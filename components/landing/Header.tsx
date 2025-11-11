'use client';

import Image from 'next/image';
import Link from 'next/link';

import { NAV_LINKS } from '@/constants/landing';
import { motion } from 'framer-motion';

/**
 * Floating header with pill design (inspired by Linktree)
 * No auth buttons - login is placed in hero section
 */
export function Header() {
  return (
    <motion.header
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="bg-background/95 backdrop-blur-lg border shadow-lg rounded-full px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 relative flex">
            <Image
              src="/linkitme.svg"
              alt="LinkItMe"
              width={32}
              height={32}
              className="rounded-lg"
              priority
            />
          </div>
          <span className="font-bold text-xl">LinkItMe</span>
        </Link>

        {/* Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Mobile menu button placeholder - can be added later */}
        <div className="md:hidden w-8" />
      </div>
    </motion.header>
  );
}
