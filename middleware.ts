// middleware.ts

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: '/signin', // Specify your sign-in page
  },
});

// Define the config object
export const config = {
  matcher: ["/api/:path*"], // Exclude the main page (page.tsx) and other specific routes
};