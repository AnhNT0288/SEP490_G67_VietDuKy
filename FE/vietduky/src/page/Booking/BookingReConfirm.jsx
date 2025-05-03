import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import BookingDetail from "../../components/BookingTour/BookingDetail";
import ContactInfo from "../../components/BookingCheckout/ContactInfo";
import BookingInfo from "../../components/BookingCheckout/BookingInfo";
import CustomerList from "../../components/BookingCheckout/CustomerList";
import BookingConfirmation from "../../components/BookingCheckout/BookingConfirmation";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { BookingService } from "@/services/API/booking.service";
import BookingReConfirmation from "@/components/BookingCheckout/BookingReConfirmation";

export default function BookingReConfirm() {
  const [searchParams] = useSearchParams();
  const bookingCode = searchParams.get("booking_code");
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await BookingService.searchBooking({
          booking_code: bookingCode,
        });
  
        if (response?.data) {
          setBookingData({ data: { data: response.data } });
          localStorage.setItem("bookingResult", JSON.stringify(bookingResult));
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };
  
    if (bookingCode) {
      fetchBookingData();
    }
  }, [bookingCode]);

  if (!bookingData) return <div>Không có dữ liệu xác nhận!</div>;

  const data = bookingData.data?.data?.data;
  const passengerData = bookingData.data?.passengers;
  // console.log("Dữ liệu xác nhận:", passengerData);
//   console.log("TravelTourData:", travelTourData);
// console.log("BookingData:", bookingData?.data?.data?.data);


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
              />
            </div>
          ))}
        </div>

        <div className="w-1/3 bg-white rounded-xl">
          <BookingReConfirmation bookingData={data} />
        </div>
      </div>
    </LayoutBookingTour>
  );
}
