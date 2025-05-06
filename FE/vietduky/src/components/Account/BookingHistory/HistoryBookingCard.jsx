import { formatDayDMY } from "@/utils/dateUtil";
import { CalendarDays, User } from "lucide-react";
import React, { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import ModalFeedbackTour from "./ModalFeedbackTour";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiDotsThreeBold } from "react-icons/pi";
import BookingDetailModal from "./ModalDetailBooking";

const HistoryBookingCard = ({ booking }) => {
  const navigate = useNavigate();
  const [isDetailModalOpen, setDetailModalOpen] = useState(false);
  const [isFeedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const handleOpenFeedbackModal = () => setFeedbackModalOpen(true);
  const handleCloseFeedbackModal = () => setFeedbackModalOpen(false);
  const handleRebook = () => {
    navigate(`/bookingReConfirm?booking_code=${booking.booking_code}`);
  };

  return (
    <div>
      <div className="flex gap-6 items-center mb-4 border-b">
        <p className="text-sm mb-2">
          Mã đơn hàng:{" "}
          <span
            className="text-red-800 font-semibold cursor-not-allowed"
            // onClick={handleRebook}
          >
            {booking.booking_code || "Không có mã đơn hàng"}
          </span>
        </p>
        <p className="text-sm mb-2">
          Trạng thái:{" "}
          <span className="text-green-600 font-semibold">Đã hoàn thành</span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3
          className="text-[#A80F21] font-semibold text-xl mb-2 cursor-pointer hover:underline"
          onClick={() =>
            navigate(`/detail-booking-tour/${booking?.TravelTour?.Tour?.id}`)
          }
        >
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
                <span>{`${booking.number_adult} người lớn, ${booking.number_toddler} trẻ em, ${booking.number_children} trẻ nhỏ, ${booking.number_newborn} em bé`}</span>
              </div>
            </div>
            <p className="text-lg text-red-800 font-semibold mt-2">
              {booking?.total_cost.toLocaleString("vi-VN") + " VND" ||
                "Không có mã tour"}
            </p>
          </div>
          <div className="flex items-start gap-3 text-gray-600 text-lg">
            <button
              title="Đặt lại"
              className="hover:text-red-600"
              onClick={() => navigate(`/tour/${booking?.TravelTour?.Tour?.id}`)}
            >
              <AiOutlineLoading3Quarters />
            </button>
            <button
              title="Đánh giá"
              onClick={handleOpenFeedbackModal}
              className="hover:text-red-600"
            >
              <RiEditBoxLine />
            </button>
            <button
              title="Thông tin chi tiết"
              className="hover:text-red-600"
              onClick={() => setDetailModalOpen(true)}
            >
              <PiDotsThreeBold />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Đánh Giá */}
      <ModalFeedbackTour
        isOpen={isFeedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        booking={booking}
      />

      {/* Modal Chi Tiết */}
      <BookingDetailModal
        open={isDetailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        booking={booking}
      />
    </div>
  );
};

export default HistoryBookingCard;
