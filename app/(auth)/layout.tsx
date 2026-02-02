import Link from 'next/link';

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="flex justify-center py-8">
        <Link href="/" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          LinkItMe
        </Link>
      </header>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center">
        <nav className="flex items-center justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <Link href="/terms" className="hover:text-slate-700 dark:hover:text-slate-300">
            Terms
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/privacy" className="hover:text-slate-700 dark:hover:text-slate-300">
            Privacy
          </Link>
          <span aria-hidden="true">·</span>
          <Link href="/help" className="hover:text-slate-700 dark:hover:text-slate-300">
            Help
          </Link>
        </nav>
      </footer>
    </div>
  );
}
