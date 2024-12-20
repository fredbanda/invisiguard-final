"use server";

import { signIn } from "@/auth";
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

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    })
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
