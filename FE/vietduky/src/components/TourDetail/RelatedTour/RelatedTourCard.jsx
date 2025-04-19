import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlane, FaBus } from "react-icons/fa";
import { MdCalendarToday } from "react-icons/md";
import Icons from "@/components/Icons/Icon";

const RelatedTourCard = ({
  id,
  name_tour,
  price_tour,
  day_number,
  album,
  typeTour,
}) => {
  const navigate = useNavigate();

  return (
    <div
      className=" px-2 py-3 bg-white flex flex-col gap-2 relative group"
      onClick={() => navigate(`/tour/${id}`)}
    >
      {/* Ribbon label */}
      <div className="absolute z-10 flex flex-col items-center -left-0 bg-red-800 shadow-md">
        <span className="text-white text-sm px-3 py-2.5 font-bold leading-tight">
          ✨ {typeTour?.name_type || "Mặc định"}
        </span>
        <div className="absolute -bottom-2 bg-red-900 -left-0 w-0 h-0 border-r-[8px] border-r-transparent border-b-[8px] border-b-white group-hover:border-b-gray-200 opacity-90" />{" "}
      </div>
      <div className="shadow-md hover:bg-gray-200 cursor-pointer">
        {/* Image */}
        <div className="h-[250px] w-full overflow-hidden">
          <img
            src={album?.[0]}
            alt={name_tour}
            className="w-full h-full object-cover"
          />
        </div>
        {/* Content */}
        <div className="p-4 flex flex-col gap-4">
          <h3 className="text-sky-900 text-base font-bold">{name_tour}</h3>

          {/* Duration + Icons */}
          <div className="flex items-center text-gray-700 text-sm gap-2">
            <img src={Icons.Clock_3} className="w-5 h-5" />
            <span className="text-blue-950 text-sm">
              {day_number > 1
                ? `${day_number} Ngày ${day_number - 1} Đêm`
                : `${day_number} Ngày ${day_number} Đêm`}
            </span>
            <img src={Icons.ConciergeBell} className="ml-auto" />
            <img src={Icons.Plane} className="" />
            <img src={Icons.Car} />
          </div>

          {/* Price */}
          <p className="text-red-800 font-bold text-lg">
            {Number(price_tour).toLocaleString("vi-VN")} VNĐ
          </p>
          <p className="text-gray-500 text-xs">
            Giá mỗi đêm chưa gồm thuế và phí
          </p>
        </div>
      </div>
    </div>
  );
};

export default RelatedTourCard;
