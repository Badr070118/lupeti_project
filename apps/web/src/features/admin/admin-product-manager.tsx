'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Category, DiscountType, Product, ProductImage } from '@/types';
import { adminService } from '@/services/admin.service';
import { categoryService } from '@/services/category.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type PromoType = DiscountType | '';

interface ProductFormState {
  id?: string;
  title: string;
  description: string;
  price: string;
  originalPrice: string;
  stock: string;
  categoryId: string;
  currency: string;
  sku: string;
  isActive: boolean;
  isFeatured: boolean;
  promoEnabled: boolean;
  discountType: PromoType;
  discountValue: string;
  promoStartAt: string;
  promoEndAt: string;
  imageFiles: File[];
}

const INITIAL_FORM: ProductFormState = {
  title: '',
  description: '',
  price: '',
  originalPrice: '',
  stock: '10',
  categoryId: '',
  currency: 'TRY',
  sku: '',
  isActive: true,
  isFeatured: false,
  promoEnabled: false,
  discountType: '',
  discountValue: '',
  promoStartAt: '',
  promoEndAt: '',
  imageFiles: [],
};

const toPrice = (value?: number | null) => {
  if (value === null || value === undefined) return '';
  return (value / 100).toFixed(2).replace(/\.00$/, '');
};

const toCents = (value: string) => Math.round(Number(value || 0) * 100);

const toDateInput = (value?: string | null) => {
  if (!value) return '';
  return new Date(value).toISOString().slice(0, 16);
};

export function AdminProductManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.products');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormState>(INITIAL_FORM);
  const [selected, setSelected] = useState<Product | null>(null);
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

  useEffect(() => {
    if (!selected) return;
    const updated = products.find((product) => product.id === selected.id);
    if (updated) {
      setSelected(updated);
    }
  }, [products, selected]);

  const resetForm = useCallback(() => {
    setSelected(null);
    setForm((prev) => ({
      ...INITIAL_FORM,
      categoryId: prev.categoryId || '',
    }));
  }, []);

  const buildPayload = useCallback(() => {
    if (!form.promoEnabled) {
      return {
        title: form.title.trim(),
        description: form.description.trim(),
        priceCents: toCents(form.price),
        stock: Number(form.stock || 0),
        categoryId: form.categoryId,
        currency: form.currency.trim() || 'TRY',
        sku: form.sku.trim() || null,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
        originalPriceCents: null,
        discountType: null,
        discountValue: null,
        promoStartAt: null,
        promoEndAt: null,
      };
    }

    const discountValue =
      form.discountType === 'PERCENT'
        ? Math.round(Number(form.discountValue || 0))
        : form.discountType === 'AMOUNT'
          ? toCents(form.discountValue)
          : null;

    return {
      title: form.title.trim(),
      description: form.description.trim(),
      priceCents: toCents(form.price),
      stock: Number(form.stock || 0),
      categoryId: form.categoryId,
      currency: form.currency.trim() || 'TRY',
      sku: form.sku.trim() || null,
      isActive: form.isActive,
      isFeatured: form.isFeatured,
      originalPriceCents: form.originalPrice ? toCents(form.originalPrice) : null,
      discountType: form.discountType || null,
      discountValue: discountValue && discountValue > 0 ? discountValue : null,
      promoStartAt: form.promoStartAt
        ? new Date(form.promoStartAt).toISOString()
        : null,
      promoEndAt: form.promoEndAt
        ? new Date(form.promoEndAt).toISOString()
        : null,
    };
  }, [form]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    try {
      const payload = buildPayload();
      if (form.id) {
        await adminService.updateProduct(accessToken, form.id, payload);
      } else {
        const uploads = await Promise.all(
          form.imageFiles.map((file) => adminService.uploadProductImage(accessToken, file)),
        );
        await adminService.createProduct(accessToken, {
          ...payload,
          images: uploads.map((upload, index) => ({
            url: upload.url,
            altText: form.title,
            sortOrder: index,
          })),
        });
      }

      if (form.id && form.imageFiles.length > 0) {
        const uploads = await Promise.all(
          form.imageFiles.map((file) => adminService.uploadProductImage(accessToken, file)),
        );
        await Promise.all(
          uploads.map((upload, index) =>
            adminService.addProductImage(accessToken, form.id as string, {
              url: upload.url,
              altText: form.title,
              sortOrder: index,
            }),
          ),
        );
      }

      resetForm();
      fetchProducts();
      showToast({
        title: form.id ? t('updated') : t('created'),
        variant: 'success',
      });
    } catch (error) {
      showToast({
        title: form.id ? t('updateError') : t('createError'),
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

  const toggleFeatured = async (product: Product) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await adminService.updateProduct(accessToken, product.id, {
        isFeatured: !product.isFeatured,
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

  const removeProduct = async (product: Product) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await adminService.deleteProduct(accessToken, product.id);
      if (selected?.id === product.id) {
        resetForm();
      }
      fetchProducts();
      showToast({ title: t('deleted'), variant: 'success' });
    } catch (error) {
      showToast({
        title: t('deleteError'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (product: Product) => {
    const hasPromo =
      Boolean(product.discountType) ||
      Boolean(product.discountValue) ||
      Boolean(product.promoStartAt) ||
      Boolean(product.promoEndAt) ||
      (product.originalPriceCents &&
        product.originalPriceCents > product.priceCents);

    setSelected(product);
    setForm({
      id: product.id,
      title: product.title,
      description: product.description,
      price: toPrice(product.priceCents),
      originalPrice: toPrice(product.originalPriceCents),
      stock: String(product.stock),
      categoryId: product.category.id,
      currency: product.currency,
      sku: product.sku ?? '',
      isActive: product.isActive,
      isFeatured: product.isFeatured,
      promoEnabled: hasPromo,
      discountType: product.discountType ?? '',
      discountValue:
        product.discountType === 'AMOUNT'
          ? toPrice(product.discountValue)
          : product.discountValue?.toString() ?? '',
      promoStartAt: toDateInput(product.promoStartAt),
      promoEndAt: toDateInput(product.promoEndAt),
      imageFiles: [],
    });
  };

  const images = useMemo<ProductImage[]>(() => selected?.images ?? [], [selected]);

  const removeImage = async (imageId: string) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await adminService.removeProductImage(accessToken, imageId);
      fetchProducts();
      if (selected) {
        const updated = products.find((product) => product.id === selected.id);
        if (updated) {
          setSelected(updated);
        }
      }
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
              <th className="p-3">{t('table.flags')}</th>
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
                <td className="p-3 text-xs text-slate-500">
                  {product.isFeatured ? t('featured') : t('standard')}
                </td>
                <td className="p-3 text-right">
                  <div className="flex flex-wrap justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => startEdit(product)}
                      disabled={loading}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFeatured(product)}
                      disabled={loading}
                    >
                      {product.isFeatured ? t('unfeature') : t('feature')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleStatus(product)}
                      disabled={loading}
                    >
                      {product.isActive ? t('disable') : t('activate')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeProduct(product)}
                      disabled={loading}
                    >
                      {t('delete')}
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <form onSubmit={handleSubmit} className="admin-form space-y-4">
        <div className="admin-form__section space-y-4">
          <div className="flex items-center justify-between">
            <p className="admin-form__heading">
              {form.id ? t('form.editTitle') : t('form.title')}
            </p>
            {form.id ? (
              <Button type="button" size="sm" variant="ghost" onClick={resetForm}>
                {t('form.reset')}
              </Button>
            ) : null}
          </div>
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
            <Textarea
              id="product-description"
              rows={3}
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
              <label htmlFor="product-original" className="admin-form__label">
                {t('form.originalPrice')}
              </label>
              <Input
                id="product-original"
                className="soft-input"
                type="number"
                min="0"
                step="0.5"
                placeholder={t('form.originalPrice')}
                value={form.originalPrice}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, originalPrice: event.target.value }))
                }
                disabled={!form.promoEnabled}
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
              <label htmlFor="product-currency" className="admin-form__label">
                {t('form.currency')}
              </label>
              <Input
                id="product-currency"
                className="soft-input"
                placeholder="TRY"
                value={form.currency}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currency: event.target.value }))
                }
              />
            </div>
          </div>
        </div>

        <div className="admin-form__section space-y-3">
          <p className="admin-form__heading">{t('form.inventory')}</p>
          <div className="admin-form__grid">
            <div className="admin-form__group">
              <label htmlFor="product-sku" className="admin-form__label">
                {t('form.sku')}
              </label>
              <Input
                id="product-sku"
                className="soft-input"
                placeholder={t('form.sku')}
                value={form.sku}
                onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
              />
            </div>
            <div className="admin-form__group">
              <label className="admin-form__label">{t('form.flags')}</label>
              <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(form.isActive)}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, isActive: event.target.checked }))
                    }
                  />
                  {t('form.visible')}
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Boolean(form.isFeatured)}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, isFeatured: event.target.checked }))
                    }
                  />
                  {t('form.featured')}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="admin-form__section space-y-3">
          <p className="admin-form__heading">{t('form.promotion')}</p>
          <div className="admin-form__group">
            <label className="admin-form__label">{t('form.enablePromo')}</label>
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={Boolean(form.promoEnabled)}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    promoEnabled: event.target.checked,
                  }))
                }
              />
              {t('form.enablePromo')}
            </label>
          </div>
          <div className="admin-form__grid">
            <div className="admin-form__group">
              <label htmlFor="promo-type" className="admin-form__label">
                {t('form.discountType')}
              </label>
              <Select
                id="promo-type"
                className="soft-input"
                value={form.discountType}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, discountType: event.target.value as PromoType }))
                }
                disabled={!form.promoEnabled}
              >
                <option value="">{t('form.discountNone')}</option>
                <option value="PERCENT">{t('form.discountPercent')}</option>
                <option value="AMOUNT">{t('form.discountAmount')}</option>
              </Select>
            </div>
            <div className="admin-form__group">
              <label htmlFor="promo-value" className="admin-form__label">
                {t('form.discountValue')}
              </label>
              <Input
                id="promo-value"
                className="soft-input"
                type="number"
                min="0"
                placeholder={t('form.discountValue')}
                value={form.discountValue}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, discountValue: event.target.value }))
                }
                disabled={!form.promoEnabled || !form.discountType}
              />
            </div>
            <div className="admin-form__group">
              <label htmlFor="promo-start" className="admin-form__label">
                {t('form.promoStart')}
              </label>
              <Input
                id="promo-start"
                className="soft-input"
                type="datetime-local"
                value={form.promoStartAt}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, promoStartAt: event.target.value }))
                }
                disabled={!form.promoEnabled}
              />
            </div>
            <div className="admin-form__group">
              <label htmlFor="promo-end" className="admin-form__label">
                {t('form.promoEnd')}
              </label>
              <Input
                id="promo-end"
                className="soft-input"
                type="datetime-local"
                value={form.promoEndAt}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, promoEndAt: event.target.value }))
                }
                disabled={!form.promoEnabled}
              />
            </div>
          </div>
        </div>

        <div className="admin-form__section space-y-3">
          <p className="admin-form__heading">{t('form.media')}</p>
          {images.length > 0 ? (
            <div className="grid gap-3">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-3 py-2 text-xs text-slate-500"
                >
                  <span>{image.url}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeImage(image.id)}
                    disabled={loading}
                  >
                    {t('remove')}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-500">{t('form.noImages')}</p>
          )}
          <div className="admin-form__group">
            <label htmlFor="product-image" className="admin-form__label">
              {t('form.image')}
            </label>
            <Input
              id="product-image"
              className="soft-input"
              type="file"
              multiple
              accept="image/*"
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  imageFiles: event.target.files ? Array.from(event.target.files) : [],
                }))
              }
            />
          </div>
        </div>

        <Button type="submit" className="w-full" loading={loading}>
          {form.id ? t('form.save') : t('form.submit')}
        </Button>
      </form>
    </div>
  );
}
