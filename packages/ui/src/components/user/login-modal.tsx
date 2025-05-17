"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import AuthLogoSection from "../auth-logo-section";
import { trackEventFunction } from "@/packages/utils/src/general";

//TODO: React Icons, nookies and toast
import { IoClose } from "react-icons/io5";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { setCookie } from "nookies";
import toast from "react-hot-toast";

interface LoginModalProps {
  handleClose: (index: number, value: boolean) => void;
}

const LoginModal = (props: LoginModalProps) => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      if (!remember) {
        setCookie(null, "showModal", "true", {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
      }
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
      <div className="z-10 min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center">
        <div className="relative w-11/12 md:max-w-[660px] lg:max-w-[880px] bg-white rounded-3xl flex flex-col-reverse md:flex-row justify-between items-center">
          <div className="py-10 px-2 md:px-10 md:w-1/2 z-10">
            <div className="flex flex-col justify-between items-center text-center">
              <h1 className="text-2xl md:text-4xl font-medium text-primary">
                PRISIJUNGIMAS
              </h1>
              <h5 className="text-xs md:text-sm">
                Tęskite savo kelionę link sveiko gyvenimo būdo
              </h5>
              {/* <button
                            onClick={() => props.handleClose(2, false)}
                            className="text-2xl font-bold"
                        >
                            <RiCloseCircleLine />
                        </button> */}
            </div>
            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div className="flex flex-col">
                  {/* <label>El. paštas</label> */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="El. paštas"
                    className="w-full border-2 border-primary rounded-lg py-2 px-4"
                    required
                    data-umami-event="Inserted Email"
                  />
                </div>

                <div className="flex flex-col relative">
                  {/* <label>Slaptažodis</label> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Slaptažodis"
                    className="w-full border border-primary rounded-lg py-2 px-4"
                    required
                    data-umami-event="Inserted Password"
                  />

                  {/* Eye Icon */}
                  <span
                    onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
                    className="absolute right-4 top-2 cursor-pointer text-gray-600"
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={24} />
                    ) : (
                      <AiFillEye size={24} />
                    )}
                  </span>
                </div>

                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-primary">
                    Pamiršau slaptažodį
                  </Link>
                </div>

                <div className="flex flex-row items-center">
                  <label>
                    <input
                      type="checkbox"
                      className="mr-2"
                      // required
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      data-umami-event="Remember Me Checkbox Clicked"
                    />
                    Prisiminti mane
                  </label>
                </div>
                <div className="flex flex-col justify-center">
                  <button
                    type="submit"
                    data-umami-event="Login Form Submitted"
                    className="w-full bg-primary rounded-lg py-2 text-white"
                  >
                    {loading ? "Įkeliama..." : "Prisijungti"}
                  </button>
                  <br />
                  <div className="text-center">
                    Esate naujas narys?{" "}
                    <button
                      onClick={() => {
                        props.handleClose(2, false);
                        props.handleClose(1, true);
                      }}
                      className="text-primary"
                      data-umami-event="Register Button Clicked"
                    >
                      Registruokitės
                    </button>
                    <br />
                    <br />
                  </div>
                </div>
              </form>
            </div>
            <AuthLogoSection />
          </div>
          <div className="hidden md:flex md:h-[515px] lg:h-[600px] overflow-hidden">
            <Image
              src="/login.png"
              width={692}
              height={"0"}
              alt="Register"
              className="rounded-r-3xl h-full"
            />
          </div>
          <div className="absolute bottom-0 left-0">
            <Image
              src="/register-grad.png"
              width={500}
              height={500}
              alt="gradient"
              className="rounded-3xl"
            />
          </div>
          <div className="absolute top-3 right-2 z-10">
            <button
              type="button"
              className="bg-white text-primary p-2 rounded-full"
              onClick={() => {
                props.handleClose(2, false);
                document.body.style.overflow = "";
              }}
              data-umami-event="Login Modal Closed"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;
