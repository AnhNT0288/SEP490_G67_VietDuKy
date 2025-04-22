import Icons from "../Icons/Icon";
import { BookingService } from "@/services/API/booking.service";
import { PaymentService } from "@/services/API/payment.service";
import { TourService } from "@/services/API/tour.service";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { formatTime } from "@/utils/dateUtil";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

// Import Modal từ react-modal
Modal.setAppElement("#root");

const BookingConfirmation = ({ bookingData }) => {
  const [booking, setBooking] = useState([]);
  const [travelTour, setTravelTour] = useState([]);
  const [tour, setTour] = useState([]);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // Modal thông báo thành công
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

  const createQrSrc = () => {
    const key = generateAddInfo();
    const src = `https://img.vietqr.io/image/mbbank-6868610102002-compact2.jpg?amount=${
      bookingData?.total_cost
    }&addInfo=start${key}end&accountName=VietDuKy`;
    setPaymentKey(key); 
    setQrSrc(src);
  };

  const paymentData = {
    bookingId: bookingData?.id,
    customerId: bookingData?.user_id,
    paymentKey: paymentKey,
    // amount: bookingData?.total_cost,
  };

  console.log("paymentData:", paymentData);
  console.log("qrSrc:", qrSrc);

  // console.log("bookingData:", bookingData);
  

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

  const checkPayment = async () => {
    try {
      const response = await PaymentService.checkPayment(paymentData);
      if (response?.status === 200) {
        console.log("Kết quả kiểm tra thanh toán:", response.data);
        setIsSuccessModalOpen(true); // Hiển thị modal thông báo thành công
        clearInterval(intervalId); // Dừng kiểm tra
      }
    } catch (error) {
      console.error("Lỗi khi kiểm tra thanh toán:", error);
    }
  };

  const startPaymentCheck = () => {
    // Bắt đầu kiểm tra thanh toán khi modal mở
    const id = setInterval(() => {
      checkPayment();
      setCountdown((prev) => {
        if (prev <= 0) {
          clearInterval(id);
          console.log("Kiểm tra thanh toán đã ngừng sau 10 phút.");
          return prev; // Không giảm xuống dưới 0
        }
        return prev - 1;
      });
    }, 2000);

    setIntervalId(id); // Lưu intervalId
  };

  const handleOpenModal = () => {
    setIsQRModalOpen(true);
    createQrSrc(); // Tạo mã QR khi mở modal
    startPaymentCheck(); // Bắt đầu kiểm tra thanh toán khi mở modal
  };

  const handleCloseModal = () => {
    setIsQRModalOpen(false);
    clearInterval(intervalId); // Dừng kiểm tra khi đóng modal
    setCountdown(600); // Reset đếm ngược
  };

  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    // Có thể thêm điều hướng hoặc hành động khác ở đây
  };

  return (
    <>
      <div className="border border-[#b1b1b1] rounded-xl bg-white p-4 shadow-md ">
        <h2 className="text-[#a80f21] text-lg font-bold uppercase mb-3">
          Phiếu xác nhận booking
        </h2>

        <div className="w-full h-[150px] flex gap-6 rounded-md overflow-hidden mb-3">
          <img
            src={tour?.image || "/placeholder.jpg"}
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
        <button className="flex-1 bg-white border border-[#a80f21] text-[#a80f21] font-bold py-3 rounded-xl hover:bg-gray-200 hover:text-[#a80f21]">
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
      <Modal
        isOpen={isQRModalOpen}
        onRequestClose={handleCloseModal}
        contentLabel="QR Code Thanh Toán"
        overlayClassName={"fixed inset-0 bg-black bg-opacity-50 z-10"}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-0"
      >
        <div className="bg-white p-6 rounded-md shadow-lg text-center z-40">
          <div className="flex flex-col">
            <div className="text-left flex items-center justify-between mb-4">
              <div className="flex-1">
                <p className="text-zinc-900 font-bold">Thanh toán chuyến đi</p>
                <p className="text-zinc-500 text-xs">
                  Khách hàng xem thông tin đơn hàng và quét mã QR
                </p>
              </div>
              <p className="text-zinc-500 text-xs font-semibold">
                Giao dịch hết hạn sau:
                <span className="ml-2 bg-black rounded-lg py-2 px-1 text-white font-semibold inline-block w-[80px] text-center font-mono">
                  {Math.floor(countdown / 60)
                    .toString()
                    .padStart(2, "0")}{" "}
                  : {(countdown % 60).toString().padStart(2, "0")}
                </span>
              </p>
            </div>
            <div className="flex mt-4 gap-6">
              <div className="w-2/5 bg-gray-50 rounded p-4 shadow-md">
                <div className="flex flex-col text-left mt-4 gap-6">
                  <div>
                    <p className="text-zinc-800 text-lg font-semibold">
                      Thông tin đơn hàng
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-zinc-500 text-sm font-semibold">
                      Số tiền thanh toán
                    </p>
                    <p className="text-red-800 text-lg font-semibold">
                      {booking?.data?.total_cost.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm font-semibold">
                      Giá trị đơn hàng
                    </p>
                    <p className="text-zinc-900 text-lg font-semibold">
                      {booking?.data?.total_cost.toLocaleString("vi-VN")} VND
                    </p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm font-semibold">
                      Phí giao dịch
                    </p>
                    <p className="text-zinc-900 text-lg font-semibold">0 VND</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm font-semibold">
                      Mã đơn hàng
                    </p>
                    <p className="text-zinc-900 text-lg font-semibold">xxxxx</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-sm font-semibold">
                      Nhà cung cấp
                    </p>
                    <p className="text-zinc-900 font-semibold">VietDuKy</p>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between mt-4 mb-2 w-3/5">
                <img src={qrSrc} alt="QR Code" className="rounded-lg mx-auto" />
                <button
                  onClick={handleCloseModal}
                  className="mt-4 px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-400"
                >
                  Hủy thanh toán
                </button>
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Modal thông báo thành công */}
      <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={handleCloseSuccessModal}
        contentLabel="Thông báo thành công"
        overlayClassName={"fixed inset-0 bg-black bg-opacity-50 z-10"}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-0"
      >
        <div className="bg-white p-6 rounded-md shadow-lg text-center z-40">
          <h2 className="text-green-600 font-bold text-lg">
            Thanh toán thành công!
          </h2>
          <p className="text-gray-600">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
          </p>
          <button
            onClick={handleCloseSuccessModal}
            className="mt-4 px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-400"
          >
            Đóng
          </button>
        </div>
      </Modal>
    </>
  );
};

export default BookingConfirmation;
