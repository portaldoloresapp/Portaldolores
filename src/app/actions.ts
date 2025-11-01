"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";

const consultationSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  message: z.string().max(500, { message: "Message must be 500 characters or less." }).optional(),
});

export type ConsultationState = {
  errors?: {
    name?: string[];
    company?:string[];
    email?: string[];
    message?: string[];
  };
  message?: string | null;
  success: boolean;
};

export async function requestConsultation(
  prevState: ConsultationState,
  formData: FormData
): Promise<ConsultationState> {
  const validatedFields = consultationSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    message: formData.get("message"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Validation failed. Please check your input and try again.",
      success: false,
    };
  }

  // Here you would typically save the data to a SQL database.
  // For this example, we'll just log it to the console to simulate a backend operation.
  console.log("New Consultation Request:", validatedFields.data);

  revalidatePath("/");

  return {
    message: "Thank you! Your consultation request has been submitted successfully. We will be in touch shortly.",
    success: true,
  };
}
