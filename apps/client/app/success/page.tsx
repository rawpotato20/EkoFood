import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { setCookie } from "nookies";
import { useEffect } from "react";
import toast from "react-hot-toast";

const Success = () => {
    const router = useRouter();
    const pathname = usePathname();
    const params = useSearchParams();

    const sessionID = params.get("session_id");

    const fetchSession = async (sessionID) => {
        const res = await fetch(
            `/api/user/stripe/checkout-session?session_id=${sessionID}`
        );
        const data = await res.json();
        if (data.success) {
            setCookie(null, "user", JSON.stringify(data.data), {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            toast.success("Mokėjimo būdas sėkmingai išsaugotas");
        } else {
            toast.error("Nepavyko išsaugoti mokėjimo metodo");
        }
    };

    useEffect(() => {
        if (sessionID) {
            fetchSession(sessionID);
        }
    }, [sessionID]);

    return (
        <>
            <div className="min-h-screen container mx-auto flex flex-col justify-center items-center">
                <h1>Mokėjimo būdas sėkmingai išsaugotas</h1>
                <br />
                <br />
                <Link href="/dashboard" className="bg-primary text-white py-2 px-10 rounded-lg">Grįžti į pagrindinį puslapį</Link>
            </div>
        </>
    );
};

export default Success;
