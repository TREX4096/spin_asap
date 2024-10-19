import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import type { NextAuthOptions } from 'next-auth';

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
        // Check if credentials are defined
        if (!credentials) {
          return null; // Return null if credentials are not provided
        }

        const { email, name } = credentials as Credentials;

        // Example: Replace this with actual user lookup logic
        if (email === 'test@example.com' && name === 'Raj') {
          return {
            id: "user1",
            username: "testuser",
            userId: "user1",
            email,
          };
        } else {
          return null; // Return null if user credentials are incorrect
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id; // Add user ID to the token
      }
      return token;
    },
    session: async ({ session, token }) => {
    //   if (token && session.user) {
    //     session.user.id = token.uid; // Attach user ID to session
    //   }
      return session;
    },
  },
  pages: {
    signIn: '/signin', // Custom sign-in page
  },
};
