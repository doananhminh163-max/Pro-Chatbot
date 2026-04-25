import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import passport from './config/passport.js'
import { env } from './config/env.js'
import authRouter from './routes/auth.routes.js'
import chatRouter from './routes/chat.routes.js'
import documentRouter from './routes/document.routes.js'

dotenv.config()

const app = express()

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
)
app.use(helmet())
app.use(cookieParser())
app.use(express.json())
app.use(passport.initialize())

app.get('/', (_request, response) => {
  response.send('Pro Chatbot API is running...')
})

app.use('/api/auth', authRouter)
app.use('/api/chat', chatRouter)
app.use('/api/documents', documentRouter)

app.listen(env.port, () => {
  console.log(`[server]: Server is running at http://localhost:${env.port}`)
})
