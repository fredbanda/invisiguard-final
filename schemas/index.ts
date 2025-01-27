import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
    email: z.string().email({message: "Apologies, but an email is required to proceed"}),
    password: z.string().min(1, { message: "Apologies, but a password is required to proceed" }),
    twoFactorCode: z.optional(z.string())
});

export const ScanSchema = z.object({
    userId: z.string(),
    emails: z.array(z.string().email()).optional(),
    phones: z.array(z.string()).optional(),
    domains: z.array(z.string()).optional(),
  });

  export const createPenTestReportSchema = z.object({
    targetUrl: z.string().url({ message: "Invalid URL" }),
    userId: z.string().cuid({ message: "Invalid user ID" }),
    scanId: z.string().nonempty({ message: "Scan ID is required" }),
    status: z.string().nonempty({ message: "Status is required" }),
  });
  
export const updatePenTestReportSchema = z.object({
    status: z.string().optional(),
    results: z.any().optional(),
  });

export const RegisterSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    phone: z.string().optional(),
  });

export const ResetPasswordSchema = z.object({
    email: z.string().email({message: "Please enter a valid email to reset your password"}),
});
export const NewPasswordSchema = z.object({
    password: z.string().min(6, {message: "Minimum password length is 6 and is required"}),
});

export const SettingsSchema = z
  .object({
    name: z.optional(z.string().min(1, { message: "Name is required" })),
    phone: z.string().min(10, { message: "Phone number is required" }),
    company: z.string().min(1, { message: "Company is required" }),
    address: z.string().min(1, { message: "Address is required" }),
    street: z.string().min(1, { message: "Street is required" }),
    city: z.string().min(1, { message: "City is required" }),
    province: z.string().min(1, { message: "Province is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    postcode: z.string().min(1, { message: "Postcode is required" }),
    email: z.optional(z.string().email({ message: "A valid email is required" })),
    role: z.enum([UserRole.ADMIN, UserRole.USER]),
    password: z.optional(z.string().min(6, { message: "Password must be at least 6 characters long" })),
    newPassword: z.optional(z.string().min(6, { message: "New Password must be at least 6 characters long" })),
    isTwoFactorEnabled: z.optional(z.boolean()),
  })
  .refine(
    (data) => {
      if (data.password || data.newPassword) {
        return data.password && data.newPassword;
      }
      return true;
    },
    {
      message: "Both current and new passwords are required to update the password.",
      path: ["newPassword"], // Path for error placement
    }
  );

