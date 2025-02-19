import { jwtDecode } from "jwt-decode"; // Use default import
import { cookies } from "next/headers";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { TUser } from "./redux/features/auth/authSlice";

const authRoutes = ["/login", "/verifyEmail", "/forgetPassword", "/setNewPass"];

export function middleware(request: NextRequest) {
  const cookiesStore = cookies();
  const accessToken = cookiesStore.get("token")?.value;

  if (accessToken) {
    //if (authRoutes.includes(request.nextUrl.pathname)) {
    //  return NextResponse.redirect(new URL("/", request.url));
    //}

    try {
      const user = jwtDecode<TUser>(accessToken);

      if (user.exp && user.exp * 1000 < Date.now()) {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        response.cookies.delete("refreshToken");
        return response;
      }

      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
      const isCsrRoute = request.nextUrl.pathname.startsWith("/csr");

      if (isAdminRoute && user.role !== "ADMIN") {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        response.cookies.delete("refreshToken");
        return response;
      }

      if (isCsrRoute && user.role !== "CSR") {
        const response = NextResponse.redirect(new URL("/login", request.url));
        response.cookies.delete("token");
        response.cookies.delete("refreshToken");
        return response;
      }

      return NextResponse.next();
    } catch (error) {
      console.error("JWT decoding failed:", error);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("token");
      response.cookies.delete("refreshToken");
      return response;
    }
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

// Config for which routes the middleware should apply
export const config = {
  //matcher: ["/:path*"],
  matcher: [
    "/csr/:path*",
    "/admin/:path*",
    //"/login",
    //"/verifyEmail",
    //"/forgetPassword",
    //"/setNewPass",
  ], // Define which routes to match
};
