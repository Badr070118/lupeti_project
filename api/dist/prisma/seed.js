"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
const argon2 = __importStar(require("argon2"));
const client_1 = require("@prisma/client");
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
const adminEmail = process.env.SEED_ADMIN_EMAIL?.toLowerCase() ?? 'admin@local.test';
const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin123!ChangeMe';
const supportEmail = process.env.SUPPORT_EMAIL ?? 'support@lupeti.local';
const localImage = (slug, title, sortOrder = 0) => ({
    url: `/products/${slug}.jpg`,
    altText: `${title} packaging`,
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
            role: client_1.Role.ADMIN,
            status: client_1.UserStatus.ACTIVE,
            name: 'Lupeti Admin',
        },
        create: {
            email: adminEmail,
            passwordHash,
            role: client_1.Role.ADMIN,
            status: client_1.UserStatus.ACTIVE,
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
            role: client_1.Role.USER,
            name: 'Demo Customer',
        },
        create: {
            email,
            passwordHash,
            role: client_1.Role.USER,
            status: client_1.UserStatus.ACTIVE,
            name: 'Demo Customer',
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
    const products = [
        {
            slug: 'anatolian-lamb-herbs-kibble',
            title: 'Anatolian Lamb & Herbs Kibble',
            description: 'Slow-dried lamb croquettes infused with thyme and sage for active dogs.',
            priceCents: 18900,
            currency: 'TRY',
            stock: 120,
            categorySlug: 'dog',
            isFeatured: true,
            originalPriceCents: 21900,
            discountType: client_1.DiscountType.PERCENT,
            discountValue: 15,
            images: [
                localImage('anatolian-lamb-herbs-kibble', 'Anatolian Lamb & Herbs Kibble'),
            ],
        },
        {
            slug: 'tender-turkey-puppy-bites',
            title: 'Tender Turkey Puppy Bites',
            description: 'Mini bites with DHA and probiotics crafted for growing puppies.',
            priceCents: 15900,
            stock: 95,
            categorySlug: 'dog',
            promoStartAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
            promoEndAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 4),
            discountType: client_1.DiscountType.AMOUNT,
            discountValue: 1500,
            images: [
                localImage('tender-turkey-puppy-bites', 'Tender Turkey Puppy Bites'),
            ],
        },
        {
            slug: 'coastal-sardine-crunch',
            title: 'Coastal Sardine Crunch',
            description: 'Airy sardine snacks rich in omega oils for shiny coats.',
            priceCents: 9900,
            stock: 140,
            categorySlug: 'cat',
            isFeatured: true,
            images: [
                localImage('coastal-sardine-crunch', 'Coastal Sardine Crunch'),
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
                localImage('charcoal-digestive-biscuits', 'Charcoal Digestive Biscuits'),
            ],
        },
        {
            slug: 'highland-salmon-casserole',
            title: 'Highland Salmon Casserole',
            description: 'Human-grade salmon and pumpkin casserole for picky cats.',
            priceCents: 21500,
            stock: 60,
            categorySlug: 'cat',
            originalPriceCents: 23900,
            images: [
                localImage('highland-salmon-casserole', 'Highland Salmon Casserole'),
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
                localImage('olive-oil-shine-coat-treats', 'Olive Oil Shine Coat Treats'),
            ],
        },
        {
            slug: 'fermented-kefir-nibbles',
            title: 'Fermented Kefir Nibbles',
            description: 'Crunchy nuggets fermented with kefir cultures to support digestion.',
            priceCents: 8500,
            stock: 110,
            categorySlug: 'cat',
            discountType: client_1.DiscountType.PERCENT,
            discountValue: 10,
            isFeatured: true,
            images: [
                localImage('fermented-kefir-nibbles', 'Fermented Kefir Nibbles'),
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
                localImage('midnight-herring-supper', 'Midnight Herring Supper'),
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
                localImage('sun-baked-goat-milk-bites', 'Sun-baked Goat Milk Bites'),
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
                localImage('slow-roasted-quail-feast', 'Slow Roasted Quail Feast'),
            ],
        },
    ];
    for (const product of products) {
        const categoryId = categoryMap.get(product.categorySlug);
        if (!categoryId)
            continue;
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
        where: { role: client_1.Role.ADMIN },
    });
    if (!admin)
        return;
    const ticket = await prisma.supportTicket.upsert({
        where: { id: '00000000-0000-0000-0000-000000000001' },
        update: {},
        create: {
            id: '00000000-0000-0000-0000-000000000001',
            email: 'customer@local.test',
            subject: 'Livraison en retard',
            message: 'Bonjour, ma commande Lupeti #1001 semble bloquée depuis 48h. Pouvez-vous vérifier ?',
            category: client_1.TicketCategory.DELIVERY,
            status: client_1.TicketStatus.OPEN,
            userId: null,
        },
    });
    await prisma.supportReply.create({
        data: {
            ticketId: ticket.id,
            authorId: admin.id,
            authorRole: client_1.Role.ADMIN,
            body: 'Nous vérifions auprès du transporteur et revenons vers vous sous 24h.',
        },
    });
}
async function main() {
    await seedAdminUser();
    await seedCustomerUser();
    await seedCatalog();
    await seedSupportTickets();
    console.log(`Seed data applied: admin (${adminEmail}), customer users, categories, products, support ticket`);
}
main()
    .catch((error) => {
    console.error('Seeding failed', error);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map