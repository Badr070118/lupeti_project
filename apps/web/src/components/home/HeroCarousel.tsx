'use client';

import { motion } from 'framer-motion';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { AnimatedButton } from '@/components/shared/AnimatedButton';
import { heroVariants } from '@/animations/variants';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

type Slide = {
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  href: string;
  category: 'dogs' | 'cats';
};

const SLIDE_CONFIG: Array<Omit<Slide, 'title' | 'subtitle' | 'cta'> & { key: 'promo' | 'wellness' | 'rituals' }> = [
  {
    key: 'promo',
    image: '/products/slow-roasted-quail-feast.jpg',
    href: '/shop',
    category: 'dogs',
  },
  {
    key: 'wellness',
    image: '/products/charcoal-digestive-biscuits.jpg',
    href: '/shop?category=cats',
    category: 'cats',
  },
  {
    key: 'rituals',
    image: '/products/anatolian-lamb-herbs-kibble.jpg',
    href: '/shop?category=dogs',
    category: 'dogs',
  },
];

export function HeroCarousel() {
  const router = useRouter();
  const t = useTranslations('home.carousel');
  const slides: Slide[] = SLIDE_CONFIG.map((slide) => ({
    ...slide,
    title: t(`slides.${slide.key}.title`),
    subtitle: t(`slides.${slide.key}.subtitle`),
    cta: t(`slides.${slide.key}.cta`),
  }));

  return (
    <section className="relative rounded-3xl bg-slate-900">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 5000 }}
        pagination={{ clickable: true }}
        className="h-[520px] rounded-3xl"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <motion.div
              variants={heroVariants}
              initial="initial"
              animate="animate"
              className="relative flex h-full w-full items-center overflow-hidden rounded-3xl"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority
                className="object-cover"
              />
              <div className="hero-overlay absolute inset-0" />
              <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 text-white md:px-12">
                <motion.span
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-4 py-1 text-sm uppercase tracking-widest"
                  whileHover={{ scale: 1.05 }}
                >
                  {t(`categories.${slide.category}`)}
                </motion.span>
                <h1 className="text-4xl font-bold leading-tight md:text-6xl">{slide.title}</h1>
                <p className="max-w-xl text-lg text-white/80">{slide.subtitle}</p>
                <div className="flex flex-wrap gap-3">
                  <AnimatedButton onClick={() => router.push(slide.href)}>
                    {slide.cta}
                  </AnimatedButton>
                  <AnimatedButton
                    variant="secondary"
                    className="bg-white/10 text-white"
                    onClick={() =>
                      router.push(slide.category === 'dogs' ? '/shop?category=dogs' : '/shop?category=cats')
                    }
                  >
                    {t(`categories.${slide.category}`)}
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
