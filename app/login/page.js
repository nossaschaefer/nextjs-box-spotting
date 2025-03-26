"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      username,
    });
    if (res?.error) {
      setError("Invalid credentials");
    } else {
      router.push("/welcome");
    }
  };

  return (
    <div className="login-form  flex flex-col items-center justify-center">
      <h1 className="text-xl text-center mt-8">Login to Box Spotting</h1>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col m-12">
        <div className="flex flex-col">
          <label>Email</label>
          <input
            className="border-2 rounded mb-4"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col">
          <div className="flex flex-row justify-between items-center">
            <label>Password</label>
            <Link className="text-violet-600 text-xs" href="/signup">
              Forgot your password?
            </Link>
          </div>
          <input
            className="border-2 rounded mb-4"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          className="border-2 border-violet-600 mt-4 rounded"
          type="submit"
        >
          Login
        </button>
        <div className="flex flex-row text-xs mt-8 justify-center">
          <p className="mr-1">New to Box Spotting?</p>
          <Link className="text-violet-600" href="/signup">
            Create an account
          </Link>
        </div>
      </form>
    </div>
  );
}
