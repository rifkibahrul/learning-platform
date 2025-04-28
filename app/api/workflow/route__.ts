import { db } from "@/database/drizzle";
import { users } from "@/database/schema";
import { serve } from "@upstash/workflow/nextjs";
import { eq } from "drizzle-orm";

type UserState = "non-active" | "active";

type InitialData = {
    email: string;
    fullName: string;
};

const ONE_DAY_IN_MS = 24 * 60 * 60 * 1000; // H * M * S * MS
const THREE_DAY_IN_MS = 3 * ONE_DAY_IN_MS;
const THIRTY_DAY_IN_MS = 30 * ONE_DAY_IN_MS;

// Check last activity state & derive if a user is active or not during that period in time
const getUserState = async (email: string): Promise<UserState> => {
    const user = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

    if (user.length === 0) return "non-active";

    const lastActivityDate = new Date(user[0].lastActivityDate!);
    const now = new Date();

    const timeDifference = now.getTime() - lastActivityDate.getTime();

    if (
        timeDifference > THREE_DAY_IN_MS &&
        timeDifference <= THIRTY_DAY_IN_MS
    ) {
        return "non-active";
    }
    return "active";
};

export const { POST } = serve<InitialData>(async (context) => {
    const { email, fullName } = context.requestPayload;

    // Welcome email
    await context.run("new-signup", async () => {
        // await sendEmail("Welcome to the platform", email);
        await sendEmail({
            email,
            subject: "Welcome to the platform",
            message: `Welcome ${fullName}! to the platform`,
        })
    });

    await context.sleep("wait-for-3-days", 60 * 60 * 24 * 3);

    while (true) {
        const state = await context.run("check-user-state", async () => {
            return await getUserState();
        });

        if (state === "non-active") {
            await context.run("send-email-non-active", async () => {
                await sendEmail("Email to non-active users", email);
            });
        } else if (state === "active") {
            await context.run("send-email-active", async () => {
                await sendEmail("Send newsletter to active users", email);
            });
        }

        await context.sleep("wait-for-1-month", 60 * 60 * 24 * 30);
    }
});

async function sendEmail(message: string, email: string) {
    // Implement email sending logic here
    console.log(`Sending ${message} email to ${email}`);
}