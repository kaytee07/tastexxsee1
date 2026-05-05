'use client';

import { signOut } from 'next-auth/react';

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      className="font-sans text-xs text-cream-200 uppercase hover:text-cream transition-colors"
      style={{ letterSpacing: '0.3em' }}
    >
      Log out
    </button>
  );
}
