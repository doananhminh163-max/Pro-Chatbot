import passport from 'passport'
import { Strategy as GoogleStrategy } from 'passport-google-oauth20'
import { env } from './env.js'
import { upsertGoogleUser } from '../services/auth.service.js'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.googleClientId,
      clientSecret: env.googleClientSecret,
      callbackURL: env.googleCallbackUrl,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value

        if (!email) {
          done(new Error('Google profile has no email'), undefined)
          return
        }

        const user = await upsertGoogleUser({
          email,
          fullName: profile.displayName,
          avatar: profile.photos?.[0]?.value,
        })

        done(null, user)
      } catch (error) {
        done(error as Error, undefined)
      }
    },
  ),
)

export default passport
