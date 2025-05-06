import Icons from "@/components/Icons/Icon";
import { FavouriteTourService } from "@/services/API/favourite_tour.service";
import React, { useState } from "react";

const TopicTourCard = ({
  id,
  name_tour,
  price_tour,
  day_number,
  album,
  userId,
  favoriteTours,
  setFavoriteTours,
  openLoginModal,
  typeTour,
}) => {
  const isFavorite = favoriteTours.some((favTour) => favTour.tour_id === id);

  const handleFavoriteToggle = async (event) => {
    event.stopPropagation();
    if (!userId) {
      openLoginModal();
      return;
    }
    const data = { user_id: userId, tour_id: id };

    if (isFavorite) {
      // Xóa tour khỏi danh sách yêu thích
      await FavouriteTourService.remove(data);
      setFavoriteTours((prev) =>
        prev.filter((favTour) => favTour.tour_id !== id)
      );
    } else {
      // Thêm tour vào danh sách yêu thích
      await FavouriteTourService.add(data);
      setFavoriteTours((prev) => [...prev, { tour_id: id }]);
    }
  };
  console.log("Type tour", typeTour);

  return (
    <div
      className="lg:w-96 md:w-80 px-2 py-3 bg-white rounded-2xl flex flex-col gap-2 hover:bg-gray-300 cursor-pointer relative group sm:w-80"
      onClick={() => navigate(`/tour/${id}`)}
    >
      <div className="absolute z-10 flex flex-col items-center -left-0 top-5 bg-red-800 shadow-md">
        <span className="text-white text-sm px-3 py-2.5 font-bold leading-tight">
          ✨ {typeTour?.name_type}
        </span>
        <div className="absolute -bottom-2 bg-red-900 -left-0 w-0 h-0 border-r-[8px] border-r-transparent border-b-[8px] border-b-white group-hover:border-b-gray-300 opacity-90" />{" "}
      </div>
      {/* Hình ảnh + Thời gian */}
      <div className="relative h-60 rounded-2xl overflow-hidden">
        <img
          src={album[0]}
          alt="Tour"
          className="w-full h-full object-cover rounded-2xl"
        />
        <button
          className={`absolute top-3 right-3 transition-all duration-300 `}
          onClick={handleFavoriteToggle}
        >
          <img
            src={isFavorite ? Icons.HeartRed : Icons.Heart}
            alt="Heart"
            className="w-9 h-9"
          />
        </button>
      </div>
      {/* Tiêu đề */}
      <h3 className="text-sky-900 text-base font-bold leading-tight truncate overflow-hidden whitespace-nowrap">
        {name_tour}
      </h3>
      {/* Thông tin tour */}
      {/* <div className="flex justify-between items-center text-blue-950 text-xs font-normal">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img src={Icons.Clock_3} alt="Clock" className="w-4 h-4" />
            <span>Thời gian: {day_number > 1
              ? `${day_number} Ngày ${day_number - 1} Đêm`
              : `${day_number} Ngày ${day_number} Đêm`}</span>
          </div>
        </div>
      </div> */}
      <div className="flex justify-between items-center text-blue-950 text-xs font-normal">
        <div className="flex items-center gap-2">
          <img src={Icons.Clock_3} alt="Clock" className="w-4 h-4" />
          <span>Thời gian: {day_number > 1
              ? `${day_number} Ngày ${day_number - 1} Đêm`
              : `${day_number} Ngày ${day_number} Đêm`}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={Icons.ConciergeBell} alt="Concierge" className="w-4 h-4" />
          <img src={Icons.Plane} alt="Plane" className="w-4 h-4" />
          <img src={Icons.Car} alt="Car" className="w-4 h-4" />
        </div>
      </div>
      {/* Giá cả */}
      <p className="text-gray-500 text-xs">Giá mỗi đêm chưa gồm thuế và phí</p>
      <p className="text-red-800 text-xl font-bold leading-7">
        {Number(price_tour).toLocaleString("vi-VN")} VNĐ
      </p>
    </div>
  );
};

export default TopicTourCard;
