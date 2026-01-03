'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { Category } from '@/types';
import { categoryService } from '@/services/category.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CategoryFormState {
  id?: string;
  name: string;
  slug: string;
}

const INITIAL_FORM: CategoryFormState = {
  name: '',
  slug: '',
};

export function AdminCategoryManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.categories');
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryFormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  const fetchCategories = useCallback(() => {
    categoryService
      .list()
      .then(setCategories)
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const resetForm = () => {
    setForm(INITIAL_FORM);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!accessToken) return;
    setLoading(true);
    try {
      if (form.id) {
        await categoryService.update(accessToken, form.id, {
          name: form.name,
          slug: form.slug || undefined,
        });
        showToast({ title: t('updated'), variant: 'success' });
      } else {
        await categoryService.create(accessToken, {
          name: form.name,
          slug: form.slug || undefined,
        });
        showToast({ title: t('created'), variant: 'success' });
      }
      resetForm();
      fetchCategories();
    } catch (error) {
      showToast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('genericError'),
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const editCategory = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
    });
  };

  const removeCategory = async (category: Category) => {
    if (!accessToken) return;
    setLoading(true);
    try {
      await categoryService.remove(accessToken, category.id);
      fetchCategories();
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

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="admin-list-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="p-3">{t('table.name')}</th>
              <th className="p-3">{t('table.slug')}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className="border-t border-slate-100">
                <td className="p-3">
                  <p className="font-semibold text-slate-900">{category.name}</p>
                </td>
                <td className="p-3 text-xs uppercase text-slate-500">{category.slug}</td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => editCategory(category)}
                      disabled={loading}
                    >
                      {t('edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeCategory(category)}
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
            <label htmlFor="category-name" className="admin-form__label">
              {t('form.name')}
            </label>
            <Input
              id="category-name"
              className="soft-input"
              placeholder={t('form.name')}
              value={form.name}
              required
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="admin-form__group">
            <label htmlFor="category-slug" className="admin-form__label">
              {t('form.slug')}
            </label>
            <Input
              id="category-slug"
              className="soft-input"
              placeholder={t('form.slug')}
              value={form.slug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
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
