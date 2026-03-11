import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Demo fallback for testing without wiping the hackathon state
        if (credentials.email === "demo@sugarush.com" && credentials.password === "demo123") {
          let user = await prisma.user.findUnique({
            where: { email: "demo@sugarush.com" }
          });
          
          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "Demo User",
                email: "demo@sugarush.com",
                profile: {
                  create: {
                    diabetesType: "Type 2",
                    age: 35,
                    targetRangeMin: 70,
                    targetRangeMax: 140,
                  }
                }
              }
            });
          }
          return { id: user.id, name: user.name, email: user.email };
        }

        // Search for the user in our real database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string }
        });

        if (!user || !user.password) {
          return null;
        }

        // Compare real hashes
        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return { id: user.id, name: user.name, email: user.email };
      }
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login', // We'll need to create this page or use the default one
  }
})
