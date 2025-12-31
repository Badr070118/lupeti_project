'use client';

import { motion } from "framer-motion";
import { PawPrint, Bone, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

const categoryIcons = {
  dog: PawPrint,
  cat: Bone,
  accessories: Sparkles,
};

const cards = [
  { key: "dog", query: { category: "dog" } },
  { key: "cat", query: { category: "cat" } },
  { key: "accessories", query: { category: "accessories" } },
] as const;

export function CategoryHighlights() {
  const t = useTranslations("home.categories");

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-wide text-amber-500">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-semibold text-slate-900">
            {t("title")}
          </h2>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card, index) => {
          const Icon = categoryIcons[card.key];
          return (
            <motion.div
              key={card.key}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-slate-50 to-slate-100 p-8 shadow-sm ring-1 ring-slate-100"
            >
              <Link
                href={{ pathname: "/shop", query: card.query }}
                className="flex h-full flex-col justify-between gap-6"
              >
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-sm font-medium text-slate-700 shadow-sm">
                    <Icon className="h-4 w-4 text-amber-500" />
                    {t(`${card.key}.badge`)}
                  </div>
                  <h3 className="mt-4 text-2xl font-semibold text-slate-900">
                    {t(`${card.key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-slate-500">
                    {t(`${card.key}.copy`)}
                  </p>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {t("cta")} →
                </span>
                <div className="absolute inset-6 rounded-3xl bg-gradient-to-tr from-amber-100/40 to-transparent opacity-0 transition group-hover:opacity-100" />
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
