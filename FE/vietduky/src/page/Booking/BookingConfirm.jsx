import { useState, useEffect } from "react";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import BookingDetail from "../../components/BookingTour/BookingDetail";
import ContactInfo from "../../components/BookingCheckout/ContactInfo";
import BookingInfo from "../../components/BookingCheckout/BookingInfo";
import CustomerList from "../../components/BookingCheckout/CustomerList";
import BookingConfirmation from "../../components/BookingCheckout/BookingConfirmation";
import { BookingService } from "@/services/API/booking.service";

export default function BookingConfirm() {
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("bookingResult");
    if (stored) {
      setBookingData(JSON.parse(stored));
    }
  }, []);

  if (!bookingData) return <div>Không có dữ liệu xác nhận!</div>;
  
  const data = bookingData.data?.data;
  const passengerData = bookingData.data?.passengers;
  console.log("Dữ liệu xác nhận:", passengerData);

  return (
    <LayoutBookingTour title="Xác nhận tour">
      <div className="w-full mx-auto p-6 flex gap-12">
        <div className="flex flex-col gap-8 w-2/3">
          {[
            ContactInfo, 
            BookingInfo, 
            CustomerList
          ].map((Component, index) => (
            <div key={index} className="bg-gray-50 rounded-xl">
              <Component bookingData={data} passengerData={passengerData} />
            </div>
          ))}
        </div>

        <div className="w-1/3 bg-white rounded-xl">
          <BookingConfirmation bookingData={bookingData} />
        </div>
      </div>
    </LayoutBookingTour>
  );
}
