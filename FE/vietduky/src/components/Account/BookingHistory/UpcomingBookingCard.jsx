import Icons from "@/components/Icons/Icon";
import { formatDayDMY } from "@/utils/dateUtil";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { PiDotsThreeBold } from "react-icons/pi";
import BookingDetailModal from "./ModalDetailBooking";
import { useState } from "react";

export default function UpcomingBookingCard({ booking }) {
  const [openModal, setOpenModal] = useState(false);
  const navigate = useNavigate();
  const handleRebook = () => {
    if (booking.status === 0 || booking.status === 1) {
      navigate(`/bookingReConfirm?booking_code=${booking.booking_code}`);
    }
  };

  return (
    <>
      <div className="flex gap-6 items-center mb-4 border-b">
        <p className="text-sm mb-2">
          Mã đơn hàng:{" "}
          <span
            className={`font-semibold ${
              booking.status === 0 || booking.status === 1
                ? "text-red-800 cursor-pointer hover:underline"
                : "text-red-800 cursor-not-allowed"
            }`}
            onClick={handleRebook}
          >
            {booking.booking_code || "Không có mã đơn hàng"}
          </span>
        </p>
        <p className="text-sm mb-2">
          Trạng thái:{" "}
          <span
            className={`${
              booking.status === 0
                ? "text-blue-950"
                : booking.status === 1
                ? "text-green-600"
                : booking.status === 2
                ? "text-green-600"
                : "text-red-800"
            } font-semibold`}
          >
            {booking.status === 0
              ? "Chờ thanh toán"
              : booking.status === 1
              ? "Đã đặt cọc"
              : booking.status === 2
              ? "Đã thanh toán"
              : booking.status === 3
              ? "Đã hủy chuyến đi"
              : booking.status === 4
              ? "Đã hoàn tiền"
              : "Quá hạn"}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2">
        <h3
          onClick={() =>
            navigate(`/detail-booking-tour/${booking?.TravelTour?.Tour?.id}`)
          }
          className="text-[#A80F21] font-semibold text-xl mb-2 cursor-pointer hover:text-red-600"
        >
          {booking?.TravelTour?.Tour?.name_tour || "Tên tour không có"}
        </h3>
        <div className="flex gap-4">
          {/* Ảnh tour */}
          <div className="w-32 h-24 overflow-hidden rounded">
            <img
              src={booking.travel_tour?.Tour?.album?.[0]} // Đảm bảo trường image tồn tại trong travel_tour
              alt="Tour"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Thông tin tour */}
          <div className="flex-1">
            <div className="flex items-center text-sm text-gray-600 gap-6">
              <div className="flex items-center gap-1 text-zinc-900 text-sm">
                <img src={Icons.CalendarBold} className="w-5 h-5" />
                <span>{`${formatDayDMY(
                  booking?.TravelTour?.start_day
                )} → ${formatDayDMY(booking?.TravelTour?.end_day)}`}</span>
              </div>
              <div className="flex items-center gap-1 text-zinc-900 text-sm">
                <img src={Icons.UserBold} className="w-5 h-5" />
                <span>{`${booking.number_adult} người lớn, ${booking.number_toddler} trẻ em, ${booking.number_children} trẻ nhỏ, ${booking.number_newborn} em bé`}</span>
              </div>
            </div>
            <p className="text-lg text-red-800 font-semibold mt-2">
              {booking?.total_cost.toLocaleString("vi-VN") + " VND" ||
                "Không có mã tour"}
            </p>
          </div>

          {/* Hành động */}
          <div className="flex items-start gap-3 text-gray-600 text-lg">
            {/* <button title="Làm mới" className="hover:text-red-600">
              <AiOutlineLoading3Quarters />
            </button> */}
            <button
              title="Thông tin chi tiết"
              className="hover:text-red-600"
              onClick={() => setOpenModal(true)}
            >
              <PiDotsThreeBold />
            </button>
          </div>
          <BookingDetailModal
            open={openModal}
            onClose={() => setOpenModal(false)}
            booking={booking}
          />
        </div>
      </div>
    </>
  );
}
