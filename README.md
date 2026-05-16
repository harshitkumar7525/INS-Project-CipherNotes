# CipherNotes

End-to-end encrypted notes app. Notes are encrypted with **DES** before being stored in MongoDB and decrypted only when served to the authenticated owner.

## Stack
- **Next.js 14** (App Router, Route Handlers)
- **MongoDB + Mongoose**
- **JWT** auth via httpOnly cookies
- **bcrypt** password hashing
- **crypto-js** for DES encryption
- **Tailwind CSS** dark cybersecurity theme
- **Zod** request validation

## Folder structure
```
src/
  app/                    # Next.js routes (pages + API)
    api/auth/             # signup, login, logout, me
    api/notes/            # CRUD + search
    dashboard/            # protected UI
    login/  signup/
  components/             # Sidebar, NoteEditor
  context/                # (reserved)
  lib/        mongodb.ts  # cached Mongoose connection
  middleware/ auth.ts     # JWT cookie verification
  middleware.ts           # edge route guard for /dashboard
  models/                 # User, Note schemas
  utils/                  # encryption.ts (DES), jwt.ts
```

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create `.env.local`** (copy from `.env.example`)
   ```
   MONGODB_URI=mongodb://localhost:27017/ciphernotes
   JWT_SECRET=replace-with-a-long-random-string
   DES_SECRET_KEY=8charkey
   NEXT_PUBLIC_APP_NAME=CipherNotes
   ```
   > `DES_SECRET_KEY` is truncated/padded to 8 bytes (DES key size).

3. **Run dev server**
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

4. **Production build**
   ```bash
   npm run build && npm start
   ```

## Security notes
- Passwords hashed with bcrypt (cost 12).
- JWT stored in httpOnly, sameSite=lax cookie.
- All `/api/notes/*` routes require a valid token and scope queries to `user: auth.userId`.
- MongoDB ObjectIds validated before queries.
- Note ciphertext is the only thing stored; plaintext never persists.
- DES is included because the spec requires it. For real production secrecy prefer AES-256-GCM.

## API
| Method | Path | Body | Auth |
|---|---|---|---|
| POST | `/api/auth/signup` | `{email, password}` | — |
| POST | `/api/auth/login`  | `{email, password}` | — |
| POST | `/api/auth/logout` | — | — |
| GET  | `/api/auth/me`     | — | ✓ |
| GET  | `/api/notes?q=`    | — | ✓ |
| POST | `/api/notes`       | `{title, content}` | ✓ |
| GET  | `/api/notes/:id`   | — | ✓ |
| PUT  | `/api/notes/:id`   | `{title?, content?}` | ✓ |
| DELETE | `/api/notes/:id` | — | ✓ |
