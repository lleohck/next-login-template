"use client";

import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useEffect } from "react";


export default function LoginPage() {
  const searchParams = useSearchParams();
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "1") {
      alert("Email verificado com sucesso! Faça login agora.");
    }
  }, [searchParams]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/",
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "grid", gap: "8px", maxWidth: 300 }}
    >
      <h2>Login</h2>
      <input
        type="email"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Entrar</button>
    </form>
  );
}
