import { Request, Response } from 'express'
import { Task } from '../models/task'

const createTask = async (req: Request, res: Response) => {
  try {
    req.body.date_created = Date.now()
    const task = await Task.create(req.body)
    const populatedTask = await (task as any).populate('assignee', ['name', 'avatar']).execPopulate()
    res.status(201).send(populatedTask)
  } catch (err) {
    console.log('createTask error = ', err)
    res.status(400).send({ error: err.message })
  }
}

const getProjectTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ project: req.params.id }).populate('assignee', ['name', 'avatar']).exec()
    res.status(200).json(tasks)
  } catch (err) {
    console.log('getProjectTasks error = ', err)
    res.status(400).send({ error: err.message })
  }
}

const getAllTasks = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find().exec()
    res.status(200).json(tasks)
  } catch (err) {
    console.log('getAllTasks error = ', err)
    res.status(400).send({ error: err.message })
  }
}

const updateTask = async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    const populatedTask = await (task as any).populate('assignee', ['name', 'avatar']).execPopulate()
    res.status(200).json(populatedTask)
  } catch (err) {
    console.log('getOneTask error = ', err)
    res.status(400).send({ error: err.message })
  }
}

const deleteTask = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send()
  }
  try {
    await Task.findByIdAndDelete(req.params.id)
    res.status(200).send()
  } catch (err) {
    console.log('deleteTask error = ', err)
    res.status(400).send({ error: err.message })
  }
}

export const taskController = {
  create: createTask,
  get: getAllTasks,
  getProjectTasks: getProjectTasks,
  update: updateTask,
  delete: deleteTask,
}
