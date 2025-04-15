"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ModelViewLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="w-full h-16 bg-gray-100 text-white flex items-center justify-end px-6 shadow-md gap-x-4">
        <Button onClick={() => router.push("/authed/models")}>← Back to Models</Button>
        <Button onClick={() => router.push("/authed/projects")}>← Back to Projects</Button>
      </header>
      <main className="flex-grow shadow-md">{children}</main>
    </div>
  );
}
