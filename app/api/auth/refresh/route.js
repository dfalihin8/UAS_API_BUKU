import { prisma } from "@/lib/prisma";
import { verifyToken, generateAccessToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { refreshToken } = await req.json();

  const { payload } = await verifyToken(refreshToken);

  const user = await prisma.user.findUnique({
    where: { id: payload.id }
  });

  if (user.refreshToken !== refreshToken) {
    return NextResponse.json(
      { success: false, error: "Invalid refresh token", code: 401 },
      { status: 401 }
    );
  }

  const newAccessToken = await generateAccessToken({
    id: user.id,
    role: user.role
  });

  return NextResponse.json({
    success: true,
    data: { accessToken: newAccessToken }
  });
}
