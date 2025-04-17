import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";

const ibmPlexSans = localFont({
    src: [
        {
            path: "/fonts/IBMPlexSans-Regular.ttf",
            weight: "400",
            style: "normal",
        },
        {
            path: "/fonts/IBMPlexSans-Medium.ttf",
            weight: "500",
            style: "normal",
        },
        {
            path: "/fonts/IBMPlexSans-Semibold.ttf",
            weight: "600",
            style: "normal",
        },
        {
            path: "/fonts/IBMPlexSans-Bold.ttf",
            weight: "700",
            style: "normal",
        },
    ],
});

const bebasNeue = localFont({
    src: [
        {
            path: "/fonts/BebasNeue-Regular.ttf",
            weight: "400",
            style: "normal",
        },
    ],
    variable: "--bebas-neue",
});

export const metadata: Metadata = {
    title: "BookHub",
    description:
        "BookHub is a streamlined digital platform for managing your school library’s book borrowings.",
};

const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="en">
            <body
                className={`${ibmPlexSans.className} ${bebasNeue.variable} antialiased`}
            >
                {children}

                <Toaster />
            </body>
        </html>
    );
};

export default RootLayout;
