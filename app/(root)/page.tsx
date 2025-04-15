import Image from "next/image";
import styles from "./page.module.css";
import { Button } from "@/components/ui/button";
import BookList from "@/components/BookList";
import BookOverview from "@/components/BookOverview";

const Home = () => {
    return (
        <>
            <BookOverview />
            <BookList />
        </>
    );
};

export default Home;
