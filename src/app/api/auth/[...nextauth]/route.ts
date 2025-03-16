// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { db } from "../../../../lib/db";
import { users } from "../../../../lib/db/schema";
import { eq } from "drizzle-orm";
import { compare } from "bcrypt";
// Import the type definitions
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";
import type { NextAuthOptions } from "next-auth";

// Define custom types for extended User
type CustomUser = {
  id: string;
  email: string;
  name?: string;
  role: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const user = await db.query.users.findFirst({
          where: eq(users.email, credentials.email),
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // Add this new signIn callback
    async signIn({ user, account, profile }) {
      // Only process for Google provider
      if (account?.provider === "google" && profile?.email) {
        try {
          // Check if the user already exists in our database
          const existingUser = await db.query.users.findFirst({
            where: eq(users.email, profile.email),
          });

          // If user doesn't exist in our database, create a new one
          if (!existingUser) {
            await db.insert(users).values({
              name: profile.name || user.name,
              email: profile.email,
              image: user.image,
              role: 'user', // Default role for Google auth users
            });
            
            console.log("Created new user from Google auth:", profile.email);
          } else {
            console.log("Google user already exists in database:", profile.email);
          }
        } catch (error) {
          console.error("Error saving Google user to database:", error);
          // Still return true to allow sign in even if DB saving fails
        }
      }
      return true;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        
        // For Google auth users, fetch the role from the database
        if (session.user.email) {
          const dbUser = await db.query.users.findFirst({
            where: eq(users.email, session.user.email),
          });
          
          if (dbUser) {
            (session.user as any).role = dbUser.role;
          } else {
            (session.user as any).role = "user"; // Default fallback
          }
        } else {
          (session.user as any).role = token.role as string;
        }
      }
      return session;
    },
    
    async jwt({ 
        token, 
        user, 
        account, 
        profile 
      }) {
        // If the user has just signed in, add their role to the token
        if (user) {
          token.role = (user as CustomUser).role;
        }
        return token;
      }
    },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };