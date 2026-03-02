import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getPublic(): Promise<{
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
}
