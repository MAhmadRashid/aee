import { useRef, useMemo } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

export default function PerfumeBottle({ variant }: { variant: any }) {
  const liquidRef = useRef<THREE.Mesh>(null);
  const { size } = useThree();

  // Inertia and velocity tracking for slosh physics
  const velocity = useRef(new THREE.Vector2(0, 0));
  const previousPointer = useRef(new THREE.Vector2(0, 0));
  const targetRotation = useRef(new THREE.Vector2(0, 0));

  useFrame((state, delta) => {
    if (liquidRef.current) {
      // Calculate pointer velocity
      const currentPointer = state.pointer;
      const dx = currentPointer.x - previousPointer.current.x;
      const dy = currentPointer.y - previousPointer.current.y;
      
      velocity.current.set(dx, dy);
      previousPointer.current.copy(currentPointer);

      // Add inertia to target rotation based on movement
      // Dragging left means liquid sloshes right (opposite direction)
      targetRotation.current.x += velocity.current.y * 5;
      targetRotation.current.y -= velocity.current.x * 5;

      // Spring physics to return to center
      targetRotation.current.x = THREE.MathUtils.lerp(targetRotation.current.x, 0, 0.05);
      targetRotation.current.y = THREE.MathUtils.lerp(targetRotation.current.y, 0, 0.05);

      // Apply rotation to liquid mesh with smooth dampening
      liquidRef.current.rotation.x = THREE.MathUtils.lerp(liquidRef.current.rotation.x, targetRotation.current.x, 0.1);
      liquidRef.current.rotation.z = THREE.MathUtils.lerp(liquidRef.current.rotation.z, targetRotation.current.y, 0.1);
    }
  });

  const bottleArgs = useMemo(() => {
    if (variant?.shapes?.bottle === 'round') return [1.8, 2.5, 1.8];
    if (variant?.shapes?.bottle === 'tall') return [1.2, 3.5, 1.2];
    return [1.8, 2.5, 1.2]; // default square
  }, [variant]);

  const liquidArgs = useMemo(() => {
    if (variant?.shapes?.bottle === 'round') return [1.6, 2.3, 1.6];
    if (variant?.shapes?.bottle === 'tall') return [1.0, 3.3, 1.0];
    return [1.6, 2.3, 1.0]; // default square
  }, [variant]);

  return (
    <group position={[0, -1, 0]}>
      
      {/* 1. Heavy Glass Outer Shell */}
      <mesh name="glass" castShadow receiveShadow position={[0, bottleArgs[1]/2, 0]}>
        <RoundedBox args={bottleArgs as [number, number, number]} radius={0.1} smoothness={4}>
          <MeshTransmissionMaterial 
            backside
            samples={16}
            resolution={512}
            transmission={0.95}
            roughness={0.1}
            thickness={0.8}
            ior={1.5}
            chromaticAberration={0.05}
            anisotropy={0.3}
            distortion={0.1}
            distortionScale={0.3}
            temporalDistortion={0.1}
            color="#ffffff"
          />
        </RoundedBox>
      </mesh>

      {/* 2. Liquid Core with Slosh Physics */}
      <mesh ref={liquidRef} position={[0, (bottleArgs[1]/2) - 0.05, 0]}>
        <RoundedBox args={liquidArgs as [number, number, number]} radius={0.05} smoothness={4}>
          <meshPhysicalMaterial 
            color={variant?.liquidColor || '#d4af37'}
            transmission={0.8}
            opacity={1}
            roughness={0.1}
            ior={1.4}
            thickness={2}
          />
        </RoundedBox>
      </mesh>

      {/* 3. Atomizer Neck Base */}
      <mesh name="neck-base" position={[0, bottleArgs[1] + 0.1, 0]}>
        <cylinderGeometry args={[0.3, 0.4, 0.2, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.1} />
      </mesh>

      {/* 4. Atomizer Pump Tube (visible through glass) */}
      <mesh position={[0, bottleArgs[1]/2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, bottleArgs[1] - 0.2, 8]} />
        <meshStandardMaterial color="#ffffff" metalness={0.5} roughness={0.2} transparent opacity={0.5} />
      </mesh>

      {/* 5. Spray Nozzle */}
      <mesh name="neck" position={[0, bottleArgs[1] + 0.3, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.4, 32]} />
        <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
      </mesh>

      {/* 6. Premium Cap (Dynamic based on data) */}
      <mesh name="cap" position={[0, bottleArgs[1] + 0.9, 0]} castShadow>
        {variant?.shapes?.cap === 'sphere' ? (
          <sphereGeometry args={[0.6, 32, 32]} />
        ) : variant?.shapes?.cap === 'cylinder' ? (
          <cylinderGeometry args={[0.4, 0.4, 1.2, 32]} />
        ) : (
          <cylinderGeometry args={[0.5, 0.4, 0.8, 8]} /> // ornate faceted
        )}
        <meshStandardMaterial 
          color={variant?.capColor || '#111111'} 
          metalness={variant?.shapes?.cap === 'sphere' ? 0.1 : 0.9} 
          roughness={variant?.shapes?.cap === 'sphere' ? 0.8 : 0.2} 
        />
      </mesh>

    </group>
  );
}
