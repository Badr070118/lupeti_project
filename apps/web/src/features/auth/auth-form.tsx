'use client';

import { FormEvent, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { Link, useRouter } from '@/i18n/routing';

interface AuthFormProps {
  mode: 'login' | 'register';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { login, register } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const t = useTranslations('auth');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form.email, form.password);
      }
      router.push('/account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-md space-y-4 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm"
    >
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === 'login' ? t('loginTitle') : t('registerTitle')}
      </h1>
      <Input
        id="email"
        name="email"
        type="email"
        placeholder={t('email')}
        required
        value={form.email}
        onChange={(event) => setForm({ ...form, email: event.target.value })}
      />
      <Input
        id="password"
        name="password"
        type="password"
        placeholder={t('password')}
        required
        minLength={8}
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
      />
      <Button type="submit" className="w-full" loading={loading}>
        {mode === 'login' ? t('loginCta') : t('registerCta')}
      </Button>
      <p className="text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>
            {t('switchToRegister')}{' '}
            <Link className="text-rose-500" href="/register">
              {t('register')}
            </Link>
          </>
        ) : (
          <>
            {t('switchToLogin')}{' '}
            <Link className="text-rose-500" href="/login">
              {t('login')}
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
