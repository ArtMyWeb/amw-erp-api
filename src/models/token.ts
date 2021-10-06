import mongoose, { Document, Types } from 'mongoose'
const { Schema } = mongoose

const tokenSchema = new Schema({
  access_token: { type: String, required: true },
  refresh_token: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true },
  date_created: { type: Date, default: Date.now() },
})

interface TokenInterface {
  access_token: string
  refresh_token: string
  user_id: Types.ObjectId
  date_created?: number
}

interface TokenDocument extends TokenInterface, Document {}

export const Token = mongoose.model<TokenDocument>('Token', tokenSchema)
