import { ExamplesGallery } from '@/components/landing/ExamplesGallery';
import { Features } from '@/components/landing/Features';
import { Footer } from '@/components/landing/Footer';
import { Header } from '@/components/landing/Header';
import { Hero } from '@/components/landing/Hero';

/**
 * Landing page
 * Shows hero, features, examples, and footer
 */
export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <ExamplesGallery />
      <Footer />
    </main>
  );
}
