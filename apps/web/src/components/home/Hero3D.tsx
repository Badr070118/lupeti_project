'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Scene3D } from './Scene3D';
import '@/styles/hero3d.css';

type Hero3DProps = {
  locale: string;
};

export function Hero3D({ locale }: Hero3DProps) {
  return (
    <section className="hero3d">
      <div className="hero3d__glow" />
      <div className="hero3d__content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="hero3d__text"
        >
          <p className="hero3d__label">LUPETI</p>
          <h2 className="hero3d__title">Premium nutrition for dogs &amp; cats</h2>
          <p className="hero3d__paragraph">
            Crafted croquettes and mindful treats presented as a living gallery. Each card highlights
            a real best seller from our pantry.
          </p>
          <Link className="hero3d__cta" href={`/${locale}/shop`}>
            Shop now
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.7 }}
          className="hero3d__canvas-wrapper"
        >
          <Scene3D />
        </motion.div>
      </div>
    </section>
  );
}
