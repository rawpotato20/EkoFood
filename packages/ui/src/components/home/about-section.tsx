import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterModal from "../user/register-modal";
import LoginModal from "../user/login-modal";
import { parseCookies } from "nookies";

const AboutSection = (props) => {
    const router = useRouter();
    const pathname = usePathname();

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

    return (
        <>
            <div className="container mx-auto px-3 md:px-0 flex flex-col md:flex-row justify-between my-10">
                <div className="md:w-2/5" data-aos="fade-right">
                    <Image
                        src={props.data.image}
                        alt="image"
                        width={643}
                        height={499}
                    />
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
                    className="md:w-1/2 text-base md:text-base lg:text-lg"
                    data-aos="fade-right"
                >
                    {/* {props.data.text} */}
                    <p dangerouslySetInnerHTML={{ __html: props.data.text }} />
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

export default AboutSection;
