# DriveBid — Car Auction (Next.js + MongoDB)

Full-stack car auction web app: public auctions, live bidding, user dashboard, admin panel.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS (white / grey canvas, indigo accent)
- MongoDB + Mongoose
- NextAuth v5 (Credentials + JWT sessions) + bcrypt

## Setup

1. Copy env:
   ```
   cp .env.example .env.local
   ```
   Fill in `MONGODB_URI`, `NEXTAUTH_SECRET`, `AUTH_SECRET`, `CRON_SECRET`.

2. Install:
   ```
   npm install
   ```

3. Seed demo data (creates admin + 6 active auctions):
   ```
   npm run seed
   ```
   - Admin: `admin@drivebid.test` / `admin123`
   - User: `user@drivebid.test` / `user123`

4. Dev server:
   ```
   npm run dev
   ```
   Open http://localhost:3000.

## Promoting a user to admin manually

```js
// in mongosh
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

## Routes

- `/` — landing + featured active auctions
- `/auctions` — list + search/filter
- `/auctions/:id` — detail + live bidding (polls every 3s)
- `/login`, `/register`
- `/dashboard`, `/dashboard/bids` — user bid history
- `/admin`, `/admin/auctions`, `/admin/users`, `/admin/bids` — admin only

## API

| Method | Path | Auth |
|---|---|---|
| POST | `/api/register` | public |
| GET/POST | `/api/auctions` | GET public · POST admin |
| GET/PUT/DELETE | `/api/auctions/:id` | GET public · rest admin |
| GET/POST | `/api/auctions/:id/bids` | GET public · POST user |
| GET | `/api/bids/me` | user |
| GET | `/api/users` | admin |
| PATCH/DELETE | `/api/users/:id` | admin |
| GET | `/api/cron/close-auctions` | cron secret |

## Theme

White (`#fff`) + grey (`#f7f8fa` / `#e5e7eb`) canvas. Single dark accent `#4f46e5` (indigo) for CTAs and live highlights. Admin top-bar uses dark ink (`#111827`) for contrast against the white panels.

## Bid safety

Bids are placed with a single atomic `findOneAndUpdate` guarded on `status`, `endTime`, and `currentPrice` — races cannot undercut the leader. Expired auctions are auto-closed on read and by a cron sweep...
