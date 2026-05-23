import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function proxy(request) {
  const { token } = await auth.api.getToken({
    headers: await headers(),
  });

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/roomdettails/:path*", "/listedroomdettails/:path*", "/add-room", "/my-bookings", "/my-listroom"],
};