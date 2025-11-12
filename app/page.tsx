"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

export default function Home() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Carregando...</p>;
  if (!session) return <p>Você não está logado</p>;

  async function handleSignOut() {
    await signOut();
  }

  return (
    <div>
      <h1>Bem-vindo, {session.user?.email}</h1>
      <Button
        type="button"
        variant="outline"
        className="w-3"
        onClick={handleSignOut}
      >
        Sair
      </Button>
    </div>
  );
}
