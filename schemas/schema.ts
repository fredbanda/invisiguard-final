import { z } from "zod"

export const businessFormSchema = z.object({
  // Company Information
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  website: z.string().url("Please enter a valid website URL"),
  industry: z.string().min(2, "Please select an industry"),

  // Contact Person
  contactName: z.string().min(2, "Contact name must be at least 2 characters"),
  role: z.string().min(2, "Please enter your role"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),

  // Business Details
  country: z.string().min(2, "Please select your country"),
  companySize: z.enum(["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"]),
  annualRevenue: z.enum(["<1M", "1M-10M", "10M-50M", "50M-100M", ">100M"]),

  // Project Details
  serviceDescription: z.string().min(10, "Please provide more details about your project"),
  timeline: z.string().min(2, "Please select your timeline"),
  budget: z.string().min(2, "Please select your budget range"),

  // Meeting Preference
  preferredTime: z.array(z.string()).min(1, "Please select at least one preferred time"),
  timezone: z.string().min(2, "Please select your timezone"),
  additionalNotes: z.string().optional(),
})

export type BusinessFormData = z.infer<typeof businessFormSchema>

