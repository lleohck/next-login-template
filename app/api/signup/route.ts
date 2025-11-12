import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { signup } from "@/app/actions/signup";

export async function POST(request: Request) {
  const { name, email, password } = await request.json();

  await signup({ name, email, password });

  const token = crypto.randomUUID();

  await prisma.emailVerificationToken.create({
    data: {
      email,
      token,
    },
  });

  try {
    const verifyLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify-email?token=${token}`;
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: `${process.env.EMAIL_FROM}`,
      to: email,
      subject: "Verify your email",
      html: `Clique aqui para verificar: <a href="${verifyLink}">${verifyLink}</a>`,
    });
  } catch (e) {
    console.log("Error on send e-mail verification", e);
  }

  return NextResponse.json({ ok: true });
}
