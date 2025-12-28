'use client';

import { motion } from "framer-motion";
import { ShieldCheck, Truck, CreditCard, HeartPulse } from "lucide-react";
import { useTranslations } from "next-intl";

const badges = [
  { icon: ShieldCheck, key: "quality" },
  { icon: Truck, key: "delivery" },
  { icon: CreditCard, key: "payment" },
  { icon: HeartPulse, key: "vet" },
] as const;

export function TrustBadges() {
  const t = useTranslations("home.trust");

  return (
    <section className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {badges.map((item, index) => {
        const Icon = item.icon;
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="flex flex-col gap-3 rounded-3xl border border-slate-100 bg-white/80 p-5 shadow-sm backdrop-blur"
          >
            <Icon className="h-8 w-8 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-900">
              {t(`${item.key}.title`)}
            </h3>
            <p className="text-sm text-slate-500">
              {t(`${item.key}.copy`)}
            </p>
          </motion.div>
        );
      })}
    </section>
  );
}
