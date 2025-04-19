import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation } from "swiper/modules";
import RelatedTourCard from "./RelatedTourCard";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function RelatedTours({ relatedTours = [] }) {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  const navigate = useNavigate();

  const handleSlideChange = (swiper) => {
    setIsBeginning(swiper.isBeginning);
    setIsEnd(swiper.isEnd);
  };

  const handlePrev = () => {
    if (swiperRef.current) {
    swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current) {
    swiperRef.current.swiper.slideNext();
    }
  };

  return (
    <div className="mx-auto mt-8 p-4 border bg-transparent">
      <div className="my-2">
        <p className="text-zinc-900/75 text-lg font-medium leading-7 ml-4">
          Tours du lịch liên quan
        </p>
      </div>

      <div className="relative">
        <Swiper
          ref={swiperRef}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          breakpoints={{
            640: { slidesPerView: 1.2 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation={false}
          className="mySwiper"
          modules={[Navigation]}
          onSlideChange={handleSlideChange}
        >
          {relatedTours.map((tour) => (
            <SwiperSlide key={tour.id}>
              <RelatedTourCard {...tour} />
            </SwiperSlide>
          ))}
        </Swiper>
        {!isBeginning && (
          <div className="absolute top-1/2 transform -translate-y-1/2 left-0 z-10">
            <button
              className="bg-white rounded-full p-2 shadow-lg hover:bg-red-500 text-[#A80F21] hover:text-white"
              onClick={handlePrev}
            >
              <IoIosArrowBack size={20} />
            </button>
          </div>
        )}
        {!isEnd && (
          <div className="absolute top-1/2 transform -translate-y-1/2 right-0 z-10">
            <button
              className="bg-white rounded-full p-2 shadow-lg hover:bg-red-500 text-[#A80F21] hover:text-white"
              onClick={handleNext}
            >
              <IoIosArrowForward size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
