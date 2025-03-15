'use client'

"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function FilesPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Uploaded Files</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.length === 0 ? (
          <p className="text-gray-500 text-center w-full">No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <Card key={file.id} className="shadow-md hover:shadow-lg transition rounded-lg">
              <CardHeader>
                <h2 className="text-lg font-semibold text-gray-900">{file.name}</h2>
              </CardHeader>
              <CardContent>
                <a
                  href={file.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  View File
                </a>
                <Button className="mt-2 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition">
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
