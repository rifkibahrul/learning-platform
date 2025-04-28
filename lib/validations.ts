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

// Define validaiton for books  schema
export const bookSchema = z.object({
    title: z.string().trim().min(2).max(100),
    description: z.string().trim().min(2).max(1000),
    author: z.string().trim().min(2).max(100),
    genre: z.string().trim().min(2).max(100),
    rating: z.number().min(1).max(5),
    totalCopies: z.coerce.number().positive().int().lte(10000),
    coverUrl: z.string().nonempty(),
    coverColor: z.string().trim().regex(/^#([A-Fa-f0-9]{6})$/),
    videoUrl: z.string().nonempty(),
    summary: z.string().trim().min(10),
})