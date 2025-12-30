import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* =======================
   GET BUKU BY ID
   (USER & ADMIN)
======================= */
export async function GET(req, context) {
  const { id } = await context.params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return NextResponse.json(
      { success: false, error: "Invalid book ID" },
      { status: 400 }
    );
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!book) {
    return NextResponse.json(
      { success: false, error: "Book not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: book
  });
}

/* =======================
   PUT BUKU (UPDATE SEMUA)
   (USER & ADMIN)
======================= */
export async function PUT(req, context) {
  const { id } = await context.params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return NextResponse.json(
      { success: false, error: "Invalid book ID" },
      { status: 400 }
    );
  }

  const { title, author, year } = await req.json();

  const book = await prisma.book.update({
    where: { id: bookId },
    data: {
      title,
      author,
      year: Number(year)
    }
  });

  return NextResponse.json({
    success: true,
    data: book
  });
}

/* =======================
   PATCH BUKU (PARTIAL)
   (USER & ADMIN)
======================= */
export async function PATCH(req, context) {
  const { id } = await context.params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return NextResponse.json(
      { success: false, error: "Invalid book ID" },
      { status: 400 }
    );
  }

  const body = await req.json();

  const book = await prisma.book.update({
    where: { id: bookId },
    data: body
  });

  return NextResponse.json({
    success: true,
    data: book
  });
}

/* =======================
   DELETE BUKU
   (ADMIN ONLY)
======================= */
export async function DELETE(req, context) {
  const { id } = await context.params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return NextResponse.json(
      { success: false, error: "Invalid book ID" },
      { status: 400 }
    );
  }

  const role = req.headers.get("x-user-role");

  if (role !== "ADMIN") {
    return NextResponse.json(
      { success: false, error: "Admin only", code: 403 },
      { status: 403 }
    );
  }

  const book = await prisma.book.findUnique({
    where: { id: bookId }
  });

  if (!book) {
    return NextResponse.json(
      { success: false, error: "Book not found" },
      { status: 404 }
    );
  }

  await prisma.book.delete({
    where: { id: bookId }
  });

  return NextResponse.json({
    success: true,
    message: "Book deleted successfully"
  });
}
