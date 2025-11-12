import { SignupFormSchema } from "@/app/lib/definitions";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function signup(data) {
  // Validate form fields
  const validatedFields = SignupFormSchema.safeParse({
    name: data.name,
    email: data.email,
    password: data.password,
  });

  // If any form fields are invalid, return early
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email, password } = validatedFields.data;

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
        name,
        email,
        passwordHash: hash,
      },
    });
  }

  return NextResponse.json({
    ok: true,
    message: "user created!",
  });
}
