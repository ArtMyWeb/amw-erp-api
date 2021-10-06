import mongoose, { Document } from 'mongoose'
import bcrypt from 'bcrypt'

const { Schema } = mongoose
const saltRounds = 10

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'manager', 'developer'] },
  approved: { type: Boolean, default: false },
  avatar: {
    url: String,
    color: String,
  },
  date_created: { type: Date, default: Date.now() },
})

export interface UserInterface {
  email: string
  password: string
  name: string
  role?: 'admin' | 'manager' | 'developer'
  approved?: boolean
  avatar?: {
    url: string | null
    color: string | null
  }
  date_created?: number
}

export interface UserDocument extends UserInterface, Document {
  validatePassword(password: string): Promise<boolean>
}

userSchema.pre<UserDocument>('save', async function save(next) {
  if (!this.isModified('password')) return next()
  try {
    const salt = await bcrypt.genSalt(saltRounds)
    this.password = await bcrypt.hash(this.password, salt)
    return next()
  } catch (err) {
    console.log(err)
    return next(err)
  }
})

userSchema.methods.validatePassword = async function validatePassword(password: string) {
  return bcrypt.compare(password, this.password)
}

export const User = mongoose.model<UserDocument>('User', userSchema)
