'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const fieldClass =
  'w-full bg-transparent border-0 border-b border-ink-600 py-2.5 px-0 font-sans text-sm text-cream placeholder:text-cream-200/40 rounded-none outline-none focus:border-gold transition-colors duration-200';
const labelClass = 'font-sans text-xs text-gold uppercase block mb-1.5';

export function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials.');
    } else {
      router.push('/admin/dashboard');
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div>
        <label htmlFor="username" className={labelClass}>Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className={fieldClass}
          placeholder="admin"
        />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          className={fieldClass}
          placeholder="••••••••"
        />
      </div>

      {error && (
        <p className="font-sans text-sm text-gold-200">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center font-sans text-sm font-medium tracking-wide uppercase bg-gold text-ink h-[52px] px-8 transition-opacity duration-200 disabled:opacity-50 hover:opacity-90"
      >
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
