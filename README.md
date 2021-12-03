# Partimap


## Setup

1. Install MySQL and Node v12+.
2. Create a MySQL database like so:
	```sql
	CREATE DATABASE partimap CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
	```
3. Copy `.env.example` to `.env` and edit the app's configuration.
4. Install dependencies with `npm i`.
5. Run database migrations with `npx db-migrate up`.
6. Add an admin user (password = "123"):
	```sql
	INSERT INTO user (email, password, name, registered, isAdmin)
	VALUES ("admin@partimap.eu", "$2a$12$TwohCgZc1t7.pwX84CXZ..R9a3vIM5qWb5RaqcJZokUCNEjmLxXBq", "Admin", 0, 1);
	```
7. Run dev server with `npm run dev`.
8. Login (`/login`), then change admin password. :)


## Setup production

1. Do all of the above.
2. Build the application with `npm run build`.

You can start the production server with `npm start`, or you can set it up as a service and run it in cluster mode with the following steps:

1. Install PM2 process manager with `npm i -g pm2`.
2. Set it up as a service (to start on boot) with `pm2 startup`.
3. Copy `ecodystem.config.js.example` to `ecosystem.config.js` and edit the app name and other options as you wish.
4. Start the production server with `pm2 start ecosystem.config.js`


## Adding a database change (migration)

1. Run `npx db-migrate create <name-of-migration>`.
2. This will create `migrations/sqls/<timestamp>-<name-of-migration>-<up|down>.sql` files.
3. Edit them so `*-up.sql` contains the SQL command of your migration, while `*-down.sql` contains the command to undo it. SQL files cannot contain more than one command.


## License

GPLv3, please see the `LICENSE` file for details.

*Copyright (C) 2021 DeepData Ltd.*
