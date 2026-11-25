import { config } from 'dotenv';
import * as argon2 from 'argon2';
import {
  DiscountType,
  PrismaClient,
  Role,
  TicketCategory,
  TicketStatus,
  UserStatus,
} from '@prisma/client';

config();

const prisma = new PrismaClient();

const adminEmail =
  process.env.SEED_ADMIN_EMAIL?.toLowerCase() ?? 'admin@local.test';
const adminPassword =
  process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!ChangeMe';
const supportEmail = process.env.SUPPORT_EMAIL ?? 'support@lupeti.local';

type ProductSeed = {
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency?: string;
  stock: number;
  isActive?: boolean;
  categorySlug: string;
  isFeatured?: boolean;
  originalPriceCents?: number;
  discountType?: DiscountType;
  discountValue?: number;
  promoStartAt?: Date;
  promoEndAt?: Date;
  images: Array<{ url: string; altText?: string | null; sortOrder?: number }>;
};

const localImage = (slug: string, title: string, sortOrder = 0) => ({
  url: `/products/${slug}.jpg`,
  altText: `${title} ambalajı`,
  sortOrder,
});

async function seedAdminUser() {
  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      name: 'Lupeti Admin',
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
      status: UserStatus.ACTIVE,
      name: 'Lupeti Admin',
    },
  });
}

async function seedCustomerUser() {
  const email = 'customer@local.test';
  const password = 'Customer123!';

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id,
  });

  await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      role: Role.USER,
      name: 'Demo Customer',
    },
    create: {
      email,
      passwordHash,
      role: Role.USER,
      status: UserStatus.ACTIVE,
      name: 'Demo Customer',
    },
  });
}

async function seedCatalog() {
  const categories = [
    { slug: 'dog', name: 'Köpek Ürünleri' },
    { slug: 'cat', name: 'Kedi Ürünleri' },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name },
      create: {
        slug: category.slug,
        name: category.name,
      },
    });
  }

  const categoryRecords = await prisma.category.findMany({
    where: { slug: { in: categories.map((item) => item.slug) } },
  });
  const categoryMap = new Map(categoryRecords.map((record) => [record.slug, record.id]));

  const products: ProductSeed[] = [
    {
      slug: 'anatolian-lamb-herbs-kibble',
      title: 'Kuzu Etli ve Otlu Köpek Maması',
      description: 'Hareketli köpekler için kekik ve adaçayıyla tatlandırılmış, yavaş kurutulan kuzu etli kuru mama.',
      priceCents: 18900,
      currency: 'TRY',
      stock: 120,
      categorySlug: 'dog',
      isFeatured: true,
      originalPriceCents: 21900,
      discountType: DiscountType.PERCENT,
      discountValue: 15,
      images: [
        localImage('anatolian-lamb-herbs-kibble', 'Kuzu Etli ve Otlu Köpek Maması'),
      ],
    },
    {
      slug: 'tender-turkey-puppy-bites',
      title: 'Hindi Etli Yavru Köpek Lokmaları',
      description: 'Büyüme çağındaki yavru köpekler için DHA ve probiyotik içeren küçük lokmalar.',
      priceCents: 15900,
      stock: 95,
      categorySlug: 'dog',
      promoStartAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      promoEndAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
      discountType: DiscountType.AMOUNT,
      discountValue: 1500,
      images: [
        localImage('tender-turkey-puppy-bites', 'Hindi Etli Yavru Köpek Lokmaları'),
      ],
    },
    {
      slug: 'coastal-sardine-crunch',
      title: 'Çıtır Sardalyalı Ödül Maması',
      description: 'Parlak tüyler için omega yağları bakımından zengin, hafif sardalyalı ödül maması.',
      priceCents: 9900,
      stock: 140,
      categorySlug: 'cat',
      isFeatured: true,
      images: [
        localImage('coastal-sardine-crunch', 'Çıtır Sardalyalı Ödül Maması'),
      ],
    },
    {
      slug: 'charcoal-digestive-biscuits',
      title: 'Rezene ve Kömürlü Sindirim Bisküvisi',
      description: 'Hassas midelere yönelik rezene ve kömür içeren çıtır bisküviler.',
      priceCents: 6900,
      stock: 80,
      categorySlug: 'dog',
      images: [
        localImage('charcoal-digestive-biscuits', 'Rezene ve Kömürlü Sindirim Bisküvisi'),
      ],
    },
    {
      slug: 'highland-salmon-casserole',
      title: 'Somonlu ve Balkabaklı Kedi Güveci',
      description: 'Seçici kediler için insan tüketimine uygun kalitede somon ve balkabağıyla hazırlanan güveç.',
      priceCents: 21500,
      stock: 60,
      categorySlug: 'cat',
      originalPriceCents: 23900,
      images: [
        localImage('highland-salmon-casserole', 'Somonlu ve Balkabaklı Kedi Güveci'),
      ],
    },
    {
      slug: 'olive-oil-shine-coat-treats',
      title: 'Zeytinyağlı Tüy Bakımı Ödülü',
      description: 'Tüy sağlığını desteklemek için deniz yosunu ve soğuk sıkım zeytinyağıyla hazırlanan ödül maması.',
      priceCents: 7500,
      stock: 150,
      categorySlug: 'dog',
      images: [
        localImage('olive-oil-shine-coat-treats', 'Zeytinyağlı Tüy Bakımı Ödülü'),
      ],
    },
    {
      slug: 'fermented-kefir-nibbles',
      title: 'Fermente Kefirli Çıtır Lokmalar',
      description: 'Sindirimi desteklemek için kefir kültürleriyle fermente edilen çıtır lokmalar.',
      priceCents: 8500,
      stock: 110,
      categorySlug: 'cat',
      discountType: DiscountType.PERCENT,
      discountValue: 10,
      isFeatured: true,
      images: [
        localImage('fermented-kefir-nibbles', 'Fermente Kefirli Çıtır Lokmalar'),
      ],
    },
    {
      slug: 'midnight-herring-supper',
      title: 'Ringa Balıklı ve Papatyalı Ezme',
      description: 'Sakin akşamlar için Baltık ringa balığı ve papatyayla hazırlanan yumuşak ezme.',
      priceCents: 17900,
      stock: 70,
      categorySlug: 'cat',
      images: [
        localImage('midnight-herring-supper', 'Ringa Balıklı ve Papatyalı Ezme'),
      ],
    },
    {
      slug: 'sun-baked-goat-milk-bites',
      title: 'Keçi Sütlü ve Zerdeçallı Lokmalar',
      description: 'Hassas köpekler için keçi sütü ve zerdeçalla hazırlanan, protein açısından zengin lokmalar.',
      priceCents: 14300,
      stock: 105,
      categorySlug: 'dog',
      images: [
        localImage('sun-baked-goat-milk-bites', 'Keçi Sütlü ve Zerdeçallı Lokmalar'),
      ],
    },
    {
      slug: 'slow-roasted-quail-feast',
      title: 'Yavaş Kavrulmuş Bıldırcınlı Kedi Maması',
      description: 'Evde yaşayan kediler için bıldırcın ve turna yemişi içeren özel kuru mama.',
      priceCents: 20500,
      stock: 90,
      categorySlug: 'cat',
      images: [
        localImage('slow-roasted-quail-feast', 'Yavaş Kavrulmuş Bıldırcınlı Kedi Maması'),
      ],
    },
  ];

  for (const product of products) {
    const categoryId = categoryMap.get(product.categorySlug);
    if (!categoryId) continue;

    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        title: product.title,
        description: product.description,
        priceCents: product.priceCents,
        currency: product.currency ?? 'TRY',
        stock: product.stock,
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        originalPriceCents: product.originalPriceCents ?? null,
        discountType: product.discountType ?? null,
        discountValue: product.discountValue ?? null,
        promoStartAt: product.promoStartAt ?? null,
        promoEndAt: product.promoEndAt ?? null,
        categoryId,
        images: {
          deleteMany: {},
          create: product.images.map((img, index) => ({
            url: img.url,
            altText: img.altText ?? null,
            sortOrder: img.sortOrder ?? index,
          })),
        },
      },
      create: {
        slug: product.slug,
        title: product.title,
        description: product.description,
        priceCents: product.priceCents,
        currency: product.currency ?? 'TRY',
        stock: product.stock,
        isActive: product.isActive ?? true,
        isFeatured: product.isFeatured ?? false,
        originalPriceCents: product.originalPriceCents ?? null,
        discountType: product.discountType ?? null,
        discountValue: product.discountValue ?? null,
        promoStartAt: product.promoStartAt ?? null,
        promoEndAt: product.promoEndAt ?? null,
        categoryId,
        images: {
          create: product.images.map((img, index) => ({
            url: img.url,
            altText: img.altText ?? null,
            sortOrder: img.sortOrder ?? index,
          })),
        },
      },
    });
  }
}

async function seedSupportTickets() {
  const admin = await prisma.user.findFirst({
    where: { role: Role.ADMIN },
  });
  if (!admin) return;

  const ticket = await prisma.supportTicket.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      email: 'customer@local.test',
      subject: 'Teslimat gecikmesi',
      message:
        'Merhaba, Lupeti #1001 numaralı siparişim 48 saattir ilerlemiyor. Kontrol edebilir misiniz?',
      category: TicketCategory.DELIVERY,
      status: TicketStatus.OPEN,
      userId: null,
    },
  });

  await prisma.supportReply.create({
    data: {
      ticketId: ticket.id,
      authorId: admin.id,
      authorRole: Role.ADMIN,
      body: 'Kargo firmasıyla görüşüp 24 saat içinde size bilgi vereceğiz.',
    },
  });
}

async function seedSettings() {
  await prisma.storeSettings.upsert({
    where: { id: '00000000-0000-0000-0000-000000000010' },
    update: {
      storeName: 'Lupeti',
      supportEmail: supportEmail,
      supportPhone: '+90 212 000 0000',
      supportAddress: 'İstanbul, Türkiye',
      shippingStandardCents: 0,
      shippingExpressCents: 2500,
      currency: 'TRY',
      enableCheckout: true,
      enableSupport: true,
      paytrEnabled: true,
    },
    create: {
      id: '00000000-0000-0000-0000-000000000010',
      storeName: 'Lupeti',
      supportEmail: supportEmail,
      supportPhone: '+90 212 000 0000',
      supportAddress: 'İstanbul, Türkiye',
      shippingStandardCents: 0,
      shippingExpressCents: 2500,
      currency: 'TRY',
      enableCheckout: true,
      enableSupport: true,
      paytrEnabled: true,
    },
  });

  await prisma.homepageSettings.upsert({
    where: { id: '00000000-0000-0000-0000-000000000011' },
    update: {
      heroImageUrl: '/hero-static.jpg',
      storyImageUrl: '/images/hero/golden.jpg',
      categoryDogImageUrl: '/images/hero/dog.jpg',
      categoryCatImageUrl: '/images/hero/cat.jpg',
      showHeroShowcase: true,
      showHero3d: true,
      showBrandMarquee: true,
      showFeatured: true,
      showCategoryCards: true,
      showStorySection: true,
      showTrustBadges: true,
    },
    create: {
      id: '00000000-0000-0000-0000-000000000011',
      heroImageUrl: '/hero-static.jpg',
      storyImageUrl: '/images/hero/golden.jpg',
      categoryDogImageUrl: '/images/hero/dog.jpg',
      categoryCatImageUrl: '/images/hero/cat.jpg',
      showHeroShowcase: true,
      showHero3d: true,
      showBrandMarquee: true,
      showFeatured: true,
      showCategoryCards: true,
      showStorySection: true,
      showTrustBadges: true,
    },
  });
}

async function main() {
  await seedAdminUser();
  await seedCustomerUser();
  await seedCatalog();
  await seedSupportTickets();
  await seedSettings();
  console.log(
    `Seed data applied: admin (${adminEmail}), customer users, categories, products, support ticket`,
  );
}

main()
  .catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
