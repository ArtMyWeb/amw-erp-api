import { Request, Response } from 'express'
import { Project } from '../models/project'

const createProject = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).send()
  }
  try {
    req.body.date_created = Date.now()
    const project = await Project.create(req.body)
    const populatedProject = await (project as any)
      .populate('manager', ['name'])
      .populate('client', 'name')
      .populate('members', ['name'])
      .execPopulate()
    return res.status(201).send(populatedProject)
  } catch (err) {
    console.log('createProject error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const getAllProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find()
      .populate('manager', ['name'])
      .populate('client', 'name')
      .populate('members', ['name'])
      .exec()
    return res.status(200).json(projects)
  } catch (err) {
    console.log('getAllProjects error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const deleteProject = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).send()
  }
  try {
    await Project.findByIdAndDelete(req.params.id).exec()
    return res.status(200).send({ message: 'Deleted' })
  } catch (err) {
    console.log('deleteProject error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const updateProject = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).send()
  }
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).json(project)
  } catch (err) {
    console.log('getOneProject error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const getSingleProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('manager', ['name'])
      .populate('members', ['name'])
      .exec()
    return res.status(200).json(project)
  } catch (err) {
    console.log('getSingleProject error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

export const projectController = {
  create: createProject,
  get: getAllProjects,
  delete: deleteProject,
  update: updateProject,
  getSingle: getSingleProject,
}
