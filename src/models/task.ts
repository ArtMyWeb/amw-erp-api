import mongoose, { Document, Types } from 'mongoose'
import { Project } from './project'

const { Schema } = mongoose

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  assignee: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    required: true,
    default: 'backlog',
    enum: ['backlog', 'to_do', 'in_progress', 'in_review', 'done'],
  },
  estimate_hours: Number,
  due_date: Date,
  date_created: { type: Date, default: Date.now() },
})

interface TaskInterface {
  title: string
  description?: string
  project: Types.ObjectId
  assignee: Types.ObjectId
  status: 'backlog' | 'to do' | 'in progress' | 'in review' | 'done'
  estimate_hours?: number
  due_date?: number
  date_created?: number
}

interface TaskDocument extends TaskInterface, Document {}

taskSchema.pre<TaskDocument>('save', async function save(next) {
  if (this.isNew) {
    try {
      const projectDoc = await Project.findById(this.project)
      let newSnapshot = {
        ...projectDoc.order_snapshot,
        backlog: [...projectDoc.order_snapshot.backlog, this._id],
      }
      projectDoc.order_snapshot = newSnapshot
      await projectDoc.save()
      return next()
    } catch (err) {
      console.log(err)
      return next(err)
    }
  } else {
    return next()
  }
})

export const Task = mongoose.model<TaskDocument>('Task', taskSchema)
