import Icons from "@/components/Icons/Icon";
import React from "react";

const TopTourCard = ({
  image,
  title,
  badge,
  location,
  duration,
  oldPrice,
  newPrice,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow duration-300 cursor-pointer hover:bg-gray-300">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-52 object-cover" />
        <button className="absolute top-3 left-3 rounded-full transition-all duration-300">
          <img src={Icons.Heart} alt="Heart" className="w-8 h-8" />
        </button>
        <div className="absolute bottom-3 left-0 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1.5 ">
          {badge}
        </div>
      </div>

      <div className="bg-[#A80F21] text-center relative py-0.5">
        <span className="text-white text-xs">{location}</span>
      </div>

      {/* Nội dung */}
      <div className="px-2 py-3 gap-1.5 flex flex-col mb-6">
        <h3 className="font-bold text-sm text-neutral-700">{title}</h3>
        <div className="flex justify-between items-center text-blue-950 text-xs font-normal">
          <div className="flex items-center gap-2">
            <img src={Icons.Clock_3} alt="Clock" className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={Icons.ConciergeBell}
              alt="Concierge"
              className="w-4 h-4"
            />
            <img src={Icons.Plane} alt="Plane" className="w-4 h-4" />
            <img src={Icons.Car} alt="Car" className="w-4 h-4" />
          </div>
        </div>
          <span className="text-neutral-400 line-through text-xs">
            {oldPrice}
          </span>
          <span className="text-red-600 font-bold text-sm">{newPrice}</span>
        <p className="text-neutral-400 font-normal text-xs">
          Chưa bao gồm thuế và phí
        </p>
      </div>
    </div>
  );
};

export default TopTourCard;
