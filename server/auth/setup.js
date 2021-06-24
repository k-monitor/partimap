const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const MySQLStore = require('express-mysql-session')(expressSession);
const passport = require('passport');
const { Strategy } = require('passport-local');
const { StatusCodes } = require('http-status-codes');
const db = require('../user/user.db');
const conf = require('../conf');

const SESSION_AGE = 24 * 60 * 60 * 1000; // 1 day

const sessionStore = new MySQLStore({
	host: conf.DB_HOST,
	port: conf.DB_PORT,
	user: conf.DB_USER,
	password: conf.DB_PASS,
	database: conf.DB_NAME,
	expiration: SESSION_AGE
});

const sessionOpts = {
	cookie: {
		maxAge: SESSION_AGE,
	},
	name: 'partimap.sid',
	resave: false,
	saveUninitialized: false,
	secret: conf.SESSION_SECRET,
	store: sessionStore
};

passport.use(new Strategy({ usernameField: 'email' }, (email, password, callback) => {
	db.findByEmail(email).then(user => {
		if (!user || !bcrypt.compareSync(password, user.password)) {
			return callback(null, false);
		}
		callback(null, user);
	}).catch(callback);
}));

passport.serializeUser((user, callback) => {
	callback(null, user.id);
});

passport.deserializeUser((id, callback) => {
	db.findById(id).then(user => callback(null, user)).catch(callback);
});

function setup(app) {
	app.use(cookieParser());
	app.use(expressSession(sessionOpts));
	app.use(passport.initialize());
	app.use(passport.session());

	app.post('/auth/login', (req, res, next) => {
		passport.authenticate('local', function (err, user) {
			req.logIn(user, function () {
				if (err) {
					next(err);
				} else {
					res.sendStatus(user ? StatusCodes.OK : StatusCodes.UNAUTHORIZED);
				}
			});
		})(req, res, next);
	});


	app.post('/auth/logout', (req, res) => {
		req.logout();
		res.end();
	});
	app.get('/auth/user', (req, res) => {
		res.json({ user: req.user });
	});
}

module.exports = {
	setup
};
