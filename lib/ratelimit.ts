import { Ratelimit } from "@upstash/ratelimit";
import redis from "@/database/redis";

// Create a new ratelimiter, that allows 10 requests per 10 seconds
const ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "1m"),
    analytics: true,
    prefix: "@upstash/ratelimit",
});

export default ratelimit;
// Use a constant string to limit all requests with a single ratelimit
// Or use a userID, apiKey or ip address for individual limits.
// const identifier = "api";
// const { success } = await ratelimit.limit(identifier);

// if (!success) {
//     return "Unable to process at this time";
// }
// doExpensiveCalculation();
// return "Here you go!";
