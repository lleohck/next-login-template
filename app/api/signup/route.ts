import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const { email, password } = await request.json();

  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing && existing.emailVerifiedAt) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 });
  }

  let user = existing;

  if (!user) {
    const hash = await bcrypt.hash(password, 10);

    user = await prisma.user.create({
      data: {
        email,
        passwordHash: hash,
      },
    });
  }

  const token = crypto.randomUUID();

  await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
    },
  });

  const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;

  await resend.emails.send({
    from: `${process.env.EMAIL_FROM}`,
    to: email,
    subject: "Verify your email",
    html: `Clique aqui para verificar: <a href="${verifyLink}">${verifyLink}</a>`,
  });

  return NextResponse.json({ ok: true });
}
