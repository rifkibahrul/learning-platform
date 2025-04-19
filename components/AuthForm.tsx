"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    DefaultValues,
    FieldValues,
    Path,
    SubmitHandler,
    useForm,
    UseFormReturn,
} from "react-hook-form";
import { ZodType } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FIELD_NAMES, FIELD_TYPES } from "@/constants";
import ImageUpload from "./ImageUpload";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Generic props for dynamic form types
interface Props<FormData extends FieldValues> {
    schema: ZodType<FormData>;
    defaultValues: FormData;
    onSubmit: (data: FormData) => Promise<{ success: boolean; error?: string }>;
    type: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <FormData extends FieldValues>({
    type,
    schema,
    defaultValues,
    onSubmit,
}: Props<FormData>) => {
    const router = useRouter();

    // Cek signin or signup
    const isSignin = type === "SIGN_IN"; // Toogle for different labels and form

    // State to track password visibility
    const [showPassword, setShowPassword] = useState(false);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // Define default value react-hook-form with Zod validation
    const form: UseFormReturn<FormData> = useForm({
        resolver: zodResolver(schema),
        defaultValues: defaultValues as DefaultValues<FormData>,
    });

    // Form submission handler
    const handleSubmit: SubmitHandler<FormData> = async (data) => {
        const result = await onSubmit(data);    // 🔁 Calls the `signUp()` function passed as a prop

        if (result.success) {
            toast({
                title: "Success",
                description: isSignin
                    ? "You have successfully signed in."
                    : "You have successfully signed up.",
            });
            router.push("/");
        } else {
            toast({
                title: "Error",
                description: result.error ?? "An error occurred",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Check form Signup or Sigin text */}
            <h1 className="text-2xl font-semibold text-white">
                {isSignin ? "Welcome back to BookHub" : "Create account"}
            </h1>
            <p className="text-light-100">
                {isSignin
                    ? "Access the book collection, and stay updated"
                    : "Please complete all fields and upload a valid student ID to gain access to the library"}
            </p>

            {/* Shadcn Form wrapper */}
            <Form {...form}>
                <form
                    // Use internal handler to trigger toast + redirect 
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6 w-full"
                >
                    {Object.keys(defaultValues).map((field) => (
                        <FormField
                            key={field}
                            control={form.control}
                            name={field as Path<FormData>}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">
                                        {
                                            FIELD_NAMES[
                                                field.name as keyof typeof FIELD_NAMES
                                            ]
                                        }
                                    </FormLabel>
                                    <FormControl>
                                        {/* Check input type for text or image */}
                                        {field.name === "studentCard" ? (
                                            <ImageUpload
                                                onFileChange={field.onChange}
                                            />
                                        ) : field.name === "password" ? (
                                            <div className="relative">
                                                {/* Toogle show and hidden password */}
                                                <Input
                                                    required
                                                    type={
                                                        showPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    {...field}
                                                    className="form-input pr-10"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={
                                                        togglePasswordVisibility
                                                    }
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-5 w-5" />
                                                    ) : (
                                                        <Eye className="h-5 w-5" />
                                                    )}
                                                    <span className="sr-only">
                                                        {showPassword
                                                            ? "Hide password"
                                                            : "Show password"}
                                                    </span>
                                                </button>
                                            </div>
                                        ) : (
                                            <Input
                                                required
                                                type={
                                                    FIELD_TYPES[
                                                        field.name as keyof typeof FIELD_TYPES
                                                    ]
                                                }
                                                {...field}
                                                className="form-input"
                                            />
                                        )}
                                    </FormControl>

                                    {/* Display validation errors */}
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button type="submit" className="form-btn">
                        {isSignin ? "Sign In" : "Sign Up"}
                    </Button>
                </form>
            </Form>

            {/* Toogle beetwen sign-in/sign-up links */}
            <p className="text-center text-base font-medium">
                {isSignin ? "New to BookHub?" : "Already have an account?"}

                <Link
                    href={isSignin ? "/sign-up" : "/sign-in"}
                    className="text-primary font-bold ml-2"
                >
                    {isSignin ? "Create an account" : "Sign in"}
                </Link>
            </p>
        </div>
    );
};

export default AuthForm;
