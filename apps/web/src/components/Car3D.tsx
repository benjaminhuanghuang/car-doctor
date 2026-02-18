// @ts-nocheck - Three.js JSX elements from @react-three/fiber
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useRef } from 'react';
import type { Mesh } from 'three';

interface Car3DProps {
  color?: string;
}

const CarModel = ({ color = '#3b82f6' }: { color: string }) => {
  const carRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (carRef.current) {
      carRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  const carColor = color.toLowerCase();

  return (
    <group ref={carRef}>
      {/* Car Body */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2, 0.8, 4]} />
        <meshStandardMaterial color={carColor} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Car Roof */}
      <mesh position={[0, 1.2, -0.3]} castShadow>
        <boxGeometry args={[1.6, 0.6, 2]} />
        <meshStandardMaterial color={carColor} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Front Windshield */}
      <mesh position={[0, 1.25, 0.7]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.1]} />
        <meshStandardMaterial
          color="#1e3a5f"
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Back Windshield */}
      <mesh position={[0, 1.25, -1.3]} rotation={[-0.3, 0, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.1]} />
        <meshStandardMaterial
          color="#1e3a5f"
          transparent
          opacity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Wheels */}
      {/* Front Left */}
      <mesh position={[-0.9, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Front Right */}
      <mesh position={[0.9, 0, 1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Back Left */}
      <mesh position={[-0.9, 0, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      {/* Back Right */}
      <mesh position={[0.9, 0, -1.2]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.35, 0.35, 0.3, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Headlights */}
      <mesh position={[-0.6, 0.4, 2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffe0" emissive="#ffffe0" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.6, 0.4, 2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ffffe0" emissive="#ffffe0" emissiveIntensity={0.5} />
      </mesh>

      {/* Taillights */}
      <mesh position={[-0.6, 0.4, -2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.6, 0.4, -2.01]}>
        <boxGeometry args={[0.3, 0.2, 0.05]} />
        <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
};

export const Car3D = ({ color = '#3b82f6' }: Car3DProps) => {
  return (
    <div className="w-full h-100 rounded-lg overflow-hidden bg-linear-to-b from-sky-100 to-slate-100 dark:from-slate-800 dark:to-slate-900">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[4, 3, 6]} fov={50} />
        <OrbitControls
          enablePan={false}
          minDistance={5}
          maxDistance={12}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />

        {/* Car */}
        <CarModel color={color} />

        {/* Ground */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.35, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.3} />
        </mesh>
      </Canvas>
    </div>
  );
};
