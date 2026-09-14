"use client";

import { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Html, Text, OrbitControls, RoundedBox, MeshTransmissionMaterial, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

interface PerfumeModelProps {
  product: any;
  isThumbnail?: boolean;
}

function PerfumeModel({ product, isThumbnail = false }: PerfumeModelProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (groupRef.current) {
      if (isThumbnail) {
        // Simple rotation on hover for thumbnails
        const targetRotation = hovered ? state.clock.elapsedTime * 2 : 0;
        groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, 0.05);
      } else {
        // Elegant, very slow floating rotation for hero/detail view
        groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.02 - 0.4;
      }
    }
  });

  const liquidColor = product?.liquidColor || "#D4941E";
  const capColor = product?.capColor || "#B8860B";
  const labelText = product?.name || 'ZERO TO ONE';

  // 1:1.3 ratio roughly
  const bodyWidth = 1.5;
  const bodyHeight = 1.15;
  const bodyDepth = 0.8;
  
  const liquidWidth = 1.35;
  const liquidHeight = 1.0;
  const liquidDepth = 0.65;
  
  const bodyY = 0;
  
  const neckHeight = 0.15;
  const neckY = bodyY + bodyHeight / 2 + neckHeight / 2;
  
  const capHeight = 0.25;
  const capY = neckY + neckHeight / 2 + capHeight / 2;
  
  const liquidY = bodyY - 0.05; // Slight air gap at top

  return (
    <>
      {/* Studio Lighting Environment */}
      <Environment preset="studio" environmentIntensity={1.5} />
      
      {/* Ambient soft lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
      <spotLight position={[-5, 5, 5]} angle={0.15} penumbra={1} intensity={2} />

      <group 
        ref={groupRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={isThumbnail ? (hovered ? 1.05 : 1) : 1}
        position={[0, -0.4, 0]}
      >
        {/* 2. LIQUID (Inner Fill) - Render first so it's behind glass */}
        <mesh position={[0, liquidY, 0]}>
          <RoundedBox args={[liquidWidth, liquidHeight, liquidDepth]} radius={0.04} smoothness={4} />
          <meshPhysicalMaterial 
            color={liquidColor}
            transmission={0.3}
            opacity={0.9}
            transparent={true}
            roughness={0.05}
            ior={1.4}
            envMapIntensity={1.5}
          />
        </mesh>

        {/* 1. BOTTLE BODY (Outer Glass) */}
        <mesh position={[0, bodyY, 0]}>
          <RoundedBox args={[bodyWidth, bodyHeight, bodyDepth]} radius={0.05} smoothness={4} />
          <MeshTransmissionMaterial 
            backside
            backsideThickness={0.15}
            thickness={0.6}
            chromaticAberration={0.08}
            anisotropy={0.3}
            distortion={0.2}
            distortionScale={0.3}
            temporalDistortion={0.0}
            ior={1.52} /* True glass IOR */
            color="#ffffff"
            clearcoat={1}
            roughness={0.02}
            envMapIntensity={2.5}
            attenuationDistance={1}
            attenuationColor="#ffffff"
          />
        </mesh>

        {/* 3. NECK CONNECTOR */}
        <mesh position={[0, neckY, 0]}>
          <cylinderGeometry args={[0.2, 0.2, neckHeight, 64]} />
          <meshStandardMaterial 
            color="#e0e0e0" 
            metalness={1} 
            roughness={0.05} 
            envMapIntensity={2.5}
          />
        </mesh>

        {/* 4. CAP */}
        <mesh position={[0, capY, 0]}>
          <boxGeometry args={[0.5, capHeight, 0.5]} />
          <meshStandardMaterial 
            color={capColor} 
            metalness={1} 
            roughness={0.1} 
            envMapIntensity={2}
          />
        </mesh>

        {/* 5. LABEL PLATE */}
        {!isThumbnail && (
          <group position={[0, bodyY, bodyDepth / 2 + 0.005]}>
            {/* Label Plate */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.45, 0.35, 0.01]} />
              <meshStandardMaterial 
                color="#c49b57" 
                metalness={0.9} 
                roughness={0.15} 
                envMapIntensity={2}
              />
            </mesh>
            {/* Label Text */}
            <Text
              position={[0, 0, 0.01]}
              fontSize={0.035}
              color="#1a1a1a"
              anchorX="center"
              anchorY="middle"
              maxWidth={0.4}
              textAlign="center"
              letterSpacing={0.1}
            >
              {labelText.toUpperCase()}
            </Text>
          </group>
        )}
        
        {/* Internal Spray Pipe */}
        <mesh position={[0, bodyY + 0.1, 0]}>
          <cylinderGeometry args={[0.015, 0.015, bodyHeight - 0.2, 16]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            transmission={1} 
            transparent 
            opacity={0.4} 
            roughness={0.1}
            envMapIntensity={1}
          />
        </mesh>
      </group>

      {/* Ultra-realistic floor shadows */}
      {!isThumbnail && (
        <ContactShadows 
          position={[0, -1.2, 0]} 
          opacity={0.4} 
          scale={10} 
          blur={2.5} 
          far={4} 
          color="#000000"
        />
      )}
    </>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
      </div>
    </Html>
  );
}

interface Perfume3DProps {
  product: any;
  isThumbnail?: boolean;
}

export default function Perfume3D({ product, isThumbnail = false }: Perfume3DProps) {
  return (
    <div className="w-full h-full absolute inset-0 z-10 pointer-events-auto">
      <Suspense fallback={
        <div className="w-full h-full flex flex-col items-center justify-center absolute inset-0 z-0 bg-[var(--color-surface)]/50">
          <div className="w-8 h-8 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Canvas key={product.id} camera={{ position: [0, 0, 4.5], fov: 45 }}>
          <Suspense fallback={<Loader />}>
            {/* LIGHTING FOR PHOTO MATCH */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[4, 5, 4]} intensity={1.2} color="#FFE4B0" castShadow />
            <directionalLight position={[-4, 2, -4]} intensity={0.6} color="#ffffff" />
            <directionalLight position={[0, 0, -3]} intensity={0.4} color="#FFE4B0" /> {/* Subtle rim light */}
            
            {/* Environment map is loaded inside PerfumeModel */}
            
            {!isThumbnail && <OrbitControls enableZoom={false} enablePan={false} />}

            {isThumbnail ? (
               <PerfumeModel product={product} isThumbnail={true} />
            ) : (
              <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
                <PerfumeModel product={product} isThumbnail={false} />
              </Float>
            )}
          </Suspense>
        </Canvas>
      </Suspense>
    </div>
  );
}
