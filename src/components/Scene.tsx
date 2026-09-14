import { useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls, ContactShadows, Html } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

import PerfumeBottle from './PerfumeBottle';
import FloatingParticles from './FloatingParticles';

gsap.registerPlugin(ScrollTrigger);

function CameraRig({ activeHotspot, hotspots, controlsRef }: any) {
  const { camera } = useThree();
  
  useEffect(() => {
    if (activeHotspot) {
      const targetHotspot = hotspots.find((h: any) => h.id === activeHotspot);
      if (targetHotspot && controlsRef.current) {
        // Fly camera to the hotspot
        gsap.to(camera.position, {
          x: targetHotspot.position[0] * 1.5,
          y: targetHotspot.position[1] + 0.5,
          z: targetHotspot.position[2] + 2.5,
          duration: 1.5,
          ease: "power3.inOut"
        });

        // Point OrbitControls at the hotspot
        gsap.to(controlsRef.current.target, {
          x: targetHotspot.position[0],
          y: targetHotspot.position[1],
          z: targetHotspot.position[2],
          duration: 1.5,
          ease: "power3.inOut"
        });
      }
    } else {
      // Reset Camera
      gsap.to(camera.position, {
        x: 0,
        y: 2,
        z: 8,
        duration: 1.5,
        ease: "power3.inOut"
      });
      
      if (controlsRef.current) {
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1.5,
          ease: "power3.inOut"
        });
      }
    }
  }, [activeHotspot, hotspots, camera, controlsRef]);

  return null;
}

function HotspotPin({ hs, activeHotspot, setActiveHotspot }: any) {
  const { camera } = useThree();
  const ref = useRef<THREE.Group>(null);
  const htmlRef = useRef<HTMLDivElement>(null);

  useFrame(() => {
    if (ref.current && htmlRef.current) {
      // Calculate normal vector (assuming normal is roughly pointing outwards from center)
      const normal = ref.current.position.clone().normalize();
      const viewVector = camera.position.clone().sub(ref.current.position).normalize();
      
      const dotProduct = normal.dot(viewVector);
      
      // Occlusion Logic: If the dot product is less than 0.1, it's facing away from camera
      if (dotProduct < 0.1) {
        htmlRef.current.style.opacity = '0';
        htmlRef.current.style.pointerEvents = 'none';
      } else {
        htmlRef.current.style.opacity = '1';
        htmlRef.current.style.pointerEvents = 'auto';
      }
    }
  });

  return (
    <group ref={ref} position={hs.position as [number, number, number]}>
      <Html distanceFactor={8} transform occlude>
        <div 
          ref={htmlRef}
          onClick={(e) => {
            e.stopPropagation();
            setActiveHotspot(hs.id);
          }}
          className={`cursor-pointer transition-opacity duration-300 ${activeHotspot === hs.id ? 'scale-125' : 'scale-100 hover:scale-110'}`}
        >
          {/* A glowing dot with a halo, matching the luxury theme */}
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className={`absolute w-full h-full rounded-full animate-ping opacity-50 ${activeHotspot === hs.id ? 'bg-white' : 'bg-accent'}`} />
            <div className={`w-3 h-3 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] ${activeHotspot === hs.id ? 'bg-white' : 'bg-accent/80'}`} />
          </div>
        </div>
      </Html>
    </group>
  );
}

export default function Scene({ variant, hotspots, activeHotspot, setActiveHotspot }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<any>(null);
  
  return (
    <div ref={containerRef} className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 2, 8], fov: 45 }}>
        {/* Environment & Lighting */}
        <color attach="background" args={['#050505']} />
        <Environment preset="studio" environmentIntensity={0.5} />
        
        <ambientLight intensity={0.3} />
        <spotLight 
          position={[5, 10, 5]} 
          angle={0.3} 
          penumbra={0.8} 
          intensity={5} 
          color="#ffeedd" 
          castShadow 
          shadow-bias={-0.0001} 
        />
        <spotLight 
          position={[-5, 5, -5]} 
          angle={0.5} 
          penumbra={1} 
          intensity={2} 
          color="#00f0ff" 
        />

        {/* Antigravity Group */}
        <AnimatedGroup activeHotspot={activeHotspot}>
          <PerfumeBottle variant={variant} />
          {/* Interactive HTML Hotspots */}
          {hotspots.map((hs: any) => (
            <HotspotPin 
              key={hs.id} 
              hs={hs} 
              activeHotspot={activeHotspot} 
              setActiveHotspot={setActiveHotspot} 
            />
          ))}
        </AnimatedGroup>

        <FloatingParticles count={150} />

        {/* Dynamic Ground Shadows */}
        <ContactShadows 
          position={[0, -3.5, 0]} 
          opacity={0.4} 
          scale={20} 
          blur={2} 
          far={10} 
        />

        <CameraRig activeHotspot={activeHotspot} hotspots={hotspots} controlsRef={controlsRef} />

        {/* Camera Controls */}
        <OrbitControls 
          ref={controlsRef}
          enableZoom={false} 
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          autoRotate={!activeHotspot}
          autoRotateSpeed={0.5}
        />

        {/* Post Processing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.5} mipmapBlur intensity={1.5} />
          <Noise opacity={0.05} />
          <Vignette eskil={false} offset={0.1} darkness={1.1} />
          {activeHotspot && (
            <DepthOfField focusDistance={0.02} focalLength={0.02} bokehScale={2} height={480} />
          )}
        </EffectComposer>
      </Canvas>
    </div>
  );
}

// Separate component to handle the GSAP ScrollTrigger and Bobbing logic
function AnimatedGroup({ children, activeHotspot }: any) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    // Scroll-based exploded view with strict PRD percentages
    const cap = groupRef.current.getObjectByName('cap');
    const neck = groupRef.current.getObjectByName('neck');
    const glass = groupRef.current.getObjectByName('glass'); // Assuming glass could be named, but we applied to the whole bottle if needed. Actually we need the outer shell.

    // Let's animate children positions if specific names aren't perfectly mapped.
    // The cap and neck base are named in PerfumeBottle.tsx.
    const neckBase = groupRef.current.getObjectByName('neck-base');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scroll-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    });

    // 0-15%: Resting (Do nothing)
    // 15-45%: Cap translates +1.4Y
    if (cap) {
      tl.fromTo(cap.position, 
        { y: 3.4 }, 
        { y: 3.4 + 1.4, ease: "power2.out" }, 
        "0.15" // Starts at 15% of timeline
      );
    }
    
    // 45-75%: Atomizer/Neck translates +0.7Y
    if (neck) tl.fromTo(neck.position, { y: 2.8 }, { y: 2.8 + 0.7, ease: "power2.out" }, "0.45");
    if (neckBase) tl.fromTo(neckBase.position, { y: 2.6 }, { y: 2.6 + 0.7, ease: "power2.out" }, "0.45");

    // 75-100%: Outer shell scales +12%
    // Currently, outer shell doesn't have a name. We can just scale the whole group slightly for dramatic effect or name it.
    tl.to(groupRef.current.scale, { x: 1.12, z: 1.12, ease: "power2.out" }, "0.75");

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <group ref={groupRef}>
      {children}
    </group>
  );
}
