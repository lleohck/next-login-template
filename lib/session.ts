import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function getSessionUser() {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}
