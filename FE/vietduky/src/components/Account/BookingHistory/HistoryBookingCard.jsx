import { formatDayDMY } from "@/utils/dateUtil";
import { CalendarDays, User } from "lucide-react";
import React, { useState } from "react";
import { RiEditBoxLine } from "react-icons/ri";
import RatingStars from "../Feedback/RatingStar";
import { FeedbackService } from "@/services/API/feedback.service";
import { toast } from "react-toastify";

const HistoryBookingCard = ({ booking }) => {
  const [rating, setRating] = useState(0);
  const [descriptionFeedback, setDescriptionFeedback] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setDescriptionFeedback("");
    setRating(0);
  };

  const feedbackData = {
    user_id: booking.user_id,
    tour_id: booking.TravelTour?.Tour?.id,
    description_feedback: descriptionFeedback,
    rating: rating,
    feedback_date: new Date().toISOString().split("T")[0],
  };

  console.log("Feedback Data:", feedbackData);
  

  const handleSubmitRating = async () => {
    try {
      await FeedbackService.createFeedbackTour(feedbackData);
      toast.success("Đánh giá chuyến đi thành công!");
    } catch (error) {
      console.error("Lỗi khi đánh giá chuyến đi:", error);
    } finally {
      handleCloseModal();
    }
  };

  return (
    <div>
      <div className="flex gap-6 items-center mb-4 border-b">
        <p className="text-sm mb-2">
          Mã đơn hàng:{" "}
          <span className="text-red-800 font-semibold">
            {booking.booking_code || "Không có mã đơn hàng"}
          </span>
        </p>
        <p className="text-sm mb-2">
          Trạng thái:{" "}
          <span className="text-green-600 font-semibold">
            Đã thanh toán
          </span>
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
              src={booking.travel_tour.image}
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
            <button title="Đánh giá" onClick={handleOpenModal} className="hover:text-red-600">
              <RiEditBoxLine />
            </button>
          </div>
        </div>
      </div>

      {/* Modal Đánh Giá */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-1/4 p-6 rounded shadow-md">
            <h2 className="text-xl mb-4">Đánh giá chuyến đi</h2>
            <RatingStars rating={rating} setRating={setRating} />
            <textarea
              value={descriptionFeedback}
              onChange={(e) => setDescriptionFeedback(e.target.value)}
              placeholder="Nhập nhận xét của bạn"
              className="border border-gray-300 rounded p-2 w-full mt-2"
            />
            <div className="flex justify-end mt-4">
              <button onClick={handleCloseModal} className="mr-2 px-4 py-2 bg-gray-300 rounded">
                Hủy
              </button>
              <button onClick={handleSubmitRating} className="px-4 py-2 bg-blue-500 text-white rounded">
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryBookingCard;