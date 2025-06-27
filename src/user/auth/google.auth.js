import {OAuth2Client} from 'google-auth-library';
import dotenv from 'dotenv';
dotenv.config();

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// you are supposed to check for validations and error handling in the controller
// Function to verify Google ID token and return user information
export default async function googleAuthProvider(idToken){
  try {
    if (!idToken || typeof idToken !== 'string') {
      throw new Error('ID token is required');
    }
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID, 
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid token payload');
    }

    return {
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      uid: payload.sub,
      username: payload.email.split('@')[0],
      provider: 'google',
    };
  } catch (error) {
    console.error('Google authentication error:', error);
    throw error;
  }
}

