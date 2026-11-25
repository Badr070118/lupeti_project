import { BadgeCheck, Headphones, PawPrint, ShieldCheck, Truck } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Hızlı teslimat',
    description: 'Siparişleriniz için hızlı ve güvenli gönderim.',
    Icon: Truck,
  },
  {
    title: '7/24 destek',
    description: 'Ekibimiz her zaman size yardımcı olmaya hazır.',
    Icon: Headphones,
  },
  {
    title: 'Memnuniyet garantisi',
    description: 'Evcil dostlarınız için özenle seçilmiş ürünler.',
    Icon: BadgeCheck,
  },
  {
    title: 'Özel ürünler',
    description: 'Kediler ve köpekler için geniş ürün seçkisi.',
    Icon: PawPrint,
  },
  {
    title: 'Güvenli ödeme',
    description: 'Güvenli ödeme altyapısıyla korunan işlemler.',
    Icon: ShieldCheck,
  },
] as const;

export function StoreBenefits() {
  return (
    <section className="bg-gradient-to-r from-[#0f172a] via-[#111827] to-[#1f2937]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {BENEFITS.map(({ title, description, Icon }) => (
            <article
              key={title}
              className="flex flex-col items-center rounded-2xl bg-white/5 p-8 text-center backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Icon className="size-7 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">{title}</h3>
              <p className="mt-2 text-sm text-gray-300">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
