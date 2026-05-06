import type { Metadata } from 'next';
import { LoginForm } from '@/components/admin/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login — TastexxSee',
  robots: 'noindex, nofollow',
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 text-center">
          <h1 className="font-display italic text-cream text-4xl">TastexxSee</h1>
          <p
            className="font-sans text-xs text-gold mt-2 uppercase"
            style={{ letterSpacing: '0.4em' }}
          >
            Admin
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
