// server action for registering a new user
"use server";

import { RegisterSchema } from "@/schemas";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { Prisma } from "@prisma/client";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid email or password." };
  }

  const { name, email, password, phone } = validatedFields.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return { error: "Sorry, but this email is already registered." };
    }

    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });

    // TODO: Send verification email

    return { success: "User registered successfully!" };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return { error: "Sorry, but this email is already registered." };
      }
    }
    console.error("Unexpected Error in Register Action:", error);
    return { error: "Something went wrong. Please try again later." };
  }
};
