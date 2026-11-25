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
      productName: 'Yavaş Kavrulmuş Bıldırcınlı Kedi Maması',
      productImg: '/products/slow-roasted-quail-feast.png',
      note: 'Doğal içeriklerle',
    },
    centerImg: '/hero/hero-animals-1.webp',
    right: {
      brand: 'Farmina',
      brandLogo: '/brands/farmina.png',
      productName: 'Somonlu ve Balkabaklı Kedi Güveci',
      productImg: '/products/highland-salmon-casserole.png',
      note: 'Evcil dostunuz için lezzet',
    },
  },
  {
    id: 'slide-2',
    left: {
      brand: 'Acana',
      brandLogo: '/brands/acana.png',
      productName: 'Kuzu Etli ve Otlu Köpek Maması',
      productImg: '/products/anatolian-lamb-herbs-kibble.png',
      note: 'Hareketli dostlar için',
    },
    centerImg: '/images/hero/golden.jpg',
    right: {
      brand: 'Orijen',
      brandLogo: '/brands/orijen.png',
      productName: 'Hindi Etli Yavru Köpek Lokmaları',
      productImg: '/products/tender-turkey-puppy-bites.png',
      note: 'Doğal protein bakımından zengin',
    },
  },
];

export type PetProductCard = {
  id: string;
  petImg: string;
  productImg: string;
  title: string;
  price: string;
  tag: 'Kedi' | 'Köpek';
};

export const petProductCards: PetProductCard[] = [
  {
    id: 'c1',
    tag: 'Kedi',
    title: 'Somonlu ve Balkabaklı Kedi Güveci',
    price: '₺215,00',
    petImg: '/images/hero/cat.jpg',
    productImg: '/products/highland-salmon-casserole.png',
  },
  {
    id: 'c2',
    tag: 'Köpek',
    title: 'Kuzu Etli ve Otlu Köpek Maması',
    price: '₺189,00',
    petImg: '/images/hero/dog.jpg',
    productImg: '/products/anatolian-lamb-herbs-kibble.png',
  },
  {
    id: 'c3',
    tag: 'Kedi',
    title: 'Rezene ve Kömürlü Sindirim Bisküvisi',
    price: '₺69,00',
    petImg: '/hero/hero-animals-1.webp',
    productImg: '/products/charcoal-digestive-biscuits.png',
  },
  {
    id: 'c4',
    tag: 'Köpek',
    title: 'Hindi Etli Yavru Köpek Lokmaları',
    price: '₺159,00',
    petImg: '/images/hero/golden.jpg',
    productImg: '/products/tender-turkey-puppy-bites.png',
  },
  {
    id: 'c5',
    tag: 'Kedi',
    title: 'Zeytinyağlı Tüy Bakımı Ödülü',
    price: '₺75,00',
    petImg: '/hero/hero-animals-2.webp',
    productImg: '/products/olive-oil-shine-coat-treats.png',
  },
  {
    id: 'c6',
    tag: 'Köpek',
    title: 'Çıtır Sardalyalı Ödül Maması',
    price: '₺99,00',
    petImg: '/images/hero/dog.jpg',
    productImg: '/products/coastal-sardine-crunch.png',
  },
];
