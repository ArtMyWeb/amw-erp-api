import express from 'express'
import passport from 'passport'
import { taskController } from '../controllers/task'

const taskRouter = express.Router()

taskRouter.get('/', passport.authenticate('bearer', { session: false }), taskController.get)
taskRouter.get('/project/:id', passport.authenticate('bearer', { session: false }), taskController.getProjectTasks)
taskRouter.post('/', passport.authenticate('bearer', { session: false }), taskController.create)
taskRouter.patch('/:id', passport.authenticate('bearer', { session: false }), taskController.update)
taskRouter.delete('/:id', passport.authenticate('bearer', { session: false }), taskController.delete)

export default taskRouter
