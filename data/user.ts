import { db } from "@/lib/db";

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string | null | undefined) => {
  if (!id) {
    throw new Error("User ID is required");
  }

  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
};
