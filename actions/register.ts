"use server";

import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { Prisma } from "@prisma/client";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import type * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema> | undefined) => {
  if (!values || typeof values !== "object") {
    return { error: "Invalid payload. Please provide all required fields." };
  }

  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    console.error("Validation Errors:", validatedFields.error.format());
    return { error: "Validation failed. Please check your input." };
  }

  const { name, email, password, phone } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "This email is already registered." };
    }

    await db.user.create({
      data: { name, email, password: hashedPassword, phone },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(email, verificationToken.token);

    return { success: "Confirmation email sent. Please check your inbox." };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "This email is already registered." };
      }
    }
    throw error;
  }
};
