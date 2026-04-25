import { Router } from 'express'
import passport from '../config/passport.js'
import {
  forgotPasswordHandler,
  googleFailureHandler,
  googleSuccessHandler,
  loginHandler,
  logoutHandler,
  meHandler,
  resetPasswordHandler,
  registerHandler,
  updateProfileHandler,
} from '../controllers/auth.controller.js'
import { requireAuth } from '../middleware/auth.middleware.js'

const authRouter = Router()

authRouter.post('/register', registerHandler)
authRouter.post('/login', loginHandler)
authRouter.post('/forgot-password', forgotPasswordHandler)
authRouter.post('/reset-password', resetPasswordHandler)
authRouter.post('/logout', logoutHandler)
authRouter.get('/me', requireAuth, meHandler)
authRouter.patch('/profile', requireAuth, updateProfileHandler)

authRouter.get(
  '/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  }),
)

authRouter.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/api/auth/google/failure',
  }),
  googleSuccessHandler,
)

authRouter.get('/google/failure', googleFailureHandler)

export default authRouter
