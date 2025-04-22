import Icons from "@/components/Icons/Icon";
import { formatDate } from "@/utils/dateUtil";
import React from "react";

const PreferentialTourCard = ({
  title,
  duration,
  seatsLeft,
  start_day,
  end_day,
  type_tour,
  originalPrice,
  discountPrice,
}) => {
  return (
    <div className="w-96 px-2 py-3 bg-white rounded-2xl flex flex-col gap-4 hover:bg-gray-300 cursor-pointer relative group">
      <div className="absolute z-10 flex flex-col items-center -left-0 bg-red-800 shadow-md">
        <span className="text-white text-sm px-3 py-2.5 font-bold leading-tight">
          ✨ {type_tour}
        </span>
        <div className="absolute -bottom-2 bg-red-900 -left-0 w-0 h-0 border-r-[8px] border-r-transparent border-b-[8px] border-b-white group-hover:border-b-gray-300 opacity-90" />{" "}
      </div>
      {/* Hình ảnh + Thời gian */}
      <div className="relative h-60 rounded-2xl overflow-hidden">
        <img
          src="https://pos.nvncdn.com/d75ecc-146199/art/artCT/20230807_oG6YHK3q.jpeg"
          alt="Tour"
          className="w-full h-full object-cover rounded-2xl"
        />
        <button className="absolute top-3 right-3 rounded-full shadow transition-all duration-300 hover:bg-red-500 hover:text-white">
          <img src={Icons.Heart} alt="Heart" className="w-9 h-9" />
        </button>
      </div>
      {/* Tiêu đề */}
      <h3 className="text-sky-900 text-base font-bold leading-tight">
        {title}
      </h3>
      {/* Thông tin tour */}
      <div className="flex justify-between items-center text-blue-950 text-xs font-normal">
        <div className="flex items-center gap-2">
          <img src={Icons.Clock_3} alt="Clock" className="w-4 h-4" />
          <span>Thời gian: {duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={Icons.ConciergeBell} alt="Concierge" className="w-4 h-4" />
          <img src={Icons.Plane} alt="Plane" className="w-4 h-4" />
          <img src={Icons.Car} alt="Car" className="w-4 h-4" />
        </div>
      </div>
      <div className="flex justify-between items-center text-blue-950 text-xs font-normal">
        <span>
          Ngày khởi hành:
          <span className="font-bold"> {formatDate(start_day)}</span>
        </span>
        <span>
          Ngày về:
          <span className="font-bold"> {formatDate(end_day)}</span>
        </span>
      </div>
      {/* Số lượng chỗ ngồi */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <img src={Icons.AimChair} alt="Seats" className="w-4 h-4" />
          <span className="text-neutral-900 text-sm">
            Số lượng chỗ ngồi còn trống:
          </span>
        </div>
        <span className="text-red-800 text-sm font-bold">{seatsLeft}</span>
      </div>
      {/* Giá cả */}
      <p className="text-gray-500 text-xs">Giá mỗi đêm chưa gồm thuế và phí</p>
      <p className="text-gray-900 text-sm">
        <span className="font-bold">Biểu giá: </span>
        <span className="line-through text-zinc-900 text-opacity-90 font-medium">
          {originalPrice}
        </span>
      </p>
      <p className="text-red-800 text-xl font-bold leading-7">
        {discountPrice}
      </p>
    </div>
  );
};

export default PreferentialTourCard;
