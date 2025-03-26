'use client'
import ModelCard from "@/components/ui/modelcard";
import { fetchFileFromCDN, getModelsForUser } from "@/features/files/actions";
import { useState, useEffect } from "react";

export default function Model() {
    const [models, setModels] = useState<any[]>([]);
    const [fileData, setFileData] = useState<string | null>(null);

    useEffect(() => {
        const fetchModels = async () => {
            try {
                const userModels = await getModelsForUser();
                console.log("Fetched models:", userModels); // Log the fetched models
                setModels(userModels);
            } catch (error) {
                console.error("Failed to fetch models:", error);
            }
        };

        fetchModels();
    }, []);

    const handleFetchFile = async (fileUrl: string) => {
        try {
            const result = await fetchFileFromCDN(fileUrl);

            if (result?.content) {
                setFileData(result.content); // This is base64-encoded
            }
        } catch (error) {
            console.error("Failed to fetch file:", error);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap gap-6 justify-center p-6">
                {models.map((model) => (
                    <ModelCard
                        key={model.id}
                        fileName={model.fileName}
                        fileUrl={model.fileUrl} // Pass the missing fileUrl property
                        title={model.metadata.title}
                        description={model.metadata.description}
                        modelId={model.id}
                        onFetchFile={() => handleFetchFile(model.fileUrl)}
                    />
                ))}
            </div>

            {fileData && (
                <div>
                    <p>Fetched file (base64-encoded):</p>
                    <textarea
                        value={fileData}
                        readOnly
                        className="w-full h-32 border p-2"
                    />
                </div>
            )}
        </div>
    );
}
