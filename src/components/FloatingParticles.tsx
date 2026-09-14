import { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const particleVertexShader = `
  uniform float uTime;
  varying vec2 vUv;
  
  // Pseudo-random function
  float hash(vec3 p) {
    p = fract(p * 0.3183099 + .1);
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  // Simplified procedural noise for zero-gravity drift
  vec3 curlNoise(vec3 p, float t) {
    float x = sin(p.y * 2.0 + t) * cos(p.z * 1.5 - t);
    float y = cos(p.x * 2.0 + t) * sin(p.z * 1.5 + t);
    float z = sin(p.x * 1.5 - t) * cos(p.y * 2.0 + t);
    return vec3(x, y, z) * 0.5;
  }

  void main() {
    vUv = uv;
    
    // Extract instance position from instanceMatrix
    vec3 instancePos = vec3(instanceMatrix[3][0], instanceMatrix[3][1], instanceMatrix[3][2]);
    
    // Apply curl noise displacement based on instance position and time
    vec3 displacement = curlNoise(instancePos, uTime * 0.2);
    
    vec4 worldPosition = instanceMatrix * vec4(position, 1.0);
    worldPosition.xyz += displacement;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const particleFragmentShader = `
  varying vec2 vUv;
  uniform vec3 uColor;
  void main() {
    float distanceToCenter = distance(vUv, vec2(0.5));
    float alpha = smoothstep(0.5, 0.2, distanceToCenter);
    gl_FragColor = vec4(uColor, alpha * 0.6);
  }
`;

export default function FloatingParticles({ count = 60 }: { count?: number }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 8;     // x
      temp[i * 3 + 1] = (Math.random() - 0.5) * 8; // y
      temp[i * 3 + 2] = (Math.random() - 0.5) * 8; // z
    }
    return temp;
  }, [count]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#d4af37') }
  }), []);

  useEffect(() => {
    if (meshRef.current) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < count; i++) {
        dummy.position.set(
          particles[i * 3],
          particles[i * 3 + 1],
          particles[i * 3 + 2]
        );
        const scale = Math.random() * 0.05 + 0.02;
        dummy.scale.set(scale, scale, scale);
        dummy.updateMatrix();
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [count, particles]);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null as any, null as any, count]} castShadow receiveShadow>
      <sphereGeometry args={[1, 16, 16]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={particleVertexShader}
        fragmentShader={particleFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
