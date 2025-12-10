'use client';
import { useState } from 'react';
import { useToast } from '@/app/context/toast';
import Link from 'next/link';
import { Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetToken, setResetToken] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        const data = await res.json();
        setResetToken(data.token);
        addToast('Password reset link created', 'success');
      } else {
        addToast('Could not process request', 'error');
      }
    } catch (error) {
      addToast('An error occurred', 'error');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-center text-slate-700 dark:text-slate-300 mb-6 text-base font-medium">
          Enter your email and we'll help you reset it
        </p>

        {!resetToken ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 p-3 border border-gray-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Reset link created! Use this token to reset your password:
            </p>
            <code className="bg-white dark:bg-slate-700 p-2 rounded block text-xs overflow-auto mb-3 text-gray-700 dark:text-gray-300">
              {resetToken}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(resetToken)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition text-sm"
            >
              Copy Token
            </button>
          </div>
        )}

        <p className="text-center text-slate-700 dark:text-slate-300 mt-6 font-medium">
          Remember your password?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-bold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
