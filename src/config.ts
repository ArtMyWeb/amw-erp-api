export const env = {
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017',
  MONGO_USER: process.env.MONGO_USER || 'artmyweb',
  MONGO_PASSWORD: process.env.MONGO_PASSWORD || 'pass123',
  API_PORT: process.env.API_PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'my-32-character-ultra-secure-and-ultra-long-secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '30m',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  SUPER_USER: process.env.SUPER_USER || 'admin@mail.com',
  SUPER_PASS: process.env.SUPER_PASS || 'password',
}
