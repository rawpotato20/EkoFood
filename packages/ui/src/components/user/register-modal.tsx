import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLogoSection from "../auth-logo-section";
import { trackEventFunction } from "@/packages/utils/src/general";

//TODO: React Icons, Nookies and Toast
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { setCookie } from "nookies";
import toast from "react-hot-toast";

interface RegisterModalProps {
  handleClose: (identifier: string | number, value: boolean) => void;
  customTrack: (eventName: string, value: number) => void;
}

const RegisterModal = (props: RegisterModalProps) => {
  const router = useRouter();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [otp, setOtp] = useState("");
  // const [address, setAddress] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [remember, setRemember] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    props.customTrack("reg_form_submitted", 1);
    // if (!otpVerified) {
    //     toast.error("Patvirtinkite el. paštą");
    //     setLoading(false);
    //     return;
    // }
    if (password !== password) {
      toast.error("Slaptažodžiai nesutampa");
      setLoading(false);
      return;
    } else {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          last_name: lastName,
          email,
          password,
          // address,
        }),
      }).then((res) => res.json());
      if (res.success) {
        trackEventFunction("Register Form Submited");
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
        props.handleClose("registrations", true);
        toast.success(res.message);
        setLoading(false);
        router.push("/dashboard");
      } else {
        setLoading(false);
        toast.error(res.message);
      }
    }
  };

  const sendOTP = async () => {
    setLoading2(true);
    props.customTrack("reg_send_otp_clicked", 1);
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
      trackEventFunction("Register Form OTP Sent");
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
    props.customTrack("reg_verify_otp_clicked", 1);
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
      trackEventFunction("Register Form OTP Verified");
      toast.success(res.message);
      setOtpVerified(true);
      setLoading3(false);
    } else {
      toast.error(res.message);
      setLoading3(false);
    }
  };

  return (
    <>
      <div className="z-10 min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center">
        <div className="relative w-11/12 md:max-w-[760px] lg:max-w-[960px] bg-white rounded-3xl flex flex-col-reverse md:flex-row justify-between items-center">
          <div className="py-10 px-2 md:px-10 md:w-1/2 z-10">
            <div className="flex flex-col justify-center items-center text-center">
              <h1 className="text-2xl md:text-4xl font-medium text-primary">
                REGISTRACIJA
              </h1>
              <h5 className="text-xs md:text-sm">
                Pirmasis žingsnis link sveiko gyvenimo būdo.
              </h5>
              {/* <button
                                onClick={() => props.handleClose(1, false)}
                                className="text-2xl font-bold"
                            >
                                <RiCloseCircleLine />
                            </button> */}
            </div>
            <div className="mt-10">
              <form onSubmit={handleSubmit} className="space-y-4 text-sm">
                <div className="flex flex-row justify-between items-center space-x-2">
                  <div className="flex flex-col w-1/2">
                    {/* <label>Vardas</label> */}
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onFocus={() => props.customTrack("reg_name_input", 1)}
                      placeholder="Vardas"
                      className="w-full border border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Register Form Name Input"
                    />
                  </div>
                  <div className="flex flex-col w-1/2">
                    {/* <label>Pavardė</label> */}
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      onFocus={() => props.customTrack("reg_lastname_input", 1)}
                      placeholder="Pavardė"
                      className="w-full border border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Register Form Last Name Input"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-between space-y-2">
                  {/* <label>El. paštas</label> */}
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => props.customTrack("reg_email_input", 1)}
                    placeholder="El. paštas"
                    className="border border-primary rounded-lg py-2 px-4 w-full"
                    required
                    data-umami-event="Register Form Email Input"
                    // readOnly={otpVerified}
                  />
                  {/* <div className="w-full flex justify-end">
                                        <button
                                            type="button"
                                            onClick={sendOTP}
                                            className="font-medium text-xs bg-secondary text-white py-2 px-4 rounded-lg w-full"
                                            disabled={otpVerified}
                                        >
                                            {loading2
                                                ? "Siunčiama..."
                                                : "Siųsti patvirtinimą"}
                                        </button>
                                    </div> */}
                </div>
                {/* {otpSent && !otpVerified && (
                                    <div className="flex flex-col justify-between space-y-2">
                                        <label>Verify OTP</label>
                                        <input
                                            type="text"
                                            value={otp}
                                            onChange={(e) =>
                                                setOtp(e.target.value)
                                            }
                                            onFocus={() => props.customTrack("reg_otp_input", 1)}
                                            placeholder="Įveskite patvirtinimo kodą"
                                            className="border border-primary rounded-lg py-2 px-4 w-full"
                                            required
                                        />
                                        <div className="w-full flex justify-end">
                                            <button
                                                type="button"
                                                onClick={verifyOTP}
                                                className="font-medium text-xs bg-secondary text-white py-2 px-4 rounded-lg w-full"
                                            >
                                                {loading3
                                                    ? "Tikrinama..."
                                                    : "Patvirtinti"}
                                            </button>
                                        </div>
                                    </div>
                                )} */}
                <div className="flex flex-col relative">
                  {/* <label>Slaptažodis</label> */}
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => props.customTrack("reg_pass_input", 1)}
                    placeholder="Slaptažodis"
                    className="w-full border border-primary rounded-lg py-2 px-4"
                    required
                    data-umami-event="Register Form Password Input"
                  />

                  {/* Eye Icon */}
                  <span
                    onClick={() => {
                      setShowPassword(!showPassword);
                      props.customTrack("reg_show_pass_clicked", 1);
                    }} // Toggle show/hide password
                    className="absolute right-4 top-2 cursor-pointer text-gray-600"
                  >
                    {showPassword ? (
                      <AiFillEyeInvisible size={24} />
                    ) : (
                      <AiFillEye size={24} />
                    )}
                  </span>
                </div>

                {/* <div className="flex flex-col relative">
                                    <label>Pakartokite slaptažodį</label>
                                    <input
                                        type={
                                            showPassword2 ? "text" : "password"
                                        }
                                        value={password2}
                                        onChange={(e) =>
                                            setPassword2(e.target.value)
                                        }
                                        onFocus={() => props.customTrack(
                                            "reg_pass2_input",
                                            1
                                        )}
                                        placeholder="Pakartokite slaptažodį"
                                        className="w-full border border-primary rounded-lg py-2 px-4"
                                        required
                                    />

                                    Eye Icon
                                    <span
                                        onClick={() => {
                                            setShowPassword2(!showPassword2);
                                            props.customTrack(
                                                "reg_show_pass2_clicked",
                                                1
                                            );
                                        }} // Toggle show/hide password
                                        className="absolute right-4 top-2 cursor-pointer text-gray-600"
                                    >
                                        {showPassword2 ? (
                                            <AiFillEyeInvisible size={24} />
                                        ) : (
                                            <AiFillEye size={24} />
                                        )}
                                    </span>
                                </div> */}

                {/* <div className="flex flex-col">
                                <label>Address</label>
                                <textarea
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full border border-primary rounded-lg py-2 px-4"
                                    required
                                />
                            </div> */}
                <div className="flex flex-row items-center">
                  <label>
                    <input
                      type="checkbox"
                      className="mr-2"
                      // required
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      onFocus={() => props.customTrack("reg_checkbox_input", 1)}
                      data-umami-event="Register Form Checkbox Clicked"
                    />
                    Prisiminti mane
                  </label>
                </div>
                <div className="flex flex-col justify-center">
                  <button
                    type="submit"
                    className="w-full bg-primary rounded-lg py-2 text-white"
                    data-umami-event="Register Form Submitted"
                  >
                    {loading ? "Įkeliama..." : "Registruokitės dabar!"}
                  </button>
                  <br />
                  <div className="text-center">
                    {/* Esate narys?{" "}
                                        <button
                                            onClick={() => {
                                                props.handleClose(2, true);
                                                props.handleClose(1, false);
                                            }}
                                            className="text-primary"
                                        >
                                            Prisijunkite
                                        </button>
                                        <br />
                                        <br />
                                        <button
                                            className="text-red-500 bg-white rounded-full py-2 px-16 shadow"
                                            onClick={() => {
                                                props.handleClose(1, false);
                                                props.customTrack(
                                                    "reg_form_close",
                                                    1
                                                );
                                            }}
                                        >
                                            Uždaryti
                                        </button> */}
                    <div className="text-gray-500">
                      EkoFood nesidalina jūsų duomenimis su jokia kita trečia
                      šalimi.
                    </div>
                    <div className="text-gray-500">
                      Registracija nemokama. Po jos būsite nukreipti į
                      pagrindinį puslapį.
                    </div>
                    <AuthLogoSection />
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="hidden md:flex md:h-[676px]">
            <Image
              src="/register.png"
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
          <div className="absolute top-5 right-5 z-10">
            <button
              type="button"
              className="bg-white text-primary p-2 rounded-full"
              onClick={() => {
                props.handleClose(1, false);
                document.body.style.overflow = "";
                props.customTrack("reg_form_close", 1);
              }}
              data-umami-event="Register Form Close"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RegisterModal;
