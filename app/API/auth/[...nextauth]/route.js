import NextAuth from "next-auth/next"
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        },
    },
};

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }