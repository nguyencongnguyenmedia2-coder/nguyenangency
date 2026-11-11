"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface PointerCoords {
  x: number;
  y: number;
}

// Camera Rig for Smooth Mouse Parallax
function CameraRig({ pointerRef }: { pointerRef: React.MutableRefObject<PointerCoords> }) {
  const { camera } = useThree();

  useFrame(() => {
    const { x, y } = pointerRef.current;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x * 0.45, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y * 0.35, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Undulating 3D Cyber Particle Mesh (Matches the blue particle wave in Image 3)
function CyberWaveField() {
  const meshRef = useRef<THREE.Points>(null);
  const countX = 45;
  const countZ = 35;
  const total = countX * countZ;

  const [positions, initialY, colors] = useMemo(() => {
    const pos = new Float32Array(total * 3);
    const initY = new Float32Array(total);
    const col = new Float32Array(total * 3);

    const cCyan = new THREE.Color("#00E5FF");
    const cBlue = new THREE.Color("#007BA7");
    const cPink = new THREE.Color("#FF2D95");

    let idx = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iz = 0; iz < countZ; iz++) {
        const x = (ix - countX / 2) * 0.32 - 1.5;
        const z = (iz - countZ / 2) * 0.28 - 1.0;
        const y = -2.2 + Math.sin(ix * 0.15) * 0.4;

        pos[idx * 3] = x;
        pos[idx * 3 + 1] = y;
        pos[idx * 3 + 2] = z;
        initY[idx] = y;

        // Gradient color across wave
        const ratio = ix / countX;
        const color = ratio < 0.65 ? cCyan.clone().lerp(cBlue, ratio / 0.65) : cBlue.clone().lerp(cPink, (ratio - 0.65) / 0.35);

        col[idx * 3] = color.r;
        col[idx * 3 + 1] = color.g;
        col[idx * 3 + 2] = color.b;

        idx++;
      }
    }

    return [pos, initY, col];
  }, [total]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const geom = meshRef.current.geometry;
    const posAttr = geom.attributes.position;
    const time = state.clock.getElapsedTime() * 1.2;

    let idx = 0;
    for (let ix = 0; ix < countX; ix++) {
      for (let iz = 0; iz < countZ; iz++) {
        const wave = Math.sin(ix * 0.28 + time) * 0.22 + Math.cos(iz * 0.24 + time * 0.8) * 0.18;
        posAttr.setY(idx, initialY[idx] + wave);
        idx++;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={total} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={total} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// Ambient Star Dust Particles
function AmbientStarField({ count = 120 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cCyan = new THREE.Color("#00A3FF");
    const cMagenta = new THREE.Color("#FF2D95");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8 - 1;

      const pick = i % 3 === 0 ? cMagenta : cCyan;
      col[i * 3] = pick.r;
      col[i * 3 + 1] = pick.g;
      col[i * 3 + 2] = pick.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={colors.length / 3} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        vertexColors
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

export default function Hero3DScene() {
  const pointerRef = useRef<PointerCoords>({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = -(e.clientY / window.innerHeight) * 2 + 1;
      pointerRef.current.x = nx;
      pointerRef.current.y = ny;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none w-full h-full overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[-4, 3, 2]} intensity={4.0} color="#00E5FF" distance={14} />
        <pointLight position={[4, -2, 2]} intensity={3.5} color="#FF2D95" distance={14} />

        <CameraRig pointerRef={pointerRef} />
        <CyberWaveField />
        <AmbientStarField count={130} />
      </Canvas>
    </div>
  );
}
