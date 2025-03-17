import ModelCard from "@/components/ui/modelcard";

export default function ModelsPage() {
  return (
    <div className="flex flex-wrap gap-6 justify-center p-6">
      <ModelCard 
        fileName="Articulated_DRAGON_V3.stl"
        title="Articulated Dragon"
        description="A 3D printable articulated dragon model."
        modelId="dragon"
      />
      <ModelCard 
        fileName="Chubby_Iguana.stl"
        title="Chubby Iguana"
        description="A 3D printable iguana"
        modelId="iguana"
      />      
      <ModelCard 
        fileName="Shark.stl"
        title="Shark"
        description="A 3D printable Shark"
        modelId="shark"
      />
    </div>
  );
}
