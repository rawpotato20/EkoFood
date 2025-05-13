import { trackEventFunction } from "@/utils/general";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
const { useRouter } = require("next/navigation");

const ForgotPassword = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [otp, setOtp] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);
    const [loading3, setLoading3] = useState(false);

    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (!otpVerified) {
            toast.error("Patvirtinkite el. paštą");
            setLoading(false);
            return;
        }
        if (password !== password2) {
            toast.error("Slaptažodžiai nesutampa");
            setLoading(false);
            return;
        } else {
            const res = await fetch("/api/auth/password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    password,
                }),
            }).then((res) => res.json());
            if (res.success) {
                toast.success(res.message);
                trackEventFunction("Forgot Password Form Submitted");
                setLoading(false);
                destroyCookie(null, "user");
                router.push("/");
            } else {
                setLoading(false);
                toast.error(res.message);
            }
        }
    };

    const sendOTP = async () => {
        setLoading2(true);
        const res = await fetch("/api/auth/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
            }),
        }).then((res) => res.json());
        if (res.success) {
            toast.success(res.message);
            setOtpSent(true);
            setLoading2(false);
        } else {
            toast.error(res.message);
            setLoading2(false);
        }
    };

    const verifyOTP = async () => {
        setLoading3(true);
        const res = await fetch("/api/auth/verify", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                otp: parseInt(otp),
            }),
        }).then((res) => res.json());
        if (res.success) {
            trackEventFunction("Forgot Password OTP Verified");
            toast.success(res.message);
            setOtpVerified(true);
            setLoading3(false);
        } else {
            toast.error(res.message);
            setLoading3(false);
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center bg-secondary">
            <div className="relative w-11/12 md:w-2/3 bg-white rounded-3xl shadow-lg flex flex-col-reverse md:flex-row justify-between items-center">
                <div className="p-10 md:w-1/2 z-10">
                    <div className="flex flex-col justify-center items-center text-center">
                        <h1 className="text-2xl md:text-4xl font-medium text-primary">
                            Atkurkite savo slaptažodį
                        </h1>
                        {/* <h5 className="text-xs md:text-sm">
                            Pirmasis žingsnis link sveiko gyvenimo būdo
                        </h5> */}
                        {/* <button
                            onClick={() => props.handleClose(1, false)}
                            className="text-2xl font-bold"
                        >
                            <RiCloseCircleLine />
                        </button> */}
                    </div>
                    <div className="mt-10 w-full">
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4 text-sm"
                        >
                            <div className="flex flex-col justify-between space-y-2">
                                {/* <label>El. paštas</label> */}
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) =>
                                        setEmail(e.target.value)
                                    }
                                    placeholder="El. paštas"
                                    className="border border-primary rounded-lg py-2 px-4 w-full"
                                    required
                                    readOnly={otpVerified}
                                    data-umami-event="Forgot Password Email Entered"
                                />
                                <div className="w-full flex justify-end">
                                    <button
                                        type="button"
                                        onClick={sendOTP}
                                        className="font-medium text-xs bg-secondary text-white py-2 px-4 rounded-lg w-full"
                                        disabled={otpVerified}
                                   data-umami-event="Forgot Password Send OTP Clicked"
                                    >
                                        {loading2
                                            ? "Siunčiama..."
                                            : "Siųsti patvirtinimą"}
                                    </button>
                                </div>
                            </div>
                            {otpSent && !otpVerified && (
                                <div className="flex flex-col justify-between space-y-2">
                                    {/* <label>Verify OTP</label> */}
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) =>
                                            setOtp(e.target.value)
                                        }
                                        placeholder="Įveskite patvirtinimo kodą"
                                        className="border border-primary rounded-lg py-2 px-4 w-full"
                                        required
                                        data-umami-event="Forgot Password OTP Entered"
                                    />
                                    <div className="w-full flex justify-end">
                                        <button
                                            type="button"
                                            onClick={verifyOTP}
                                            className="font-medium text-xs bg-secondary text-white py-2 px-4 rounded-lg"
                                       data-umami-event="Forgot Password OTP Verified"
                                        >
                                            {loading3
                                                ? "Tikrinama..."
                                                : "Patvirtinti"}
                                        </button>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-col relative">
                                {/* <label>Slaptažodis</label> */}
                                <input
                                    type={
                                        showPassword ? "text" : "password"
                                    }
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Naujas slaptažodis"
                                    className="w-full border border-primary rounded-lg py-2 px-4"
                                    required
                                    data-umami-event="Forgot Password Password Entered"
                                />

                                {/* Eye Icon */}
                                <span
                                    onClick={() => {
                                        setShowPassword(!showPassword)
                                    trackEventFunction("Forgot Password Show Password Clicked");
                                    }
                                    } // Toggle show/hide password
                                    className="absolute right-4 top-2 cursor-pointer text-gray-600"
                                >
                                    {showPassword ? (
                                        <AiFillEyeInvisible size={24} />
                                    ) : (
                                        <AiFillEye size={24} />
                                    )}
                                </span>
                            </div>

                            <div className="flex flex-col relative">
                                {/* <label>Pakartokite slaptažodį</label> */}
                                <input
                                    type={
                                        showPassword2 ? "text" : "password"
                                    }
                                    value={password2}
                                    onChange={(e) => {
                                        setPassword2(e.target.value)
                                    trackEventFunction("Forgot Password Confirm Password Entered");
                                    }
                                    }
                                    placeholder="Pakartokite slaptažodį"
                                    className="w-full border border-primary rounded-lg py-2 px-4"
                                    required
                                    data-umami-event="Forgot Password Confirm Password Entered"
                                />

                                {/* Eye Icon */}
                                <span
                                    onClick={() =>
                                        setShowPassword2(!showPassword2)
                                    } // Toggle show/hide password
                                    className="absolute right-4 top-2 cursor-pointer text-gray-600"
                                >
                                    {showPassword2 ? (
                                        <AiFillEyeInvisible size={24} />
                                    ) : (
                                        <AiFillEye size={24} />
                                    )}
                                </span>
                            </div>

                            <div className="flex flex-col justify-center">
                                <button
                                    type="submit"
                                    className="w-full bg-primary rounded-lg py-2 text-white"
                                data-umami-event="Forgot Password Form Submitted"
                                >
                                    {loading
                                        ? "Įkeliama..."
                                        : "Atnaujinti"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="hidden md:flex md:w-1/2">
                    <Image
                        src="/password.jpg"
                        width={692}
                        height={1024}
                        alt="Register"
                        className="rounded-r-3xl"
                    />
                </div>
                {/* <div className="absolute bottom-0 left-0">
                    <Image
                        src="/register-grad.png"
                        width={500}
                        height={500}
                        alt="gradient"
                        className="rounded-3xl"
                    />
                </div> */}
            </div>
        </div>
    )
}

export default ForgotPassword