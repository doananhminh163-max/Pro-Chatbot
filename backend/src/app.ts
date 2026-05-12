import express from "express";
import 'dotenv/config'
import activateWebRoutes from "routes/web.js";
import initDatabase from "config/seed.js";
import passport from "passport";
import session from "express-session";
import configPassport from "middleware/passport.local.js";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import { prisma } from "config/prisma.config.js";

const app = express();
const PORT = process.env.PORT;

// config view engine
app.set('view engine', 'ejs');
app.set('views', './src/views')

// config body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// config static files
app.use(express.static('public'));

//config session
app.use(session({
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    secret: "hello world",
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(
        prisma,
        {
            checkPeriod: 2 * 60 * 1000,
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }
    )
}));

// config passport
configPassport();
app.use(passport.initialize());
app.use(passport.session());

// config user session
app.use(async (req, res, next) => {
    res.locals.user = req.user;
    next();
});

// init database
initDatabase()

activateWebRoutes(app);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
