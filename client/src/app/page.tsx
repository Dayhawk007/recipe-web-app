'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Home() {
    const router = useRouter();

    const handleButtonClick = () => {
        const token = Cookies.get("token");
        if (token) {
            router.push("/recipe-maker"); // Redirect to recipe maker if token exists
        } else {
            router.push("/login"); // Redirect to login page if token does not exist
        }
    };

    return (
        <main className="flex h-screen z-10 flex-col md:items-start items-center justify-between md:px-32 md:pt-40 md:pb-32 px-10 py-20 bg-off-white relative overflow-hidden text-black">
            <Image src={"/images/home-bg.png"} className="absolute top-0 hidden -z-10 md:block left-[47%] overflow-hidden" alt="Home Background Image" width={820} height={900} />
            <div className="flex flex-col md:space-y-8 space-y-16 w-full md:items-start items-center">
                <h2 className="text-5xl font-medium">Meal<span className="text-secondary">Gen</span></h2>
                <p className="text-base md:w-1/3 w-full">Discover a world of culinary possibilities with MealGen Input your pantry ingredients and unlock curated dishes. Effortlessly elevate your cooking game with personalized recipes. Say goodbye to meal planning stress and hello to culinary creativity. Start exploring now!</p>
            </div>
            <button onClick={handleButtonClick} style={{
                boxShadow:"0 4px 50px rgba(0, 0, 0, 0.30)"
            }} className="md:w-1/3 w-full py-5 flex flex-row justify-center font-medium bg-primary text-white rounded-2xl">Let's Get Started
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                <path fill="white" d="M9.29 6.71a.996.996 0 0 0 0 1.41L13.17 12l-3.88 3.88a.996.996 0 1 0 1.41 1.41l4.59-4.59a.996.996 0 0 0 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01z"/>
            </svg>
            </button>
        </main>
    );
}
