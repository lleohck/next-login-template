import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import crypto from "crypto";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email obrigatório" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    if (user.emailVerifiedAt) {
      return NextResponse.json(
        { error: "Email já verificado" },
        { status: 400 }
      );
    }

    // gera novo token
    const token = crypto.randomUUID();

    // remove tokens antigos
    await prisma.emailVerificationToken.deleteMany({ where: { email } });

    await prisma.emailVerificationToken.create({
      data: { email, token },
    });

    const verifyUrl = `${process.env.APP_URL}/api/verify-email?token=${token}`;

    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: email,
      subject: "Verifique seu e-mail",
      html: `
      <p>Clique para verificar seu e-mail:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro ao reenviar email" },
      { status: 500 }
    );
  }
}
