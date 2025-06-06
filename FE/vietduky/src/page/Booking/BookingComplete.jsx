import { useState, useEffect } from "react";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import { BookingService } from "@/services/API/booking.service";
import ContactInfoDone from "@/components/BookingComplete/ContactInfoDone";
import BookingInfoDone from "@/components/BookingComplete/BookingInfoDone";
import CustomerListDone from "@/components/BookingComplete/CustomerListDone";
import BookingConfirmationDone from "@/components/BookingComplete/BookingConfirmationDone";
import { PaymentService } from "@/services/API/payment.service";

export default function BookingComplete() {
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookingResult"));
    if (stored) {
      const fetchBookingData = async () => {
        try {
          const response = await BookingService.getBookingById(stored.data?.data?.id);
          if (response?.data) {
            setBookingData(response);
          }
        } catch (error) {
          console.error("Error fetching booking data:", error);
        }
      };
      
      const fetchPaymentData = async () => {
        try {
          const response = await PaymentService.getPaymentByBookingId(stored.data?.data?.id);
            setPaymentData(response.data.data);
        } catch (error) {
          console.error("Lỗi lấy thông tin thanh toán:", error);
        }
      };
  
      fetchBookingData();
      fetchPaymentData();
    }
  }, []);
  
  const totalAmount = paymentData.reduce((total, item) => total + item.amount, 0);

  if (!bookingData) return <div>Không có dữ liệu xác nhận!</div>;
  
  const data = bookingData.data?.data;
  const passengerData = bookingData.data?.passengers;
  // console.log("Dữ liệu xác nhận:", passengerData);
  console.log("BookingData:", data);
  console.log("PaymentDataComplete:", paymentData);
  

  return (
    <LayoutBookingTour title="Xác nhận tour">
      <div className="w-full mx-auto p-6 flex gap-12">
        <div className="flex flex-col gap-8 w-2/3">
          {[
            ContactInfoDone, 
            BookingInfoDone, 
            CustomerListDone
          ].map((Component, index) => (
            <div key={index} className="bg-gray-50 rounded-xl">
              <Component bookingData={data} passengerData={passengerData} paymentData={paymentData} totalAmount={totalAmount}/>
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
