or you can set it up as a service and run it in cluster mode with the following steps:

1. Install PM2 process manager with `npm i -g pm2`.
2. Set it up as a service (to start on boot) with `pm2 startup`.
3. Copy `ecodystem.config.js.example` to `ecosystem.config.js` and edit the app name and other options as you wish.
4. Start the production server with `pm2 start ecosystem.config.js`
