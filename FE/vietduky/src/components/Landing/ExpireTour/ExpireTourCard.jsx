import Icons from "@/components/Icons/Icon";
import { formatDate } from "@/utils/dateUtil";
import { useState, useEffect } from "react";

const ExpireTourCard = ({
  title,
  image,
  duration,
  seatsLeft,
  start_day,
  end_day,
  originalPrice,
  discountPrice,
  onClick,
}) => {
  const calculateInitialTimeLeft = () => {
    const startTime = new Date(start_day).getTime();
    const now = new Date().getTime();
    return Math.max(Math.floor((startTime - now) / 1000), 0);
  };

  const [timeLeft, setTimeLeft] = useState(calculateInitialTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0; // Dừng lại khi thời gian hết
        }
        return prevTime - 1; // Giảm 1 giây
      });
    }, 1000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  // Chuyển đổi giây thành định dạng hh:mm:ss
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <div
      onClick={onClick}
      className="sm:w-64 lg:w-96 md:w-80 px-2 px-2 py-3 bg-white hover:bg-gray-100 rounded-2xl flex flex-col gap-2 shadow cursor-pointer"
    >
      {/* Hình ảnh + Thời gian */}
      <div className="relative h-60 rounded-2xl overflow-hidden">
        <img
          src={
            image ||
            "https://pos.nvncdn.com/d75ecc-146199/art/artCT/20230807_oG6YHK3q.jpeg"
          }
          alt="Tour"
          className="w-full h-full object-cover rounded-2xl"
        />
        {/* <button className="absolute top-3 left-3 rounded-full shadow">
          <img src={Icons.Heart} alt="Heart" className="w-9 h-9" />
        </button> */}

        <div className="absolute bottom-3 left-3 bg-white px-3 py-2 rounded-[5px] flex justify-start items-center gap-1 shadow">
          <img src={Icons.Flame} />
          <span className="text-red-800 text-sm font-bold">Giờ chót</span>
        </div>

        <div className="absolute bottom-3 right-3 bg-white px-3 py-2 rounded-[5px] text-red-800 text-sm font-bold shadow">
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Tiêu đề */}
      <h3 className="text-sky-900 text-sm font-bold leading-tight truncate overflow-hidden whitespace-nowrap">
        {title}
      </h3>

      {/* Thông tin tour */}
      <div className="flex justify-between items-center text-blue-950 text-xs font-normal">
        <div className="flex items-center gap-2">
          <img src={Icons.Clock_3} />
          <span className="text-blue-950 text-xs">Thời gian: {duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <img src={Icons.ConciergeBell} />
          <img src={Icons.Plane} />
          <img src={Icons.Car} />
        </div>
      </div>

      <div className="flex justify-between items-center text-blue-950 text-xs font-normal">
        <span className="text-blue-950 text-xs">
          Ngày khởi hành:
          <span className="font-bold">{formatDate(start_day)}</span>
        </span>
        <span className="text-blue-950 text-xs">
          Ngày về:
          <span className="font-bold">{formatDate(end_day)}</span>
        </span>
      </div>

      {/* Số lượng chỗ ngồi */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <img src={Icons.AimChair} />
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

export default ExpireTourCard;
