import { Strategy } from "passport-local";
import passport from "passport";
import bcrypt from "bcrypt";

const configPassport = () => {
    passport.use(new Strategy({
        usernameField: 'identifier',
        passwordField: 'password'
    }, async function verify(identifier, password, callback) {
        const expectedUser = process.env.LOCAL_ADMIN_USERNAME;
        const expectedPasswordHash = process.env.LOCAL_ADMIN_PASSWORD_HASH;

        if (!expectedUser || !expectedPasswordHash || identifier !== expectedUser) {
            return callback(null, false, { message: `${identifier} not found` });
        }

        try {
            const isPasswordValid = await bcrypt.compare(password, expectedPasswordHash);
            if (!isPasswordValid) {
                return callback(null, false, { message: 'Invalid password' });
            }
        } catch (err) {
            return callback(err);
        }

        return callback(null, {
            id: "local-admin",
            username: expectedUser,
            email: `${expectedUser}@local`,
            role: { name: "Admin" },
        });
    }));

    passport.serializeUser(function (user: Express.User, callback) {
        process.nextTick(function () {
            callback(null, (user as Express.User & { id: string }).id);
        });
    });

    passport.deserializeUser(async function (id: string, callback) {
        callback(null, {
            id,
            username: process.env.LOCAL_ADMIN_USERNAME ?? "local-admin",
            email: `${process.env.LOCAL_ADMIN_USERNAME ?? "local-admin"}@local`,
            role: { name: "Admin" },
        });
    });
}

export default configPassport;
