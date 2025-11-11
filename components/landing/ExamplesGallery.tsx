'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

import { EXAMPLE_PAGES } from '@/constants/landing';

/**
 * Examples gallery showing circular avatars of example users
 * Each avatar is clickable and links to the user's page
 */
export function ExamplesGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Parallax transforms for floating decorations
  const y1 = useTransform(scrollYProgress, [0, 1], [150, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [80, -120]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [0, -180]);

  return (
    <section ref={ref} id="examples" className="relative py-24 bg-muted/30 overflow-hidden">
      {/* Floating decorative elements */}
      <motion.div
        className="absolute top-40 left-20 w-24 h-24 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-2xl"
        style={{ y: y1, rotate: rotate1 }}
      />
      <motion.div
        className="absolute bottom-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-cyan-400/10 rounded-full blur-2xl"
        style={{ y: y2 }}
      />

      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            See what others are creating
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get inspired by pages from creators, artists, and businesses around the world.
          </p>
        </motion.div>

        {/* Examples - Circular avatars */}
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 max-w-4xl mx-auto">
          {EXAMPLE_PAGES.map((example, index) => {
            // Generate theme-based gradient for avatar
            const getGradient = () => {
              switch (example.theme) {
                case 'dark':
                  return 'from-gray-700 via-gray-800 to-gray-900';
                case 'light':
                  return 'from-blue-200 via-purple-200 to-pink-200';
                case 'gradient':
                  return 'from-purple-500 via-pink-500 to-orange-500';
                default:
                  return 'from-blue-500 to-purple-600';
              }
            };

            // Parallax effect - subtle movement
            const yParallax = useTransform(
              scrollYProgress,
              [0, 1],
              [0, (index % 2 === 0 ? -30 : -20)]
            );

            return (
              <motion.a
                key={example.id}
                href={`/${example.username}`}
                className="group flex flex-col items-center cursor-pointer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
                style={{ y: yParallax }}
              >
                {/* Avatar circle */}
                <div className="relative">
                  {/* Gradient ring on hover */}
                  <div
                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${getGradient()} opacity-0 group-hover:opacity-100 transition-opacity blur-md`}
                  />

                  {/* Avatar */}
                  <div
                    className={`relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br ${getGradient()} flex items-center justify-center border-4 border-background shadow-lg`}
                  >
                    {/* Initials or icon */}
                    <span className="text-white font-bold text-2xl md:text-3xl">
                      {example.displayName.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Username */}
                <p className="mt-3 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  @{example.username}
                </p>

                {/* Category badge */}
                <span className="mt-1 text-xs text-muted-foreground">{example.category}</span>
              </motion.a>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-muted-foreground">
            Join them and start sharing your world in seconds
          </p>
        </motion.div>
      </div>
    </section>
  );
}
