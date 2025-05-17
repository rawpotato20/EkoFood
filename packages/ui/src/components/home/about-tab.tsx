import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterModal from "../user/register-modal";
import LoginModal from "../user/login-modal";
import { parseCookies } from "nookies";

interface AboutTabData {
  image: string;
  textTitle1: string;
  textDescription1: string;
  textTitle2: string;
  textDescription2: string;
  textTitle3: string;
  textDescription3: string;
  textTitle4: string;
  textDescription4: string;
}

interface AboutTabProps {
  data: AboutTabData;
  handleClick: (id: string, step: number) => void;
  customTrack: (id: string, step: number) => void;
}

const AboutTab = (props: AboutTabProps) => {
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

  return (
    <>
      <div className="container mx-auto px-3 md:px-0 flex flex-col md:flex-row justify-between my-10">
        <div className="md:w-2/5" data-aos="fade-right">
          <Image src={props.data.image} alt="image" width={643} height={499} />
          <br />
          {!isLogged && (
            <button
              className="hidden md:flex justify-center bg-secondary text-white rounded-lg py-2 w-full"
              onClick={() => {
                setShow(true);
                props.handleClick("reg_btn_3", 1);
                props.customTrack("reg_btn_3", 1);
              }}
              data-umami-event="Register Button Clicked About Page"
            >
              Registruokis ir pasirink sveikatą!
            </button>
          )}
        </div>
        <div
          className="md:w-1/2 text-sm md:text-base lg:text-lg space-y-4 flex flex-col"
          data-aos="fade-up"
        >
          <div className="flex flex-row justify-between items-center space-x-4">
            <div className="w-1/12 flex justify-end items-start h-full">
              <div className="bg-primary rounded-full text-xs text-white w-8 h-8 flex justify-center items-center">
                1
              </div>
            </div>
            <div className="w-11/12">
              <h3 className="font-medium">{props.data.textTitle1}</h3>
              <p className="text-gray-700 text-sm">
                {props.data.textDescription1}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center space-x-4">
            <div className="w-1/12 flex justify-end items-start h-full">
              <div className="bg-primary rounded-full text-xs text-white w-8 h-8 flex justify-center items-center">
                2
              </div>
            </div>
            <div className="w-11/12">
              <h3 className="font-medium">{props.data.textTitle2}</h3>
              <p className="text-gray-700 text-sm">
                {props.data.textDescription2}
              </p>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center space-x-4">
            <div className="w-1/12 flex justify-end items-start h-full">
              <div className="bg-primary rounded-full text-xs text-white w-8 h-8 flex justify-center items-center">
                3
              </div>
            </div>
            <div className="w-11/12">
              <h3 className="font-medium">{props.data.textTitle3}</h3>
              <p
                className="text-gray-700 text-sm"
                dangerouslySetInnerHTML={{
                  __html: props.data.textDescription3,
                }}
              ></p>
            </div>
          </div>
          <div className="flex flex-row justify-between items-center space-x-4">
            <div className="w-1/12 flex justify-end items-start h-full">
              <div className="bg-primary rounded-full text-xs text-white w-8 h-8 flex justify-center items-center">
                4
              </div>
            </div>
            <div className="w-11/12">
              <h3 className="font-medium">{props.data.textTitle4}</h3>
              <p className="text-gray-700 text-sm">
                {props.data.textDescription4}
              </p>
            </div>
          </div>
          {/* <div className="flex flex-row justify-between items-center space-x-4">
                        <div className="w-1/12 flex justify-end items-end">
                            <div className="bg-primary rounded-full text-xs text-white w-8 h-8 flex justify-center items-center">
                                5
                            </div>
                        </div>
                        <div className="w-11/12">
                            <h3 className="font-medium">
                                {props.data.textTitle5}
                            </h3>
                            <p>{props.data.textDescription5}</p>
                        </div>
                    </div> */}
        </div>
        {!isLogged && (
          <button
            className="text-sm flex md:hidden justify-center mt-5 bg-secondary text-white rounded-lg py-2 w-full text-center"
            onClick={() => {
              setShow(true);
              props.handleClick("reg_btn_3", 1);
              props.customTrack("reg_btn_3", 1);
            }}
            data-umami-event="Register Button Clicked About Page"
          >
            Registruokis ir pasirink sveikatą!
          </button>
        )}
      </div>
      {show && (
        <RegisterModal
          handleClose={handleClose}
          handleClick={props.handleClick}
          customTrack={props.customTrack}
        />
      )}
      {show2 && <LoginModal handleClose={handleClose} />}
    </>
  );
};

export default AboutTab;
