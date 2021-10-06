import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'
import cors from 'cors'
import passport from 'passport'

import initPassport from './auth/index'
import userRouter from './routes/user'
import clientRouter from './routes/client'
import projectRouter from './routes/project'
import taskRouter from './routes/task'
import authRouter from './routes/auth'

import { createAdmin } from './utils/createAdmin'
import { env } from './config'

dotenv.config()
const port = env.API_PORT
const app = express()
initPassport()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/clients', clientRouter)
app.use('/projects', projectRouter)
app.use('/tasks', taskRouter)

const listen = () => {
  app.listen(port, () => {
    console.log(`API listening at http://localhost:${port}`)
  })
}

mongoose
  .connect(env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    user: env.MONGO_USER,
    pass: env.MONGO_PASSWORD,
  })
  .then(() => {
    console.log(`connection to database established`)
    listen()
    createAdmin()
  })
  .catch(err => {
    console.log(`db error ${err}`)
    process.exit(-1)
  })
