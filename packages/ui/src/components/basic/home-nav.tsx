import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterModal from "../user/register-modal";
import LoginModal from "../user/login-modal";
import { RiMenuFill, RiCloseCircleLine } from "react-icons/ri";
import { parseCookies } from "nookies";

const HomeNav = (props) => {
    const router = useRouter();
    const pathname = usePathname();

    const [open, setOpen] = useState(false);

    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);

    const handleClose = (index, value) => {
        if (index === 1) {
            setShow(value);
        } else {
            setShow2(value);
        }
    };

    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") {
                setShow(false);
                setShow2(false);
            }
        };
        window.addEventListener("keydown", handleEsc);
        return () => {
            window.removeEventListener("keydown", handleEsc);
        };
    }, []);

    const [isLogged, setIsLogged] = useState(false);

    useEffect(() => {
        let user = parseCookies().user;
        if (user) {
            setIsLogged(true);
        }
    }, []);

    const customTrack = async (label, value) => {
        const res = await fetch("/api/view/track", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                link: "home",
                label: label,
                value: value,
            }),
        }).then((res) => res.json());
        if (res.success) {
            return;
        } else {
            console.log(res.message);
        }
    };

    return (
      <>
        <div
          className="container mx-auto px-3 md:px-0 flex flex-row justify-between items-center text-black"
          data-aos="fade-up"
        >
          <div className="mt-4">
            <Link href="/">
              <Image
                src="/logo_summer.svg"
                alt="logo"
                width={198}
                height={68}
              />
            </Link>
          </div>
          {isLogged ? (
            <>
              <div className="hidden md:flex space-x-14">
                <Link
                  href="/dashboard"
                  className="bg-secondary text-white rounded-lg py-2 px-7 w-full text-sm"
                >
                  EkoDežė
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:flex space-x-14 text-sm">
                <button
                  className="bg-white rounded-lg py-2 px-7"
                  data-umami-event="Register button clicked"
                  onClick={() => {
                    setShow(true);
                    document.body.style.overflow = "hidden";
                  }}
                >
                  Registracija
                </button>
                <button
                  className="bg-secondary text-white rounded-lg py-2 px-7"
                  data-umami-event="Login button clicked"
                  onClick={() => {
                    setShow2(true);
                    document.body.style.overflow = "hidden";
                  }}
                >
                  Prisijungti
                </button>
              </div>
            </>
          )}

          <div className="flex md:hidden">
            <button
              onClick={() => setOpen(true)}
              data-umami-event="Menu button clicked"
            >
              <RiMenuFill className="text-4xl text-white" />
            </button>
          </div>
        </div>
        <div className="flex justify-center md:hidden">
          {isLogged && (
            <>
              <div className="flex space-x-14">
                <Link
                  href="/dashboard"
                  className="bg-secondary text-white rounded-lg py-2 px-7 w-full text-sm"
                >
                  EkoDežė
                </Link>
              </div>
            </>
          )}
        </div>
        {show && (
          <RegisterModal handleClose={handleClose} customTrack={customTrack} />
        )}
        {show2 && <LoginModal handleClose={handleClose} />}

        {open && (
          <>
            <div className="min-h-screen absolute top-0 right-0 w-full py-10 px-3 bg-black z-10">
              <div className="flex justify-end">
                <button
                  onClick={() => setOpen(false)}
                  className=""
                  data-umami-event="Close button clicked"
                >
                  <RiCloseCircleLine className="text-4xl text-white" />
                </button>
              </div>

              <div className="w-full h-96 flex justify-center items-center">
                {isLogged ? (
                  <>
                    <div className="w-3/4 mx-auto flex md:hidden flex-col justify-center items-center space-y-14">
                      <Link
                        href="/dashboard"
                        className="bg-secondary text-white rounded-lg py-2 px-7 w-full text-center text-sm"
                      >
                        EkoDežė
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-3/4 mx-auto flex md:hidden flex-col justify-center items-center space-y-14 text-sm">
                      <button
                        className="bg-white rounded-lg py-2 px-7 w-full"
                        onClick={() => {
                          setShow(true);
                          setOpen(false);
                        }}
                        data-umami-event="Register button clicked"
                      >
                        Registracija
                      </button>
                      <button
                        className="bg-secondary text-white rounded-lg py-2 px-7 w-full"
                        onClick={() => {
                          setShow2(true);
                          setOpen(false);
                        }}
                        data-umami-event="Login button clicked"
                      >
                        Prisijungti
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </>
    );
};

export default HomeNav;
