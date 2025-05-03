import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import { BookingService } from "@/services/API/booking.service";
import ContactInfoDone from "@/components/BookingComplete/ContactInfoDone";
import BookingInfoDone from "@/components/BookingComplete/BookingInfoDone";
import CustomerListDone from "@/components/BookingComplete/CustomerListDone";
import BookingConfirmationDone from "@/components/BookingComplete/BookingConfirmationDone";
import { PaymentService } from "@/services/API/payment.service";

export default function BookingReComplete() {
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get("booking_code");

  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await BookingService.searchBooking({
          booking_code: bookingCode,
        });

        const data = response?.data;
        if (data) {
          setBookingData(data);

          // Fetch payment data theo booking id
          const paymentsRes = await PaymentService.getAllPayment();
          const payments = paymentsRes?.data?.data || [];

          const matchedPayment = payments.find(
            (payment) => payment.booking_id === data.data?.id
          );

          if (matchedPayment) {
            setPaymentData(matchedPayment);
          }
        }
      } catch (error) {
        console.error("Lỗi lấy booking hoặc payment:", error);
      }
    };

    if (bookingCode) {
      fetchBookingData();
    }
  }, [bookingCode]);

  console.log("BookingData:", bookingData);
  

  if (!bookingData) return <div>Không có dữ liệu xác nhận!</div>;

  const data = bookingData.data;
  const passengerData = bookingData.passengers;

  return (
    <LayoutBookingTour title="Xác nhận tour">
      <div className="w-full mx-auto p-6 flex gap-12">
        <div className="flex flex-col gap-8 w-2/3">
          {[ContactInfoDone, BookingInfoDone, CustomerListDone].map(
            (Component, index) => (
              <div key={index} className="bg-gray-50 rounded-xl">
                <Component
                  bookingData={data}
                  passengerData={passengerData}
                  paymentData={paymentData}
                />
              </div>
            )
          )}
        </div>

        <div className="w-1/3 bg-white rounded-xl">
          <BookingConfirmationDone bookingData={data} />
        </div>
      </div>
    </LayoutBookingTour>
  );
}
