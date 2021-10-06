import { User, UserInterface } from '../models/user'
import { env } from '../config'

export const createAdmin = async () => {
  try {
    const user = await User.findOne({ email: env.SUPER_USER })
    if (!user) {
      let admin: UserInterface = {
        email: env.SUPER_USER,
        password: env.SUPER_PASS,
        name: 'Super Admin',
        role: 'admin',
        approved: true,
      }
      await User.create(admin)
      console.log('admin created')
    } else {
      console.log('admin already exist')
    }
  } catch (err) {
    console.log('createAdmin error = ', err)
  }
}
