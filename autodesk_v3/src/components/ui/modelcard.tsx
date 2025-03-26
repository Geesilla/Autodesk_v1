"use client";

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ThreeModelViewer from "./ThreeModelViewer"; // Import the ThreeModelViewer component

type ModelCardProps = {
  fileName: string;
  fileUrl: string; // Add fileUrl to pass to ThreeModelViewer
  title: string;
  description: string;
  modelId: string; // Unique model ID for navigation
  onFetchFile: () => Promise<void>;
};

export default function ModelCard({ fileName, fileUrl, title, description, modelId, onFetchFile }: ModelCardProps) {
  const router = useRouter();

  return (
    <Card className="w-full max-w-md shadow-lg cursor-pointer transition-transform transform hover:scale-105">
      <CardHeader>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          {/* Render the interactive 3D model preview */}
          <ThreeModelViewer fileName={fileName} fileUrl={fileUrl} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onFetchFile}>Fetch File</Button>
        <Button onClick={() => router.push(`modelview/${modelId}`)}>Edit</Button>
      </CardFooter>
    </Card>
  );
}

export { ModelCard };