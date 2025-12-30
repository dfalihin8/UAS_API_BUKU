import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { name, email, password } = await req.json();
  const hashed = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashed }
  });

  return NextResponse.json({
    success: true,
    message: "Register berhasil"
  });
}
