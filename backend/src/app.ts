import express from "express";
import 'dotenv/config'
import passport from "passport";
import session from "express-session";
import { randomBytes } from "node:crypto";
import configPassport from "middleware/passport.local.js";
import activateApiRoutes from "routes/api.js";
import activateWebRoutes from "routes/web.js";

const app = express();
const PORT = process.env.PORT ?? 8080;
const SESSION_SECRET = process.env.SESSION_SECRET ?? randomBytes(32).toString("hex");

app.use((req, res, next) => {
    const allowedOrigins = new Set([
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]);
    const origin = req.headers.origin;
    if (origin && allowedOrigins.has(origin)) {
        res.header("Access-Control-Allow-Origin", origin);
        res.header("Vary", "Origin");
    }
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
    if (req.method === "OPTIONS") {
        res.sendStatus(204);
        return;
    }
    next();
});

// config view engine
app.set('view engine', 'ejs');
app.set('views', './src/views')

// config body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static files
app.use(express.static('public'));

// config login session support for Passport
app.use(session({
    name: "report_analizing.sid",
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
}));

// config passport authentication
configPassport();
app.use(passport.initialize());
app.use(passport.session());

// config user session
app.use(async (req, res, next) => {
    res.locals.user = req.user;
    next();
});

activateApiRoutes(app);
activateWebRoutes(app);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
