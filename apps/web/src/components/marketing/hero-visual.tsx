'use client';

import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import { useReducedMotion } from 'framer-motion';

function Bowl() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[2.2, 0.35, 32, 64]} />
      <meshStandardMaterial color="#e11d48" roughness={0.4} metalness={0.1} />
    </mesh>
  );
}

function Kibble({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.25, 24, 24]} />
      <meshStandardMaterial color="#fbbf24" roughness={0.7} />
    </mesh>
  );
}

export function HeroVisual() {
  const prefersReducedMotion = useReducedMotion();
  const kibbles = useMemo<[number, number, number][]>(
    () => [
      [0, 0.4, 0],
      [0.5, 0.7, -0.4],
      [-0.6, 0.6, 0.3],
      [0.2, 0.2, 0.7],
    ],
    [],
  );

  if (prefersReducedMotion) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl bg-gradient-to-br from-rose-100 via-white to-sky-100">
        <div className="rounded-full bg-white/70 px-6 py-3 text-sm font-semibold text-slate-600 shadow-lg">
          Nourish playfully, even in still moments.
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <Canvas camera={{ position: [0, 0, 6], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.8}>
            <Bowl />
            {kibbles.map((pos, index) => (
              <Kibble key={index} position={pos} />
            ))}
          </Float>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
