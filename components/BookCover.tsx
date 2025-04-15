import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import BookCoverSvg from "./BookCoverSvg";

// Create a type alias to define the Cover Size.
type BookCoverVariant = "extraSmall" | "small" | "medium" | "regular" | "wide";

// An Object that stores CSS classes based on size variants.
const variantStyles: Record<BookCoverVariant, string> = {
    extraSmall: "book-cover_extra_small",
    small: "book-cover_small",
    medium: "book-cover_medium",
    regular: "book-cover_regular",
    wide: "book-cover_wide",
};

// Define data type props
interface Props {
    className?: string;
    variant?: BookCoverVariant;
    coverColor: string;
    coverImage: string;
}

const BookCover = ({
    className,
    variant = "regular",
    coverColor = "#012B48",
    coverImage = "https://placehold.co/400x600.png",
}: Props) => {
    return (
        <div
            className={cn(
                "relative transition-all duration-300",
                variantStyles[variant],
                className
            )}
        >
            <BookCoverSvg coverColor={coverColor} />
            <div
                className="absolute z-10"
                style={{
                    left: "11.6%",
                    width: "87.5%", // Reduced from 87.5%
                    height: "87.5%", // Adjusted from 88%
                }}
            >
                <Image
                    src={coverImage}
                    alt="book cover"
                    fill
                    className="object-fill"
                    style={{
                        borderRadius: "0 0.5rem 0.5rem 0", // equivalent to rounded-r-lg
                    }}
                />
            </div>
        </div>
    );
};

export default BookCover;
