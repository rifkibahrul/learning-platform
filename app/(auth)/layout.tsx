import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {

    // Check if there is an active session then redirect to dashboard
    const session = await auth();
    if (session) redirect("/");

    return (
        <main className="auth-container">
            {/* Form */}
            <section className="auth-form">
                <div className="auth-box">
                    <div className="flex flex-row gap-3">
                        <Image
                            src="/icons/logo.svg"
                            alt="logo"
                            width={37}
                            height={37}
                        />

                        <h1 className="text-2xl font-semibold text-white">
                            BookHub
                        </h1>
                    </div>

                    {/* Renders page from folder sign-in/sign-up */}
                    <div className="">{children}</div>
                </div>
            </section>

            <section className="auth-illustration">
                <Image
                    src="/images/auth-illustration.png"
                    alt="illustration"
                    height={1000}
                    width={1000}
                    className="size-full object-cover"
                />
            </section>
        </main>
    );
};

export default Layout;
