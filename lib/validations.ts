import { z } from "zod";

// Define validation rules
export const signUpSchema = z.object({
    fullName: z.string().min(2),
    email: z.string().email(),
    studentId: z.coerce.number(),       // Convert string to number
    studentCard: z.string().nonempty("Student card is required"),
    password: z.string().min(6),
});

export const signInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})