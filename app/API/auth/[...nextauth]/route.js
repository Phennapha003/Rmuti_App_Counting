import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { allowedEmails } from '@/app/components/allowedEmails';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: "select_account", // Allow users to select account
                },
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async jwt({ token, account, profile }) {
            // ตรวจสอบว่าอีเมลของผู้ใช้ในรายการที่อนุญาต
            if (profile?.email && allowedEmails.includes(profile.email)) {
                token.allowed = true;
            } else {
                token.allowed = false;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.allowed = token.allowed;
            return session;
        },
    }

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };