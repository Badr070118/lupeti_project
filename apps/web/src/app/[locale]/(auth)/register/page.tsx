import type { Metadata } from 'next';
import { AuthForm } from '@/features/auth/auth-form';
import { buildMetadata, pickLocalizedCopy } from '@/lib/metadata';

type RegisterPageProps = {
  params: Promise<{ locale: string }>;
};

const metaCopy = {
  en: {
    title: 'Create a Lupeti account',
    description: 'Register to save carts, track orders, and unlock perks.',
  },
  fr: {
    title: 'Créer un compte Lupeti',
    description:
      'Inscrivez-vous pour sauvegarder votre panier et suivre vos commandes.',
  },
  tr: {
    title: 'Lupeti hesabı oluştur',
    description: 'Sepetini kaydetmek ve siparişlerini izlemek için kayıt ol.',
  },
};

export async function generateMetadata({
  params,
}: RegisterPageProps): Promise<Metadata> {
  const { locale } = await params;
  const copy = pickLocalizedCopy(locale, metaCopy);
  return buildMetadata({
    title: copy.title,
    description: copy.description,
    path: `/${locale}/register`,
  });
}

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <AuthForm mode="register" />
    </div>
  );
}
