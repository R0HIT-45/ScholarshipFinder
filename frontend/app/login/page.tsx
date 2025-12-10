"use client";
import { useAuth } from '@/app/context/auth';
import { useToast } from '@/app/context/toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Mail } from 'lucide-react';
import PremiumButton from '@/app/components/PremiumButton';
import PremiumInput from '@/app/components/PremiumInput';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = 'Invalid email format';

    if (!form.password) newErrors.password = 'Password is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validateForm()) {
      addToast('Please fix the errors below', 'error');
      return;
    }

    try {
      const user = await login(form.email, form.password);
      addToast('Login successful!', 'success');
      router.push(user.role === 'admin' ? '/admin' : '/');
    } catch (error: any) {
      addToast(error.message || 'Login failed', 'error');
    }
  }

  return (
    <div className="min-h-screen bg-premium-gradient flex items-center justify-center p-4">
      <div className="card-premium p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2 text-slate-900 dark:text-white">
            Sign In
          </h1>
          <p className="text-slate-700 dark:text-slate-300 text-base">
            Access your dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              Email Address
            </label>
            <PremiumInput
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              error={errors.email}
              placeholder="your@email.com"
              icon={<Mail className="h-5 w-5 text-gray-400" />}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-slate-900 dark:text-white mb-2">
              Password
            </label>
            <div className="relative">
              <PremiumInput
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                error={errors.password}
                placeholder="••••••••"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <PremiumButton
            type="submit"
            isLoading={isLoading}
            className="w-full py-3 rounded-lg font-bold"
          >
            Sign In
          </PremiumButton>
        </form>

        <div className="my-4 text-center">
          <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium transition-colors text-sm">
            Forgot password?
          </Link>
        </div>

        <p className="text-center text-slate-700 dark:text-slate-300 font-medium">
          Don't have an account?{' '}
          <Link href="/register" className="text-blue-600 hover:text-blue-800 font-bold transition-colors">
            Create one
          </Link>
        </p>

        <hr className="my-6 dark:border-slate-600" />
        <p className="text-sm text-slate-600 dark:text-slate-400 text-center font-medium">
          Demo: Use <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-900 dark:text-white font-semibold">admin@eduequity.com</code> / <code className="bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded text-slate-900 dark:text-white font-semibold">admin123</code>
        </p>
      </div>
    </div>
  );
}
