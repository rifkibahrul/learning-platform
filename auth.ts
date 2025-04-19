import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { users } from "./database/schema";
import { db } from "./database/drizzle";
import { eq } from "drizzle-orm";
import { compare } from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
    session: {
        strategy: "jwt",    // JWT session stored in cookie, not database
    },
    providers: [
        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                const user = await db
                    .select()
                    .from(users)
                    .where(eq(users.email, credentials.email.toString()))
                    .limit(1);

                if (user.length === 0) return null;

                const isPasswordValid = await compare(
                    credentials.password.toString(),
                    user[0].password
                );

                if (!isPasswordValid) return null;

                return {
                    id: user[0].id.toString(),
                    email: user[0].email,
                    name: user[0].fullName,
                } as User;      // User info passed to callbacks
            },
        }),
    ],
    pages: {
        signIn: "/sign-in",
    },
    callbacks: {
        // To populate the token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
            }
            return token;
        },

        // To populate the session
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
            }

            return session;     // Session object returned to client
        },
    },
});
