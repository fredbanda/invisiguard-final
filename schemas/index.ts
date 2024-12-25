import { newPassword } from "@/actions/new-password";
import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({message: "Apologies, but an email is required to proceed"}),
    password: z.string().min(1, { message: "Apologies, but a password is required to proceed" }),
    twoFactorCode: z.optional(z.string())
});

export const RegisterSchema = z.object({
    name: z.string().min(1, {message: "Name is required"}),
    phone: z.string().min(10, {message: "Phone number is required"}),
    email: z.string().email({message: "Apologies, but an email is required to proceed"}),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

export const ResetPasswordSchema = z.object({
    email: z.string().email({message: "Please enter a valid email to reset your password"}),
});
export const NewPasswordSchema = z.object({
    password: z.string().min(6, {message: "Minimum password length is 6 and is required"}),
});

export const SettingsSchema = z.object({
    name: z.optional(z.string().min(1, {message: "Name is required"})),
    phone: z.string().min(10, {message: "Phone number is required"}),
    company: z.string().min(1, {message: "Company is required"}),
    address: z.string().min(1, {message: "Address is required"}),
    street: z.string().min(1, {message: "Street is required"}),
    city: z.string().min(1, {message: "City is required"}),
    province: z.string().min(1, {message: "Province is required"}),
    country: z.string().min(1, {message: "Country is required"}),
    postcode: z.string().min(1, {message: "Postcode is required"}),
    email: z.optional(z.string().email({message: "Apologies, but an email is required to proceed"})),
    role:z.enum([UserRole.ADMIN, UserRole.USER]),
    password: z.optional(z.string().min(6, {message: "Password must be at least 6 characters long"})),
    newPassword: z.optional(z.string().min(6, {message: "Password must be at least 6 characters long"})),
    isTwoFactorEnabled: z.optional(z.boolean())
})
.refine((data) => {
    if (data.password && !data.newPassword) {
        return false;
    }

    return true;
}, {
    message: "New Password must be provided",
    path: ["newPassword"]
})
.refine((data) => {
if (data.newPassword && !data.password ) {
        return false;
    }
    return true;
}, {
    message: "Password must be provided",
    path: ["password"]
})