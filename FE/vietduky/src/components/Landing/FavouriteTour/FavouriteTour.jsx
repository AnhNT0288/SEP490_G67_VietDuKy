import { useNavigate } from "react-router-dom";
import FavouriteTourCard from "./FavouriteTourCard";
import React from "react";

const tours = [
  {
    id: 1,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    Price: "9.900.000 VNĐ",
    type_tour: "Tiêu chuẩn",
  },
  {
    id: 2,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    Price: "9.900.000 VNĐ",
    type_tour: "Tiêu chuẩn",
  },
  {
    id: 3,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    Price: "9.900.000 VNĐ",
    type_tour: "Tiết kiệm",
  },
  {
    id: 4,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    Price: "9.900.000 VNĐ",
    type_tour: "Cao cấp",
  },
  {
    id: 5,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    Price: "9.900.000 VNĐ",
    type_tour: "Cao cấp",
  },
  {
    id: 6,
    image: "/images/tour1.jpg",
    title: "Tour Côn Đảo 2N2Đ bằng Xe Giường Nằm + Tàu Cao Tốc",
    start_day: "2023-10-01",
    end_day: "2023-10-05",
    timeLeft: "2 Ngày 3 Giờ",
    duration: "5 Ngày 4 Đêm",
    seatsLeft: 14,
    Price: "9.900.000 VNĐ",
    type_tour: "Cao cấp",
  },
];

const FavouriteTour = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white">
      <div className="py-10 w-4/5 mx-auto relative p-6 ">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-[#A80F21]">
            Tour du lịch được yêu thích nhất
          </p>
          <p className="text-zinc-900 mt-2">
            Khám phá những hành trình được yêu thích nhất, chinh phục mọi cảm
            xúc!
          </p>
          <div className="w-1/5 h-1 bg-red-800 rounded-sm mt-2" />
        </div>
        <div className="flex flex-wrap justify-between gap-12 mt-6 mx-auto">
          {tours.map((tour) => (
            <div className="relative box-border" key={tour.id}>
              <FavouriteTourCard {...tour} />
            </div>
          ))}
        </div>
        <div className="text-center mt-9">
          <button onClick={() => navigate("/listTour")} className="bg-white border border-red-500 text-red-500 px-10 py-3 font-semibold rounded-md hover:bg-red-500 hover:text-white transition duration-300">
            Xem thêm Tours
          </button>
        </div>
      </div>
    </div>
  );
};

export default FavouriteTour;
