import Icons from "../Icons/Icon";
import { BookingService } from "@/services/API/booking.service";
import { PaymentService } from "@/services/API/payment.service";
import { TourService } from "@/services/API/tour.service";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { formatTime } from "@/utils/dateUtil";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import ModalQRPayment from "./ModalBookingCheckout/ModalPayment";
import ModalPaymentSuccess from "./ModalBookingCheckout/ModalPaymentSuccess";

// Import Modal từ react-modal
Modal.setAppElement("#root");

const BookingConfirmation = ({ bookingData }) => {
  const navigate = useNavigate();
  const [booking, setBooking] = useState([]);
  const [travelTour, setTravelTour] = useState([]);
  const [tour, setTour] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [countdown, setCountdown] = useState(600);
  const [intervalId, setIntervalId] = useState(null);
  const [paymentKey, setPaymentKey] = useState("");
  const [qrSrc, setQrSrc] = useState("");

  const generateAddInfo = () => {
    const randomLetters = String.fromCharCode(
      65 + Math.floor(Math.random() * 26),
      65 + Math.floor(Math.random() * 26)
    ); // Tạo 2 chữ cái ngẫu nhiên (A-Z)
    const timestamp = Math.floor(Date.now() / 1000);
    return `${randomLetters}${timestamp}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy thông tin booking
        const bookingResponse = await BookingService.getBookingById(
          bookingData?.id
        );
        if (bookingResponse?.data) {
          setBooking(bookingResponse.data.data);
        }

        // Lấy thông tin travel tour
        const travelTourResponse = await TravelTourService.getTravelTour(
          bookingData?.travel_tour_id
        );
        if (travelTourResponse?.data) {
          setTravelTour(travelTourResponse.data?.data);

          // Gọi tour chỉ khi travelTour đã được lấy thành công
          const tourResponse = await TourService.getTour(
            travelTourResponse.data?.data.tour_id
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

  console.log("Booking:", booking);

  const handleOpenModal = () => {
    const key = generateAddInfo();
    setPaymentKey(key);

    const src = `https://img.vietqr.io/image/mbbank-6868610102002-compact2.jpg?amount=${booking.total_cost}&addInfo=start${key}end&accountName=VietDuKy`;
    setQrSrc(src);

    setIsQRModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsQRModalOpen(false);
    clearInterval(intervalId); // Dừng kiểm tra khi đóng modal
    setCountdown(600); // Reset đếm ngược
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    navigate("/bookingHistory");
  };

  useEffect(() => {
    if (isQRModalOpen && paymentKey) {
      startPaymentCheck();
    }
  }, [isQRModalOpen, paymentKey]);

  const checkPayment = async () => {
    const paymentData = {
      bookingId: bookingData?.id,
      customerId: bookingData?.user_id,
      paymentKey: paymentKey,
    };

    try {
      const response = await PaymentService.checkPayment(paymentData);
      if (response?.status === 200) {
        setIsSuccessModalOpen(true);
        clearInterval(intervalId);
        setCountdown(0); // Dừng đếm ngược khi thanh toán thành công
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra thanh toán:", error);
    }
  };

  const startPaymentCheck = () => {
    const id = setInterval(() => {
      checkPayment();
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          console.log("Kiểm tra thanh toán đã ngừng sau 10 phút.");
          return prev;
        }
        return prev - 1;
      });
    }, 2000);

    setIntervalId(id);
  };

  useEffect(() => {
    if (isSuccessModalOpen) {
      const timer = setTimeout(() => {
        navigate("/bookingComplete");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccessModalOpen]);
    
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
              <span>{formatTime(travelTour?.end_time_depart)}</span>
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
          onClick={() => navigate("/bookingComplete")}
          className="flex-1 bg-white border border-[#a80f21] text-[#a80f21] font-bold py-3 rounded-xl hover:bg-gray-200 hover:text-[#a80f21]"
        >
          Thanh toán sau
        </button>
        <button
          className="flex-1 bg-[#a80f21] text-white font-bold py-2 rounded-xl border border-[#a80f21] hover:bg-gray-100 hover:text-[#a80f21]"
          onClick={handleOpenModal} // Toggle hiển thị QR
        >
          Thanh toán ngay
        </button>
      </div>

      {/* Modal QR Code */}
      <ModalQRPayment
        isOpen={isQRModalOpen}
        countdown={countdown}
        qrSrc={qrSrc}
        booking={booking}
        onClose={handleCloseModal}
      />

      {/* Modal thông báo thành công */}
      <ModalPaymentSuccess
        isOpen={isSuccessModalOpen}
        booking={booking}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate("/bookingComplete");
        }}
      />
    </>
  );
};

export default BookingConfirmation;
