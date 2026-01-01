'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Category, Product } from '@/types';
import { adminService } from '@/services/admin.service';
import { categoryService } from '@/services/category.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';

interface ProductFormState {
  title: string;
  description: string;
  price: string;
  stock: string;
  categoryId: string;
  isFeatured: boolean;
  discountPercent?: string;
  imageFile?: File | null;
}

const INITIAL_FORM: ProductFormState = {
  title: '',
  description: '',
  price: '',
  stock: '10',
  categoryId: '',
  isFeatured: false,
  discountPercent: '',
  imageFile: null,
};

export function AdminProductManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(() => {
    if (!accessToken) return;
    adminService
      .listProducts(accessToken, { includeInactive: true })
      .then((res) => setProducts(res.data))
      .catch((error) =>
        showToast({
          title: t('loadError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        }),
      );
  }, [accessToken, showToast, t]);

  useEffect(() => {
    if (!accessToken) return;
    fetchProducts();
    categoryService
      .list()
      .then((items) => {
        setCategories(items);
        if (!form.categoryId && items[0]) {
          setForm((prev) => ({ ...prev, categoryId: items[0].id }));
        }
      })
      .catch(() => undefined);
  }, [accessToken, fetchProducts, form.categoryId]);

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    try {
      let imageUrl: string | undefined;
      if (form.imageFile) {
        const upload = await adminService.uploadProductImage(accessToken, form.imageFile);
        imageUrl = upload.url;
      }
      const discountPercent = Number(form.discountPercent);
      await adminService.createProduct(accessToken, {
        title: form.title,
        description: form.description,
        priceCents: Math.round(Number(form.price || 0) * 100),
        stock: Number(form.stock || 0),
        categoryId: form.categoryId,
        isFeatured: form.isFeatured,
        discountType: discountPercent ? 'PERCENT' : null,
        discountValue: discountPercent || null,
        images: imageUrl ? [{ url: imageUrl, altText: form.title }] : undefined,
      });
      setForm(INITIAL_FORM);
      fetchProducts();
      showToast({ title: t('created'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('createError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (product: Product) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await adminService.updateProduct(accessToken, product.id, {
        isActive: !product.isActive,
      });
      fetchProducts();
    } catch (error) {
      showToast({
        title: t('updateError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="admin-list-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="p-3">{t('table.product')}</th>
              <th className="p-3">{t('table.stock')}</th>
              <th className="p-3">{t('table.price')}</th>
              <th className="p-3">{t('table.status')}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t border-slate-100">
                <td className="p-3">
                  <p className="font-semibold text-slate-900">{product.title}</p>
                  <p className="text-xs text-slate-500">{product.category.name}</p>
                </td>
                <td className="p-3 text-slate-600">{product.stock}</td>
                <td className="p-3 font-semibold text-slate-900">
                  {formatPrice(product.pricing.finalPriceCents, product.currency)}
                  {product.pricing.isPromoActive && (
                    <span className="ml-2 text-xs text-slate-400 line-through">
                      {formatPrice(product.pricing.originalPriceCents, product.currency)}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-semibold',
                      product.isActive
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-slate-100 text-slate-500',
                    )}
                  >
                    {product.isActive ? t('active') : t('inactive')}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => toggleStatus(product)}
                    disabled={loading}
                  >
                    {product.isActive ? t('disable') : t('activate')}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleCreate} className="admin-form space-y-4">
        <div className="admin-form__section space-y-4">
          <p className="admin-form__heading">{t('form.title')}</p>
          <div className="admin-form__group">
            <label htmlFor="product-name" className="admin-form__label">
              {t('form.name')}
            </label>
            <Input
              id="product-name"
              className="soft-input"
              placeholder={t('form.name')}
              value={form.title}
              required
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
            />
          </div>
          <div className="admin-form__group">
            <label htmlFor="product-description" className="admin-form__label">
              {t('form.description')}
            </label>
            <Input
              id="product-description"
              className="soft-input"
              placeholder={t('form.description')}
              value={form.description}
              required
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
            />
          </div>
          <div className="admin-form__group">
            <label htmlFor="product-category" className="admin-form__label">
              {t('form.category')}
            </label>
            <Select
              id="product-category"
              className="soft-input"
              value={form.categoryId}
              required
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  categoryId: event.target.value,
                }))
              }
            >
              <option value="">{t('form.category')}</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="admin-form__section space-y-3">
          <p className="admin-form__heading">{t('form.price')}</p>
          <div className="admin-form__grid">
            <div className="admin-form__group">
              <label htmlFor="product-price" className="admin-form__label">
                {t('form.price')}
              </label>
              <Input
                id="product-price"
                className="soft-input"
                type="number"
                min="0"
                step="0.5"
                placeholder={t('form.price')}
                value={form.price}
                required
                onChange={(event) => setForm((prev) => ({ ...prev, price: event.target.value }))}
              />
            </div>
            <div className="admin-form__group">
              <label htmlFor="product-stock" className="admin-form__label">
                {t('form.stock')}
              </label>
              <Input
                id="product-stock"
                className="soft-input"
                type="number"
                min="0"
                placeholder={t('form.stock')}
                value={form.stock}
                required
                onChange={(event) => setForm((prev) => ({ ...prev, stock: event.target.value }))}
              />
            </div>
            <div className="admin-form__group">
              <label htmlFor="product-discount" className="admin-form__label">
                {t('form.discount')}
              </label>
              <Input
                id="product-discount"
                className="soft-input"
                type="number"
                min="0"
                max="95"
                placeholder={t('form.discount')}
                value={form.discountPercent}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, discountPercent: event.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="admin-form__section space-y-3">
          <p className="admin-form__heading">{t('form.media')}</p>
          <div className="admin-form__group">
            <label htmlFor="product-image" className="admin-form__label">
              {t('form.image')}
            </label>
            <Input
              id="product-image"
              className="soft-input"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  imageFile: event.target.files?.[0] ?? null,
                }))
              }
            />
          </div>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          {t('form.submit')}
        </Button>
      </form>
    </div>
  );
}
