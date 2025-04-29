import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import BookForm from "@/components/admin/forms/BookForm";
import { ArrowLeft } from "lucide-react";

const page = () => {
    return (
        <>
            <Button asChild className="back-btn">
                <Link href="/admin/books">
                    <ArrowLeft /> Go Back
                </Link>
            </Button>

            <section className="w-full max-w-2xl">
                <BookForm />
            </section>
        </>
    );
};

export default page;
