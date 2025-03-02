"use server";

import { signIn } from "@/auth";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/lib/mail";
import { generateTwoFactorToken, generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import type * as z from "zod";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string | null) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email or password" };
  }
  
  const { email, password, twoFactorCode } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email || !existingUser.password){
    return { error: "Invalid email or password" };
  }

  if(!existingUser.emailVerified){
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(existingUser.email, verificationToken.token);

    return {success: "Please check your email for verification link."}
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {

    if(twoFactorCode){
      // verify 2FA code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if(!twoFactorToken) return {error: "Invalid 2FA code"};

      if(twoFactorToken.token !== twoFactorCode) {
        return {error: "Invalid 2FA code"};
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if(hasExpired){
        return {error: "2FA code has expired. Please request a new code."};
      }
      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if(existingConfirmation){
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    
    }else{
    const twoFactorToken = await generateTwoFactorToken(existingUser.email);

    await sendTwoFactorTokenEmail(existingUser.email, twoFactorToken.token);

    return {twoFactor: true}
    }

  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
    return { success: "You have successfully logged in" };

  } catch (error) {
    if (error instanceof AuthError){
      switch(error.type){
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        case "AccessDenied":
            return { error: "Account access has been denied " };
        default:
          return { error: "Something went wrong. Please try again later." };
      }
    }
    throw error;
  }
};
