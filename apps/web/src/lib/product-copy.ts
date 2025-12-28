import type { Product } from '@/types';

type CopyEntry = {
  title: string;
  description: string;
};

type ProductCopyMap = Record<string, Record<string, CopyEntry>>;

const productCopy: ProductCopyMap = {
  en: {
    'anatolian-lamb-herbs-kibble': {
      title: 'Anatolian Lamb & Herb Ritual',
      description: 'Slow-baked lamb kibble perfumed with thyme and sage for active companions.',
    },
    'tender-turkey-puppy-bites': {
      title: 'Tender Turkey Puppy Bites',
      description: 'Mini bites enriched with DHA and probiotics to nurture growing pups.',
    },
    'coastal-sardine-crunch': {
      title: 'Coastal Sardine Crunch',
      description: 'Airy sardine treats packed with omega oils for glossy coats.',
    },
    'charcoal-digestive-biscuits': {
      title: 'Charcoal Digestive Biscuits',
      description: 'Crunchy biscuits with fennel and charcoal to settle sensitive tummies.',
    },
    'highland-salmon-casserole': {
      title: 'Highland Salmon Casserole',
      description: 'Human-grade salmon and pumpkin casserole for picky felines.',
    },
    'olive-oil-shine-coat-treats': {
      title: 'Olive Oil Shine Treats',
      description: 'Functional treats with kelp and cold-pressed olive oil for coat wellness.',
    },
    'fermented-kefir-nibbles': {
      title: 'Fermented Kefir Nibbles',
      description: 'Crunchy nuggets fermented with kefir cultures to support digestion.',
    },
    'midnight-herring-supper': {
      title: 'Midnight Herring Supper',
      description: 'Moist pâté with Baltic herring and chamomile for calm evenings.',
    },
    'sun-baked-goat-milk-bites': {
      title: 'Sun-baked Goat Milk Bites',
      description: 'Protein-rich bites with goat milk and turmeric for sensitive dogs.',
    },
    'slow-roasted-quail-feast': {
      title: 'Slow Roasted Quail Feast',
      description: 'Premium quail kibble with cranberries tailored for indoor cats.',
    },
  },
  fr: {
    'anatolian-lamb-herbs-kibble': {
      title: 'Rituel agneau & herbes',
      description: "Croquettes d'agneau infusées au thym et à la sauge pour les chiens aventureux.",
    },
    'tender-turkey-puppy-bites': {
      title: 'Bouchées tendres dinde chiot',
      description: 'Mini bouchées enrichies en DHA et probiotiques pour soutenir la croissance.',
    },
    'coastal-sardine-crunch': {
      title: 'Croustillant sardine littoral',
      description: 'Snacks légers aux sardines riches en oméga pour un pelage brillant.',
    },
    'charcoal-digestive-biscuits': {
      title: 'Biscuits digestifs au charbon',
      description: "Biscuits croquants au fenouil qui apaisent les estomacs sensibles.",
    },
    'highland-salmon-casserole': {
      title: 'Cassolette saumon & potiron',
      description: 'Cassolette premium pour chats exigeants, au saumon et potiron méditatif.',
    },
    'olive-oil-shine-coat-treats': {
      title: 'Gourmandises éclat à l’olive',
      description: "Friandises fonctionnelles aux algues et huile d'olive vierge pour la robe.",
    },
    'fermented-kefir-nibbles': {
      title: 'Croquants kéfir fermenté',
      description: 'Nuggets croustillants fermentés au kéfir pour un microbiote équilibré.',
    },
    'midnight-herring-supper': {
      title: 'Souper hareng minuit',
      description: 'Pâté moelleux au hareng et camomille pour des soirées apaisées.',
    },
    'sun-baked-goat-milk-bites': {
      title: 'Bouchées lait de chèvre',
      description: 'Bouchées protéinées au lait de chèvre et curcuma pour chiens sensibles.',
    },
    'slow-roasted-quail-feast': {
      title: 'Festin de caille rôtie',
      description: 'Croquettes de caille aux canneberges pensées pour les chats d’intérieur.',
    },
  },
  tr: {
    'anatolian-lamb-herbs-kibble': {
      title: 'Anadolu kuzu & ot mama',
      description: 'Aktif dostlar için kekik ve adaçayı ile fırınlanmış kuzu kroket.',
    },
    'tender-turkey-puppy-bites': {
      title: 'Hassas hindi yavru lokması',
      description: 'Büyüyen yavrulara uygun DHA ve probiyotik destekli mini taneler.',
    },
    'coastal-sardine-crunch': {
      title: 'Kıyı sardalya çıtırı',
      description: 'Parlak tüyler için omega zengini sardalya atıştırmalıkları.',
    },
    'charcoal-digestive-biscuits': {
      title: 'Karbonlu sindirim bisküvisi',
      description: 'Hassas mideleri yatıştıran rezene ve kömürlü bisküviler.',
    },
    'highland-salmon-casserole': {
      title: 'Dağ somon güveci',
      description: 'Seçici kedilere özel somon ve balkabaklı gurme güveç.',
    },
    'olive-oil-shine-coat-treats': {
      title: 'Zeytinyağlı parlaklık ödülü',
      description: 'Tüy sağlığı için soğuk sıkım zeytinyağı ve yosunlu fonksiyonel ödül.',
    },
    'fermented-kefir-nibbles': {
      title: 'Fermente kefir lokmaları',
      description: 'Sindirim sistemini destekleyen kefir kültürlü çıtır lokmalar.',
    },
    'midnight-herring-supper': {
      title: 'Gece yarısı ringa menüsü',
      description: 'Baltık ringası ve papatya ile huzurlu akşamlar sağlayan püre.',
    },
    'sun-baked-goat-milk-bites': {
      title: 'Güneşte kurutulmuş keçi sütlü ısırık',
      description: 'Hassas köpekler için keçi sütlü ve zerdeçallı proteinli lokmalar.',
    },
    'slow-roasted-quail-feast': {
      title: 'Yavaş kavrulmuş bıldırcın şöleni',
      description: 'Ev kedilerine özel kızılcık destekli bıldırcın maması.',
    },
  },
};

export type ProductCopy = ReturnType<typeof getProductCopy>;

export function getProductCopy(product: Product, locale: string) {
  const entry = productCopy[locale]?.[product.slug];
  return {
    title: entry?.title ?? product.title,
    description: entry?.description ?? product.description,
  };
}

