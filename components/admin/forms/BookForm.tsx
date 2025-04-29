"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { bookSchema } from "@/lib/validations";
import FileUpload from "@/components/FileUpload";
import ColorPicker from "../ColorPicker";
import { createBook } from "@/lib/admin/actions/book";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Generic props for dynamic form types
interface Props extends Partial<Book> {
    type?: "create" | "update";
}

const BookForm = ({ type, ...book }: Props) => {

    const router = useRouter();

    const form = useForm<z.infer<typeof bookSchema>>({
        resolver: zodResolver(bookSchema),
        defaultValues: {
            title: "",
            description: "",
            author: "",
            genre: "",
            rating: 1,
            totalCopies: 1,
            coverUrl: "",
            coverColor: "",
            videoUrl: "",
            summary: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof bookSchema>) => {
        // console.log(values);
        const result = await createBook(values);

        if (result.success) {
            toast({
                title: "Success",
                description: "Book created successfully",
            });
            router.push(`/admin/books/${result.data.id}`);
        } else {
            toast({
                title: "Error",
                description: result.message,
                variant: "destructive"
            })
        }
    };

    return (
        <>
            {/* Shadcn Form wrapper */}
            <Form {...form}>
                <form
                    // Use internal handler to trigger toast + redirect
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    {/* Title */}
                    <FormField
                        control={form.control}
                        name={"title"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Book Title
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Enter the book title"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Author */}
                    <FormField
                        control={form.control}
                        name={"author"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Author
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Enter the author name"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Genre */}
                    <FormField
                        control={form.control}
                        name={"genre"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Genre
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        required
                                        placeholder="Enter the genre of the book"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Rating */}
                    <FormField
                        control={form.control}
                        name={"rating"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Book Rating
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={5}
                                        placeholder="Book rating"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Total Copies */}
                    <FormField
                        control={form.control}
                        name={"totalCopies"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Total Copies
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min={1}
                                        max={10000}
                                        placeholder="Total copies"
                                        {...field}
                                        className="book-form_input"
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Upload Image */}
                    <FormField
                        control={form.control}
                        name={"coverUrl"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Book Image
                                </FormLabel>
                                <FormControl>
                                    <FileUpload
                                        type="image"
                                        accept="image/*"
                                        placeholder="Upload a book cover"
                                        folder="books/covers"
                                        variant="light"
                                        onFileChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Color picker */}
                    <FormField
                        control={form.control}
                        name={"coverColor"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Primary Color
                                </FormLabel>
                                <FormControl>
                                    <ColorPicker
                                        value={field.value}
                                        onPickerChange={field.onChange}
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Video upload */}
                    <FormField
                        control={form.control}
                        name={"videoUrl"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Book Trailer
                                </FormLabel>
                                <FormControl>
                                    <FileUpload
                                        type="video"
                                        accept="video/*"
                                        placeholder="Upload a book trailer"
                                        folder="books/videos"
                                        variant="light"
                                        onFileChange={field.onChange}
                                        value={field.value}
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Description */}
                    <FormField
                        control={form.control}
                        name={"description"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Book Description
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter a book description"
                                        {...field}
                                        className="book-form_input"
                                        rows={10}
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Summary */}
                    <FormField
                        control={form.control}
                        name={"summary"}
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-1">
                                <FormLabel className="text-base font-normal text-dark-500">
                                    Book Summary
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Enter a book summary"
                                        {...field}
                                        className="book-form_input"
                                        rows={5}
                                    />
                                </FormControl>

                                {/* Display validation errors */}
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="book-form_btn text-white">
                        Add Book to Library
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default BookForm;
