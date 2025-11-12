import { NextResponse } from "next/server";
import { getSessionUser } from "./lib/session";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rotas públicas (sem autenticação)
  const publicPaths = [
    "/login",
    "/signup",
    "/api/auth",
    "/api/register",
    "/api/verify-email",
  ];
  const isPublic = publicPaths.some((path) => pathname.startsWith(path));
  const user = await getSessionUser();
  // Usuário não autenticado tentando acessar rota privada
  if (!user && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Usuário autenticado tentando acessar login/signup
  if (
    user &&
    (pathname.startsWith("/login") || pathname.startsWith("/signup"))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Permite seguir o fluxo normal
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos, exceto aqueles que começam com:
     * - api (rotas de API)
     * - _next/static (arquivos estáticos do Next.js)
     * - _next/image (otimização de imagem do Next.js)
     * - favicon.ico (ícone)
     * - images (sua pasta de imagens em /public)
     * - /login (a própria página de login, para evitar loop)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images|login).*)",
  ],
};
