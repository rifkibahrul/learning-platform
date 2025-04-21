import React from "react";

const page = () => {
    return (
        <main className="root-container flex min-h-screen flex-col items-center justify-center">
            <h1 className="text-light-100 text-5xl font-bold font-bebas-neue">
                Too many requests, wait a few minutes!
            </h1>
            <p className="mt-4 text-center text-light-400 max-w-xl">
                Looks like you&apos;ve made too many requests in a short period
                of time. We&apos;ve put a limit on the number of requests you
                can make. 🚦 Chill for a bit, and try again buddy!
            </p>
        </main>
    );
};

export default page;
