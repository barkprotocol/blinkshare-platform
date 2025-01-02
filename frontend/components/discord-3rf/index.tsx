"use client";

import { useRef, useState, useEffect, useContext, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { ThemeContext } from "@/lib/contexts/theme-provider";

// DiscordLogo component
function DiscordLogo() {
  const mesh = useRef<THREE.Group>(null); // Correct ref typing
  const { size, viewport } = useThree();
  const aspect = size.width / viewport.width;

  // Load the GLTF model (replace with your own model path)
  const { scene } = useGLTF("/models/scene.gltf");

  const [position, setPosition] = useState<[number, number, number]>([0, 0, 0]);

  const { isDark } = useContext(ThemeContext);

  // Drag event handler to move the logo
  const bind = useDrag(({ offset: [x, y] }) => {
    const z = position[2];
    setPosition([x / aspect, -y / aspect, z]);
  });

  // Rotation and floating effect on the model
  useFrame((state, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.5;
      mesh.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  // Material color based on theme
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: isDark ? 0xff00ff : 0xffffff, // Color changes based on dark/light mode
      metalness: 0.1,
      roughness: 0.5,
    });
  }, [isDark]);

  // Update material when scene or material changes
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });
  }, [scene, material]);

  return (
    <primitive
      ref={mesh} // Referencing the mesh group correctly
      object={scene}
      position={position}
      scale={[0.5, 0.5, 0.5]}
      {...bind()} // Drag functionality
    />
  );
}

// Main 3D scene component
export default function DiscordLogo3D() {
  return (
    <div className="absolute inset-0 pointer-events-auto opacity-60">
      <Canvas>
        {/* Ambient light */}
        <ambientLight intensity={0.5} />
        {/* Point light */}
        <pointLight position={[10, 10, 10]} />
        {/* Discord logo */}
        <DiscordLogo />
      </Canvas>
    </div>
  );
}

// Preload GLTF model to optimize loading
useGLTF.preload("/models/scene.gltf");
