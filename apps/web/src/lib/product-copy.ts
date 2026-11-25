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
      title: 'Kuzu Etli ve Otlu Köpek Maması',
      description: 'Hareketli köpekler için kekik ve adaçayıyla tatlandırılmış, yavaş kurutulan kuzu etli kuru mama.',
    },
    'tender-turkey-puppy-bites': {
      title: 'Hindi Etli Yavru Köpek Lokmaları',
      description: 'Büyüme çağındaki yavru köpekler için DHA ve probiyotik içeren küçük lokmalar.',
    },
    'coastal-sardine-crunch': {
      title: 'Çıtır Sardalyalı Ödül Maması',
      description: 'Parlak tüyler için omega yağları bakımından zengin, hafif sardalyalı ödül maması.',
    },
    'charcoal-digestive-biscuits': {
      title: 'Rezene ve Kömürlü Sindirim Bisküvisi',
      description: 'Hassas midelere yönelik rezene ve kömür içeren çıtır bisküviler.',
    },
    'highland-salmon-casserole': {
      title: 'Somonlu ve Balkabaklı Kedi Güveci',
      description: 'Seçici kediler için insan tüketimine uygun kalitede somon ve balkabağıyla hazırlanan güveç.',
    },
    'olive-oil-shine-coat-treats': {
      title: 'Zeytinyağlı Tüy Bakımı Ödülü',
      description: 'Tüy sağlığını desteklemek için deniz yosunu ve soğuk sıkım zeytinyağıyla hazırlanan ödül maması.',
    },
    'fermented-kefir-nibbles': {
      title: 'Fermente Kefirli Çıtır Lokmalar',
      description: 'Sindirimi desteklemek için kefir kültürleriyle fermente edilen çıtır lokmalar.',
    },
    'midnight-herring-supper': {
      title: 'Ringa Balıklı ve Papatyalı Ezme',
      description: 'Sakin akşamlar için Baltık ringa balığı ve papatyayla hazırlanan yumuşak ezme.',
    },
    'sun-baked-goat-milk-bites': {
      title: 'Keçi Sütlü ve Zerdeçallı Lokmalar',
      description: 'Hassas köpekler için keçi sütü ve zerdeçalla hazırlanan, protein açısından zengin lokmalar.',
    },
    'slow-roasted-quail-feast': {
      title: 'Yavaş Kavrulmuş Bıldırcınlı Kedi Maması',
      description: 'Evde yaşayan kediler için bıldırcın ve turna yemişi içeren özel kuru mama.',
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


// Existing order snapshots keep their stored title and display the known Turkish equivalent.
const historicalOrderTitles = new Map([
  ['Anatolian Lamb & Herbs Kibble', productCopy.tr['anatolian-lamb-herbs-kibble'].title],
  ['Tender Turkey Puppy Bites', productCopy.tr['tender-turkey-puppy-bites'].title],
  ['Coastal Sardine Crunch', productCopy.tr['coastal-sardine-crunch'].title],
  ['Charcoal Digestive Biscuits', productCopy.tr['charcoal-digestive-biscuits'].title],
  ['Highland Salmon Casserole', productCopy.tr['highland-salmon-casserole'].title],
  ['Olive Oil Shine Coat Treats', productCopy.tr['olive-oil-shine-coat-treats'].title],
  ['Fermented Kefir Nibbles', productCopy.tr['fermented-kefir-nibbles'].title],
  ['Midnight Herring Supper', productCopy.tr['midnight-herring-supper'].title],
  ['Sun-baked Goat Milk Bites', productCopy.tr['sun-baked-goat-milk-bites'].title],
  ['Slow Roasted Quail Feast', productCopy.tr['slow-roasted-quail-feast'].title],
]);

export function orderItemTitle(storedTitle: string) {
  return historicalOrderTitles.get(storedTitle) ?? storedTitle;
}
