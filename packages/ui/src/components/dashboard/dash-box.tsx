import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { RiCloseCircleLine } from "react-icons/ri";
import CheckoutButton from "../checkout-button";
import {
  auth,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithCredential,
  signInWithPhoneNumber,
} from "@/utils/firebase";
import DeliveryChoice from "../basic/delivery-choice";
import ReactHtmlParser from "react-html-parser";
import ReviewSwiper from "../review-swiper";
import { trackEventFunction } from "@/utils/general";

const DashBox = (props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [settings, setSettings] = useState({});
  const [show, setShow] = useState(false);

  const [agree, setAgree] = useState(false);

  const [open, setOpen] = useState(false); // address
  const [open2, setOpen2] = useState(false); // payment
  const [open3, setOpen3] = useState(false); // activate delivery
  const [open4, setOpen4] = useState(false); // deactivate delivery
  const [open5, setOpen5] = useState(false); // phone
  const [open6, setOpen6] = useState(false); // delivery choice
  const [open7, setOpen7] = useState(false);
  const [open8, setOpen8] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const [address, setAddress] = useState(props.data.delivery_address);
  const [address2, setAddress2] = useState("");
  const [phone, setPhone] = useState(props.user.phone);
  const [otp, setOtp] = useState("");
  const [otpId, setOtpId] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);

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

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
        setOpen2(false);
        setOpen3(false);
        setOpen4(false);
        setOpen5(false);
        setOpen6(false);
        setOpen7(false);
        setOpen8(false);
        setShow(false);
        document.body.style.overflow = "";
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  // useEffect(() => {
  //     if (navigator.geolocation) {
  //         navigator.geolocation.getCurrentPosition((position) => {
  //             // console.log("Latitude is :", position.coords.latitude);
  //             // console.log("Longitude is :", position.coords.longitude);
  //             setCookie(null, "lat", position.coords.latitude, {
  //                 maxAge: 30 * 24 * 60 * 60,
  //                 path: "/",
  //             });
  //             setCookie(null, "long", position.coords.longitude, {
  //                 maxAge: 30 * 24 * 60 * 60,
  //                 path: "/",
  //             });
  //         });
  //     } else {
  //         toast.error("Geolocation is not supported by this browser.");
  //     }
  // }, []);

  const getLocation = async () => {
    setLoading2(true);
    if (navigator.geolocation) {
      let lat, long;
      navigator.geolocation.getCurrentPosition(async (position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        // console.log("Latitude is :", lat);
        // console.log("Longitude is :", long);
        setCookie(null, "lat", lat, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        setCookie(null, "long", long, {
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
        });
        const ress = await fetch("/api/view/location", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            lat: lat,
            long: long,
          }),
        }).then((ress) => ress.json());
        if (ress.success) {
          setAddress(ress.data);
          setLoading2(false);
        } else {
          toast.error(ress.message);
          setLoading2(false);
        }
      });
    } else {
      toast.error("Geolocation is not supported by this browser.");
      setLoading2(false);
    }
  };

  const updateAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.user._id,
        key: "address",
        value: address,
      }),
    }).then((res) => res.json());
    if (res.success) {
      trackEventFunction("Address Updated");
      setCookie(null, "user", JSON.stringify(res.data), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast.success(res.message);
      setLoading(false);
      setOpen(false);
      setOpen5(true);
      setOpen3(true);
      document.body.style.overflow = "hidden";
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const activateDelivery = async () => {
    setLoading(true);
    const res = await fetch("/api/user/delivery", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.user._id,
      }),
    }).then((res) => res.json());
    if (res.success) {
      trackEventFunction("Activate Delivery");
      setCookie(null, "user", JSON.stringify(res.data), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast.success(res.message);
      setLoading(false);
      setOpen3(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const deactivateDelivery = async () => {
    setLoading(true);
    const res = await fetch("/api/user/delivery", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.user._id,
      }),
    }).then((res) => res.json());
    if (res.success) {
      trackEventFunction("Deactivate Delivery");
      setCookie(null, "user", JSON.stringify(res.data), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast.success(res.message);
      setLoading(false);
      setOpen4(false);
      router.refresh();
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const handleDate = (inputDate) => {
    // Parse the date
    const dateObj = new Date(inputDate);

    // Extract the year, month, and day
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to the month and ensuring two digits
    const day = String(dateObj.getDate()).padStart(2, "0"); // Ensuring two digits

    // Build the new date string in the format YYYY-MM-DD
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
  };

  const handleSendCode = () => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, "send-code-button", {
      size: "invisible",
    });

    signInWithPhoneNumber(auth, phone, recaptchaVerifier)
      .then((verificationId) => {
        setOtpId(verificationId);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleVerifyCode = () => {
    const credential = PhoneAuthProvider.credential(otpId, otp);

    signInWithCredential(credential)
      .then(async (userCredential) => {
        // User signed in successfully
        await updatePhone();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const updatePhone = async () => {
    const res = await fetch("/api/auth/register", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: props.user._id,
        key: "phone",
        value: phone,
      }),
    }).then((res) => res.json());
    if (res.success) {
      trackEventFunction("Phone Number Updated");
      setCookie(null, "user", JSON.stringify(res.data), {
        maxAge: 30 * 24 * 60 * 60,
        path: "/",
      });
      toast.success("Phone number updated successfully.");
      setOpen5(false);
      setOpen2(true);
      document.body.style.overflow = "hidden";
    } else {
      toast.error(res.message);
      setLoading(false);
    }
  };

  const handleOpen5 = (b) => {
    setOpen6(b);
    setOpen3(true);
  };

  return (
    <>
      <div className="w-full border-2 border-secondary rounded-xl">
        <div className="py-10 px-5">
          <div className="flex justify-center">
            <Image
              src="/cart-box.png"
              width="0"
              height="0"
              sizes="100vw"
              alt="cart box"
              className="w-[320px] h-auto bg-cover"
            />
          </div>
          <br />
          <div className="space-y-2">
            <div className="flex flex-row justify-between">
              <div>Dėžėje produktų:</div>
              <div>{props.data.quantity ? props.data.quantity : 0}</div>
            </div>
            <div className="flex flex-row justify-between">
              <div>Praeitas pristatymas:</div>
              <div>
                {props.data.last_delivery
                  ? handleDate(props.data.last_delivery)
                  : "-"}
              </div>
            </div>
            <div className="flex flex-row justify-between">
              {props.user.active_delivery && (
                <>
                  <div>Kitas pristatymas:</div>
                  <div>
                    {props.data.next_delivery
                      ? handleDate(props.data.next_delivery)
                      : "-"}
                  </div>
                </>
              )}
            </div>
            <br />
            <div className="flex flex-row justify-between">
              <div>Kaina:</div>
              <div>
                {props.data.original_price
                  ? Number(props.data.original_price).toFixed(2)
                  : 0}{" "}
                €
              </div>
            </div>
            {/* <div className="flex flex-row justify-between">
                            <div>Eko Nuolaida:</div>
                            <div>
                                {props.data.discount
                                    ? Number(props.data.discount).toFixed(2)
                                    : 0}
                                %
                            </div>
                        </div> */}
            <div className="flex flex-row justify-between">
              <div>Siuntimas:</div>
              <div>
                {props.data.shipping_fee
                  ? Number(props.data.shipping_fee).toFixed(2)
                  : 0}{" "}
                €
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div>Iš viso:</div>
              <div>
                {props.data.final_price
                  ? Number(props.data.final_price).toFixed(2)
                  : 0}{" "}
                €
              </div>
            </div>
            {/* <div className="flex flex-row justify-between">
                            <div>Sutaupėte:</div>
                            <div>
                                {props.data.saved
                                    ? Number(props.data.saved).toFixed(2)
                                    : 0}{" "}
                                €
                            </div>
                        </div> */}
          </div>
          <br />
          {/* <div className="flex justify-center items-center">
                    <input
                        type="checkbox"
                        id="purchase_rules"
                        name="purchase_rules"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                    />
                    <label htmlFor="purchase_rules" className="ml-2">
                        Sutinku su{" "}
                        <Link
                            href="/website-usage-policy"
                            className="text-secondary"
                            target="_blank"
                        >
                            pirkimo taisyklėmis
                        </Link>
                    </label>
                </div> */}
          <br />
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-5 md:space-y-0">
            <div>
              {props.user.active_delivery ? (
                <button
                  className="bg-secondary text-white border-2 border-secondary rounded-md py-2 px-4 md:px-7 text-xs font-medium"
                  onClick={() => {
                    if (
                      Math.abs(
                        new Date() - new Date(props.data.next_delivery)
                      ) <=
                      7 * 24 * 60 * 60 * 1000
                    ) {
                      toast.error(
                        "Pristatymą galite išjungti tik likus 7 dienoms iki kitos pristatymo datos"
                      );
                    } else {
                      setOpen4(true);
                      document.body.style.overflow = "hidden";
                    }
                  }}
                  data-umami-event="Deactivate delivery button clicked"
                >
                  Pristatymas aktyvus
                </button>
              ) : (
                <button
                  onClick={() => {
                    if (
                      !props.data.delivery_choice ||
                      props.data.delivery_choice === "."
                    ) {
                      setOpen6(true);
                      document.body.style.overflow = "hidden";
                      // } else if (
                      //     !props.user.address ||
                      //     props.user.address === "."
                      // ) {
                      //     setOpen(true);
                    }
                    // else if (
                    //     !props.user.phone ||
                    //     props.user.phone === "."
                    // ) {
                    //     setOpen5(true);
                    // }
                    else if (!props.user.payment_connected) {
                      setOpen2(true);
                      document.body.style.overflow = "hidden";
                    } else {
                      setOpen3(true);
                      document.body.style.overflow = "hidden";
                    }
                  }}
                  className="bg-danger border-2 border-danger rounded-md py-2 px-4 md:px-7 text-xs text-black font-medium"
                  data-umami-event="Activate delivery button clicked"
                >
                  Pristatymas neaktyvus
                </button>
              )}
            </div>
            <div>
              <button
                className="bg-white border-2 border-black rounded-md py-2 px-4 md:px-7 text-xs text-black font-medium"
                onClick={() => {
                  props.customTrack("about_discount_btn", 1);
                  setShow(true);
                  document.body.style.overflow = "hidden";
                }}
                data-umami-event="About discount button clicked"
              >
                Veikimo principas
              </button>
            </div>
          </div>
        </div>
        {settings.shipping_bracket > (props.data.original_price || 0) ? (
          <div className="text-base text-center bg-primary text-white py-2 rounded-b-lg">
            Jums liko{" "}
            <b>
              {(
                settings.shipping_bracket - (props.data.original_price || 0)
              ).toFixed(2)}{" "}
              €
            </b>{" "}
            iki nemokamo pristatymo!
          </div>
        ) : (
          <div className="text-base text-center bg-primary text-white py-2 rounded-b-lg">
            Nemokamas pristatymas tik Jums!
          </div>
        )}
      </div>
      {show && (
        <>
          <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center z-20">
            <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
              <div className="flex flex-row justify-between items-center">
                <h1 className="text-lg font-bold">Veikimo principas</h1>
                <button
                  onClick={() => {
                    setShow(false);
                    document.body.style.overflow = "";
                  }}
                  className="text-2xl font-bold"
                  data-umami-event="About discount modal closed"
                >
                  <RiCloseCircleLine />
                </button>
              </div>
              <div className="html-parser px-3 pb-4 h-[50vh] overflow-y-auto">
                {ReactHtmlParser(settings.about_eco_discount_text)}
              </div>
              {/* <Markdown>
                                    {settings.about_eco_discount_text}
                                </Markdown> */}
            </div>
          </div>
        </>
      )}

      {/* address */}
      {open && (
        <>
          <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center z-10">
            <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
              <div className="flex flex-row justify-end items-center">
                <button
                  onClick={() => {
                    setOpen(false);
                    document.body.style.overflow = "";
                  }}
                  className="text-2xl font-bold"
                  data-umami-event="Address modal closed"
                >
                  <RiCloseCircleLine />
                </button>
              </div>
              <div className="mt-10">
                <form onSubmit={updateAddress} className="space-y-4">
                  <div className="flex flex-col">
                    <div className="flex flex-row justify-between items-center">
                      <label>Enter your address:</label>
                      <button
                        className="text-primary font-bold"
                        type="button"
                        onClick={() => getLocation()}
                        data-umami-event="Get My Location Button Clicked"
                      >
                        Get My Location
                      </button>
                    </div>
                    <textarea
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full border-2 border-primary rounded-lg py-2 px-4"
                      required
                    />
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="w-full bg-primary rounded-lg py-2 text-white"
                      data-umami-event="Address update button clicked"
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

      {/* payment */}
      {open2 && (
        <>
          <div className="min-h-screen overflow-y-scroll fixed top-0 right-0 w-full bg-black/60 ">
            <div className=" flex flex-col justify-center items-center z-10">
              <div className="w-full sm:w-5/6  lg:w-1/2 bg-white rounded-lg p-3 sm:p-5 flex flex-col">
                <div className="flex flex-row justify-end items-center">
                  <button
                    onClick={() => {
                      setOpen2(false);
                      document.body.style.overflow = "";
                    }}
                    className="text-2xl font-bold"
                    data-umami-event="Payment modal closed"
                  >
                    <RiCloseCircleLine />
                  </button>
                </div>
                <div className=" md:mt-1 text-center">
                  {/* <StripeWrapper id={props.user.stripe_customer_id} /> */}
                  <CheckoutButton user={props.user} cart={props.data} />

                  {/* <button>Add Payment Method</button> */}
                </div>
              </div>
              <ReviewSwiper />
            </div>
          </div>
        </>
      )}

      {/* activate delivery */}
      {open3 && (
        <>
          <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center z-10">
            <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
              <div className="flex flex-row justify-end items-center">
                <button
                  onClick={() => {
                    setOpen3(false);
                    document.body.style.overflow = "";
                  }}
                  className="text-2xl font-bold"
                  data-umami-event="Activate delivery modal closed"
                >
                  <RiCloseCircleLine />
                </button>
              </div>
              <div className="mt-10">
                <h1>Ar Jūs tikrai norite aktyvuoti pristatymą?</h1>
                <br />
                <div className="flex flex-row justify-between">
                  <button
                    type="button"
                    onClick={() => activateDelivery()}
                    className="bg-primary text-white py-2 px-10 rounded-lg"
                    data-umami-event="Activate delivery yes button clicked"
                  >
                    {loading ? "Įkeliama..." : "Taip"}
                  </button>
                  <button
                    onClick={() => {
                      setOpen3(false);
                      document.body.style.overflow = "";
                    }}
                    className="bg-danger text-white py-2 px-10 rounded-lg"
                    data-umami-event="Activate delivery no button clicked"
                  >
                    Ne
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* deactivate delivery */}
      {open4 && (
        <>
          <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center z-10">
            <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
              <div className="flex flex-row justify-end items-center">
                <button
                  onClick={() => {
                    setOpen4(false);
                    document.body.style.overflow = "";
                  }}
                  className="text-2xl font-bold"
                  data-umami-event="Deactivate delivery modal closed"
                >
                  <RiCloseCircleLine />
                </button>
              </div>
              <div className="mt-10">
                <h1>Ar Jūs tikrai norite sustabdyti pristatymą?</h1>
                <br />
                <div className="flex flex-row justify-between">
                  <button
                    type="button"
                    onClick={() => deactivateDelivery()}
                    className="bg-primary text-white py-2 px-10 rounded-lg"
                    data-umami-event="Deactivate delivery yes button clicked"
                  >
                    {loading ? "Įkeliama..." : "Taip"}
                  </button>
                  <button
                    onClick={() => {
                      setOpen4(false);
                      document.body.style.overflow = "";
                    }}
                    data-umami-event="Deactivate delivery cancel button clicked"
                    className="bg-danger text-white py-2 px-10 rounded-lg"
                  >
                    Ne
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* phone */}
      {open5 && (
        <>
          <div className="min-h-screen fixed top-0 right-0 w-full bg-black/60 flex flex-col justify-center items-center z-10">
            <div className="w-5/6 md:w-1/2 bg-white rounded-lg p-5 flex flex-col">
              <div className="flex flex-row justify-end items-center">
                <button
                  onClick={() => {
                    setOpen5(false);
                    document.body.style.overflow = "";
                  }}
                  data-umami-event="Phone Modal Closed"
                  className="text-2xl font-bold"
                >
                  <RiCloseCircleLine />
                </button>
              </div>
              <div className="mt-10 space-y-4">
                <div className="flex flex-col space-y-2">
                  <input
                    type="tel"
                    value={phone}
                    placeholder="Jūsų telefono numeris"
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border-2 border-primary rounded-lg py-2 px-4"
                    required
                    data-umami-event="Inserted Phone Number"
                  />
                  <button
                    id="send-code-button"
                    data-event="Send Code Button Clicked"
                    // onClick={handleSendCode}
                    onClick={updatePhone}
                    className="font-medium text-base bg-secondary text-white py-2 px-4 rounded-lg w-full"
                  >
                    Send Code
                  </button>
                </div>
                {/* <input
                                    type="text"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full border-2 border-primary rounded-lg py-2 px-4"
                                    required
                                />
                                <button onClick={handleVerifyCode}>
                                    Verify Code
                                </button> */}
              </div>
            </div>
          </div>
        </>
      )}

      {/* delivery method */}
      {open6 && (
        <>
          <DeliveryChoice
            data={props.user}
            cart={props.data}
            settings={settings}
            handleOpen5={handleOpen5}
            handleFetchData={props.handleFetchData}
          />
        </>
      )}
    </>
  );
};

export default DashBox;
