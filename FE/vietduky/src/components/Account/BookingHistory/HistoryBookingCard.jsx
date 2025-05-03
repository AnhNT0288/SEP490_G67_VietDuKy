import { formatDayDMY } from "@/utils/dateUtil";
import { CalendarDays, User } from "lucide-react";
import React, { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ModalFeedbackTour from "./ModalFeedbackTour";

const HistoryBookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleRebook = () => {
    navigate(`/bookingReConfirm?booking_code=${booking.booking_code}`);
  };

  return (
    <div>
      <div className="flex gap-6 items-center mb-4 border-b">
        <p className="text-sm mb-2">
          Mã đơn hàng:{" "}
          <span className="text-red-800 font-semibold cursor-pointer" onClick={handleRebook}>
            {booking.booking_code || "Không có mã đơn hàng"}
          </span>
        </p>
        <p className="text-sm mb-2">
          Trạng thái:{" "}
          <span className="text-green-600 font-semibold">Đã thanh toán</span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-[#A80F21] font-semibold text-xl mb-2">
          {booking?.TravelTour?.Tour?.name_tour || "Tên tour không có"}
        </h3>
        <div className="flex gap-4">
          {/* Ảnh tour */}
          <div className="w-32 h-24 overflow-hidden rounded">
            <img
              src={
                booking.travel_tour?.Tour?.album?.[0] ||
                "https://via.placeholder.com/150"
              }
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thông tin tour */}
          <div className="flex-1">
            <div className="flex items-center text-sm text-gray-600 gap-6">
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                <span>{`${formatDayDMY(
                  booking?.TravelTour?.start_day
                )} → ${formatDayDMY(booking?.TravelTour?.end_day)}`}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{`${booking.number_adult} người lớn, ${booking.number_children} trẻ em`}</span>
              </div>
            </div>
            <p className="text-lg text-red-800 font-semibold mt-2">
              {booking?.total_cost.toLocaleString("vi-VN") + " VND" ||
                "Không có mã tour"}
            </p>
          </div>
          <div className="flex items-start gap-3 text-gray-600 text-lg">
            <button
              title="Đánh giá"
              onClick={handleOpenModal}
              className="hover:text-red-600"
            >
              <RiEditBoxLine />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Đánh Giá */}
      <ModalFeedbackTour
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        booking={booking}
      />
    </div>
  );
};

export default HistoryBookingCard;
