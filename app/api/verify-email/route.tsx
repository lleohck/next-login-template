import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json({ error: "token required" }, { status: 400 });
  }

  const record = await prisma.emailVerificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    return Response.json({ error: "invalid token" }, { status: 400 });
  }

  await prisma.user.update({
    where: { email: record.email },
    data: { emailVerifiedAt: new Date() },
  });

  await prisma.emailVerificationToken.delete({
    where: { token },
  });

  return Response.redirect(`${process.env.APP_URL}/login?verified=1`);
}
