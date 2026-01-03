'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { HomepageSettings } from '@/types';
import { adminService } from '@/services/admin.service';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type PendingImages = {
  heroImage?: File | null;
  storyImage?: File | null;
  categoryDogImage?: File | null;
  categoryCatImage?: File | null;
};

export function AdminContentManager() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();
  const t = useTranslations('admin.content');
  const [homepage, setHomepage] = useState<HomepageSettings | null>(null);
  const [pendingImages, setPendingImages] = useState<PendingImages>({});
  const [previewUrls, setPreviewUrls] = useState<Partial<Record<keyof PendingImages, string>>>(
    {},
  );
  const [loading, setLoading] = useState(false);

  const fetchSettings = useCallback(() => {
    if (!accessToken) return;
    adminService
      .getSettings(accessToken)
      .then((res) => setHomepage(res.homepage))
      .catch((error) =>
        showToast({
          title: t('loadError'),
          description: error instanceof Error ? error.message : t('genericError'),
          variant: 'error',
        }),
      );
  }, [accessToken, showToast, t]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    const urls: Partial<Record<keyof PendingImages, string>> = {};
    const revoke: string[] = [];
    (Object.keys(pendingImages) as Array<keyof PendingImages>).forEach((key) => {
      const file = pendingImages[key];
      if (!file) return;
      const url = URL.createObjectURL(file);
      urls[key] = url;
      revoke.push(url);
    });
    setPreviewUrls((prev) => ({ ...prev, ...urls }));
    return () => {
      revoke.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [pendingImages]);

  const updateHomepage = async () => {
    if (!accessToken || !homepage) return;
    setLoading(true);
    try {
      const updates: Partial<HomepageSettings> = {
        showHeroShowcase: homepage.showHeroShowcase,
        showHero3d: homepage.showHero3d,
        showBrandMarquee: homepage.showBrandMarquee,
        showFeatured: homepage.showFeatured,
        showCategoryCards: homepage.showCategoryCards,
        showStorySection: homepage.showStorySection,
        showTrustBadges: homepage.showTrustBadges,
      };

      const uploadField = async (
        field: keyof PendingImages,
        target: keyof HomepageSettings,
      ) => {
        const file = pendingImages[field];
        if (!file) return;
        const upload = await adminService.uploadContentImage(accessToken, file);
        updates[target] = upload.url as never;
      };

      await uploadField('heroImage', 'heroImageUrl');
      await uploadField('storyImage', 'storyImageUrl');
      await uploadField('categoryDogImage', 'categoryDogImageUrl');
      await uploadField('categoryCatImage', 'categoryCatImageUrl');

      const updated = await adminService.updateHomepageSettings(accessToken, updates);
      setHomepage(updated);
      setPendingImages({});
      showToast({ title: t('updated'), variant: 'success' });
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

  if (!homepage) {
    return (
      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-500">
        {t('loading')}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="admin-list-card p-6">
        <div className="space-y-4">
          <div>
            <p className="text-xs uppercase tracking-wide text-slate-400">{t('sections')}</p>
            <h3 className="text-lg font-semibold text-slate-900">{t('title')}</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {[
              { key: 'showHeroShowcase', label: t('toggles.heroShowcase') },
              { key: 'showHero3d', label: t('toggles.hero3d') },
              { key: 'showBrandMarquee', label: t('toggles.brandMarquee') },
              { key: 'showFeatured', label: t('toggles.featured') },
              { key: 'showCategoryCards', label: t('toggles.categoryCards') },
              { key: 'showStorySection', label: t('toggles.story') },
              { key: 'showTrustBadges', label: t('toggles.trustBadges') },
            ].map((item) => (
              <label key={item.key} className="flex items-center gap-2 text-sm text-slate-600">
                <input
                  type="checkbox"
                  checked={Boolean(homepage[item.key as keyof HomepageSettings])}
                  onChange={(event) =>
                    setHomepage((prev) =>
                      prev
                        ? {
                            ...prev,
                            [item.key]: event.target.checked,
                          }
                        : prev,
                    )
                  }
                />
                {item.label}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {[
          {
            id: 'hero-image',
            label: t('images.hero'),
            current: homepage.heroImageUrl,
            field: 'heroImage' as const,
          },
          {
            id: 'story-image',
            label: t('images.story'),
            current: homepage.storyImageUrl,
            field: 'storyImage' as const,
          },
          {
            id: 'dog-image',
            label: t('images.categoryDog'),
            current: homepage.categoryDogImageUrl,
            field: 'categoryDogImage' as const,
          },
          {
            id: 'cat-image',
            label: t('images.categoryCat'),
            current: homepage.categoryCatImageUrl,
            field: 'categoryCatImage' as const,
          },
        ].map((item) => (
          <div key={item.id} className="admin-form__section space-y-3">
            <p className="admin-form__heading">{item.label}</p>
            {previewUrls[item.field] || item.current ? (
              <img
                src={previewUrls[item.field] ?? item.current ?? ''}
                alt={item.label}
                className="h-24 w-full rounded-2xl object-cover"
              />
            ) : (
              <p className="text-sm text-slate-500">{t('images.empty')}</p>
            )}
            <div className="admin-form__group">
              <label htmlFor={item.id} className="admin-form__label">
                {t('images.upload')}
              </label>
              <Input
                id={item.id}
                className="soft-input"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setPendingImages((prev) => ({
                    ...prev,
                    [item.field]: event.target.files?.[0] ?? null,
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      <Button onClick={updateHomepage} loading={loading} className="w-full">
        {t('save')}
      </Button>
    </div>
  );
}
