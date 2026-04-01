import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, Text, Stars, RoundedBox, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ─── Floating Resume Document ─── */
const ResumeDocument = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const { pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      pointer.x * 0.15,
      2 * delta
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -pointer.y * 0.1,
      2 * delta
    );
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <group ref={groupRef}>
        {/* Main document */}
        <RoundedBox args={[2.4, 3.2, 0.05]} radius={0.06} smoothness={4}>
          <meshStandardMaterial
            color="#1a1a2e"
            metalness={0.3}
            roughness={0.4}
          />
        </RoundedBox>

        {/* Header bar */}
        <mesh position={[0, 1.2, 0.03]}>
          <planeGeometry args={[2, 0.35]} />
          <meshStandardMaterial color="#d4a843" metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Text lines */}
        {[-0.1, -0.35, -0.6, -0.85, -1.1].map((y, i) => (
          <mesh key={i} position={[-0.15, y, 0.03]}>
            <planeGeometry args={[1.5 - i * 0.15, 0.08]} />
            <meshStandardMaterial
              color={i === 0 ? "#555577" : "#333355"}
              metalness={0.1}
              roughness={0.8}
            />
          </mesh>
        ))}

        {/* Profile circle */}
        <mesh position={[-0.7, 0.65, 0.03]}>
          <circleGeometry args={[0.22, 32]} />
          <meshStandardMaterial color="#d4a843" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Glow border effect */}
        <RoundedBox args={[2.5, 3.3, 0.01]} radius={0.08} smoothness={4} position={[0, 0, -0.02]}>
          <meshStandardMaterial
            color="#d4a843"
            emissive="#d4a843"
            emissiveIntensity={0.15}
            transparent
            opacity={0.3}
          />
        </RoundedBox>
      </group>
    </Float>
  );
};

/* ─── Orbiting Skill Chips ─── */
const SkillChips = () => {
  const groupRef = useRef<THREE.Group>(null!);
  const skills = useMemo(
    () => ["React", "Python", "AWS", "SQL", "Node.js", "TypeScript"],
    []
  );

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {skills.map((skill, i) => {
        const angle = (i / skills.length) * Math.PI * 2;
        const radius = 2.8;
        const y = Math.sin(i * 1.2) * 0.5;
        return (
          <Float key={skill} speed={2 + i * 0.3} floatIntensity={0.3}>
            <Text
              position={[
                Math.cos(angle) * radius,
                y,
                Math.sin(angle) * radius,
              ]}
              fontSize={0.18}
              color="#d4a843"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Medium.woff"
            >
              {skill}
              <meshStandardMaterial
                color="#d4a843"
                emissive="#d4a843"
                emissiveIntensity={0.4}
              />
            </Text>
          </Float>
        );
      })}
    </group>
  );
};

/* ─── ATS Score Ring ─── */
const ATSRing = () => {
  const ringRef = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.3;
      ringRef.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <Float speed={1} floatIntensity={0.4}>
      <mesh ref={ringRef} position={[2, 1.2, -1]}>
        <torusGeometry args={[0.5, 0.06, 16, 64]} />
        <meshStandardMaterial
          color="#d4a843"
          emissive="#d4a843"
          emissiveIntensity={0.6}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <Text
        position={[2, 1.2, -0.9]}
        fontSize={0.2}
        color="#d4a843"
        anchorX="center"
        anchorY="middle"
      >
        95
      </Text>
    </Float>
  );
};

/* ─── Ambient Glow Sphere ─── */
const GlowSphere = () => {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.scale.setScalar(1 + Math.sin(clock.elapsedTime) * 0.05);
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, -3]}>
      <sphereGeometry args={[3, 32, 32]} />
      <MeshDistortMaterial
        color="#0a0a1a"
        emissive="#d4a843"
        emissiveIntensity={0.03}
        distort={0.2}
        speed={1.5}
        transparent
        opacity={0.4}
      />
    </mesh>
  );
};

/* ─── Main Scene ─── */
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#d4a843" />
      <pointLight position={[-5, -3, 3]} intensity={0.3} color="#4a9eff" />
      <pointLight position={[0, 3, 2]} intensity={0.4} color="#ffffff" />

      <ResumeDocument />
      <SkillChips />
      <ATSRing />
      <GlowSphere />

      <Stars
        radius={50}
        depth={50}
        count={1500}
        factor={3}
        saturation={0.2}
        fade
        speed={0.5}
      />
    </>
  );
};

/* ─── Exported Canvas ─── */
const HeroScene = () => {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
          </div>
        }
      >
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Scene />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default HeroScene;
