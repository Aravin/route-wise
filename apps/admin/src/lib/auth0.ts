// Auth0 configuration
export const auth0Config = {
  domain: process.env.AUTH0_DOMAIN || 'dev-routewise.auth0.com',
  clientId: process.env.AUTH0_CLIENT_ID || 'your-client-id',
  clientSecret: process.env.AUTH0_CLIENT_SECRET || 'your-client-secret',
  baseURL: process.env.AUTH0_BASE_URL || 'http://localhost:3020',
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL || 'https://dev-routewise.auth0.com',
  secret: process.env.AUTH0_SECRET || 'your-secret-key',
  audience: process.env.AUTH0_AUDIENCE || 'https://dev-routewise.auth0.com/api/v2/',
}
