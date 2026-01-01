'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { ContactShadows } from '@react-three/drei';
import { FloatingProduct } from './FloatingProduct';

const cards = [
  {
    image: '/products/tender-turkey-puppy-bites.png',
    color: '#10b981',
    position: [-1.6, -0.15, 0],
  },
  {
    image: '/products/slow-roasted-quail-feast.png',
    color: '#a855f7',
    position: [0, 0, 0],
  },
  {
    image: '/products/highland-salmon-casserole.png',
    color: '#38bdf8',
    position: [1.6, -0.1, 0],
  },
];

export function Scene3D() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollBoost, setScrollBoost] = useState(0);

  useEffect(() => {
    const listener = () => {
      const progress = window.scrollY / window.innerHeight;
      setScrollBoost(Math.min(progress, 1));
    };
    listener();
    window.addEventListener('scroll', listener, { passive: true });
    return () => window.removeEventListener('scroll', listener);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const handler = () => setIsMobile(query.matches);
    handler();
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  }, []);

  const displayedCards = useMemo(
    () =>
      cards.map((card, index) => ({
        ...card,
        position: [
          card.position[0] * (isMobile ? 0.7 : 1),
          card.position[1],
          card.position[2],
        ] as [number, number, number],
        floatOffset: index * 0.8,
      })),
    [isMobile],
  );

  return (
    <Canvas
      shadows
      dpr={[1, isMobile ? 1.2 : 2]}
      camera={{ position: [0, isMobile ? 1 : 1.4, 4], fov: isMobile ? 45 : 36 }}
    >
      <color attach="background" args={['#00000000']} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[4, 5, 3]} castShadow intensity={1.4} />
      <Suspense fallback={null}>
        {displayedCards.map((card) => (
          <FloatingProduct
            key={card.image}
            image={card.image}
            accentColor={card.color}
            position={card.position}
            scrollBoost={scrollBoost}
            mobile={isMobile}
          />
        ))}
        <ContactShadows
          position={[0, -1.15, 0]}
          opacity={0.45}
          width={10}
          height={10}
          blur={2}
          far={12}
        />
      </Suspense>
    </Canvas>
  );
}
