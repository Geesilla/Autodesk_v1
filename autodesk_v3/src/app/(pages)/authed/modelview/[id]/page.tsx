import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThreeModelViewer from "@/components/ui/ThreeModelViewer";

export default function ModelViewPage({ params }: { params: { id: string } }) {
  console.log("Model ID from URL:", params.id); // Debugging

  const modelFileMap: Record<string, string> = {
    dragon: "Articulated_DRAGON_V3.stl",
    iguana: "Chubby_Iguana.stl",
    shark: "Shark.stl",
  };

  const fileName = modelFileMap[params.id] || "Articulated_DRAGON_V3.stl"; // Default file

  return (
    <div className="flex justify-center items-center h-screen w-full absolute">
      <ThreeModelViewer fileName={fileName} /> {/* ✅ Loads correct STL */}
    </div>
  );
}

