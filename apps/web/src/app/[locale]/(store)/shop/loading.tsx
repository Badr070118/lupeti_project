import { ProductGridSkeleton } from '@/features/products/components/product-grid.skeleton';

export default function ShopLoading() {
  return (
    <div className="space-y-6">
      <ProductGridSkeleton />
    </div>
  );
}
