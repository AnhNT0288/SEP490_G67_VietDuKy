import { BookingService } from "@/services/API/booking.service";
import { PaymentService } from "@/services/API/payment.service";
import { CheckCircle2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

const ModalPaymentSuccess = ({ isOpen, onClose, booking }) => {
  const [bookingData, setBookingData] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState([]);

  useEffect(() => {
    const fetchPaymentInfo = async () => {
      try {
        const response = await PaymentService.getPaymentByBookingId("42");
        setPaymentInfo(response.data);
      } catch (error) {
        console.error("Error fetching payment info:", error);
      }
    };

    fetchPaymentInfo();
  });

  console.log("BookingData:", booking);

  console.log("Payment Info:", paymentInfo);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Thông báo thành công"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-10"
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white rounded-xl shadow-2xl p-6 w-[90%] max-w-md text-center animate-fade-in-up">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="text-green-500" size={48} />
        </div>
        <h2 className="text-xl font-bold text-green-600 mb-2">
          Thanh toán thành công!
        </h2>
        <p className="text-2xl font-extrabold text-black mb-4">
          {/* {Number(paymentInfo.amount || 0).toLocaleString("vi-VN")} VND */}
        </p>

        <div className="text-left text-sm text-gray-700 space-y-2">
          <div>
            <span className="font-medium">Mã hóa đơn:</span>{" "}
            {/* {paymentInfo.invoiceCode || "250306110713_250306JVPEEC"} */}
          </div>
          <div>
            <span className="font-medium">Thời gian thanh toán:</span>{" "}
            {/* {paymentInfo.paidAt || "06-03-2025, 23:50:16"} */}
          </div>
          <div>
            <span className="font-medium">Phương thức thanh toán:</span>{" "}
            {/* {paymentInfo.method || "Quét mã QR"} */}
          </div>
          <div>
            <span className="font-medium">Tên người gửi:</span>{" "}
            {/* {paymentInfo.senderName || "Phạm Đức Mạnh"} */}
          </div>
          <div>
            <span className="font-medium">Số tiền:</span>{" "}
            {/* {Number(paymentInfo.amount || 0).toLocaleString("vi-VN")} VND */}
          </div>
          <div>
            <span className="font-medium">Phí giao dịch:</span> 0 VND
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ModalPaymentSuccess;
