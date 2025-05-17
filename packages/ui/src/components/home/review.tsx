import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import RegisterModal from "../user/register-modal";
import LoginModal from "../user/login-modal";

//TODO: Swiper?
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import "swiper/css";
// import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";

//TODO: LucideIcons
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

interface ReviewItem {
  name: string;
  comment: string;
  rating: number; // should be 0–5
}

interface ReviewProps {
  data: ReviewItem[];
  handleClick: (id: string, step: number) => void;
  customTrack: (id: string, step: number) => void;
}

const Review = (props: ReviewProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const swiper = useSwiper();

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

  return (
    <>
      <div className="bg-secondary text-white py-16 md:py-24 mb-10">
        <div className="container mx-auto px-3 md:px-0 my-24 space-y-10">
          <div
            className="text-xl md:text-4xl font-medium text-center text-[#B7B3AD]"
            data-aos="fade-up"
          >
            Kodėl mumis <span className="text-[#B7B3AD]">pasitiki</span>?
          </div>
          <div className="my-10 relative hidden md:flex" data-aos="fade-up">
            <Swiper
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
              }}
              slidesPerView={3}
              spaceBetween={30}
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              className="mySwiper w-11/12"
            >
              {props.data.map((review, index) => (
                <SwiperSlide key={index}>
                  <div className="flex flex-col space-y-4 border rounded p-5">
                    <div className="flex flex-row space-x-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <svg
                          key={index}
                          width="20"
                          height="19"
                          viewBox="0 0 20 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                        >
                          <path
                            d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z"
                            fill={
                              index + 1 <= review.rating ? "#FFD700" : "#D1D5DB"
                            } // Gold color for filled, gray for unfilled
                          />
                        </svg>
                      ))}
                    </div>
                    <p>{review.comment}</p>
                    <h3 className="font-medium text-[#282938]">
                      {review.name}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute top-[45%] w-full flex flex-row justify-between items-center">
              <div>
                <button
                  className="swiper-button-prev"
                  onClick={() => {
                    props.handleClick("review_left", 1);
                    props.customTrack("review_left", 1);
                  }}
                  data-umami-event="Review Left Button Clicked"
                >
                  <FaArrowLeft className="text-white text-2xl" />
                </button>
              </div>
              <div>
                <button
                  className="swiper-button-next"
                  onClick={() => {
                    props.handleClick("review_right", 1);
                    props.customTrack("review_right", 1);
                  }}
                  data-umami-event="Review Right Button Clicked"
                >
                  <FaArrowRight className="text-white text-2xl" />
                </button>
              </div>
            </div>
          </div>

          <div className="my-10 relative flex md:hidden" data-aos="fade-up">
            <Swiper
              loop={true}
              autoplay={{
                delay: 5000,
                disableOnInteraction: true,
              }}
              slidesPerView={1}
              spaceBetween={30}
              centeredSlides={true}
              modules={[Navigation, Autoplay]}
              navigation={{
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
              }}
              className="mySwiper w-11/12"
            >
              {props.data.map((review, index) => (
                <SwiperSlide key={index} className="">
                  <div className="w-11/12 mx-auto flex flex-col space-y-4 border rounded p-5">
                    <div className="flex flex-row space-x-1">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <svg
                          key={index}
                          width="20"
                          height="19"
                          viewBox="0 0 20 19"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                        >
                          <path
                            d="M9.07088 0.612343C9.41462 -0.204115 10.5854 -0.204114 10.9291 0.612346L12.9579 5.43123C13.1029 5.77543 13.4306 6.01061 13.8067 6.0404L19.0727 6.45748C19.9649 6.52814 20.3267 7.62813 19.6469 8.2034L15.6348 11.5987C15.3482 11.8412 15.223 12.2218 15.3106 12.5843L16.5363 17.661C16.744 18.5211 15.7969 19.201 15.033 18.7401L10.5245 16.0196C10.2025 15.8252 9.7975 15.8252 9.47548 16.0196L4.96699 18.7401C4.20311 19.201 3.25596 18.5211 3.46363 17.661L4.68942 12.5843C4.77698 12.2218 4.65182 11.8412 4.36526 11.5987L0.353062 8.2034C-0.326718 7.62813 0.0350679 6.52814 0.927291 6.45748L6.19336 6.0404C6.5695 6.01061 6.89716 5.77543 7.04207 5.43123L9.07088 0.612343Z"
                            fill={
                              index + 1 <= review.rating ? "#FFD700" : "#D1D5DB"
                            } // Gold color for filled, gray for unfilled
                          />
                        </svg>
                      ))}
                    </div>
                    <p>{review.comment}</p>
                    <h3 className="font-medium text-[#282938]">
                      {review.name}
                    </h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <div className="absolute top-[45%] w-full flex flex-row justify-between items-center">
              <div>
                <button
                  className="swiper-button-prev"
                  onClick={() => {
                    props.handleClick("review_left", 1);
                    props.customTrack("review_left", 1);
                  }}
                  data-umami-event="Review Left Button Clicked"
                >
                  <FaArrowLeft className="text-white text-2xl" />
                </button>
              </div>
              <div>
                <button
                  className="swiper-button-next"
                  onClick={() => {
                    props.handleClick("review_right", 1);
                    props.customTrack("review_right", 1);
                  }}
                  data-umami-event="Review Right Button Clicked"
                >
                  <FaArrowRight className="text-white text-2xl" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          <button
            className="bg-white rounded-lg py-2 px-7 text-black text-base"
            onClick={() => {
              setShow(true);
              props.handleClick("reg_btn_4", 1);
              props.customTrack("reg_btn_4", 1);
            }}
            data-umami-event="Join Our community  Button Clicked On Review"
          >
            Prisijunk prie šios bendruomenės!
          </button>
        </div>
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

export default Review;
