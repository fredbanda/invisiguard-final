"use server";

import { ResetPasswordSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import * as z from "zod";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>) => {
    const validatedFields = ResetPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Valid email is required" };
    }

    const { email } = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser) {
        return { error: "Sorry the email you provided was not found." };
    }

    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

    return { success: "Please check your email for password reset link." }
}