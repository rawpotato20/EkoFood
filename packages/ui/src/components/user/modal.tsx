import { trackEventFunction } from "@/utils/general";
import { setCookie } from "nookies";
import toast from "react-hot-toast";
const { useRouter } = require("next/navigation");
const { useState } = require("react");
import { RiCloseCircleLine } from "react-icons/ri";

const Modal = (props) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        }).then((res) => res.json());
        if (res.success) {
            trackEventFunction("Login Form Submited");
            setCookie(null, "user", JSON.stringify(res.data), {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            toast.success(res.message);
            setLoading(false);
            router.push("/dashboard");
        } else {
            setLoading(false);
            toast.error(res.message);
        }
    };

    return (
        <>
            <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center">
                <div className="w-1/2 bg-white rounded-lg p-5 flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                        <h1 className="text-lg">Prisijungti</h1>
                        <button
                            onClick={() => props.handleClose(2, false)}
                            className="text-2xl font-bold"
                            data-umami-event="Close Modal Button Clicked"
                        >
                            <RiCloseCircleLine />
                        </button>
                    </div>
                    <div className="mt-10">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="flex flex-col">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                    required
                                />
                            </div>
                            <div className="flex flex-col">
                                <label>Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                    required
                                />
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="submit"
                                    className="w-full bg-primary rounded-lg py-2 text-white"
                                data-umami-event="Login Button Clicked"
                                >
                                    {loading ? "Įkeliama..." : "Login"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;
