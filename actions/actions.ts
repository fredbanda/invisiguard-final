"use server"

import { businessFormSchema } from "../schemas/schema"
import { db } from "@/lib/db"

type SubmitBusinessFormState = {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export async function submitBusinessForm(
  prevState: SubmitBusinessFormState,
  formData: FormData
): Promise<SubmitBusinessFormState> {
  const validatedFields = businessFormSchema.safeParse({
    companyName: formData.get("companyName"),
    website: formData.get("website"),
    industry: formData.get("industry"),
    contactName: formData.get("contactName"),
    role: formData.get("role"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    country: formData.get("country"),
    companySize: formData.get("companySize"),
    annualRevenue: formData.get("annualRevenue"),
    serviceDescription: formData.get("projectDescription"),
    timeline: formData.get("timeline"),
    budget: formData.get("budget"),
    preferredTime: formData.getAll("preferredTime"),
    timezone: formData.get("timezone"),
    additionalNotes: formData.get("additionalNotes"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Missing or invalid fields. Please check your input.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await db.prospectedClient.create({
      data: validatedFields.data, // Use the validated schema data
    })

    return {
      success: true,
      message: "Thank you for your submission. We will contact you shortly.",
    }
  } catch (error) {
    console.error("Database Error:", error)
    return {
      success: false,
      message: "An error occurred while submitting the form. Please try again.",
    }
  }
}
