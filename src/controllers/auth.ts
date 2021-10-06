import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'

import { Token } from '../models/token'
import { User } from '../models/user'
import { ColorGenerator } from '../utils/colorGenerator'
import { env } from '../config'

const login = async (req: Request, res: Response) => {
  try {
    const accessToken = jwt.sign({ userId: req.user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    })
    const refreshToken = jwt.sign({ userId: req.user._id }, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    })
    const token = await Token.create({ access_token: accessToken, refresh_token: refreshToken, user_id: req.user._id })
    return res.status(200).send(token)
  } catch (err) {
    console.log('login error = ', err)
    return res.status(400).send()
  }
}

const signup = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      const body = {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        role: req.body.role,
        avatar: { url: null as null, color: ColorGenerator.getColor() },
        date_created: Date.now(),
      }
      await User.create(body)
      return res.status(201).send({ message: 'created' })
    } else {
      return res.status(400).send({ error: 'User already exists' })
    }
  } catch (err) {
    console.log('signup error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const logout = async (req: Request, res: Response) => {
  try {
    await Token.findOneAndDelete({ access_token: req.body.access_token })
    return res.status(200).send()
  } catch (err) {
    console.log('logout error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const refresh = async (req: Request, res: Response) => {
  try {
    // verify that token exists
    jwt.verify(req.body.refresh_token, env.JWT_SECRET)
    const tokenDoc = await Token.findOne({ refresh_token: req.body.refresh_token })
    if (!tokenDoc) return res.status(403).send()

    // delete old token and generate new
    const accessToken = jwt.sign({ userId: tokenDoc.user_id }, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN,
    })
    const refreshToken = jwt.sign({ userId: tokenDoc.user_id }, env.JWT_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN,
    })
    await Token.findOneAndDelete({ refresh_token: req.body.refresh_token })
    const token = await Token.create({
      access_token: accessToken,
      refresh_token: refreshToken,
      user_id: tokenDoc.user_id,
    })
    return res.status(200).send(token)
  } catch (err) {
    console.log('refresh error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

const changePassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id)
    const isValidPassword = await user.validatePassword(req.body.old_password)
    if (!isValidPassword) {
      return res.status(403).send({ error: 'Wrong password' })
    } else {
      user.password = req.body.new_password
      await user.save()
      return res.status(200).send()
    }
  } catch (err) {
    console.log('logout error = ', err)
    return res.status(400).send({ error: err.message })
  }
}

export const authController = {
  login,
  signup,
  logout,
  changePassword,
  refresh,
}
