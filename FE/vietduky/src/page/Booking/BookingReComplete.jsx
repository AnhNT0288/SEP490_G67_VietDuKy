import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import ContactInfoDone from "@/components/BookingComplete/ContactInfoDone";
import BookingInfoDone from "@/components/BookingComplete/BookingInfoDone";
import CustomerListDone from "@/components/BookingComplete/CustomerListDone";
import BookingConfirmationDone from "@/components/BookingComplete/BookingConfirmationDone";
import { BookingService } from "@/services/API/booking.service";
import { PaymentService } from "@/services/API/payment.service";

export default function BookingReComplete() {
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get("booking_code");

  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await BookingService.searchBooking({
          booking_code: bookingCode,
        });

        const data = response?.data;
        if (data?.data?.id) {
          setBookingData(data);

          // Gọi fetchPaymentData với booking_id
          fetchPaymentData(data.data.id);
        }
      } catch (error) {
        console.error("Lỗi lấy booking:", error);
      }
    };

    const fetchPaymentData = async (bookingId) => {
      try {
        const response = await PaymentService.getPaymentByBookingId(bookingId);
        setPaymentData(response?.data?.data || []);
      } catch (error) {
        console.error("Lỗi lấy thông tin thanh toán:", error);
      }
    };

    if (bookingCode) {
      fetchBookingData();
    }
  }, [bookingCode]);

  if (!bookingData) return <div>Không có dữ liệu xác nhận!</div>;

  const data = bookingData.data;
  const passengerData = bookingData.passengers;
  const totalAmount = paymentData.reduce((total, item) => total + item.amount, 0);

  return (
    <LayoutBookingTour title="Xác nhận tour">
      <div className="w-full mx-auto p-6 flex gap-12">
        <div className="flex flex-col gap-8 w-2/3">
          {[ContactInfoDone, BookingInfoDone, CustomerListDone].map((Component, index) => (
            <div key={index} className="bg-gray-50 rounded-xl">
              <Component
                bookingData={data}
                passengerData={passengerData}
                paymentData={paymentData}
                totalAmount={totalAmount}
              />
            </div>
          ))}
        </div>

        <div className="w-1/3 bg-white rounded-xl">
          <BookingConfirmationDone bookingData={data} totalAmount={totalAmount} />
        </div>
      </div>
    </LayoutBookingTour>
  );
}
