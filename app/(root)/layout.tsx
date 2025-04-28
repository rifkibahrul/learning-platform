import React, { ReactNode } from "react";
import Header from "@/components/Header";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { eq } from "drizzle-orm";

const Layout = async ({ children }: { children: ReactNode }) => {
    // Check if there is no active session then redirect to dashboard
    const session = await auth();
    if (!session) redirect("/sign-in");

    // Logic for update user last activity
    after(async () => {
        // if the user doesnt have an ID in the session, just exit
        if (!session?.user?.id) return;

        // get the current user and see if the last activity date is today
        const user = await db
            .select()
            .from(users)
            .where(eq(users.id, session?.user?.id))
            .limit(1);
        
        // if the last activity date is today, there's no need to update it again
        if(user[0].lastActivityDate === new Date().toISOString().slice(0, 10)) return;

        // if the last activity date is not today, update it
        await db
            .update(users)
            .set({ lastActivityDate: new Date().toISOString().slice(0, 10) })
            .where(eq(users.id, session?.user?.id));
    });

    return (
        <main className="root-container">
            <div className="mx-auto max-w-7xl">
                <Header session={session} />
                <div className="mt-20 pb-20">{children}</div>
            </div>
        </main>
    );
};

export default Layout;
