declare namespace Express {
  export interface User {
    _id?: string
    role?: 'admin' | 'manager' | 'developer'
    id?: string
  }
}
