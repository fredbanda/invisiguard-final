"use server";

import { signIn } from "@/auth";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { AuthError } from "next-auth";
import { z } from "zod";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email or password" };
  }
  
  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email || !existingUser.password){
    return { error: "Invalid email or password" };
  }

  if(!existingUser.emailVerified){
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(existingUser.email, verificationToken.token);

    return {success: "Please check your email for verification link."}
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
    return { success: "You have successfully logged in" };

  } catch (error) {
    if (error instanceof AuthError){
      switch(error.type){
        case "CredentialsSignin":
          return { error: "Invalid email or password" };
        case "AccessDenied":
            return { error: "You are not allowed to sign in with this account" };
        default:
          return { error: "Something went wrong. Please try again later." };
      }
    }
    throw error;
  }
};
