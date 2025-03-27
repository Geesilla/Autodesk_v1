'use client';

import { useRouter } from "next/navigation";
import { Button } from "./button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import ThreeThumbnailViewer from "./ThreeThumbnailViewer"; // Import the thumbnail viewer

type ModelCardProps = {
  fileName: string;
  fileUrl: string;
  title: string;
  description: string;
  modelId: string;
  onFetchFile: (fileUrl: string) => Promise<void>;
  selectionMode?: boolean;                   // When true, shows a checkbox and makes the card clickable
  isSelected?: boolean;                      // Whether this card is selected
  onSelectChange?: (checked: boolean) => void; // Handler for selection changes
};

export default function ModelCard({
  fileName,
  fileUrl,
  title,
  description,
  modelId,
  onFetchFile,
  selectionMode = false,
  isSelected = false,
  onSelectChange,
}: ModelCardProps) {
  const router = useRouter();

  const handleCardClick = () => {
    if (selectionMode && onSelectChange) {
      onSelectChange(!isSelected);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      className={`relative w-full max-w-md shadow-lg cursor-pointer transition-transform transform hover:scale-105 ${
        selectionMode && isSelected ? "border-2 border-blue-500" : ""
      }`}
    >
      <CardHeader className="relative">
        <h3 className="text-lg font-semibold">{fileName}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
          <ThreeThumbnailViewer fileUrl={fileUrl} />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          onClick={(e) => {
            e.stopPropagation(); // Prevent card click when button is pressed
            router.push(`/authed/modelview/${modelId}`);
          }}
        >
          Model Details
        </Button>
        <Button onClick={(e) => e.stopPropagation()}>Comments</Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/authed/modelview/${modelId}`);
          }}
        >
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}

export { ModelCard };