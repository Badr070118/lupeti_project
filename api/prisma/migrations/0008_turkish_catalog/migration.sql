-- Translate existing demo copy while preserving merchant edits.
BEGIN;

UPDATE "Product" AS product
SET "title" = CASE WHEN product."title" = copy.old_title THEN copy.title ELSE product."title" END,
    "description" = CASE WHEN product."description" = copy.old_description THEN copy.description ELSE product."description" END
FROM (VALUES
  ('anatolian-lamb-herbs-kibble', 'Anatolian Lamb & Herbs Kibble', 'Slow-dried lamb croquettes infused with thyme and sage for active dogs.', 'Kuzu Etli ve Otlu Köpek Maması', 'Hareketli köpekler için kekik ve adaçayıyla tatlandırılmış, yavaş kurutulan kuzu etli kuru mama.'),
  ('tender-turkey-puppy-bites', 'Tender Turkey Puppy Bites', 'Mini bites with DHA and probiotics crafted for growing puppies.', 'Hindi Etli Yavru Köpek Lokmaları', 'Büyüme çağındaki yavru köpekler için DHA ve probiyotik içeren küçük lokmalar.'),
  ('coastal-sardine-crunch', 'Coastal Sardine Crunch', 'Airy sardine snacks rich in omega oils for shiny coats.', 'Çıtır Sardalyalı Ödül Maması', 'Parlak tüyler için omega yağları bakımından zengin, hafif sardalyalı ödül maması.'),
  ('charcoal-digestive-biscuits', 'Charcoal Digestive Biscuits', 'Crunchy biscuits with charcoal and fennel to soothe tummies.', 'Rezene ve Kömürlü Sindirim Bisküvisi', 'Hassas midelere yönelik rezene ve kömür içeren çıtır bisküviler.'),
  ('highland-salmon-casserole', 'Highland Salmon Casserole', 'Human-grade salmon and pumpkin casserole for picky cats.', 'Somonlu ve Balkabaklı Kedi Güveci', 'Seçici kediler için insan tüketimine uygun kalitede somon ve balkabağıyla hazırlanan güveç.'),
  ('olive-oil-shine-coat-treats', 'Olive Oil Shine Coat Treats', 'Functional treats with kelp and cold-pressed olive oil for coat health.', 'Zeytinyağlı Tüy Bakımı Ödülü', 'Tüy sağlığını desteklemek için deniz yosunu ve soğuk sıkım zeytinyağıyla hazırlanan ödül maması.'),
  ('fermented-kefir-nibbles', 'Fermented Kefir Nibbles', 'Crunchy nuggets fermented with kefir cultures to support digestion.', 'Fermente Kefirli Çıtır Lokmalar', 'Sindirimi desteklemek için kefir kültürleriyle fermente edilen çıtır lokmalar.'),
  ('midnight-herring-supper', 'Midnight Herring Supper', 'Moist pâté with Baltic herring and chamomile for calm evenings.', 'Ringa Balıklı ve Papatyalı Ezme', 'Sakin akşamlar için Baltık ringa balığı ve papatyayla hazırlanan yumuşak ezme.'),
  ('sun-baked-goat-milk-bites', 'Sun-baked Goat Milk Bites', 'Protein-rich bites with goat milk and turmeric for sensitive dogs.', 'Keçi Sütlü ve Zerdeçallı Lokmalar', 'Hassas köpekler için keçi sütü ve zerdeçalla hazırlanan, protein açısından zengin lokmalar.'),
  ('slow-roasted-quail-feast', 'Slow Roasted Quail Feast', 'Premium quail kibble with cranberries tailored for indoor cats.', 'Yavaş Kavrulmuş Bıldırcınlı Kedi Maması', 'Evde yaşayan kediler için bıldırcın ve turna yemişi içeren özel kuru mama.')
) AS copy(slug, old_title, old_description, title, description)
WHERE product."slug" = copy.slug
  AND (product."title" = copy.old_title OR product."description" = copy.old_description);

UPDATE "ProductImage" AS image
SET "altText" = CASE WHEN image."altText" = copy.old_title THEN copy.title ELSE copy.title || ' ambalajı' END
FROM "Product" AS product
JOIN (VALUES
  ('anatolian-lamb-herbs-kibble', 'Anatolian Lamb & Herbs Kibble', 'Kuzu Etli ve Otlu Köpek Maması'),
  ('tender-turkey-puppy-bites', 'Tender Turkey Puppy Bites', 'Hindi Etli Yavru Köpek Lokmaları'),
  ('coastal-sardine-crunch', 'Coastal Sardine Crunch', 'Çıtır Sardalyalı Ödül Maması'),
  ('charcoal-digestive-biscuits', 'Charcoal Digestive Biscuits', 'Rezene ve Kömürlü Sindirim Bisküvisi'),
  ('highland-salmon-casserole', 'Highland Salmon Casserole', 'Somonlu ve Balkabaklı Kedi Güveci'),
  ('olive-oil-shine-coat-treats', 'Olive Oil Shine Coat Treats', 'Zeytinyağlı Tüy Bakımı Ödülü'),
  ('fermented-kefir-nibbles', 'Fermented Kefir Nibbles', 'Fermente Kefirli Çıtır Lokmalar'),
  ('midnight-herring-supper', 'Midnight Herring Supper', 'Ringa Balıklı ve Papatyalı Ezme'),
  ('sun-baked-goat-milk-bites', 'Sun-baked Goat Milk Bites', 'Keçi Sütlü ve Zerdeçallı Lokmalar'),
  ('slow-roasted-quail-feast', 'Slow Roasted Quail Feast', 'Yavaş Kavrulmuş Bıldırcınlı Kedi Maması')
) AS copy(slug, old_title, title) ON product."slug" = copy.slug
WHERE image."productId" = product."id"
  AND image."altText" IN (copy.old_title, copy.old_title || ' packaging');

UPDATE "Category" SET "name" = 'Köpek Ürünleri' WHERE "slug" = 'dog' AND "name" = 'Dog Essentials';
UPDATE "Category" SET "name" = 'Kedi Ürünleri' WHERE "slug" = 'cat' AND "name" = 'Cat Comfort';
UPDATE "StoreSettings" SET "storeName" = 'Lupeti' WHERE "storeName" = 'Lupeti Pet Shop';
UPDATE "StoreSettings" SET "supportAddress" = 'İstanbul, Türkiye' WHERE "supportAddress" = 'Istanbul, TR';

COMMIT;
