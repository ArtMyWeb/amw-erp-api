import express from 'express'
import passport from 'passport'
import { projectController } from '../controllers/project'

const projectRouter = express.Router()

projectRouter.get('/', passport.authenticate('bearer', { session: false }), projectController.get)
projectRouter.get('/:id', passport.authenticate('bearer', { session: false }), projectController.getSingle)
projectRouter.post('/', passport.authenticate('bearer', { session: false }), projectController.create)
projectRouter.delete('/:id', passport.authenticate('bearer', { session: false }), projectController.delete)
projectRouter.patch('/:id', passport.authenticate('bearer', { session: false }), projectController.update)

export default projectRouter
