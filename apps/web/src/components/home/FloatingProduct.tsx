'use client';

import { useFrame } from '@react-three/fiber';
import { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, PlaneGeometry } from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { meshBounds, useCursor, useTexture } from '@react-three/drei';
import gsap from 'gsap';

type FloatingProductProps = {
  image: string;
  accentColor: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scrollBoost: number;
  mobile?: boolean;
};

export function FloatingProduct({
  image,
  accentColor,
  position,
  rotation = [0, Math.PI, 0],
  scrollBoost,
  mobile,
}: FloatingProductProps) {
  const texture = useTexture(image);
  useEffect(() => {
    texture.flipY = true;
    texture.needsUpdate = true;
  }, [texture]);

  const groupRef = useRef<Group>(null);
  const glowRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const basePosition = useMemo(() => ({ x: position[0], y: position[1], z: position[2] }), [position]);

  useEffect(() => {
    if (!groupRef.current) return;
    gsap.to(groupRef.current.scale, {
      x: hovered ? 1.08 : 1,
      y: hovered ? 1.08 : 1,
      z: hovered ? 1.08 : 1,
      duration: 0.4,
      ease: 'power3.out',
    });
    if (glowRef.current) {
      gsap.to((glowRef.current.material as MeshBasicMaterial).opacity, {
        value: hovered ? 0.55 : 0.35,
        duration: 0.35,
        ease: 'power3.out',
      });
    }
  }, [hovered]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const elapsed = state.clock.elapsedTime;
    const rotationBoost = mobile ? 0.15 : 0.25;
    groupRef.current.rotation.y += (0.2 + scrollBoost * rotationBoost) * delta;
    const floatStrength = mobile ? 0.05 : 0.12;
    groupRef.current.position.y =
      basePosition.y + Math.sin(elapsed + basePosition.x) * floatStrength + scrollBoost * 0.15;
    groupRef.current.position.x = basePosition.x + Math.sin(elapsed * 0.3) * 0.05;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      raycast={meshBounds}
      onPointerOver={(event) => {
        event.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      <mesh receiveShadow castShadow>
        <boxGeometry args={[1.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#020617" metalness={0.25} roughness={0.35} />
      </mesh>

      <mesh position={[0, 0, -0.041]} rotation={rotation}>
        <planeGeometry args={[1.1, 1.65]} />
        <meshStandardMaterial map={texture} transparent side={2} />
      </mesh>

      <mesh ref={glowRef} position={[0, 0, -0.06]}>
        <planeGeometry args={[1.35, 1.9]} />
        <meshBasicMaterial color={accentColor} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}
