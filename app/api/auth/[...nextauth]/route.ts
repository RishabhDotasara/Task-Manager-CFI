import { PrismaClient, User } from "@prisma/client";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export interface UserSession extends Session {
  userId: string,
  permissions: string[],
  username:string
}

export interface UserToken extends User 
{
  id:string,
  permissions:string[],
  username:string
}

const handler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      type: "credentials",
      credentials: {
        employeeId: {
          label: "EmployeeId",
          type: "text",
          placeholder: "EmployeeId",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },

      async authorize(credentials, req) {
        try {
          const id = credentials?.employeeId.toLowerCase();
          const user:User | null = await prisma.user.findUnique({
            where: {
              employeeId: id,
            },
          });

          if (!user) {
            return null;
          }

          const passwordCheck = await bcrypt.compare(credentials?.password as string, user?.password as string);
          
          if (passwordCheck) {
            return { id: user.userId, permissions:user.permissions, username:user.username , user}; 
          } else {
            return null;
          }
        } catch (err) {
          console.log("Error in nextauth config.", err);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 24 * 60 * 60, // update session every 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    async session({ session, token }:{session:UserSession, token:UserToken}) {
      // Add userId and isAdmin to the session object
      if (token?.id) {
        session.userId = token.id;
        session.permissions = token.permissions;
        session.username = token.username
      }
      return session;
    },
    async jwt({ token, user }:{token:UserToken, user:User}) {
      // Add userId and isAdmin to the token
      if (user) {
        token.id = user.id;
        token.permissions = user.permissions;
        token.username = user.username
      }
      return token;
    },
  },
});

export { handler as GET, handler as POST };
