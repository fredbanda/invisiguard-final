"use server";

import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/data/verification-token";
import { getUserByEmail } from "@/data/user";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Sorry but this token is invalid." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
        return { error: "Sorry but this token has expired." };
    }

    const existingUser = await getUserByEmail(existingToken.email);

    if (!existingUser) {
        return { error: "Sorry but this email is invalid." };
    }

    existingUser.emailVerified = new Date();

    await db.user.update({
        where: {
            id: existingUser.id,
        },
        data: {
            //emailVerified: existingUser.emailVerified,
            emailVerified: new Date(),
            email: existingToken.email,
        },
    });

    await db.verificationToken.delete({
        where: {
            id: existingToken.id,
        },
    });

    return { success: "Your email has been verified successfully." };
}