"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Toast de email verificado via query param
  useState(() => {
    const verified = searchParams.get("verified");
    if (verified === "1") toastSuccess("Email verificado com sucesso!");
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      if (res.error === "EMAIL_NOT_VERIFIED") {
        setErrorMessage("Você precisa verificar seu email antes de logar!");
      } else {
        setErrorMessage("Email ou senha inválidos");
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
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Login</h2>

        {errorMessage && (
          <div className="text-red-600 text-sm font-medium bg-red-100 p-2 rounded">
            {errorMessage}
          </div>
        )}

        <div className="space-y-2">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleResendEmail}
        >
          Reenviar email de verificação
        </Button>

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
