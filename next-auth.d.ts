import { UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  phone?: string;
  address?: string;
  street: string;
  city: string;
  province: string;
  country: string;
  postcode: string;
  isTwoFactorEnabled?: boolean;
  isOAuth: boolean;
  company: string;
  password?: hashedPassword;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

import { JWT } from "next-authjwt";

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole;
    phone?: string;
    address?: string;
    street: string;
    city: string;
    province: string;
    country: string;
    postcode: string;
    company: string;
    password?: hashedPassword;
    isTwoFactorEnabled?: boolean;
  }
}
