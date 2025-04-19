import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";
import { db } from "@/database/drizzle";
import { users } from "@/database/schema";

const Home = async () => {
    // const result = await db.select().from(users);

    // console.log(JSON.stringify(result, null, 2));

    return (
        <>
            {/* Render all properties of the first book using the spread operator (...) */}
            <BookOverview {...sampleBooks[0]} />

            <BookList
                title="Latest books"
                books={sampleBooks}
                containerClassName="mt-28"
            />
        </>
    );
};

export default Home;
