import Icons from "../Icons/Icon";
import { BookingService } from "@/services/API/booking.service";
import { PaymentService } from "@/services/API/payment.service";
import { TourService } from "@/services/API/tour.service";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { formatTime } from "@/utils/dateUtil";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingConfirmationDone = ({ bookingData }) => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState([]);
  const [travelTour, setTravelTour] = useState([]);
  const [tour, setTour] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin booking
        const bookingResponse = await BookingService.getBookingById(
          bookingData?.id
        );
        if (bookingResponse?.data) {
          setBooking(bookingResponse.data);
        }

        // Lấy thông tin travel tour
        const travelTourResponse = await TravelTourService.getTravelTour(
          bookingData?.travel_tour_id
        );
        if (travelTourResponse?.data) {
          setTravelTour(travelTourResponse.data.data);

          // Gọi tour chỉ khi travelTour đã được lấy thành công
          const tourResponse = await TourService.getTour(
            travelTourResponse.data.data.tour_id
          );
          if (tourResponse?.data) {
            setTour(tourResponse.data?.data);
          }
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin:", error);
      }
    };

    fetchData();
  }, [bookingData]);

  // console.log("Tour:", tour);

  return (
    <>
      <div className="border border-[#b1b1b1] rounded-xl bg-white p-4 shadow-md ">
        <h2 className="text-[#a80f21] text-lg font-bold uppercase mb-3">
          Phiếu xác nhận booking
        </h2>

        <div className="w-full h-[150px] flex gap-6 rounded-md overflow-hidden mb-3">
          <img
            src={tour?.album?.[0] || "/placeholder.jpg"}
            alt={tour?.name_tour}
            className="w-2/5 h-full rounded-xl object-cover"
          />
          <p className="text-sm font-semibold mb-2">{tour?.name_tour}</p>
        </div>

        <div className="flex text-sm mb-2 mt-6">
          <img src={Icons.Coupon} className="mr-6" />
          <span className="font-bold">Số booking: </span>
          <span className="text-[#a80f21] font-bold">
            {bookingData?.booking_code}
          </span>
        </div>

        <div className="border-t border-gray-300 my-3" />

        <div className="flex text-sm mb-4">
          <img src={Icons.Coupon} className="mr-6" />
          <span className="font-bold mr-6">Mã tour: </span>
          <span>{tour?.code_tour || "Chưa có mã tour"}</span>
        </div>

        <div className="border-t border-gray-300 my-3" />

        <h3 className="text-sm font-bold uppercase mb-2 flex items-center gap-1">
          <img src={Icons.Bus} className="mr-6" />
          Thông tin chuyến xe
        </h3>

        <div className="flex">
          <div className="flex-1 pr-4">
            <div className="text-sm font-semibold mb-3">
              Ngày đi - {travelTour?.start_day}
            </div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>{formatTime(travelTour?.start_time_depart)}</span>
              <span>{formatTime(travelTour?.start_time_close)}</span>
            </div>
            <div className="relative mb-2">
              <div className="absolute -top-0.8 transforms -translate-y-1/3 w-2 h-2 bg-[#B1B1B1]" />
              <div className="border-b-2 border-[#B1B1B1]" />
              <div className="absolute right-0 -top-0 transforms -translate-y-1/3 w-2 h-2 bg-[#B1B1B1]" />
              <img
                src={Icons.Bus}
                className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-6 h-6"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>{tour?.startLocation?.name_location}</span>
              <span>{tour?.endLocation?.name_location}</span>
            </div>
          </div>
          <div className="flex-1 border-l-2 border-gray-200 pl-4">
            <div className="text-sm font-semibold mb-3">
              Ngày về - {travelTour?.end_day}
            </div>
            <div className="flex justify-between text-sm font-semibold mb-2">
              <span>{formatTime(travelTour?.start_time_close)}</span>
              <span>{formatTime(travelTour?.end_time_close)}</span>
            </div>
            <div className="relative mb-2">
              <div className="absolute -top-0.8 transforms -translate-y-1/3 w-2 h-2 bg-[#B1B1B1]" />
              <div className="border-b-2 border-[#B1B1B1]" />
              <div className="absolute right-0 -top-0 transforms -translate-y-1/3 w-2 h-2 bg-[#B1B1B1]" />
              <img
                src={Icons.Bus}
                className="absolute -top-2.5 left-1/2 transform -translate-x-1/2 w-6 h-6"
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-4">
              <span>{tour?.endLocation?.name_location}</span>
              <span>{tour?.startLocation?.name_location}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => navigate("/")}
          className="flex-1 bg-white border border-[#a80f21] text-[#a80f21] font-bold py-3 rounded-xl hover:bg-gray-200 hover:text-[#a80f21]"
        >
          Về trang chủ
        </button>
        <button
          onClick={() => navigate("/bookingHistory")}
          className="flex-1 bg-[#a80f21] text-white font-bold py-2 rounded-xl border border-[#a80f21] hover:bg-gray-100 hover:text-[#a80f21]"
        >
          Xem lịch sử đặt tour
        </button>
      </div>
    </>
  );
};

export default BookingConfirmationDone;
