import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as BearerStrategy } from 'passport-http-bearer'
import jwt from 'jsonwebtoken'

import { User } from '../models/user'
import { Token } from '../models/token'
import { env } from '../config'

const initPassport = () => {
  passport.use(
    'local',
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password',
      },
      async function (username: string, password: string, done) {
        try {
          const user = await User.findOne({ email: username })
          if (!user) {
            console.log('Incorrect email')
            return done(null, false, { message: 'Incorrect email' })
          }
          const isValidPassword = await user.validatePassword(password)
          if (!isValidPassword) {
            console.log('Incorrect password')
            return done(null, false, { message: 'Incorrect password' })
          }
          if (!user.approved) return done(null, false, { message: 'User not approved' })
          return done(null, user)
        } catch (err) {
          return done(err)
        }
      },
    ),
  )

  passport.use(
    'bearer',
    new BearerStrategy(async function (token: string, done) {
      try {
        const decoded = jwt.verify(token, env.JWT_SECRET)
        const tokenDoc = await Token.findOne({ access_token: token })
        if (!tokenDoc) return done(null, false)
        if (typeof decoded === 'object') {
          type DecodedType = {
            userId?: string
          }
          let newDecoded: DecodedType = Object.assign({}, decoded)
          const user = await User.findById(newDecoded.userId)
          if (!user) return done(null, false)
          if (!user.approved) return done(null, false)
          return done(null, user)
        }
      } catch (err) {
        return done(null, false)
      }
    }),
  )
}

export default initPassport
