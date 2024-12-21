import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({message: "Apologies, but an email is required to proceed"}),
    password: z.string().min(1, { message: "Apologies, but a password is required to proceed" })
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