import * as z from "zod";

export const loginSchema = z.object({
    email: z.string().email({message: "Apologies, but an email is required to proceed"}),
    password: z.string().min(1, { message: "Apologies, but a password is required to proceed" })
});