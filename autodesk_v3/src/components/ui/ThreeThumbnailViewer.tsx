'use client';

import { Canvas, useLoader } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

type ThumbnailViewerProps = {
  fileUrl: string;
};

function ThumbnailModel({ fileUrl }: { fileUrl: string }) {
  // Load the STL geometry from the fileUrl
  const geometry = useLoader(STLLoader, fileUrl);
  
  // Center the geometry and compute its bounding box
  geometry.center();
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox?.getSize(size);
  
  // Compute a uniform scale factor to fit the model nicely in the view
  const scaleFactor = 2 / Math.max(size.x, size.y, size.z);

  return (
    <mesh scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <primitive attach="geometry" object={geometry} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export default function ThreeThumbnailViewer({ fileUrl }: ThumbnailViewerProps) {
  return (
    <Canvas
      style={{ width: "100%", height: "100%" }}
      camera={{ position: [0, 0, 3], fov: 50 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} />
      {/* No OrbitControls here, so the model is static */}
      <ThumbnailModel fileUrl={fileUrl} />
    </Canvas>
  );
}
