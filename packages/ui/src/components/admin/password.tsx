import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Password = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/admin/password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password,
                new_password: newPassword,
            }),
        }).then((res) => res.json());
        if (res.success) {
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
            <div className="container mx-auto bg-slate-200 p-5 rounded-xl mt-5 space-y-5">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="password" className="font-medium">
                            Current Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="rounded-md p-2"
                        />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="new-password" className="font-medium">
                            New Password
                        </label>
                        <input
                            type="password"
                            id="new-password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="rounded-md p-2"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-primary text-white rounded-md py-2 px-4 md:px-7"
                    >
                        {loading ? "Įkeliama..." : "atnaujinti"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default Password;
