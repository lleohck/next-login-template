import { prisma } from "@/lib/prisma";
import { Resend } from "resend";
import { randomUUID } from "crypto";

export async function POST(request: Request) {
  const { email } = await request.json();

  if (!email) return Response.json({ error: "missing email" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return Response.json({ error: "user not found" }, { status: 400 });

  const token = randomUUID();

  await prisma.emailVerificationToken.create({
    data: {
      token,
      email,
    },
  });

  const resend = new Resend(process.env.RESEND_API_KEY);

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

  return Response.json({ ok: true });
}
