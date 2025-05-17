import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterModal from "../user/register-modal";
import LoginModal from "../user/login-modal";
import * as fbq from "@/packages/utils/src/fpixel";

//TODO: Nookies
import { parseCookies } from "nookies";

interface WelcomeData {
  heading: string;
  text: string;
}

interface Welcome2Props {
  data: WelcomeData;
  customTrack: (id: string, step: number) => void;
}

const Welcome2 = (props: Welcome2Props) => {
  const router = useRouter();
  const pathname = usePathname();

  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose = (index: number, value: boolean) => {
    if (index === 1) {
      setShow(value);
    } else {
      setShow2(value);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
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

  const handleClick = (name: string, value: number) => {
    fbq.event(name, { value: value });
  };

  return (
    <>
      <div className="w-full py-24 relative min-h-screen flex justify-center items-center">
        <video
          className="absolute inset-0 top-0 left-0 w-full min-h-screen object-cover"
          playsInline
          autoPlay
          muted
          loop
        >
          <source
            src="/video-summer.mp4"
            // src="/video.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="container mx-auto px-3 md:px-0 flex flex-row justify-between items-center text-white">
          <div className="space-y-7 md:w-1/3 text-sm" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl font-medium">
              {props.data.heading
                ? props.data.heading
                : "Maistas jūsų sveikatai"}
            </h1>
            <p
              className="text-lg"
              dangerouslySetInnerHTML={{
                __html: props.data.text,
              }}
            />
            {/* <p className="text-lg">
                        {props.data.text
                            ? props.data.text
                            : "Lorem ipsum dolor sit amet consectetur. Morbi sed velit at et in elementum. Et in egestas interdum nunc. Nec enim sit netus vitae viverra. Sed quis ut ac suspendisse."}
                    </p> */}
            {!isLogged && (
              <button
                className="bg-secondary text-white rounded-lg py-2 px-7"
                onClick={() => {
                  setShow(true);
                  handleClick("reg_btn_2", 1);
                  props.customTrack("reg_btn_2", 1);
                }}
                data-umami-event="Join Our community Button Clicked Welcome Page"
              >
                Prisijunk prie mūsų bendruomenės!
              </button>
            )}
          </div>
          <div
            className="w-2/3 hidden md:flex justify-center"
            data-aos="zoom-in"
          >
            <Image
              src="/cart-box.png"
              alt="Welcome to Eko Maistas"
              width="0"
              height="0"
              sizes="100vw"
              className="w-[530px] h-auto bg-cover"
            />
          </div>
        </div>
      </div>
      {show && (
        <RegisterModal
          handleClose={handleClose}
          handleClick={handleClick}
          customTrack={props.customTrack}
        />
      )}
      {show2 && <LoginModal handleClose={handleClose} />}
    </>
  );
};

export default Welcome2;
