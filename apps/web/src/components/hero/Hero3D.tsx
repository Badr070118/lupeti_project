'use client';

import { useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import { Vector3 } from 'three';
import { HeroStatic } from './HeroStatic';

function KibbleCloud({ count = 14 }: { count?: number }) {
  const [positions] = useState(() =>
    Array.from({ length: count }, () => ({
      position: new Vector3(
        (Math.random() - 0.5) * 2,
        Math.random() * 1.2,
        (Math.random() - 0.5) * 1.5,
      ),
      scale: 0.08 + Math.random() * 0.06,
    })),
  );

  return (
    <>
      {positions.map((item, index) => (
        <mesh key={`kibble-${index}`} position={item.position}>
          <dodecahedronGeometry args={[item.scale, 0]} />
          <meshStandardMaterial color="#f59e0b" roughness={0.5} metalness={0.1} />
        </mesh>
      ))}
    </>
  );
}

function Bowl() {
  return (
    <group>
      <mesh position={[0, -0.25, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <cylinderGeometry args={[1.4, 1.4, 0.45, 64, 1, false]} />
        <meshStandardMaterial color="#fb923c" roughness={0.2} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.4, 0]}>
        <torusGeometry args={[1.45, 0.08, 32, 64]} />
        <meshStandardMaterial color="#f97316" roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.3, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <cylinderGeometry args={[1.1, 1.25, 0.3, 64]} />
        <meshStandardMaterial color="#fed7aa" roughness={0.1} />
      </mesh>
    </group>
  );
}

export function Hero3D() {
  const [prefersReduce, setPrefersReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduce(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  if (prefersReduce) {
    return <HeroStatic />;
  }

  return (
    <div className="h-[360px] w-full overflow-hidden rounded-3xl bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-900 shadow-2xl">
      <Canvas camera={{ position: [0, 1.2, 3], fov: 38 }} dpr={[1, 2]}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 4, 2]} intensity={1.2} />
        <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
          <Bowl />
        </Float>
        <Float speed={3} rotationIntensity={0.8} floatIntensity={1.4}>
          <KibbleCloud />
        </Float>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
          <ringGeometry args={[1.5, 2.2, 64]} />
          <meshBasicMaterial color="#0f172a" wireframe opacity={0.2} transparent />
        </mesh>
      </Canvas>
    </div>
  );
}
