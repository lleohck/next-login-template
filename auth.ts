import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // vazio agora (vamos colocar credentials depois)
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" as const },
};
export default authOptions;
