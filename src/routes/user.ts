import express from 'express'
import passport from 'passport'
import { userController } from '../controllers/user'

const userRouter = express.Router()

userRouter.get('/', passport.authenticate('bearer', { session: false }), userController.get)
userRouter.get('/current', passport.authenticate('bearer', { session: false }), userController.getMyself)
userRouter.post('/', passport.authenticate('bearer', { session: false }), userController.create)
userRouter.delete('/:id', passport.authenticate('bearer', { session: false }), userController.delete)
userRouter.patch('/:id', passport.authenticate('bearer', { session: false }), userController.update)

export default userRouter
