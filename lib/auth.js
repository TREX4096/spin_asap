import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export const NEXT_AUTH_CONFIG = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        // Common fields for user registration
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
        // Fields for admin registration
        secretKey: { label: 'Secret Key', type: 'password' },
        adminName: { label: 'Admin Name', type: 'text' },
        adminPassword: { label: 'Admin Password', type: 'password' },
        isAdmin: { label: 'Admin', type: 'hidden' }, // Hidden field to indicate admin mode
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        try {
          const isAdmin = credentials.isAdmin === 'true';
          let response;

          if (isAdmin) {
            // Handle admin registration
            response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/${process.env.NEXT_PUBLIC_ADMIN_ID}`, {
              secret: credentials.secretKey,
              name: credentials.adminName,
              password: credentials.adminPassword,
            });
          } else {
            // Handle user registration
            response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/${process.env.NEXT_PUBLIC_ADMIN_ID}`, {
              name: credentials.name,
              email: credentials.email,
              gender: credentials.gender,
              age: credentials.age,
            });
          }

          // Check if the response contains a valid userId
          if (!response.data || !response.data.userId) {
            return null; // Registration failed
          }

          // Return user object with admin flag
          return {
            id: response.data.userId,
            name: isAdmin ? credentials.adminName : credentials.name,
            email: isAdmin ? credentials.email : credentials.email, // Depending on your backend, this could change
            isAdmin, // Attach the admin flag
          };

        } catch (error) {
          console.error('Error during registration:', error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Add userId and admin flag to JWT token
    jwt: async ({ token, user }) => {
      if (user) {
        token.userId = user.id;
        token.name = user.name;
        token.isAdmin = user.isAdmin; // Attach the admin flag to the JWT
      }
      return token;
    },
    // Add userId, name, and admin flag to the session object
    session: async ({ session, token }) => {
      if (token && session.user) {
        session.user.id = token.userId;
        session.user.name = token.name;
        session.user.isAdmin = token.isAdmin; // Attach the admin flag to the session
      }
      return session;
    },
    // Redirect to /api/admin if the user is an admin
    redirect: async ({ url, baseUrl }) => {
      if (url === '/api/admin' || url.startsWith(baseUrl)) {
        return url; // Redirect if accessing admin route
      }
      return baseUrl; // Default redirection
    }
  },
  pages: {
    signIn: '/signin', // Your custom sign-in page
  },
};
