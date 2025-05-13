import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ModNav from "@/components/basic/mod-nav";
import toast from "react-hot-toast";
import { setCookie } from "nookies";

const ModLogin = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/auth/admin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
            }),
        }).then((res) => res.json());
        if (res.success) {
            setCookie(null, "admin", "true", {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            setCookie(null, "adminPassword", password, {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            toast.success(res.message);
            setLoading(false);
            router.push("/mod");
        } else {
            toast.error(res.message);
            setLoading(false);
        }
    };

    return (
        <>
            <div className="container mx-auto my-5 space-y-4">
                <ModNav />

                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col">
                            <label>Password</label>
                            <input
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 py-2 px-4 rounded-md"
                                required
                            />
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="bg-secondary text-white py-2 px-7 rounded-md"
                            >
                                {loading ? "checking..." : "Log In"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default ModLogin;
