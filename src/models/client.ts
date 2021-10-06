import mongoose, { Document } from 'mongoose'
const { Schema } = mongoose

const clientSchema = new Schema({
  name: { type: String, required: true },
  date_created: { type: Date, default: Date.now() },
})

interface ClientInterface {
  name: string
  date_created?: number
}

export interface ClientDocument extends ClientInterface, Document {}

export const Client = mongoose.model<ClientDocument>('Client', clientSchema)
