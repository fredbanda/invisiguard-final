import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  events: {
    async linkAccount({ user, account }) {
      await db.user.update({
        where: {id: user.id},
        data: {emailVerified: new Date()},
      });
    }
  },
  callbacks: {
    async signIn({ user, account }: { user: any; account: any }) {
      try {
        // Allow OAuth accounts without email verification
        if (account?.provider !== "credentials") return true;
    
        // Check if the user object has an ID
        if (!user?.id) {
          console.error("User ID is missing");
          return false;
        }
    
        // Fetch the user by ID
        const existingUser = await getUserById(user.id);
    
        //Preventing users from logging in before validating their emails
        if (!existingUser?.emailVerified) {
          console.error("User does not exist in our records");
          return false;
        }

        //2FA CHECKS
        if(existingUser.isTwoFactorEnabled){
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(user.id);

          if(!twoFactorConfirmation) return false;

          // delete the confirmation after successful login
          await db.twoFactorConfirmation.delete({
            where: {
              id: twoFactorConfirmation.id,
            },
          });

          
        }

        return true;
      } catch (error) {
        console.error("Error during signIn:", error);
        return false;
      }
    },
    async session({ session, token }) {
      console.log({sessionToken: token});
      if(token.sub && session.user){
        session.user.id = token.sub
      }

      if(token.role && session.user){
        session.user.role = token.role as UserRole
      }
      return session;
    },
    async jwt({ token }) {
      if(!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if(!existingUser) return token;

      token.role = existingUser.role;
      return token;
    }
  },
adapter: PrismaAdapter(db),
session: {strategy: "jwt"},
 ...authConfig,
});


