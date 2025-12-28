import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm uppercase tracking-wide text-rose-500">404</p>
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="text-slate-500">
        We could not find what you were looking for. Explore our shop instead.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
