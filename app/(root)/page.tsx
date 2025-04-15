import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";
import { sampleBooks } from "@/constants";

const Home = () => {
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
