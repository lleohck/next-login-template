"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Toast de email verificado via query param
  useState(() => {
    const verified = searchParams.get("verified");
    if (verified === "1") toastSuccess("Email verificado com sucesso!");
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "EMAIL_NOT_VERIFIED") {
        toastError("Você precisa verificar seu email antes de logar!");
      } else {
        toastError("Email ou senha inválidos");
      }
    } else {
      toastSuccess("Login efetuado!");
      router.push("/");
    }
  }

  async function handleResendEmail() {
    if (!email) return toastError("Informe seu email primeiro");

    const res = await fetch("/api/resend-verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (data.ok) toastSuccess("Email de verificação reenviado!");
    else toastError(data.error || "Erro ao reenviar email");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <button
          type="button"
          onClick={handleResendEmail}
          className="w-full text-center text-sm text-blue-600 hover:underline"
        >
          Reenviar email de verificação
        </button>

        <p className="text-center text-sm text-gray-500">
          Não tem conta?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Registrar
          </a>
        </p>
      </form>
    </div>
  );
}
