import { useEffect, useState } from "react";

export default function FilesPage() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => setFiles(data));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Uploaded Files</h1>
      <ul className="list-disc pl-5">
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          files.map((file) => (
            <li key={file.id} className="mb-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline"
              >
                {file.name}
              </a>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}