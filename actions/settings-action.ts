"use server";

import type * as z from "zod";
import type { SettingsSchema } from "@/schemas";
import { db } from "@/lib/db";
import { getUserByEmail, getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { sendVerificationEmail } from "@/lib/mail";
import { generateVerificationToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";

export const settingsAction = async (values: z.infer<typeof SettingsSchema>) => {
    const user = await currentUser();

    if(!user) {
        return {error: " Unauthorized user"};
    }

   const dbUser = await getUserById(user.id);
    if(!dbUser){
        return {error: "User not authorized"};
    }

    if(user.isOAuth){
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        values.isTwoFactorEnabled = undefined as any;
    }

    if(values.email && values.email !== user.email){
        const existingUser = await getUserByEmail(values.email);

        if(existingUser && existingUser.id !== user.id){
            return {error: "Sorry this email is already in use"};
        }

        const verificationToken = await generateVerificationToken(values.email);

        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return {success: "Verification email sent"};
    }

    if(values.password && values.newPassword && dbUser.password){
        const isPasswordMatch = await bcrypt.compare(values.password, dbUser.password);
        if(!isPasswordMatch){
            return {error: "Sorry, the password you entered is incorrect"};
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10);
        
        values.password = hashedPassword;
        values.newPassword = undefined;
    }

    await db.user.update({
        where: {id: user.id},
        data: {
            ...values
        }
    });

    return {success: "Settings updated successfully"};
}