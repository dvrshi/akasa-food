import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import { compare } from "bcrypt";


export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt"
    },
    pages: {
        signIn: "/sign-in",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "johndoe@gmail.com" },
                password: { label: "Password", type: "password" }
            },

            async authorize(credentials): Promise<{ id: string; email: string; username: string } | null> {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }
                const { email, password } = credentials as { email: string, password: string };

                const existingUser = await db.user.findUnique({
                    where: { email: credentials?.email }
                });
                if (!existingUser) {
                    return null;
                }
                const passwordMatch = await compare(password, existingUser.password);
                if (!passwordMatch) {
                    return null;
                }

                return {
                    id: existingUser.id.toString(),
                    email: existingUser.email,
                    username: existingUser.username
                };
            }
        })
    ],
    callbacks: {
        async jwt({token, user}) {
            // console.log(token,user);
            if (user) {
                return { ...token, username: user.username};
            }
            return token;
        },
        async session({session, token}) {
            // console.log(session, token);
            return{
                ...session,
                user: {
                    ...session.user,
                    username: token.username
                }
            }
        },
    }
}