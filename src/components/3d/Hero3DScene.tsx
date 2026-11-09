"use client";

import React, { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PointerCoords {
  x: number;
  y: number;
}

interface BirdFlightConfig {
  scale?: number;
  speed?: number;
  flapSpeed?: number;
  radiusX?: number;
  radiusY?: number;
  radiusZ?: number;
  offsetY?: number;
  offsetZ?: number;
  phase?: number;
  primaryColor?: string;
  accentColor?: string;
  followMouse?: number;
}

/**
 * 3D Articulated Cyber-Origami Bird that flaps its multi-segment wings
 * and flies back and forth along a smooth 3D trajectory with realistic banking.
 */
function CyberBird({
  pointerRef,
  config = {},
}: {
  pointerRef: React.MutableRefObject<PointerCoords>;
  config?: BirdFlightConfig;
}) {
  const {
    scale = 0.72,
    speed = 0.55,
    flapSpeed = 6.2,
    radiusX = 4.2,
    radiusY = 1.05,
    radiusZ = 1.4,
    offsetY = 0.35,
    offsetZ = -0.3,
    phase = 0,
    primaryColor = "#007BA7",
    accentColor = "#FF2D95",
    followMouse = 0.65,
  } = config;

  const birdRootRef = useRef<THREE.Group>(null);
  const bodyTiltRef = useRef<THREE.Group>(null);
  const leftWingInnerRef = useRef<THREE.Group>(null);
  const leftWingOuterRef = useRef<THREE.Group>(null);
  const rightWingInnerRef = useRef<THREE.Group>(null);
  const rightWingOuterRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);

  // Store previous position to compute velocity vector & banking angle
  const prevPos = useRef<THREE.Vector3>(new THREE.Vector3(0, offsetY, offsetZ));

  // Custom faceted wing geometries (Origami / Stealth Falcon style)
  const { innerWingGeo, outerWingGeo, bodyGeo, tailGeo, headGeo } = useMemo(() => {
    // Inner Wing (Triangle/Quad prism look using BufferGeometry)
    const innerShape = new THREE.Shape();
    innerShape.moveTo(0, 0);
    innerShape.lineTo(1.35, 0.25);
    innerShape.lineTo(1.15, -0.45);
    innerShape.lineTo(0, -0.32);
    innerShape.closePath();

    const extrudeSettings = {
      steps: 1,
      depth: 0.045,
      bevelEnabled: true,
      bevelThickness: 0.015,
      bevelSize: 0.02,
      bevelSegments: 2,
    };

    const innerGeo = new THREE.ExtrudeGeometry(innerShape, extrudeSettings);
    innerGeo.rotateX(Math.PI / 2);

    // Outer Wingtip (Swept pointed falcon tip)
    const outerShape = new THREE.Shape();
    outerShape.moveTo(0, 0.25);
    outerShape.lineTo(1.55, -0.15);
    outerShape.lineTo(0.85, -0.52);
    outerShape.lineTo(-0.2, -0.45);
    outerShape.closePath();

    const outerGeo = new THREE.ExtrudeGeometry(outerShape, {
      ...extrudeSettings,
      depth: 0.03,
    });
    outerGeo.rotateX(Math.PI / 2);

    // Sleek Fuselage Body
    const bGeo = new THREE.ConeGeometry(0.24, 1.85, 4);
    bGeo.rotateX(Math.PI / 2);
    bGeo.scale(1, 0.55, 1);

    // Head & Beak
    const hGeo = new THREE.ConeGeometry(0.16, 0.65, 4);
    hGeo.rotateX(Math.PI / 2);
    hGeo.scale(0.9, 0.6, 1);

    // V-Tail Feather
    const tailShape = new THREE.Shape();
    tailShape.moveTo(0, 0);
    tailShape.lineTo(0.55, -0.65);
    tailShape.lineTo(0, -0.42);
    tailShape.lineTo(-0.55, -0.65);
    tailShape.closePath();

    const tGeo = new THREE.ExtrudeGeometry(tailShape, {
      steps: 1,
      depth: 0.025,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 1,
    });
    tGeo.rotateX(Math.PI / 2);

    return {
      innerWingGeo: innerGeo,
      outerWingGeo: outerGeo,
      bodyGeo: bGeo,
      tailGeo: tGeo,
      headGeo: hGeo,
    };
  }, []);

  useFrame((state) => {
    const root = birdRootRef.current;
    if (!root) return;

    const t = state.clock.elapsedTime * speed + phase;
    const { x: mx, y: my } = pointerRef.current;

    // Smooth back-and-forth figure-8 / sweeping arc trajectory across the screen
    const targetX = Math.sin(t) * radiusX + mx * followMouse;
    const targetY =
      offsetY +
      Math.sin(t * 2) * radiusY +
      Math.cos(t * 0.7) * 0.25 +
      my * (followMouse * 0.6);
    const targetZ = offsetZ + Math.cos(t) * radiusZ;

    // Smooth position interpolation
    root.position.x = THREE.MathUtils.lerp(root.position.x, targetX, 0.06);
    root.position.y = THREE.MathUtils.lerp(root.position.y, targetY, 0.06);
    root.position.z = THREE.MathUtils.lerp(root.position.z, targetZ, 0.06);

    // Compute velocity vector to orient bird along flight path
    const vx = root.position.x - prevPos.current.x;
    const vy = root.position.y - prevPos.current.y;
    const vz = root.position.z - prevPos.current.z;

    prevPos.current.copy(root.position);

    // Horizontal heading angle (yaw)
    const speedSq = vx * vx + vz * vz;
    if (speedSq > 0.000001) {
      const targetYaw = Math.atan2(vx, vz);
      // Smooth shortest-angle interpolation for yaw
      let diff = targetYaw - root.rotation.y;
      while (diff < -Math.PI) diff += Math.PI * 2;
      while (diff > Math.PI) diff -= Math.PI * 2;
      root.rotation.y += diff * 0.1;
    }

    // Pitch & Roll (banking into turns)
    if (bodyTiltRef.current) {
      const targetPitch = THREE.MathUtils.clamp(-vy * 8, -0.45, 0.45);
      const targetBank = THREE.MathUtils.clamp(-vx * 5.5, -0.65, 0.65);

      bodyTiltRef.current.rotation.x = THREE.MathUtils.lerp(
        bodyTiltRef.current.rotation.x,
        targetPitch,
        0.1
      );
      bodyTiltRef.current.rotation.z = THREE.MathUtils.lerp(
        bodyTiltRef.current.rotation.z,
        targetBank,
        0.08
      );
    }

    // Articulated Wing Flapping Cycle (Inner + delayed Outer wingtips)
    const flapTime = state.clock.elapsedTime * flapSpeed + phase * 2;
    const innerAngle = Math.sin(flapTime) * 0.52;
    const outerAngle = Math.sin(flapTime - 0.65) * 0.48;

    // Vertical body bob synced with downstroke
    if (bodyTiltRef.current) {
      bodyTiltRef.current.position.y = -Math.sin(flapTime) * 0.08;
    }

    if (leftWingInnerRef.current && leftWingOuterRef.current) {
      leftWingInnerRef.current.rotation.z = innerAngle;
      leftWingOuterRef.current.rotation.z = outerAngle;
    }

    if (rightWingInnerRef.current && rightWingOuterRef.current) {
      rightWingInnerRef.current.rotation.z = -innerAngle;
      rightWingOuterRef.current.rotation.z = -outerAngle;
    }

    if (tailRef.current) {
      tailRef.current.rotation.x = Math.cos(flapTime) * 0.12;
    }
  });

  return (
    <group ref={birdRootRef} scale={[scale, scale, scale]}>
      <group ref={bodyTiltRef}>
        {/* Main Aerodynamic Fuselage */}
        <mesh geometry={bodyGeo} castShadow receiveShadow>
          <meshStandardMaterial
            color="#16161A"
            metalness={0.92}
            roughness={0.18}
            emissive={primaryColor}
            emissiveIntensity={0.35}
          />
        </mesh>

        {/* Sculpted Head & Beak */}
        <mesh geometry={headGeo} position={[0, 0.06, 0.98]} castShadow>
          <meshStandardMaterial
            color="#202026"
            metalness={0.96}
            roughness={0.12}
            emissive={accentColor}
            emissiveIntensity={0.6}
          />
        </mesh>

        {/* Glowing Energy Core along Spine */}
        <mesh position={[0, 0.09, 0.1]} scale={[0.09, 0.05, 0.9]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={2.4}
            toneMapped={false}
          />
        </mesh>

        {/* Tail Feathers */}
        <group ref={tailRef} position={[0, 0, -0.78]}>
          <mesh geometry={tailGeo}>
            <meshStandardMaterial
              color="#141418"
              metalness={0.9}
              roughness={0.2}
              emissive={primaryColor}
              emissiveIntensity={0.55}
            />
          </mesh>
        </group>

        {/* LEFT WING (Inner + Articulated Outer Tip) */}
        <group ref={leftWingInnerRef} position={[0.12, 0.03, 0.18]}>
          <mesh geometry={innerWingGeo} castShadow>
            <meshStandardMaterial
              color="#18181E"
              metalness={0.94}
              roughness={0.16}
              emissive={primaryColor}
              emissiveIntensity={0.45}
            />
          </mesh>
          {/* Neon Leading Edge Strip */}
          <mesh position={[0.68, 0.02, 0.12]} rotation={[0, -0.18, 0]}>
            <boxGeometry args={[1.3, 0.03, 0.04]} />
            <meshStandardMaterial
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>

          {/* Left Outer Wingtip */}
          <group ref={leftWingOuterRef} position={[1.25, 0, 0]}>
            <mesh geometry={outerWingGeo} castShadow>
              <meshStandardMaterial
                color="#1E1E26"
                metalness={0.95}
                roughness={0.12}
                emissive={accentColor}
                emissiveIntensity={0.65}
              />
            </mesh>
            {/* Glowing Wingtip Feather Accent */}
            <mesh position={[0.75, 0.02, 0.05]} rotation={[0, 0.25, 0]}>
              <boxGeometry args={[1.45, 0.025, 0.035]} />
              <meshStandardMaterial
                color={accentColor}
                emissive={accentColor}
                emissiveIntensity={2.6}
                toneMapped={false}
              />
            </mesh>
          </group>
        </group>

        {/* RIGHT WING (Mirrored on X axis) */}
        <group ref={rightWingInnerRef} position={[-0.12, 0.03, 0.18]}>
          <group scale={[-1, 1, 1]}>
            <mesh geometry={innerWingGeo} castShadow>
              <meshStandardMaterial
                color="#18181E"
                metalness={0.94}
                roughness={0.16}
                emissive={primaryColor}
                emissiveIntensity={0.45}
              />
            </mesh>
            <mesh position={[0.68, 0.02, 0.12]} rotation={[0, -0.18, 0]}>
              <boxGeometry args={[1.3, 0.03, 0.04]} />
              <meshStandardMaterial
                color={primaryColor}
                emissive={primaryColor}
                emissiveIntensity={2.2}
                toneMapped={false}
              />
            </mesh>
          </group>

          {/* Right Outer Wingtip */}
          <group ref={rightWingOuterRef} position={[-1.25, 0, 0]}>
            <group scale={[-1, 1, 1]}>
              <mesh geometry={outerWingGeo} castShadow>
                <meshStandardMaterial
                  color="#1E1E26"
                  metalness={0.95}
                  roughness={0.12}
                  emissive={accentColor}
                  emissiveIntensity={0.65}
                />
              </mesh>
              <mesh position={[0.75, 0.02, 0.05]} rotation={[0, 0.25, 0]}>
                <boxGeometry args={[1.45, 0.025, 0.035]} />
                <meshStandardMaterial
                  color={accentColor}
                  emissive={accentColor}
                  emissiveIntensity={2.6}
                  toneMapped={false}
                />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

// Camera Rig for Smooth Mouse Parallax
function CameraRig({ pointerRef }: { pointerRef: React.MutableRefObject<PointerCoords> }) {
  const { camera } = useThree();

  useFrame(() => {
    const { x, y } = pointerRef.current;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, x * 0.35, 0.04);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, y * 0.25, 0.04);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

// Interactive 3D Starfield Particles
function ParticleField({ count = 160 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorBlue = new THREE.Color("#007BA7");
    const colorPink = new THREE.Color("#FF2D95");

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;

      const mixed = i % 2 === 0 ? colorBlue : colorPink;
      col[i * 3] = mixed.r;
      col[i * 3 + 1] = mixed.g;
      col[i * 3 + 2] = mixed.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.rotation.x += delta * 0.01;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function Hero3DScene() {
  const flockGroupRef = useRef<THREE.Group | null>(null);
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

  useEffect(() => {
    let scrollTriggerInstance: ScrollTrigger | null = null;

    const timeout = window.setTimeout(() => {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: "#hero-section",
        start: "top top",
        end: "bottom top",
        scrub: 1,
        onUpdate: (self) => {
          if (!flockGroupRef.current) return;
          flockGroupRef.current.position.y = self.progress * 1.4;
          flockGroupRef.current.position.z = -self.progress * 2.2;
        },
      });
    }, 120);

    return () => {
      window.clearTimeout(timeout);
      scrollTriggerInstance?.kill();
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 45 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      >
        {/* Dual Brand Lighting Setup */}
        <ambientLight intensity={0.85} />
        <pointLight position={[-5, 3.5, 3.5]} intensity={5.5} color="#007BA7" distance={16} />
        <pointLight position={[5, -2.5, 3.5]} intensity={4.8} color="#FF2D95" distance={16} />
        <directionalLight position={[0, 6, 3]} intensity={2.4} color="#ffffff" />
        <directionalLight position={[0, -5, -2]} intensity={0.9} color="#38BDF8" />

        <CameraRig pointerRef={pointerRef} />

        <group ref={flockGroupRef}>
          {/* Main Hero Cyber-Falcon flying back and forth across the scene */}
          <CyberBird
            pointerRef={pointerRef}
            config={{
              scale: 0.78,
              speed: 0.62,
              flapSpeed: 6.5,
              radiusX: 4.1,
              radiusY: 1.05,
              radiusZ: 1.35,
              offsetY: 0.55,
              offsetZ: 0.2,
              phase: 0,
              primaryColor: "#007BA7",
              accentColor: "#FF2D95",
              followMouse: 0.85,
            }}
          />

          {/* Companion Bird #2 (Upper Arc, Counter-phase flight) */}
          <CyberBird
            pointerRef={pointerRef}
            config={{
              scale: 0.42,
              speed: 0.52,
              flapSpeed: 7.8,
              radiusX: 4.8,
              radiusY: 0.9,
              radiusZ: 1.6,
              offsetY: 1.35,
              offsetZ: -1.8,
              phase: Math.PI * 0.85,
              primaryColor: "#38BDF8",
              accentColor: "#007BA7",
              followMouse: 0.4,
            }}
          />

          {/* Companion Bird #3 (Lower Depth Sweeping Arc) */}
          <CyberBird
            pointerRef={pointerRef}
            config={{
              scale: 0.36,
              speed: 0.46,
              flapSpeed: 8.4,
              radiusX: 4.5,
              radiusY: 0.85,
              radiusZ: 1.5,
              offsetY: -0.95,
              offsetZ: -2.4,
              phase: Math.PI * 1.45,
              primaryColor: "#FF2D95",
              accentColor: "#38BDF8",
              followMouse: 0.3,
            }}
          />
        </group>

        <ParticleField count={160} />
      </Canvas>
    </div>
  );
}
