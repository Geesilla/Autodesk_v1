"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Card, CardHeader, CardContent, CardFooter} from "@/components/ui/card";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import * as THREE from "three";

type ModelCardProps = {
  fileName: string;
  title: string;
  description: string;
  modelId: string; // Unique model ID for navigation
};

function ModelPreview({ fileName }: { fileName: string }) {
  const geometry = useLoader(STLLoader, `/Assets/${fileName}`);

  geometry.center();
  geometry.computeBoundingBox();
  const size = new THREE.Vector3();
  geometry.boundingBox?.getSize(size);
  const scaleFactor = 2 / Math.max(size.x, size.y, size.z);

  return (
    <mesh scale={[scaleFactor, scaleFactor, scaleFactor]}>
      <primitive attach="geometry" object={geometry} />
      <meshStandardMaterial color="gray" />
    </mesh>
  );
}

export default function ModelCard({ fileName, title, description, modelId }: ModelCardProps) {
    const router = useRouter();
  
    return (
      <Card className="w-full max-w-md shadow-lg cursor-pointer transition-transform transform hover:scale-105">
        <CardHeader>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </CardHeader>
        <CardContent>
          <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[5, 5, 5]} />
              <OrbitControls enableZoom={false} enablePan={false} />
              <ModelPreview fileName={fileName} />
            </Canvas>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button>Model Info</Button>
          <Button onClick={() => router.push(`modelview/${modelId}`)}>Edit</Button>
        </CardFooter>
      </Card>
    );
  }
  
export {ModelCard}