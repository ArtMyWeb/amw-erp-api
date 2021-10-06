import { Request, Response } from 'express'
import { User } from '../models/user'
import { ColorGenerator } from '../utils/colorGenerator'

type UpdatedUserBody = {
  email?: string
  name?: string
  role?: 'admin' | 'manager' | 'developer'
  approved?: boolean
}

const createUser = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).send()
  }
  try {
    req.body.date_created = Date.now()
    req.body.avatar = { url: null as null, color: ColorGenerator.getColor() }
    const user = await User.create(req.body)
    const userObject = user.toObject()
    delete userObject.password
    return res.status(200).json(userObject)
  } catch (err) {
    console.log('createUser error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}, '-password')
    return res.status(200).json(users)
  } catch (err) {
    console.log('getAllUsers error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const getMyself = (req: Request, res: Response) => {
  return res.status(200).json(req.user)
}

const deleteUser = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send()
  }
  try {
    await User.findByIdAndDelete(req.params.id).exec()
    return res.status(200).send({ message: 'Deleted' })
  } catch (err) {
    console.log('deleteUser error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const updateUser = async (req: Request, res: Response) => {
  let body: UpdatedUserBody = {}
  if (req.user.role === 'admin' || req.user.role === 'manager') {
    delete req.body.password
    delete req.body.date_created
    body = req.body
  } else {
    if (req.params.id !== req.user.id) {
      return res.status(403).send()
    }
    if (req.body.email) body.email = req.body.email
    if (req.body.name) body.name = req.body.name
  }
  try {
    const user = await User.findByIdAndUpdate(req.params.id, body, { new: true })
    const userObject = user.toObject()
    delete userObject.password
    return res.status(200).json(userObject)
  } catch (err) {
    console.log('getOneUser error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

export const userController = {
  create: createUser,
  get: getAllUsers,
  delete: deleteUser,
  update: updateUser,
  getMyself: getMyself,
}
