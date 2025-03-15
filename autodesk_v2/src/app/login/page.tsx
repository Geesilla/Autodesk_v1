'use client'

import { signIn } from "next-auth/react";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      setError(result.error);
    } else {
      // Handle successful login, redirect or other actions
      window.location.href = "/"; // Redirect to the homepage or dashboard
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm">Email</label>
          <input
            id="email"
            type="email"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm">Password</label>
          <input
            id="password"
            type="password"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded-lg">
          Sign In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
