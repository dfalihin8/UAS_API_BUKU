//(route buku versi + pagination)

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* =======================
   GET - LIHAT SEMUA BUKU
   (USER & ADMIN)
   + PAGINATION
======================= */
export async function GET(req) {
 const { searchParams } = new URL(req.url);

 const page = Number(searchParams.get("page")) || 1;
 const limit = Number(searchParams.get("limit")) || 5;

 const skip = (page - 1) * limit;

 const [books, total] = await Promise.all([
   prisma.book.findMany({
     skip,
     take: limit,
     orderBy: { createdAt: "desc" },
     include: {
       user: {
         select: {
           id: true,
           name: true,
           email: true
         }
       }
     }
   }),
   prisma.book.count()
 ]);

 return NextResponse.json({
   success: true,
   data: books,
   meta: {
     page,
     limit,
     total,
     totalPages: Math.ceil(total / limit)
   }
 });
}

/* =======================
   POST - TAMBAH BUKU
   (USER LOGIN)
======================= */
export async function POST(req) {
 const { title, author, year } = await req.json();

 const userIdHeader = req.headers.get("x-user-id");
 const userId = Number(userIdHeader);

 if (!userId) {
   return NextResponse.json(
     { success: false, error: "User ID not found", code: 401 },
     { status: 401 }
   );
 }

 const book = await prisma.book.create({
   data: {
     title,
     author,
     year: Number(year),
     userId
   }
 });

 return NextResponse.json({
   success: true,
   data: book
 });
}
