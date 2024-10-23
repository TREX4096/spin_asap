import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export const NEXT_AUTH_CONFIG = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      async profile(profile) {
        return {
          id: profile.sub, // Google user ID
          name: profile.name,
          email: profile.email,
        };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id; // Store the Google user ID in the token

        // Send user details to the backend to store them
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/${process.env.NEXT_PUBLIC_ADMIN_ID}`, {
            name: user.name,
            email: user.email,
          });

          console.log(response);

          if (response.data && response.data.user.id) {
            // Store the userId from the response in the token
            token.userId = response.data.user.id;
          }
        } catch (error) {
          console.error('Error storing user details:', error);
        }
      }

      return token; // Return the token with userId included
    },

    async session({ session, token }) {
      // Pass userId from the token to the session object
      if (token.userId) {
        session.user.id = token.userId;  // Add userId to the session object
      }
      console.log(session);
      
      return session;  // Return session with userId
    },

    // redirect: async ({ url, baseUrl }) => {
    //   return '/api/hello';
    // }
  },

  pages: {
    signIn: '/signin',
  },
};
