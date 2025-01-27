import { config as dotenvConfig } from 'dotenv';

dotenvConfig({ path: '.env.development' });

export const config = {
  authRequired: false,
  authLogout: true,
  secret: process.env.AUTH0_SECRET,
  audience: process.env.AUTH0_AUDIENCE,
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_BASE_URL,
};
