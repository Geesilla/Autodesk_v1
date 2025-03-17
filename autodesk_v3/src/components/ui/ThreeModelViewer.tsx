"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three-stdlib";

type ModelViewerProps = {
  fileName: string; // Example: "Articulated_DRAGON_V3.stl"
};

function Model({ fileName }: { fileName: string }) {
  const geometry = useLoader(STLLoader, `/Assets/${fileName}`);

  // Adjust position if necessary (here centered)
  return (
    <mesh scale={0.01} position={[0, 0, 0]}>
      <primitive attach="geometry" object={geometry} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export default function ThreeModelViewer({ fileName }: ModelViewerProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 10], fov: 50 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      <OrbitControls />
      <Model fileName={fileName} />
    </Canvas>
  );
}
