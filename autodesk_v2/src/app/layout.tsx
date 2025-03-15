import Link from "next/link";
import { getServerSession } from "next-auth";
import authOptions from "@/app/api/auth/[...nextauth]/route.js";
import { signOut } from "next-auth/react";
import { ReactNode } from "react";

export default async function Layout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <head>
        {/* Add any meta tags or title here */}
      </head>
      <body>
        <div>
          <nav className="p-4 bg-gray-900 text-white flex justify-center gap-6">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <Link href="/users" className="hover:text-gray-300">Users</Link>
            <Link href="/files" className="hover:text-gray-300">Files</Link>
            <Link href="/upload" className="hover:text-gray-300">Upload</Link>
            {session ? (
              <button onClick={() => signOut()} className="hover:text-red-400">Logout</button>
            ) : (
              <Link href="/login" className="hover:text-gray-300">Login</Link>
            )}
          </nav>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
