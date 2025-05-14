import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { destroyCookie, setCookie } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiEditBoxLine, RiCloseCircleLine } from "react-icons/ri";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import CheckoutButton from "../checkout-button";
import {
    LiaCcVisa,
    LiaCcMastercard,
    LiaCcAmex,
    LiaCcDinersClub,
    LiaCcDiscover,
    LiaCcJcb,
} from "react-icons/lia";
import DeliveryChoice from "../basic/delivery-choice";
import ReviewSwiper from "../review-swiper";
import { trackEventFunction } from "@/utils/general";

const SettingsAccount = (props) => {
    
    const router = useRouter();
    const pathname = usePathname();

    const [settings, setSettings] = useState({});

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [open3, setOpen3] = useState(false);
    const [open4, setOpen4] = useState(false);
    const [open5, setOpen5] = useState(false);
    const [open6, setOpen6] = useState(false);

    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [label, setLabel] = useState("");
    const [key, setKey] = useState("");
    const [value, setValue] = useState("");

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                setOpen2(false);
                setOpen3(false);
                 document.body.style.overflow = "";
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const fetchSettings = async () => {
        const res = await fetch("/api/view/settings").then((res) => res.json());
        if (res.success) {
            setSettings(res.data);
        } else {
            toast.error(res.message);
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/auth/register", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: props.data._id,
                key,
                value,
            }),
        }).then((res) => res.json());
        if (res.success) {
            setCookie(null, "user", JSON.stringify(res.data), {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            toast.success(res.message);
            setLoading(false);
            router.refresh();
        } else {
            toast.error(res.message);
            setLoading(false);
        }
    };

    const handleUpdate2 = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/auth/login", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: props.data._id,
                password,
                key,
                value,
            }),
        }).then((res) => res.json());
        if (res.success) {
            trackEventFunction("Password Changed");
            destroyCookie(null, "user");
            toast.success(res.message);
            setLoading(false);
            router.push("/");
        } else {
            toast.error(res.message);
            setLoading(false);
        }
    };

    const handleDisconnect = async () => {
        setLoading(true);
        if (!props.data.payment_connected) {
            toast.error("Nėra prijungtas mokėjimo metodas");
            setLoading(false);
            return;
        }
        if (props.data.active_delivery) {
            toast.error("Pirmiausiai reikia deaktyvuoti savo dėžę");
            setLoading(false);
            return;
        }
        const res = await fetch("/api/user/stripe/disconnect", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: props.data._id,
            }),
        }).then((res) => res.json());
        if (res.success) {
            trackEventFunction("Payment Disconnected");
            setCookie(null, "user", JSON.stringify(res.data), {
                maxAge: 30 * 24 * 60 * 60,
                path: "/",
            });
            toast.success(res.message);
            setLoading(false);
            router.refresh();
        } else {
            toast.error(res.message);
            setLoading(false);
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);
        const res = await fetch("/api/auth/register", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: props.data._id,
                password,
            }),
        }).then((res) => res.json());
        if (res.success) {
            trackEventFunction("Account Deleted");
            destroyCookie(null, "user");
            toast.success(res.message);
            setLoading(false);
            router.push("/");
        } else {
            toast.error(res.message);
            setLoading(false);
        }
    };

    const handleChoiceTranslation = (choice) => {
        switch (choice) {
            case "mail":
                return "paštomatas";
            case "courier":
                return "kurjeris";
            default:
                return choice;
        }
    };

    const showCardIcon = (card) => {
        switch (card) {
            case "visa":
                return <LiaCcVisa className="text-3xl mr-[2px]" />;
            case "mastercard":
                return <LiaCcMastercard className="text-3xl mr-[2px]" />;
            case "amex":
                return <LiaCcAmex className="text-3xl mr-[2px]" />;
            case "dinersclub":
                return <LiaCcDinersClub className="text-3xl mr-[2px]" />;
            case "discover":
                return <LiaCcDiscover className="text-3xl mr-[2px]" />;
            case "jcb":
                return <LiaCcJcb className="text-3xl mr-[2px]" />;
            default:
                return card;
        }
    };

    const handleOpen5 = (b) => {
        setOpen5(b);
    };

    const handleLogo = (s) => {
        if (s == "venipak") return "/logos/venipak.png";
        else if (s == "lp") return "/logos/lpexpress.png";
        else if (s == "omniva") return "/logos/omniva.png";
        else if (s == "dpd") return "/logos/dpd.png";
    };

    return (
      <>
        <div className="w-full space-y-7">
          <div>
            <h1 className="text-xl md:text-2xl font-medium">Paskyra</h1>
          </div>

          <div className="space-y-2 text-xs md:text-sm">
            <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
              <div className="w-1/3">Vardas:</div>
              <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                <div>{props.data.name}</div>
                <div>
                  <button
                    className="text-primary text-xl"
                    onClick={() => {
                      setOpen(true);
                      document.body.style.overflow = "hidden";
                      setLabel("Vardas");
                      setKey("name");
                      setValue(props.data.name);
                    }}
                    data-umami-event="Edit Name Button Clicked"
                  >
                    <RiEditBoxLine />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
              <div className="w-1/3">Pavardė:</div>
              <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                <div>{props.data.last_name}</div>
                <div>
                  <button
                    className="text-primary text-xl"
                    onClick={() => {
                      setOpen(true);
                      document.body.style.overflow = "hidden";
                      setLabel("Pavardė");
                      setKey("last_name");
                      setValue(props.data.last_name);
                    }}
                    data-umami-event="Edit Last Name Button Clicked"
                  >
                    <RiEditBoxLine />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
              <div className="w-1/3">El. Paštas:</div>
              <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                <div>
                  {props.data && props.data.email ? (
                    (() => {
                      const [username, domain] = props.data.email.split("@");
                      const truncatedUsername =
                        username.length > 5
                          ? `${username.slice(0, 5)}...`
                          : username;
                      return `${truncatedUsername}@${domain}`;
                    })()
                  ) : (
                    <span>No Email Provided</span>
                  )}
                </div>

                {/* <div>
                                <button
                                    className="text-primary text-xl"
                                    onClick={() => {
                                        setOpen(true);
                                        setKey("email");
                                        setValue(props.data.email);
                                    }}
                                >
                                    <RiEditBoxLine />
                                </button>
                            </div> */}
              </div>
            </div>

            <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
              <div className="w-1/3">Slaptažodis:</div>
              <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                <div>********</div>
                <div>
                  <button
                    className="text-primary text-xl"
                    onClick={() => {
                      setOpen2(true);
                      document.body.style.overflow = "hidden";
                      setLabel("Slaptažodis");
                      setKey("password");
                    }}
                    data-umami-event="Change Password Button Clicked"
                  >
                    <RiEditBoxLine />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
              <div className="w-1/3">Pristatymas:</div>
              <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                <div className="">
                  {props.cart && props.cart.delivery_choice ? (
                    <span className="flex flex-row items-center">
                      <Image
                        src={handleLogo(props.cart.delivery_provider)}
                        alt={props.cart.delivery_provider}
                        width={30}
                        height={30}
                        className="object-contain"
                      />
                      {String(props.cart.delivery_provider).toUpperCase() +
                        ", " +
                        handleChoiceTranslation(props.cart.delivery_choice)}
                    </span>
                  ) : (
                    <span>-</span>
                  )}
                </div>

                {/* <div>
                                {props.data && props.data.address ? (
                                    props.data.address.length > 10 ? (
                                        `${props.data.address.slice(0, 10)}...`
                                    ) : (
                                        props.data.address
                                    )
                                ) : (
                                    <span>-</span>
                                )}
                            </div> */}

                <div>
                  <button
                    className="text-primary text-xl"
                    onClick={() => {
                      if (props.data.active_delivery) {
                        toast.error("Pirmiausiai reikia deaktyvuoti savo dėžę");
                        setLoading(false);
                        return;
                      } else {
                        setOpen5(true);
                        document.body.style.overflow = "hidden";
                      }
                    }}
                    data-umami-event="Edit Delivery Button Clicked"
                  >
                    <RiEditBoxLine />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-b-2 border-primary flex flex-row justify-between pb-1">
              <div className="w-1/3">Mokėjimo būdas:</div>
              <div className="flex flex-row justify-between w-1/2 md:w-1/3">
                <div className="flex flex-row items-center">
                  {props.data.payment_connected ? (
                    <>
                      {showCardIcon(props.data.payment_card_name)}
                      {" **** **** **** " + props.data.payment_card_number}
                    </>
                  ) : (
                    "Neprisijungę"
                  )}
                </div>
                <div>
                  <button
                    className="text-primary text-xl"
                    onClick={() => {
                      if (props.data.payment_connected) {
                        setOpen3(true);
                        document.body.style.overflow = "hidden";
                        setKey("payment_connected");
                        setValue(props.data.payment_connected);
                      } else {
                        setOpen6(true);
                        document.body.style.overflow = "hidden";
                      }
                    }}
                    data-umami-event="Edit Payment Button Clicked"
                  >
                    <RiEditBoxLine />
                  </button>
                </div>
              </div>
            </div>

            <div className="">
              <div className="">
                <button
                  className="text-sm text-red-400"
                  onClick={() => {
                    router.push("/forgot-password");
                  }}
                  data-umami-event="Forgot Password Button Clicked"
                >
                  Pamiršau slaptažodį
                </button>
              </div>
            </div>

            <div className="">
              <div className="">
                <button
                  className="text-sm text-danger"
                  onClick={() => {
                    setOpen4(true);
                    document.body.style.overflow = "hidden";
                  }}
                  data-umami-event="Delete Account Button Clicked"
                >
                  Ištrinti paskyrą
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* update */}
        {open && (
          <>
            <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center">
              <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
                <div className="flex flex-row justify-end items-center">
                  <button
                    onClick={() => {
                      setOpen(false);
                      document.body.style.overflow = "";
                    }}
                    className="text-2xl font-bold"
                    data-umami-event="Close Update Button Clicked"
                  >
                    <RiCloseCircleLine />
                  </button>
                </div>
                <div className="mt-10">
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="flex flex-col">
                      <div className="flex flex-row justify-between items-center">
                        <label>{label}</label>
                        {/* {key === "address" && (
                                                <button
                                                    className="text-primary font-bold"
                                                    type="button"
                                                    onClick={() =>
                                                        getLocation()
                                                    }
                                                >
                                                    Get Location
                                                </button>
                                            )} */}
                      </div>
                      {key === "address" ? (
                        <textarea
                          type="text"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="w-full border-2 border-primary rounded-lg py-2 px-4"
                          required
                          data-umami-event="Update Address Input"
                        />
                      ) : (
                        <input
                          type={key === "email" ? "email" : "text"}
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          className="w-full border-2 border-primary rounded-lg py-2 px-4"
                          required
                          data-umami-event="Update Input"
                        />
                      )}
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="w-full bg-primary rounded-lg py-2 text-white"
                        data-umami-event="Update Button Clicked"
                      >
                        {loading ? "Įkeliama..." : "Atnaujinti"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        {/* password change */}
        {open2 && (
          <>
            <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center">
              <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
                <div className="flex flex-row justify-end items-center">
                  <button
                    onClick={() => {
                      setOpen2(false);
                      document.body.style.overflow = "";
                    }}
                    className="text-2xl font-bold"
                    data-umami-event="Close Password Change Button Clicked"
                  >
                    <RiCloseCircleLine />
                  </button>
                </div>
                <div className="mt-10">
                  <form onSubmit={handleUpdate2} className="space-y-4">
                    <div className="flex flex-col">
                      <label>Įveskite dabartinį slaptažodį</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="Current Password Input"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label>Įveskite naują slaptažodį</label>
                      <input
                        type="password"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="w-full border-2 border-primary rounded-lg py-2 px-4"
                        required
                        data-umami-event="Change Password Input"
                      />
                    </div>
                    <div className="flex justify-center">
                      <button
                        type="submit"
                        className="w-full bg-primary rounded-lg py-2 text-white"
                        data-umami-event="Change Password Button Clicked"
                      >
                        {loading ? "Įkeliama..." : "Atnaujinti"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </>
        )}

        {/* disconnect */}
        {open3 && (
          <>
            <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center">
              <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
                <div className="flex flex-row justify-end items-center">
                  <button
                    onClick={() => {
                      setOpen3(false);
                      document.body.style.overflow = "";
                    }}
                    className="text-2xl font-bold"
                    data-umami-event="Close Disconnect Payment Button Clicked"
                  >
                    <RiCloseCircleLine />
                  </button>
                </div>
                <div className="mt-10 flex justify-center">
                  <button
                    type="button"
                    onClick={handleDisconnect}
                    className="bg-danger py-2 px-10 rounded-lg text-white"
                    data-umami-event="Disconnect Payment Button Clicked"
                  >
                    {loading ? "Įkeliama..." : "Pašalinti kortelę"}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* delete account */}
        {open4 && (
          <>
            <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center">
              <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
                <div className="flex flex-row justify-end items-center">
                  <button
                    onClick={() => {
                      setOpen4(false);
                      document.body.style.overflow = "";
                    }}
                    className="text-2xl font-bold"
                    data-umami-event="Close Delete Account Button Clicked"
                  >
                    <RiCloseCircleLine />
                  </button>
                </div>
                <form onSubmit={handleDelete} className="my-10">
                  <div className="flex flex-col relative">
                    {/* <label>Slaptažodis</label> */}
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Slaptažodis"
                      className="w-full border border-primary rounded-lg py-2 px-4"
                      required
                      data-umami-event="Delete Account Password Input"
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
                  <div className="mt-10">
                    <button
                      type="submit"
                      className="bg-danger py-2 px-10 rounded-lg text-white"
                      data-umami-event="Delete Account Button Clicked"
                    >
                      {loading ? "Įkeliama..." : "Ištrinti mano paskyrą"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </>
        )}

        {/* delivery */}
        {open5 && (
          <>
            <DeliveryChoice
              data={props.data}
              cart={props.cart}
              settings={settings}
              handleOpen5={handleOpen5}
            />
          </>
        )}

        {/* payment */}
        {open6 && (
          <>
            <div className="h-screen overflow-y-scroll fixed top-0 right-0 w-full bg-black/60 ">
              <div className=" flex flex-col justify-center items-center z-10">
                <div className="w-full lg:w-1/2 bg-white rounded-lg p-3 md:p-5 flex flex-col ">
                  <div className="flex flex-row justify-end items-center">
                    <button
                      onClick={() => {
                        setOpen6(false);
                        document.body.style.overflow = "";
                      }}
                      className="text-2xl font-bold"
                      data-umami-event="Close Payment Button Clicked"
                    >
                      <RiCloseCircleLine />
                    </button>
                  </div>
                  <div className="md:mt-1 text-center">
                    {/* <StripeWrapper id={props.user.stripe_customer_id} /> */}
                    <CheckoutButton user={props.data} cart={props.cart} />
                    {/* <button>Add Payment Method</button> */}
                  </div>
                </div>
                <ReviewSwiper />
              </div>
            </div>
          </>
        )}
      </>
    );
};

export default SettingsAccount;
