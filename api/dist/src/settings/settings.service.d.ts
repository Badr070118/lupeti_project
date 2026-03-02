import { PrismaService } from '../prisma/prisma.service';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { UpdateHomepageSettingsDto } from './dto/update-homepage-settings.dto';
export declare class SettingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getStoreSettings(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        storeName: string;
        supportEmail: string | null;
        supportPhone: string | null;
        supportAddress: string | null;
        shippingStandardCents: number;
        shippingExpressCents: number;
        enableCheckout: boolean;
        enableSupport: boolean;
        paytrEnabled: boolean;
    }>;
    getHomepageSettings(): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        heroImageUrl: string | null;
        storyImageUrl: string | null;
        categoryDogImageUrl: string | null;
        categoryCatImageUrl: string | null;
        showHeroShowcase: boolean;
        showHero3d: boolean;
        showBrandMarquee: boolean;
        showFeatured: boolean;
        showCategoryCards: boolean;
        showStorySection: boolean;
        showTrustBadges: boolean;
    }>;
    getPublicSettings(): Promise<{
        store: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            currency: string;
            storeName: string;
            supportEmail: string | null;
            supportPhone: string | null;
            supportAddress: string | null;
            shippingStandardCents: number;
            shippingExpressCents: number;
            enableCheckout: boolean;
            enableSupport: boolean;
            paytrEnabled: boolean;
        };
        homepage: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            heroImageUrl: string | null;
            storyImageUrl: string | null;
            categoryDogImageUrl: string | null;
            categoryCatImageUrl: string | null;
            showHeroShowcase: boolean;
            showHero3d: boolean;
            showBrandMarquee: boolean;
            showFeatured: boolean;
            showCategoryCards: boolean;
            showStorySection: boolean;
            showTrustBadges: boolean;
        };
    }>;
    updateStoreSettings(dto: UpdateStoreSettingsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        currency: string;
        storeName: string;
        supportEmail: string | null;
        supportPhone: string | null;
        supportAddress: string | null;
        shippingStandardCents: number;
        shippingExpressCents: number;
        enableCheckout: boolean;
        enableSupport: boolean;
        paytrEnabled: boolean;
    }>;
    updateHomepageSettings(dto: UpdateHomepageSettingsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        heroImageUrl: string | null;
        storyImageUrl: string | null;
        categoryDogImageUrl: string | null;
        categoryCatImageUrl: string | null;
        showHeroShowcase: boolean;
        showHero3d: boolean;
        showBrandMarquee: boolean;
        showFeatured: boolean;
        showCategoryCards: boolean;
        showStorySection: boolean;
        showTrustBadges: boolean;
    }>;
    getShippingFees(): Promise<{
        standardCents: number;
        expressCents: number;
    }>;
    isPaytrEnabled(): Promise<boolean>;
    private normalizeUrl;
    private assertLocalUrl;
}
