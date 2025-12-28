import type { Metadata } from 'next';
import { AuthForm } from '@/features/auth/auth-form';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';

type LoginPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'Login to Lupeti',
    description: 'Access your Lupeti account to manage carts and orders.',
  },
  fr: {
    title: 'Connexion Lupeti',
    description:
      'Accédez à votre compte Lupeti pour gérer panier et commandes.',
  },
  tr: {
    title: 'Lupeti giriş',
    description: 'Sepetinizi ve siparişlerinizi görmek için giriş yapın.',
  },
};

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/login`,
  });
}

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <AuthForm mode="login" />
    </div>
  );
}
