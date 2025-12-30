import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import { NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@mail.com";

export async function POST(req) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json(
      { success: false, error: "Invalid login", code: 401 },
      { status: 401 }
    );
  }

  //  FORCE ADMIN BY EMAIL
  let role = user.role;

  if (user.email === ADMIN_EMAIL && user.role !== "ADMIN") {
    role = "ADMIN";

    await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" }
    });
  }

  const payload = {
    id: user.id,
    role
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken }
  });

  return NextResponse.json({
    success: true,
    data: { accessToken, refreshToken }
  });
}
