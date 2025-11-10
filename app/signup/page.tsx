"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);

  // validação: senha e confirmação devem coincidir
  useEffect(() => {
    setCanSubmit(
      password.length >= 8 &&
        password === confirmPassword &&
        email.includes("@")
    );
  }, [email, password, confirmPassword]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      setLoading(false);

      if (data.ok) {
        toastSuccess("Conta criada! Verifique seu email.");
        router.push("/login");
      } else {
        toastError(data.error || "Erro desconhecido");
      }
    } catch (err) {
      setLoading(false);
      toastError("Erro ao criar conta");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Criar Conta</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          required
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className={`w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 ${
            confirmPassword && confirmPassword !== password
              ? "focus:ring-red-500 border-red-500"
              : "focus:ring-green-500 border-gray-300"
          }`}
          required
        />
        {confirmPassword && confirmPassword !== password && (
          <p className="text-red-500 text-sm">As senhas não coincidem</p>
        )}

        <button
          type="submit"
          disabled={loading || !canSubmit}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Criando..." : "Criar conta"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Já tem conta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Entrar
          </a>
        </p>
      </form>
    </div>
  );
}
