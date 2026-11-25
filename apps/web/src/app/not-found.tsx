import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm uppercase tracking-wide text-rose-500">404</p>
      <h1 className="text-3xl font-bold text-slate-900">Sayfa bulunamadı</h1>
      <p className="text-slate-500">
        Aradığınız sayfayı bulamadık. Mağazamıza göz atabilirsiniz.
      </p>
      <Button asChild>
        <Link href="/">Ana sayfaya dön</Link>
      </Button>
    </div>
  );
}
