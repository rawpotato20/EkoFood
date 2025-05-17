import React, { useEffect, useState } from "react";

//TODO: Swiper and Toast
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import toast from "react-hot-toast";

interface Review {
  name: string;
  comment: string;
  rating: number;
}

const ReviewSwiper = () => {
  const [reviewData, setReviewData] = useState<Review[]>([]);

  const fetchReviews = async () => {
    const res = await fetch("/api/view/review").then((res) => res.json());
    if (res.success) {
      setReviewData(res.data);
    } else {
      toast.error(res.message);
    }
  };
  useEffect(() => {
    fetchReviews();
  }, []);
  const duplicateSlides =
    reviewData.length > 0 ? [...reviewData, ...reviewData] : [];

  if (!reviewData || reviewData.length === 0) return null;
  return (
    <div className="w-full text-white md:w-4/5  overflow-y-auto z-30 mb-10">
      <div className="relative hidden md:flex mt-2 ">
        <Swiper
          loop={reviewData.length > 3}
          autoplay={{
            delay: 5000,
            disableOnInteraction: true,
          }}
          slidesPerView={3}
          spaceBetween={30}
          modules={[Autoplay]}
          className="mySwiper w-11/12"
        >
          {duplicateSlides?.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="flex flex-col space-y-4 border rounded p-3">
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
                <p className="text-sm">{review.comment}</p>
                <h3 className="font-medium ">{review.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="my-3 relative flex md:hidden">
        <Swiper
          loop={reviewData.length > 3}
          autoplay={{
            delay: 2000,
            disableOnInteraction: true,
          }}
          slidesPerView={1}
          spaceBetween={30}
          centeredSlides={true}
          modules={[Autoplay]}
          className="mySwiper w-11/12"
        >
          {duplicateSlides?.map((review, index) => (
            <SwiperSlide key={index} className="">
              <div className="w-11/12 mx-auto flex flex-col space-y-2 border rounded p-2 text-xs">
                <div className="flex flex-row w-full md:w-1/2 space-x-1">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <svg
                      key={index}
                      width="15"
                      height="12"
                      viewBox="0 0 20 19"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
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
                <h3 className="font-medium ">{review.name}</h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default ReviewSwiper;
