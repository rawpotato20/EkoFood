import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "nookies";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Cancel = () => {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <>
            <div className="min-h-screen container mx-auto flex flex-col justify-center items-center">
                <h1>Payment Method Not Saved</h1>
                <br />
                <br />
                <Link
                    href="/dashboard"
                    className="bg-primary text-white py-2 px-10 rounded-lg"
                >
                    Grįžti į pagrindinį puslapį
                </Link>
            </div>
        </>
    );
};

export default Cancel;
