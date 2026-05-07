import { auth } from "@/lib/auth";

export default auth((req) => {
  const isAdminPath = req.nextUrl.pathname.startsWith("/api/admin") || req.nextUrl.pathname.startsWith("/admin");
  
  if (isAdminPath && !req.auth) {
    return Response.json(
      { message: "Not authenticated" },
      { status: 401 }
    );
  }
});

export const config = {
  matcher: ["/api/admin/:path*", "/admin/:path*"],
};
