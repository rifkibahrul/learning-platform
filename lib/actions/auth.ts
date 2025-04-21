"use server";

import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";
import { headers } from "next/headers";
import ratelimit from "../ratelimit";
import { redirect } from "next/navigation";

// Pick is used to select only the email and password params from AuthCredentials
export const signInWithCredentials = async (
    params: Pick<AuthCredentials, "email" | "password">
) => {
    const { email, password } = params;
    // Get current IP address
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    console.log("IP used for ratelimit:", ip);
    const { success } = await ratelimit.limit(ip);
    console.log(success);

    if (!success) return redirect("/many-requests");

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false, // Prevents auto navigation - handle manually in AuthForm
        });

        if (result?.error) {
            return { success: false, error: result.error };
        }

        return { success: true };
    } catch (error) {
        console.log(error, "Signin error");
        return { success: false, error: "Signin error" };
    }
};

export const signUp = async (params: AuthCredentials) => {
    const { fullName, email, password, studentId, studentCard } = params;

    // Get current IP address
    const ip = (await headers()).get("x-forwarded-for") || "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) return redirect("/many-requests");

    // Check if the user already exist
    const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (existingUser.length > 0) {
        return { success: false, error: "User already exist!" };
    }

    const hashedPassword = await hash(password, 10);

    try {
        // Insert new user using Drizzle ORM
        await db.insert(users).values({
            fullName,
            email,
            password: hashedPassword,
            studentCard,
            studentId,
        });

        // Immediately logs user after signup
        await signInWithCredentials({ email, password });

        return { success: true };
    } catch (error) {
        console.log(error, "Signup error");
        return { success: false, error: "Signup error" };
    }
};
