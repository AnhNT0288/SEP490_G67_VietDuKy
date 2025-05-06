import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import ContactInfo from "../../components/BookingCheckout/ContactInfo";
import BookingInfo from "../../components/BookingCheckout/BookingInfo";
import CustomerList from "../../components/BookingCheckout/CustomerList";
import BookingReConfirmation from "@/components/BookingCheckout/BookingReConfirmation";
import { BookingService } from "@/services/API/booking.service";

export default function BookingReConfirm() {
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get("booking_code");
  const navigate = useNavigate();

  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState([]);

  // Fetch booking
  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await BookingService.searchBooking({ booking_code: bookingCode });

        if (response?.data) {
          const fullData = response.data;
          setBookingData({ data: { data: fullData } });

          const bookingId = fullData?.data?.id;
          if (bookingId) {
            fetchRePaymentData(bookingId);
          }
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    if (bookingCode) {
      fetchBookingData();
    }
  }, [bookingCode]);

  // Fetch re-payment
  const fetchRePaymentData = async (bookingId) => {
    try {
      const response = await BookingService.getRePaymentAmount(bookingId);
      console.log("RePaymentData:", response.data);

      const data = response.data;

      if (data.data === 0) {
        navigate(`/bookingReComplete?booking_code=${bookingData.data?.data?.data?.booking_code}`);
      } else {
        setPaymentData(data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin booking:", error);
    }
  };

  if (!bookingData) return <div>Không có dữ liệu xác nhận!</div>;

  const data = bookingData.data?.data?.data;
  const passengerData = bookingData.data?.passengers;

  console.log("Booking 1", bookingData);
  

  return (
    <LayoutBookingTour title="Xác nhận tour">
      <div className="w-full mx-auto p-6 flex gap-12">
        <div className="flex flex-col gap-8 w-2/3">
          {[ContactInfo, BookingInfo, CustomerList].map((Component, index) => (
            <div key={index} className="bg-gray-50 rounded-xl">
              <Component
                bookingData={data}
                setBookingData={setBookingData}
                passengerData={passengerData}
                paymentData={paymentData}
              />
            </div>
          ))}
        </div>

        <div className="w-1/3 bg-white rounded-xl">
          <BookingReConfirmation
            bookingData={data}
            paymentData={paymentData}
            onRePaymentUpdate={() => fetchRePaymentData(data?.id)}
          />
        </div>
      </div>
    </LayoutBookingTour>
  );
}
