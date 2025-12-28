import { config } from 'dotenv';
import * as argon2 from 'argon2';
import { PrismaClient, Role } from '@prisma/client';

config();

const prisma = new PrismaClient();

type ProductSeed = {
  slug: string;
  title: string;
  description: string;
  priceCents: number;
  currency?: string;
  stock: number;
  isActive?: boolean;
  categorySlug: string;
  images: Array<{ url: string; altText?: string | null; sortOrder?: number }>;
};

async function seedAdminUser() {
  const adminEmail = 'admin@local.test';
  const adminPassword = 'Admin123!ChangeMe';

  const passwordHash = await argon2.hash(adminPassword, {
    type: argon2.argon2id,
  });

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: Role.ADMIN,
    },
    create: {
      email: adminEmail,
      passwordHash,
      role: Role.ADMIN,
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
    },
    create: {
      email,
      passwordHash,
      role: Role.USER,
    },
  });
}

async function seedCatalog() {
  const categories = [
    { slug: 'dog', name: 'Dog Essentials' },
    { slug: 'cat', name: 'Cat Comfort' },
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
      title: 'Anatolian Lamb & Herbs Kibble',
      description: 'Slow-dried lamb croquettes infused with thyme and sage for active dogs.',
      priceCents: 18900,
      currency: 'TRY',
      stock: 120,
      categorySlug: 'dog',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Lamb+Kibble+1',
          altText: 'Anatolian lamb kibble front pack',
          sortOrder: 0,
        },
        {
          url: 'https://placehold.co/600x400.png?text=Lamb+Kibble+2',
          altText: 'Scooped lamb kibble',
          sortOrder: 1,
        },
      ],
    },
    {
      slug: 'tender-turkey-puppy-bites',
      title: 'Tender Turkey Puppy Bites',
      description: 'Mini bites with DHA and probiotics crafted for growing puppies.',
      priceCents: 15900,
      stock: 95,
      categorySlug: 'dog',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Turkey+Bites',
          altText: 'Turkey puppy bites pouch',
        },
      ],
    },
    {
      slug: 'coastal-sardine-crunch',
      title: 'Coastal Sardine Crunch',
      description: 'Airy sardine snacks rich in omega oils for shiny coats.',
      priceCents: 9900,
      stock: 140,
      categorySlug: 'cat',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Sardine+Crunch',
          altText: 'Sardine snack bites',
        },
      ],
    },
    {
      slug: 'charcoal-digestive-biscuits',
      title: 'Charcoal Digestive Biscuits',
      description: 'Crunchy biscuits with charcoal and fennel to soothe tummies.',
      priceCents: 6900,
      stock: 80,
      categorySlug: 'dog',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Digestive+Biscuits',
          altText: 'Digestive biscuits bag',
        },
      ],
    },
    {
      slug: 'highland-salmon-casserole',
      title: 'Highland Salmon Casserole',
      description: 'Human-grade salmon and pumpkin casserole for picky cats.',
      priceCents: 21500,
      stock: 60,
      categorySlug: 'cat',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Salmon+Casserole',
          altText: 'Salmon casserole tray',
        },
      ],
    },
    {
      slug: 'olive-oil-shine-coat-treats',
      title: 'Olive Oil Shine Coat Treats',
      description: 'Functional treats with kelp and cold-pressed olive oil for coat health.',
      priceCents: 7500,
      stock: 150,
      categorySlug: 'dog',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Coat+Treats',
          altText: 'Coat treat bites',
        },
      ],
    },
    {
      slug: 'fermented-kefir-nibbles',
      title: 'Fermented Kefir Nibbles',
      description: 'Crunchy nuggets fermented with kefir cultures to support digestion.',
      priceCents: 8500,
      stock: 110,
      categorySlug: 'cat',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Kefir+Nibbles',
          altText: 'Kefir cat snacks',
        },
      ],
    },
    {
      slug: 'midnight-herring-supper',
      title: 'Midnight Herring Supper',
      description: 'Moist pâté with Baltic herring and chamomile for calm evenings.',
      priceCents: 17900,
      stock: 70,
      categorySlug: 'cat',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Herring+Supper',
          altText: 'Herring pâté tin',
        },
      ],
    },
    {
      slug: 'sun-baked-goat-milk-bites',
      title: 'Sun-baked Goat Milk Bites',
      description: 'Protein-rich bites with goat milk and turmeric for sensitive dogs.',
      priceCents: 14300,
      stock: 105,
      categorySlug: 'dog',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Goat+Milk+Bites',
          altText: 'Goat milk bite pieces',
        },
      ],
    },
    {
      slug: 'slow-roasted-quail-feast',
      title: 'Slow Roasted Quail Feast',
      description: 'Premium quail kibble with cranberries tailored for indoor cats.',
      priceCents: 20500,
      stock: 90,
      categorySlug: 'cat',
      images: [
        {
          url: 'https://placehold.co/600x400.png?text=Quail+Feast',
          altText: 'Quail feast kibble',
        },
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

async function main() {
  await seedAdminUser();
  await seedCustomerUser();
  await seedCatalog();
  console.log('Seed data applied: admin & customer users, categories, products');
}

main()
  .catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
