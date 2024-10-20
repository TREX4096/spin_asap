import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';
import axios from 'axios';

interface Credentials {
  email: string;
  name: string;
  age: string;
  gender: string;
}

export const NEXT_AUTH_CONFIG: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        name: { label: 'Nickname', type: 'text', placeholder: 'Enter your nickname' },
        age: { label: 'Age', type: 'number', placeholder: 'Enter your age' },
        gender: {
          label: 'Gender',
          type: 'select',
          options: [
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' }
          ],
        },
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        

        try {
          // Register the user in your backend
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/register`, {
            name: credentials.name,
            email: credentials.email,
            gender: credentials.gender,
            age: credentials.age,
          });

          if (!response.data || !response.data.userId) {
            return null; // If no userId is returned
          }

          // Return user object for NextAuth
          return {
            id: response.data.userId, // Use 'id' for consistency
            name: credentials.name,
            email: credentials.email,
          };

        } catch (error) {
          console.error('Error during user registration:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Add userId to JWT token
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id; // Attach the userId to the JWT
      }
      return token;
    },
    // Add userId to the session object
    session: async ({ session, token }) => {
      if (token && session.user) {
        
        session.user.id = token.userId; // Attach userId from JWT to the session
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
  },
};
