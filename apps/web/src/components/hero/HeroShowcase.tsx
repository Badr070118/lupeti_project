'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  Float,
  MeshDistortMaterial,
  OrbitControls,
  PointMaterial,
  Points,
} from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as THREE from 'three';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMediaQuery } from '@/hooks/use-media-query';

type AnimatedGroupProps = {
  basePosition?: [number, number, number];
};

const FloatingBalls = () => {
  const balls = [
    { color: '#f472b6', position: [2, 1, -2] },
    { color: '#60a5fa', position: [-2, 1.5, -1] },
    { color: '#22d3ee', position: [0, 0.5, -3] },
    { color: '#a78bfa', position: [1, 2, 1] },
  ] as const;

  return (
    <>
      {balls.map((ball, index) => (
        <Float
          key={ball.color}
          speed={2 + index * 0.4}
          rotationIntensity={1}
          floatIntensity={1.8}
        >
          <mesh position={ball.position} castShadow>
            <sphereGeometry args={[0.35, 32, 32]} />
            <meshStandardMaterial
              color={ball.color}
              emissive={ball.color}
              emissiveIntensity={0.5}
              metalness={0.7}
              roughness={0.25}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

const createParticlePositions = (count: number) => {
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const x = (Math.random() - 0.5) * 40;
    const y = (Math.random() - 0.2) * 25;
    const z = (Math.random() - 0.5) * 40;
    arr.set([x, y, z], i * 3);
  }
  return arr;
};

const ParticleField = ({ count }: { count: number }) => {
  const points = useRef<THREE.Points>(null);
  const [positions, setPositions] = useState<Float32Array>(() =>
    createParticlePositions(count),
  );

  useEffect(() => {
    setPositions(createParticlePositions(count));
  }, [count]);

  useFrame((state) => {
    if (!points.current) return;
    const t = state.clock.getElapsedTime();
    points.current.rotation.y = t * 0.04;
    points.current.rotation.x = t * 0.02;
  });

  return (
    <Points ref={points} positions={positions} stride={3}>
      <PointMaterial
        transparent
        color="#a78bfa"
        size={0.08}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

const GroundPlane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.1, 0]} receiveShadow>
    <planeGeometry args={[40, 40]} />
    <MeshDistortMaterial
      color="#1a0b2e"
      metalness={0.8}
      roughness={0.2}
      distort={0.3}
      speed={2}
      opacity={0.85}
      transparent
    />
  </mesh>
);

const LowPolyDog = ({ basePosition = [-3, 0, 0] }: AnimatedGroupProps) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    const radius = 3;
    group.current.position.x = Math.cos(t * 0.5) * radius;
    group.current.position.z = Math.sin(t * 0.5) * radius;
    group.current.position.y = 0.4 + Math.abs(Math.sin(t * 1.2)) * 0.2;
    group.current.rotation.y = Math.atan2(
      Math.sin(t * 0.5) * radius,
      Math.cos(t * 0.5) * radius,
    );
  });

  return (
    <group ref={group} position={basePosition}>
      <mesh castShadow>
        <boxGeometry args={[1.2, 0.7, 1.8]} />
        <meshStandardMaterial color="#d4a574" metalness={0.35} roughness={0.65} />
      </mesh>
      <mesh position={[0, 0.55, 0.8]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      <mesh position={[-0.35, 0.95, 0.9]} rotation={[0, 0, -0.4]} castShadow>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshStandardMaterial color="#b8936f" />
      </mesh>
      <mesh position={[0.35, 0.95, 0.9]} rotation={[0, 0, 0.4]} castShadow>
        <coneGeometry args={[0.15, 0.4, 3]} />
        <meshStandardMaterial color="#b8936f" />
      </mesh>
      <mesh position={[0, 0.3, -0.9]} rotation={[0.6, 0, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.16, 0.6, 8]} />
        <meshStandardMaterial color="#d4a574" />
      </mesh>
      {[
        [-0.35, -0.6, 0.4],
        [0.35, -0.6, 0.4],
        [-0.35, -0.6, -0.4],
        [0.35, -0.6, -0.4],
      ].map((pos) => (
        <mesh key={pos.toString()} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.7, 8]} />
          <meshStandardMaterial color="#b8936f" />
        </mesh>
      ))}
      <pointLight position={[0, 1, 0]} intensity={0.6} color="#60a5fa" distance={4} />
    </group>
  );
};

const LowPolyCat = ({ basePosition = [3, 0, 0] }: AnimatedGroupProps) => {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.getElapsedTime();
    group.current.position.x = Math.sin(t * 0.7) * 2.5;
    group.current.position.y = 0.6 + Math.abs(Math.sin(t * 2.4)) * 1;
    group.current.position.z = Math.cos(t * 0.7) * 1.5;
    group.current.rotation.y = t * 0.5;
  });

  return (
    <group ref={group} position={basePosition}>
      <mesh castShadow>
        <boxGeometry args={[0.9, 0.6, 1.2]} />
        <meshStandardMaterial color="#e5e5e5" metalness={0.2} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.4, 0.7]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      <mesh position={[-0.25, 0.8, 0.6]} rotation={[0, 0, -0.3]} castShadow>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0.25, 0.8, 0.6]} rotation={[0, 0, 0.3]} castShadow>
        <coneGeometry args={[0.15, 0.3, 3]} />
        <meshStandardMaterial color="#cccccc" />
      </mesh>
      <mesh position={[0, 0.45, -0.7]} rotation={[1, 0, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.12, 0.8, 8]} />
        <meshStandardMaterial color="#e5e5e5" />
      </mesh>
      {[
        [-0.25, -0.55, 0.3],
        [0.25, -0.55, 0.3],
        [-0.25, -0.55, -0.3],
        [0.25, -0.55, -0.3],
      ].map((pos) => (
        <mesh key={pos.toString()} position={pos as [number, number, number]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 0.55, 8]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
      ))}
      <pointLight position={[0, 1, 0]} intensity={0.6} color="#a78bfa" distance={4} />
    </group>
  );
};

const HeroContent = ({ reduceMotion }: { reduceMotion: boolean }) => {
  const router = useRouter();

  const sharedAnimate = reduceMotion ? undefined : { opacity: 1, y: 0 };

  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={sharedAnimate}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mb-6 rounded-full border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-200 backdrop-blur-lg"
      >
        <span className="inline-flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Promotions Janvier
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.9 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : { opacity: 1, scale: 1, transition: { delay: 0.6, duration: 0.8 } }
        }
        className="mb-6 text-4xl font-black leading-tight text-white md:text-7xl"
        style={{
          background:
            'linear-gradient(135deg, #ffffff 0%, #a78bfa 50%, #60a5fa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(167, 139, 250, 0.5)',
        }}
      >
        Bienvenue chez
        <br />
        <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          Lupeti
        </span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={sharedAnimate}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="mb-10 max-w-2xl text-lg text-slate-200 md:text-2xl"
      >
        Jusqu&apos;à{' '}
        <span className="font-bold text-pink-300">-20%</span> sur vos produits préférés.
        <br />
        <span className="text-cyan-300">Pour le bonheur de vos compagnons 🐕🐈</span>
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : 20 }}
        animate={sharedAnimate}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="pointer-events-auto flex flex-wrap justify-center gap-4"
      >
        <motion.button
          whileHover={reduceMotion ? undefined : { scale: 1.05, boxShadow: '0 0 30px rgba(244,114,182,0.6)' }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          type="button"
          onClick={() => router.push('/shop')}
          className="relative overflow-hidden rounded-full px-8 py-4 font-semibold text-white shadow-lg"
        >
          <div className="absolute inset-0 animate-gradient-shift bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500" />
          <span className="relative z-10 flex items-center gap-2 text-lg">
            <ShoppingBag className="h-5 w-5" />
            Découvrir
          </span>
        </motion.button>
        <motion.button
          whileHover={reduceMotion ? undefined : { scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          type="button"
          onClick={() => router.push('/category/dog')}
          className="rounded-full border-2 border-white/30 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-white/20"
        >
          Boutique Chiens
        </motion.button>
        <motion.button
          whileHover={reduceMotion ? undefined : { scale: 1.05 }}
          whileTap={reduceMotion ? undefined : { scale: 0.97 }}
          type="button"
          onClick={() => router.push('/category/cat')}
          className="rounded-full border-2 border-purple-400/60 bg-white/10 px-8 py-4 text-lg font-semibold text-white backdrop-blur-md transition hover:bg-purple-500/20"
        >
          Boutique Chats
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={
          reduceMotion
            ? { opacity: 1 }
            : {
                opacity: 1,
                y: [0, 10, 0],
                transition: { duration: 2, repeat: Infinity },
              }
        }
        transition={{ delay: 1.8 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-sm text-cyan-200"
      >
        <span>Scroll pour découvrir</span>
        <div className="flex h-12 w-6 items-start justify-center rounded-full border-2 border-cyan-200/50 p-1">
          <motion.span
            animate={reduceMotion ? undefined : { y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-1.5 w-1.5 rounded-full bg-cyan-200"
          />
        </div>
      </motion.div>
    </div>
  );
};

export function HeroShowcase() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const reduceMotion = useReducedMotion();

  const camera = isMobile ? [0, 2, 10] : [0, 2, 8];
  const fov = isMobile ? 70 : 60;
  const particleCount = isMobile ? 1200 : 2800;

  return (
    <section className="relative min-h-[620px] w-full overflow-hidden rounded-[40px] bg-[#0f172a] shadow-[0_20px_80px_rgba(0,0,0,0.4)]">
      <div className="hero-gradient-dark animate-gradient-shift absolute inset-0 opacity-90" />
      <div className="scan-effect absolute inset-0" />
      {!reduceMotion && (
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{ position: camera as [number, number, number], fov }}
          className="absolute inset-0"
        >
          <Suspense fallback={null}>
            <color attach="background" args={['#080d1b']} />
            <ambientLight intensity={0.6} />
            <spotLight
              position={[10, 10, 10]}
              angle={0.4}
              penumbra={0.8}
              intensity={1.1}
              color="#a78bfa"
              castShadow
            />
            <pointLight position={[-10, 5, -10]} intensity={0.8} color="#60a5fa" />
            <ParticleField count={particleCount} />
            <group>
              <LowPolyDog />
              <LowPolyCat />
              <FloatingBalls />
              <GroundPlane />
            </group>
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
            <EffectComposer>
              <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.9} />
              <ChromaticAberration offset={[0.0008, 0.0008]} />
            </EffectComposer>
          </Suspense>
        </Canvas>
      )}
      <HeroContent reduceMotion={reduceMotion} />
    </section>
  );
}

export function HeroShowcaseSkeleton() {
  return (
    <div className="hero-gradient-dark flex min-h-[620px] w-full items-center justify-center rounded-[40px]">
      <div className="space-y-4 text-center text-white/70">
        <div className="mx-auto h-4 w-48 rounded-full bg-white/10" />
        <div className="mx-auto h-10 w-64 rounded-full bg-white/10" />
        <div className="mx-auto h-10 w-64 rounded-full bg-white/10" />
      </div>
    </div>
  );
}
