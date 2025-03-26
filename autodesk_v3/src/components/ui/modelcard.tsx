'use client';

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ThreeThumbnailViewer from "./ThreeThumbnailViewer"; // Import the new viewer

type ModelCardProps = {
  fileName: string;
  fileUrl: string;
  title: string;
  description: string;
  modelId: string;
  onFetchFile: (fileName: string) => Promise<void>;
};


export default function ModelCard({
  fileName,
  fileUrl,
  title,
  description,
  modelId,
  onFetchFile,
}: ModelCardProps) {
  
  const router = useRouter();
  

  return (
    <Card className="w-full max-w-md shadow-lg cursor-pointer transition-transform transform hover:scale-105">
      <CardHeader>
        <h3 className="text-lg font-semibold">{fileName}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          {/* Render the non-interactive thumbnail viewer */}
          <ThreeThumbnailViewer fileUrl={fileUrl} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button> Model Details</Button>
        <Button>Comments</Button>

        <Button onClick={() => router.push(`/authed/modelview/${modelId}`)}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ModelCard };
