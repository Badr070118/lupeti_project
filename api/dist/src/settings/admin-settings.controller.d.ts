import { File as MulterFile } from 'multer';
import { UpdateHomepageSettingsDto } from './dto/update-homepage-settings.dto';
import { UpdateStoreSettingsDto } from './dto/update-store-settings.dto';
import { SettingsMediaService } from './settings-media.service';
import { SettingsService } from './settings.service';
export declare class AdminSettingsController {
    private readonly settingsService;
    private readonly mediaService;
    constructor(settingsService: SettingsService, mediaService: SettingsMediaService);
    getAll(): Promise<{
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
    updateStore(dto: UpdateStoreSettingsDto): Promise<{
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
    updateHomepage(dto: UpdateHomepageSettingsDto): Promise<{
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
    upload(file: MulterFile): Promise<{
        url: string;
    }>;
}
