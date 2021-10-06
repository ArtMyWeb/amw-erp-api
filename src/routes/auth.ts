import express from 'express'
import passport from 'passport'
import { authController } from '../controllers/auth'

const authRouter = express.Router()

authRouter.post('/signup', authController.signup)
authRouter.post('/login', passport.authenticate('local', { session: false }), authController.login)
authRouter.post('/logout', authController.logout)
authRouter.post('/changePassword', passport.authenticate('bearer', { session: false }), authController.changePassword)
authRouter.post('/refresh', authController.refresh)

export default authRouter
