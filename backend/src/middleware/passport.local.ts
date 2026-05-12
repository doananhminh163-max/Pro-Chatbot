import { Strategy } from "passport-local";
import passport from "passport";
import { prisma } from "config/prisma.config.js";
import bcrypt from 'bcrypt';
import * as adminUser from "services/admin/user.service.js";

const configPassport = () => {
    passport.use(new Strategy({
        usernameField: 'identifier',
        passwordField: 'password'
    }, async function verify(identifier, password, callback) {
        const user: Express.User = await prisma.user.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            },
        });

        if (!user) {
            return callback(null, false, { message: `${identifier} not found` });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return callback(null, false, { message: 'Invalid password' });
        }

        return callback(null, user);
    }));

    passport.serializeUser(function (user: Express.User, callback) {
        process.nextTick(function () {
            callback(null, user.id);
        });
    });

    passport.deserializeUser(async function (id: number, callback) {
        try {
            const user: Express.User = await adminUser.getUserByIdService(String(id));
            callback(null, user);
        } catch (err) {
            callback(err);
        }
    });
}

export default configPassport;