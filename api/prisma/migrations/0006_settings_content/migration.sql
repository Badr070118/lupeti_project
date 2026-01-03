-- CreateTable for StoreSettings
CREATE TABLE "StoreSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "storeName" TEXT NOT NULL DEFAULT 'Lupeti',
    "supportEmail" TEXT,
    "supportPhone" TEXT,
    "supportAddress" TEXT,
    "shippingStandardCents" INTEGER NOT NULL DEFAULT 0,
    "shippingExpressCents" INTEGER NOT NULL DEFAULT 2500,
    "currency" TEXT NOT NULL DEFAULT 'TRY',
    "enableCheckout" BOOLEAN NOT NULL DEFAULT true,
    "enableSupport" BOOLEAN NOT NULL DEFAULT true,
    "paytrEnabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StoreSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable for HomepageSettings
CREATE TABLE "HomepageSettings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "heroImageUrl" TEXT,
    "storyImageUrl" TEXT,
    "categoryDogImageUrl" TEXT,
    "categoryCatImageUrl" TEXT,
    "showHeroShowcase" BOOLEAN NOT NULL DEFAULT true,
    "showHero3d" BOOLEAN NOT NULL DEFAULT true,
    "showBrandMarquee" BOOLEAN NOT NULL DEFAULT true,
    "showFeatured" BOOLEAN NOT NULL DEFAULT true,
    "showCategoryCards" BOOLEAN NOT NULL DEFAULT true,
    "showStorySection" BOOLEAN NOT NULL DEFAULT true,
    "showTrustBadges" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "HomepageSettings_pkey" PRIMARY KEY ("id")
);
