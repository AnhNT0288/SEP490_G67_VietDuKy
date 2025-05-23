import { formatDate } from '@/utils/dateUtil';
import React from 'react';

const BookingInfoDone = ({ bookingData, paymentData }) => {
  const getPaymentDeadline = (bookingDate) => {
    const bookingDateObj = new Date(bookingDate);
    const paymentDeadline = new Date(bookingDateObj);
    paymentDeadline.setDate(bookingDateObj.getDate() + 15);
    return paymentDeadline.toLocaleDateString("vi-VN");
  };
  const totalAmount = paymentData.reduce((total, item) => total + item.amount, 0);

  console.log("PaymentData:", paymentData);
  

  const isPaid = totalAmount === bookingData?.total_cost;

  return (
    <div className="p-6 bg-[#f8f8f8] rounded-lg border border-gray-300 shadow-md">
      <div className="text-[#d80027] text-lg font-bold">Chi tiết booking</div>
      <div className="border-t border-gray-200 my-3"></div>

      <div className="space-y-4">
        <div className="flex justify-between">
          <div className="text-gray-900 font-bold">Mã đặt chỗ:</div>
          <div className="text-[#a80f21] font-bold">{bookingData?.booking_code || "N/A"}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-900 font-bold">Ngày tạo:</div>
          <div className="text-gray-900 font-bold">{formatDate(bookingData?.booking_date) || "N/A"}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-900 font-bold">Trị giá booking:</div>
          <div className="text-gray-900 font-bold">{bookingData?.total_cost?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) || "0 ₫"}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-900 font-bold">Số tiền đã thanh toán:</div>
          <div className="text-gray-900 font-bold">{totalAmount?.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
          }) || "0 ₫"}</div>
        </div>
        <div className="flex justify-between">
          <div className="text-gray-900 font-bold">Tình trạng:</div>
          <div className="text-[#a80f21] font-bold">
            {isPaid
              ? "Booking của quý khách đã thanh toán thành công"
              : "Quý khách đã chọn thanh toán sau, vui lòng thanh toán trước thời hạn"}
          </div>
        </div>

        {!isPaid && (
          <div>
            <div className="flex justify-between">
              <div className="text-gray-900 font-bold">Thời hạn thanh toán:</div>
              <div>
                <span className="text-[#a80f21] font-bold">{getPaymentDeadline(bookingData?.booking_date)}</span>
                <span className="text-gray-900 font-bold"> -</span>
              </div>
            </div>
            <div className="text-gray-600 text-sm mt-1">(Theo giờ Việt Nam. Booking sẽ tự động hủy nếu quá thời hạn thanh toán trên)</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingInfoDone;
