"use client";

import { sessionDeauth } from "@app/lib/serverActions/authentication";
import Button from "@app/lib/components/Button";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();
    const handleClick = async () => {
        await sessionDeauth();
        router.push("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl font-extrabold">Home Page</h1>
            <Button onClick={handleClick}>Log out</Button>
        </div>
    );
}
