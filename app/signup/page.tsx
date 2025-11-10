"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toastError, toastSuccess } from "@/lib/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);

    setCanSubmit(
      password.length >= 8 &&
        password === confirmPassword &&
        email.includes("@")
    );
  }, [email, password, confirmPassword]);

  const suggestedPassword = "Abcd1234!";

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

  function renderPasswordStrength() {
    const colors = [
      "bg-red-500",
      "bg-orange-500",
      "bg-yellow-400",
      "bg-green-500",
    ];
    return (
      <div className="h-2 w-full bg-gray-200 rounded mt-1">
        <div
          className={`h-2 rounded ${
            colors[passwordStrength - 1] || "bg-gray-200"
          }`}
          style={{ width: `${(passwordStrength / 4) * 100}%` }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-8 rounded-lg shadow-md space-y-6 flex flex-col items-center"
      >
        {/* Logo */}
        <div className="mb-4">
          <Image
            src="/images/logo.jpg"
            alt="Abstergo Logo"
            width={120}
            height={120}
            className="object-contain"
          />
        </div>

        <h2 className="text-2xl font-bold text-center">Criar Conta</h2>

        <div className="space-y-2 w-full">
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>

        <div className="space-y-2 w-full">
          <Label>Senha</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            required
          />
          {renderPasswordStrength()}
          <p className="text-sm text-gray-500">
            Sugestão: <span className="font-mono">{suggestedPassword}</span>
          </p>
        </div>

        <div className="space-y-2 w-full">
          <Label>Confirmar senha</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a senha"
            required
          />
          {confirmPassword && confirmPassword !== password && (
            <p className="text-red-500 text-sm">As senhas não coincidem</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!canSubmit || loading}
        >
          {loading ? "Criando..." : "Criar conta"}
        </Button>

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
