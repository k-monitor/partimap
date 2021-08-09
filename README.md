# Partimap

This is a Nuxt project with Express backend and MySQL database.


## Setup

1. Install MySQL and Node v12+.
2. Create a MySQL database like so:
	```sql
	CREATE DATABASE partimap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
	```
3. Add an admin user (password = "123"):
	```sql
	INSERT INTO user (email, password, name, registered, instId, isAdmin)
	VALUES ("admin@partimap.hu", "$2a$12$TwohCgZc1t7.pwX84CXZ..R9a3vIM5qWb5RaqcJZokUCNEjmLxXBq", "Admin", 0, 0, 1);
	```
4. Copy `.env.example` to `.env` and edit it to point to your database.
5. Install dependencies with `npm i`.
6. Run database migration with `npx db-migrate up`.
7. Run dev server with `npm run dev`.
8. Login (`/login`), then change admin password. :)

To run prod server, use `npm run build && npm start`.


## Adding a database migration

1. Run `npx db-migrate create <name-of-migration>`.
2. This will create `migrations/sqls/<timestamp>-<name-of-migration>-<up|down>.sql` files.
3. Edit them so `*-up.sql` contains the SQL command of your migration, while `*-down.sql` contains the command to undo it.

