import { BadgeCheck, Headphones, PawPrint, ShieldCheck, Truck } from 'lucide-react';

const BENEFITS = [
  {
    title: 'Livraison Rapide',
    description: 'Expedition rapide et securisee pour tous vos produits.',
    Icon: Truck,
  },
  {
    title: 'Support 24/7',
    description: 'Notre equipe est disponible pour vous aider a tout moment.',
    Icon: Headphones,
  },
  {
    title: 'Satisfaction Garantie',
    description: 'Produits de qualite selectionnes pour vos animaux.',
    Icon: BadgeCheck,
  },
  {
    title: 'Produits Specialises',
    description: 'Une large selection pour chiens et chats.',
    Icon: PawPrint,
  },
  {
    title: 'Paiement Securise',
    description: 'Transactions protegees avec un paiement fiable et securise.',
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
