# Partimap

## Setup

1. Create a MySQL database like so:
	```sql
	CREATE DATABASE partimap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
	```
2. Copy `.env.example` to `.env` and edit it to point to your database.
3. Install dependencies with `npm i`.
4. Run database migration with `npx db-migrate up`.
5. Run dev server with `npm run dev`.
6. Run prod server with `npm run build && npm start`
