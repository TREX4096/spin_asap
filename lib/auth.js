import GoogleProvider from 'next-auth/providers/google';
import axios from 'axios';

export const NEXT_AUTH_CONFIG = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      async profile(profile) {
        // You can return any additional data to the user object here
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          // Add any additional fields you want to store
        };
      }
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id; // Store the Google user ID in the token

        // Send user details to the backend to store them
        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/${process.env.NEXT_PUBLIC_ADMIN_ID}`, {
            name: user.name,
            email: user.email,
            // You can include any other fields if required
          });

          
          console.log(response);
           
         
          if (response.data && response.data.user.id) {
            localStorage.setItem('userId', response.data.user.id);
          }
        } catch (error) {
          console.error('Error storing user details:', error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      return session;
    },
    redirect: async ({ url, baseUrl }) => {
      return '/api/hello'; 
    }
  },
  pages: {
    signIn: '/signin', // Your custom sign-in page
  },
};
