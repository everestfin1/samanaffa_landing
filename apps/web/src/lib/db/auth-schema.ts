// Re-export Better Auth schema from main schema file
// This ensures consistency between app schema and Better Auth adapter
export { users as user, session, account, verification } from './schema';
