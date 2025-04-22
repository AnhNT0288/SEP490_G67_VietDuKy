import React, { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import image from "../../../assets/images/TopTour.png";
import TopTourCard from "./TopTourCard";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const tours = [
  {
    id: 1,
    image: `${image}`,
    title: "Keio Plaza Hotel Tokyo",
    duration: "5 Ngày 4 Đêm",
    oldPrice: "13.332.146 VNĐ",
    newPrice: "9.999.110 VNĐ",
    badge: "Tiết kiệm 25%",
    location: "Vị trí tốt",
  },
  {
    id: 2,
    image: `${image}`,
    title: "Keio Plaza Hotel Tokyo",
    duration: "5 Ngày 4 Đêm",
    oldPrice: "13.332.146 VNĐ",
    newPrice: "9.999.110 VNĐ",
    badge: "Tiết kiệm 25%",
    location: "Vị trí tốt",
  },
  {
    id: 3,
    image: `${image}`,
    title: "Keio Plaza Hotel Tokyo",
    duration: "5 Ngày 4 Đêm",
    oldPrice: "13.332.146 VNĐ",
    newPrice: "9.999.110 VNĐ",
    badge: "Tiết kiệm 25%",
    location: "Vị trí tốt",
  },
  {
    id: 4,
    image: `${image}`,
    title: "Keio Plaza Hotel Tokyo",
    duration: "5 Ngày 4 Đêm",
    oldPrice: "13.332.146 VNĐ",
    newPrice: "9.999.110 VNĐ",
    badge: "Tiết kiệm 25%",
    location: "Vị trí tốt",
  },
  {
    id: 5,
    image: `${image}`,
    title: "Keio Plaza Hotel Tokyo",
    duration: "5 Ngày 4 Đêm",
    oldPrice: "13.332.146 VNĐ",
    newPrice: "9.999.110 VNĐ",
    badge: "Tiết kiệm 25%",
    location: "Vị trí tốt",
  },
  {
    id: 6,
    image: `${image}`,
    title: "Keio Plaza Hotel Tokyo",
    duration: "5 Ngày 4 Đêm",
    oldPrice: "13.332.146 VNĐ",
    newPrice: "9.999.110 VNĐ",
    badge: "Tiết kiệm 25%",
    location: "Vị trí tốt",
  },
];

const TopTours = () => {
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
    <div className="py-10 w-4/5 mx-auto relative p-6">
      <div className="flex flex-col">
        <p className="text-2xl font-bold text-pink-500">
          Top Tour cho trải nghiệm đáng nhớ
        </p>
        <p className="text-zinc-900 mt-2">
          Đặt Tour vi vu mùa hoa anh đào ngay
        </p>
        <div className="w-1/5 h-1 bg-[#FE3F95] rounded-sm mt-2" />
      </div>

      <div className="flex flex-row items-start justify-between mt-6 gap-1">
        {/* Banner khuyến mãi */}
        <div className="w-1/5 h-[412px] bg-gradient-to-r from-pink-100 to-pink-300 rounded-xl p-5 flex flex-col items-center justify-center mb-6">
          <h3 className="text-xl font-bold text-pink-700">Mùa Sale 🌸</h3>
          <p className="text-lg font-semibold text-gray-700">
            Tour du lịch đáng nhớ, khó quên
          </p>
          <p className="text-4xl font-bold text-pink-700">Giảm đến 1 triệu</p>
          <div className="bg-red-600 text-white text-sm px-4 py-2 rounded-full mt-2">
            Flash Sale 21-23H
          </div>
          <button className="mt-4 px-6 py-2 bg-blue-600 text-white font-bold rounded-full">
            Xem thêm tour
          </button>
        </div>

        {/* Danh sách tour */}
        <div className="relative w-4/5">
          <Swiper
            ref={swiperRef}
            slidesPerView={4}
            spaceBetween={10}
            navigation={false}
            modules={[Navigation]}
            className="mySwiper"
            onSlideChange={handleSlideChange}
          >
            {tours.slice(0, 10).map((tour) => (
              <SwiperSlide className="my-2" key={tour.id}>
                <TopTourCard {...tour} />
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Nút điều hướng tùy chỉnh */}
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

      <div className="text-center mt-1">
        <button
          onClick={() => navigate("/listTour")}
          className="bg-red-500 border border-red-500 text-white px-10 py-3 font-semibold rounded-md hover:bg-white hover:text-red-500 transition duration-300 shadow-lg"
        >
          Xem thêm Tours
        </button>
      </div>
    </div>
  );
};

export default TopTours;
