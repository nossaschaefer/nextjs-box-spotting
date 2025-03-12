"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !username) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <div>
      <h1 className="text-xl text-center mt-8">Sign up to Box Spotting</h1>
      <form className="flex flex-col m-12" onSubmit={handleSubmit}>
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
          <label>Username</label>
          <input
            className="border-2 rounded mb-4"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col mb-4">
          <label>Password</label>
          <input
            className="border-2 rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p>{error}</p>}
        <button
          className="border-2 border-violet-600 mt-4 rounded"
          type="submit"
        >
          Sign up
        </button>
      </form>
    </div>
  );
}
