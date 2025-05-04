import TermsAndConditions from "./TermsAndConditions";
import Icons from "@/components/Icons/Icon";
import { BookingService } from "@/services/API/booking.service";
import { TourService } from "@/services/API/tour.service";
import { formatTime } from "@/utils/dateUtil";
import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ContactModal from "./ContactModal";

const TourBooking = ({
  formData,
  setFormData,
  tourId,
  travelTour,
  roomCost,
  assistance,
  discountInfo,
}) => {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [tours, setTours] = useState("");
  const [travelTourData, setTravelTourData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const validatePhoneNumber = (phone) => /^0\d{9,10}$/.test(phone);
  const isDateInRange = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date.getFullYear() >= 1900 && date <= new Date();
  };

  const getPassengerErrors = (passenger) => {
    const errors = {};
    if (!passenger.name?.trim()) {
      errors.name = "Họ tên không được để trống";
    }
    if (passenger.type === "adult") {
      if (!validatePhoneNumber(passenger.phone_number)) {
        errors.phone =
          "Số điện thoại không hợp lệ (chỉ kiểm tra với người lớn)";
      }
    }
    if (!passenger.gender) {
      errors.gender = "Chưa chọn giới tính";
    }
    if (!isDateInRange(passenger.birth_date)) {
      errors.birthdate = "Ngày sinh không hợp lệ";
    }
    return errors;
  };

  const isAllPassengerValid = (passengerList) => {
    return (
      Array.isArray(passengerList) &&
      passengerList.every(
        (p) => Object.keys(getPassengerErrors(p)).length === 0
      )
    );
  };

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await TourService.getTour(tourId);
        setTours(response?.data?.data);
      } catch (error) {
        console.error("Error fetching tour:", error);
      }
    };

    fetchTours();
  }, [tourId]);

  useEffect(() => {
    const fetchTravelTour = async () => {
      try {
        if (travelTour && travelTour.length > 0) {
          setTravelTourData(travelTour[0]);
        }
      } catch (error) {
        console.error("Error fetching travel tour:", error);
      }
    };

    fetchTravelTour();
  }, [travelTour]);

  const handleBooking = async () => {
    if (!formData) {
      toast.error("Vui lòng nhập đầy đủ thông tin trước khi đặt tour.");
      return;
    }

    if (!formData.name) {
      toast.error("Vui lòng nhập tên khách hàng!");
      return;
    }

    if (!formData.phone) {
      toast.error("Vui lòng nhập số điện thoại!");
      return;
    }

    if (!formData.email) {
      toast.error("Vui lòng nhập email!");
      return;
    }

    if (
      !formData.number_adult &&
      !formData.number_children &&
      !formData.number_toddler &&
      !formData.number_newborn
    ) {
      toast.error("Vui lòng chọn ít nhất một hành khách!");
      return;
    }

    if (!Array.isArray(formData.passengers)) {
      toast.error("Danh sách hành khách không hợp lệ!");
      return;
    }

    if (!assistance && !isAllPassengerValid(formData.passengers)) {
      toast.error("Vui lòng kiểm tra lại thông tin hành khách!");
      return;
    }

    try {
      const response = await BookingService.createBooking(formData);

      toast.success("Đặt tour thành công!");

      // Ghi dữ liệu vào localStorage
      localStorage.setItem("bookingResult", JSON.stringify(response));

      // Điều hướng
      navigate("/bookingConfirm");
    } catch (error) {
      console.error("Booking failed:", error);
      toast.error("Đặt tour thất bại. Vui lòng thử lại!");
    }
  };

  const adultPrice =
    discountInfo?.priceDiscount || travelTourData?.price_tour || 0;
  const totalPrice =
    formData?.number_adult * adultPrice +
    formData?.number_children * (travelTourData?.children_price || 0) +
    formData?.number_toddler * (travelTourData?.toddler_price || 0) +
    (roomCost || 0);

  // console.log("Tổng tiền:", totalPrice);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      total_cost: totalPrice,
    }));
  }, [totalPrice]);

  // console.log("Dữ liệu booking:", formData);
  // console.log("Tour booking:", travelTourData);

  return (
    <div className="flex flex-col items-end gap-4">
      {/* Box chứa thông tin tour */}
      <div className="bg-gray-100 p-6 rounded-xl shadow-lg w-full border border-gray-200">
        {/* Ảnh và tiêu đề */}
        <div className="flex gap-4">
          <img
            src={tours.album?.[0] || "/placeholder.jpg"}
            alt="tour"
            className="w-26 h-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="text-neutral-900 text-base font-bold">
              {tours.name_tour}
            </h2>
            <p className="text-sm text-gray-700 mt-1">
              <span className="font-semibold">Mã tour:</span>{" "}
              <span className="text-gray-800 font-bold">
                {tours.code_tour || "Chưa có mã Tour"}
              </span>
            </p>
          </div>
        </div>

        {/* Thông tin chi tiết */}
        <div className="flex gap-24 border-y border-gray-200 mt-4 py-3 text-sm">
          <div className="flex items-center gap-1">
            <img src={Icons.Place} className="mr-1" />
            <span className="text-gray-700">Khởi hành:</span>
            <span className="text-red-800 font-semibold ml-1">
              {tours.startLocation?.name_location}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-gray-700">Thời gian:</span>
            <span className="text-red-800 font-semibold ml-1">
              {tours.day_number}N{tours.day_number - 1}Đ
            </span>
          </div>
        </div>

        <div className="py-3 border-b border-gray-200 text-sm">
          <div className="text-sm mb-4 flex items-center gap-1">
            <img src={Icons.Coupon} className="mr-1" />
            <span className="font-bold">Mã tour: </span>
            {tours?.code_tour || "Chưa có mã tour"}
          </div>

          <div className="my-3" />

          <h3 className="text-sm font-bold uppercase mb-2 flex items-center gap-1">
            <img src={Icons.Bus} className="mr-8" />
            Thông tin chuyến xe
          </h3>

          <div className="flex">
            <div className="flex-1 pr-4">
              <div className="text-sm font-semibold mb-3">
                Ngày đi - {travelTourData?.start_day}
              </div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>{formatTime(travelTourData?.start_time_depart)}</span>
                <span>{formatTime(travelTourData?.end_time_depart)}</span>
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
                <span>{tours?.startLocation?.name_location}</span>
                <span>{tours?.endLocation?.name_location}</span>
              </div>
            </div>
            <div className="flex-1 border-l-2 border-gray-200 pl-4">
              <div className="text-sm font-semibold mb-3">
                Ngày về - {travelTourData?.end_day}
              </div>
              <div className="flex justify-between text-sm font-semibold mb-2">
                <span>{formatTime(travelTourData?.start_time_close)}</span>
                <span>{formatTime(travelTourData?.end_time_close)}</span>
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
                <span>{tours?.endLocation?.name_location}</span>
                <span>{tours?.startLocation?.name_location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tổng tiền và chi tiết giá */}
        <div className="mt-4 space-y-2 text-sm text-gray-800">
          <div className="flex justify-between font-semibold text-base">
            <span>Khách hàng + Phụ thu</span>
            <span className="text-red-800 font-bold">
              {totalPrice.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </span>
          </div>

          {/* Giá tour */}
          {formData && (
            <div className="">
              {formData.number_adult > 0 && (
                <div className="flex justify-between">
                  <span>Người lớn</span>
                  <span>
                    {formData.number_adult} x{" "}
                    {(
                      discountInfo?.priceDiscount ||
                      travelTourData?.price_tour ||
                      0
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </div>
              )}

              {formData.number_children > 0 && (
                <div className="flex justify-between">
                  <span>Trẻ em</span>
                  <span>
                    {formData.number_children} x{" "}
                    {travelTourData?.children_price?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || "0 ₫"}
                  </span>
                </div>
              )}

              {formData.number_toddler > 0 && (
                <div className="flex justify-between">
                  <span>Trẻ nhỏ</span>
                  <span>
                    {formData.number_toddler} x{" "}
                    {travelTourData?.toddler_price?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || "0 ₫"}
                  </span>
                </div>
              )}

              {formData.number_newborn > 0 && (
                <div className="flex justify-between">
                  <span>Em bé</span>
                  <span>
                    {formData.number_newborn} x{" "}
                    {/* {travelTourData?.price_tour?.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }) || "0 ₫"} */}
                    0 đ
                  </span>
                </div>
              )}
            </div>
          )}

          {roomCost > 0 && (
            <div className="flex justify-between">
              <span>Phụ thu phòng đơn</span>
              <span>
                {roomCost.toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </span>
            </div>
          )}
        </div>

        {/* Mã giảm giá */}
        {/* <div className="mt-6 border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center gap-2 text-sm font-semibold cursor-pointer">
            <span className="text-lg font-bold flex items-center gap-2">
              <img src={Icons.Voucher} alt="Voucher" className="w-6 h-6" />
              <span className="uppercase">Mã giảm giá</span>
            </span>
            <span className="text-red-800 flex justify-between items-center gap-2">
              <img src={Icons.AddCircle} className="w-5 h-5" />
              <span>Thêm mã giảm giá</span>
            </span>
          </div>
        </div> */}

        {/* Tổng tiền sau cùng */}
        <div className="mt-4 border-t border-gray-300 pt-4 flex justify-between items-center text-lg font-bold ">
          <span>Tổng tiền</span>
          <span className="text-red-800">
            {totalPrice.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </span>
        </div>

        {/* Nút đặt tour */}
        {agreed ? (
          <button
            onClick={handleBooking}
            className="w-full py-3 mt-4 bg-red-800 text-white font-bold rounded-lg hover:bg-red-700 transition"
          >
            Đặt Tour
          </button>
        ) : (
          <button
            disabled
            className="w-full py-3 mt-4 bg-gray-200 text-gray-500 font-bold rounded-lg cursor-not-allowed"
          >
            Đặt Tour
          </button>
        )}

        {/* Checkbox điều khoản */}
        <div className="text-xs text-gray-600 mt-3 flex items-start gap-2">
          <TermsAndConditions agreed={agreed} setAgreed={setAgreed} />
        </div>
      </div>

      {/* Nút gọi tư vấn */}
      <div className="flex gap-3">
        <button className="px-4 py-2 bg-red-800 text-white rounded-lg hover:bg-red-600 transition font-bold">
          Gọi miễn phí qua internet
        </button>
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 bg-white border border-red-800 text-red-800 rounded-lg hover:bg-red-100 transition font-bold"
        >
          Liên hệ tư vấn
        </button>
        <ContactModal open={modalOpen} onClose={() => setModalOpen(false)} />
      </div>
    </div>
  );
};

export default TourBooking;
