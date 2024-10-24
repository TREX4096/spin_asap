// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export default NextAuth({
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials) return null;
                try {
                    const user = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/auth/${process.env.NEXT_PUBLIC_ADMIN_ID}`, {
                        email: credentials.email,
                        name: credentials.name,
                        gender:credentials.gender,
                        age:credentials.age
                    });

                    if (user) {
                        return user.data; // Ensure to return user data
                    } else {
                        console.log("User not found");
                        return null;
                    }
                } catch (error) {
                    console.error("Authorization error:", error);
                    throw new Error("Authentication failed");
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code"
                }
            }
        }),
    ],
    pages: {
        signIn: '/test', // Custom sign-in page path
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id; // You can add user info to the token if needed
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id; // You can attach user info to session
            return session;
        }
    },
});
