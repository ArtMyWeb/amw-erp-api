import { Request, Response } from 'express'
import { Client } from '../models/client'

const createClient = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).send()
  }
  try {
    req.body.date_created = Date.now()
    const client = await Client.create(req.body)
    return res.status(201).send(client)
  } catch (err) {
    console.log('createClient error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const getAllClients = async (req: Request, res: Response) => {
  try {
    const clients = await Client.find()
    return res.status(200).json(clients)
  } catch (err) {
    console.log('getAllClients error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const deleteClient = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).send()
  }
  try {
    await Client.findByIdAndDelete(req.params.id).exec()
    return res.status(200).send({ message: 'Deleted' })
  } catch (err) {
    console.log('deleteClient error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const updateClient = async (req: Request, res: Response) => {
  if (req.user.role !== 'admin' && req.user.role !== 'manager') {
    return res.status(403).send()
  }
  try {
    const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true })
    return res.status(200).json(client)
  } catch (err) {
    console.log('getOneClient error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

export const clientController = {
  create: createClient,
  get: getAllClients,
  delete: deleteClient,
  update: updateClient,
}
