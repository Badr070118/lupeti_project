export type PromoSlide = {
  id: string;
  left: {
    brand: string;
    brandLogo?: string;
    productName: string;
    productImg: string;
    note: string;
  };
  centerImg: string;
  right: {
    brand: string;
    brandLogo?: string;
    productName: string;
    productImg: string;
    note: string;
  };
};

export const promoSlides: PromoSlide[] = [
  {
    id: 'slide-1',
    left: {
      brand: 'Brit Care',
      brandLogo: '/brands/brit-care.png',
      productName: 'Slow Roasted Quail Feast',
      productImg: '/products/slow-roasted-quail-feast.png',
      note: 'Premium by nature',
    },
    centerImg: '/hero/hero-animals-1.webp',
    right: {
      brand: 'Farmina',
      brandLogo: '/brands/farmina.png',
      productName: 'Highland Salmon Casserole',
      productImg: '/products/highland-salmon-casserole.png',
      note: 'Happy pet, happy you',
    },
  },
  {
    id: 'slide-2',
    left: {
      brand: 'Acana',
      brandLogo: '/brands/acana.png',
      productName: 'Anatolian Lamb Herbs Kibble',
      productImg: '/products/anatolian-lamb-herbs-kibble.png',
      note: 'Crafted for active pets',
    },
    centerImg: '/images/hero/golden.jpg',
    right: {
      brand: 'Orijen',
      brandLogo: '/brands/orijen.png',
      productName: 'Tender Turkey Puppy Bites',
      productImg: '/products/tender-turkey-puppy-bites.png',
      note: 'Rich in natural protein',
    },
  },
];

export type PetProductCard = {
  id: string;
  petImg: string;
  productImg: string;
  title: string;
  price: string;
  tag: 'Chat' | 'Chien';
};

export const petProductCards: PetProductCard[] = [
  {
    id: 'c1',
    tag: 'Chat',
    title: 'Highland Salmon Casserole',
    price: '199 DH',
    petImg: '/images/hero/cat.jpg',
    productImg: '/products/highland-salmon-casserole.png',
  },
  {
    id: 'c2',
    tag: 'Chien',
    title: 'Anatolian Lamb Herbs Kibble',
    price: '249 DH',
    petImg: '/images/hero/dog.jpg',
    productImg: '/products/anatolian-lamb-herbs-kibble.png',
  },
  {
    id: 'c3',
    tag: 'Chat',
    title: 'Charcoal Digestive Biscuits',
    price: '109 DH',
    petImg: '/hero/hero-animals-1.webp',
    productImg: '/products/charcoal-digestive-biscuits.png',
  },
  {
    id: 'c4',
    tag: 'Chien',
    title: 'Tender Turkey Puppy Bites',
    price: '149 DH',
    petImg: '/images/hero/golden.jpg',
    productImg: '/products/tender-turkey-puppy-bites.png',
  },
  {
    id: 'c5',
    tag: 'Chat',
    title: 'Olive Oil Shine Coat Treats',
    price: '49 DH',
    petImg: '/hero/hero-animals-2.webp',
    productImg: '/products/olive-oil-shine-coat-treats.png',
  },
  {
    id: 'c6',
    tag: 'Chien',
    title: 'Coastal Sardine Crunch',
    price: '69 DH',
    petImg: '/images/hero/dog.jpg',
    productImg: '/products/coastal-sardine-crunch.png',
  },
];
