import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
// biome-ignore lint/style/useImportType: <explanation>
import { UserRole } from "@prisma/client";

import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { getAccountByUserId } from "./data/accounts";
import { getFingerprintData } from "./data/fingerprint";



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
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    async signIn({ user, account }: { user: any; account: any }) {
      try {
        // Allow OAuth accounts without email verification
        if (account?.provider !== "credentials") return true;

        // Check if the user object has an ID
        if (!user?.id) {
          console.error("User ID is missing");
          return false;
        }

        const visitorId = await getFingerprintData(user.id);
        await signIn("credentials", {
          redirect: false,
          visitorId,
          callbackUrl: "/dashboard",
        });
      
        // Fetch the user by ID
        const existingUser = await getUserById(user.id);

        //Preventing users from logging in before validating their emails
        if (!existingUser?.emailVerified) {
          console.error("User does not exist in our records");
          return false;
        }

        //2FA CHECKS
        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
            user.id
          );

          if (!twoFactorConfirmation) return false;

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
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if(!session.fingerprint){
       // biome-ignore lint/suspicious/noExplicitAny: <explanation>
       session.fingerprint = token.fingerprint as any;
      }

       // Include the full fingerprint data in the session
        if (token.fingerprint) {
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          session.fingerprint = token.fingerprint as any;
        }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      if (session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.isOAuth = token.isOAuth as boolean;
        session.user.name = token.name
        session.user.company = token.company as string;
        session.user.email = token.email as string;
        session.user.phone = token.phone as string;
        session.user.address = token.address as string;
        session.user.street = token.street as string;
        session.user.city = token.city as string;
        session.user.province = token.province as string;
        session.user.country = token.country as string;
        session.user.postcode = token.postcode as string;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        
      }

      return session;
    },
    async jwt({ token, user, account }) {
      // Only set token.sub on first login
      if (user) {
        token.sub = user.id;
      }
    
      // If visitorId is present in account, add it to token
      if (account?.visitorId) {
        token.visitorId = account.visitorId;
      }
    
      // If no user id, return token early
      if (!token.sub) return token;
    
      // Fetch existing user details
      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;
    
      // Fetch fingerprint data if visitorId is present
      if (token.visitorId) {
        const fingerprintData = await getFingerprintData(token.visitorId as string);
        if (fingerprintData) {
          token.fingerprint = {
            visitorId: fingerprintData.visitorId,
            ip: fingerprintData.ips,
            country: fingerprintData.country,
            city: fingerprintData.city,
            isp: fingerprintData.isp,
            vpnOrProxy: fingerprintData.vpnOrProxy,
            botProbability: fingerprintData.botProbability,
            confidenceScore: fingerprintData.confidenceScore,
            fraudScore: fingerprintData.fraudScore,
            browser: fingerprintData.browser,
            os: fingerprintData.os,
            device: fingerprintData.device,
            lastUpdated: fingerprintData.lastUpdated,
          };
        }
      }
    
      // Fetch account information to determine if it's an OAuth user
      const existingAccount = await getAccountByUserId(existingUser.id);
      token.isOAuth = !!existingAccount;
    
      // Add user details to token
      token.role = existingUser.role;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.phone = existingUser.phone;
      token.company = existingUser.company;
      token.address = existingUser.address;
      token.street = existingUser.street;
      token.city = existingUser.city;
      token.province = existingUser.province;
      token.country = existingUser.country;
      token.postcode = existingUser.postcode;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;
    
      return token;
    },
    
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
