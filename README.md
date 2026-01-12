# Tech Stack
Next.js (App Router)
Prisma ORM
PostgreSQL (NeonDB / Local)
JWT (Access & Refresh Token)
bcrypt
Middleware (Auth, Rate Limit, Logging)

# api endpoint
(Auth)
POST /api/auth/register
{
  "name": "User",
  "email": "user@mail.com",
  "password": "password"
}

POST /api/auth/login
{
  "success": true,
  "data": {
    "accessToken": "JWT_ACCESS_TOKEN",
    "refreshToken": "JWT_REFRESH_TOKEN"
  }
}

POST /api/auth/refresh
{
  "refreshToken": "REFRESH_TOKEN_LAMA"
}


(books)
GET /api/books?page=1&limit=5  list buku (pagination)
GET /api/books/:id (memanggil salah satu buku dengan id)
GET /api/books   (semua buku)
HEADER = Authorization: Bearer ACCESS_TOKEN

POST /api/books  tambah buku (login)
Authorization: Bearer ACCESS_TOKEN
{
  "title": "kisah hidoep",
  "author": "Dalilul.F",
  "year": 2045
}

PUT /api/books/:id  (update semua field)
{
  "title": "kisah hidoep",
  "author": "Dalilul.F",
  "year": 2046
}
PATCH /api/books/:id  (update sebagian)
{
  "title": "Judul Baru"
}

DELETE /api/books/:id  (ADMIN ONLY)
respon jika bukan admin
{
  "success": false,
  "error": "Admin only"
}

# env
DATABASE_URL=postgresql://...
JWT_SECRET=rahasia_super

# install & run
npm install
npx prisma migrate dev
npm run dev

#Link VERCEL

uas-api-buku.vercel.app
