import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateHomepageSettingsDto {
  @IsOptional()
  @IsString()
  heroImageUrl?: string | null;

  @IsOptional()
  @IsString()
  storyImageUrl?: string | null;

  @IsOptional()
  @IsString()
  categoryDogImageUrl?: string | null;

  @IsOptional()
  @IsString()
  categoryCatImageUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  showHeroShowcase?: boolean;

  @IsOptional()
  @IsBoolean()
  showHero3d?: boolean;

  @IsOptional()
  @IsBoolean()
  showBrandMarquee?: boolean;

  @IsOptional()
  @IsBoolean()
  showFeatured?: boolean;

  @IsOptional()
  @IsBoolean()
  showCategoryCards?: boolean;

  @IsOptional()
  @IsBoolean()
  showStorySection?: boolean;

  @IsOptional()
  @IsBoolean()
  showTrustBadges?: boolean;
}
