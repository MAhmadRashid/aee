'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import FloatingParticles from './FloatingParticles';

export default function HeroParticles() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <FloatingParticles count={40} />
    </Canvas>
  );
}
