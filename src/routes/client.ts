import express from 'express'
import passport from 'passport'
import { clientController } from '../controllers/client'

const clientRouter = express.Router()

clientRouter.get('/', passport.authenticate('bearer', { session: false }), clientController.get)
clientRouter.post('/', passport.authenticate('bearer', { session: false }), clientController.create)
clientRouter.delete('/:id', passport.authenticate('bearer', { session: false }), clientController.delete)
clientRouter.patch('/:id', passport.authenticate('bearer', { session: false }), clientController.update)

export default clientRouter
