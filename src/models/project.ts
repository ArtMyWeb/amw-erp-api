import mongoose, { Document, Types } from 'mongoose'
import { UserDocument } from './user'
import { ClientDocument } from './client'
const { Schema } = mongoose

const projectSchema = new Schema({
  name: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, ref: 'Client', required: true },
  manager: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  order_snapshot: {
    backlog: [Schema.Types.ObjectId],
    to_do: [Schema.Types.ObjectId],
    in_progress: [Schema.Types.ObjectId],
    in_review: [Schema.Types.ObjectId],
    done: [Schema.Types.ObjectId],
  },
  description: String,
  date_created: { type: Date, default: Date.now() },
})

export interface ProjectInterface {
  name: string
  client: Types.ObjectId | ClientDocument | string
  manager: Types.ObjectId | UserDocument | string
  members?: Types.ObjectId[] | UserDocument[]
  order_snapshot?: {
    backlog: Types.ObjectId[]
    to_do: Types.ObjectId[]
    in_progress: Types.ObjectId[]
    in_review: Types.ObjectId[]
    done: Types.ObjectId[]
  }
  description: string
  date_created?: number
}

interface ProjectDocument extends ProjectInterface, Document {}

export interface ProjectPopulatedDocument extends ProjectDocument {
  client: ClientDocument
  manager: UserDocument
  members: UserDocument[]
}

export const Project = mongoose.model<ProjectDocument>('Project', projectSchema)
