import ThreeModelViewer from "@/components/ui/ThreeModelViewer";

export default function ModelViewPage() {
  return (
    <div className="flex justify-center items-center h-screen w-full absolute">
      <div className="w-full h-full flex justify-center items-center">
      <ThreeModelViewer fileName="Articulated_DRAGON_V3.stl" />
      </div>
    </div>
  );
}

