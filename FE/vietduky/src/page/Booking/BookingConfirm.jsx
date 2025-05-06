import { useState, useEffect } from "react";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import BookingDetail from "../../components/BookingTour/BookingDetail";
import ContactInfo from "../../components/BookingCheckout/ContactInfo";
import BookingInfo from "../../components/BookingCheckout/BookingInfo";
import CustomerList from "../../components/BookingCheckout/CustomerList";
import BookingConfirmation from "../../components/BookingCheckout/BookingConfirmation";
import { BookingService } from "@/services/API/booking.service";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { useNavigate } from "react-router-dom";

export default function BookingConfirm() {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [paymentData, setPaymentData] = useState([]);
  const [travelTourData, setTravelTourData] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("bookingResult"));
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

    const travelTourId = stored.data?.data?.travel_tour_id;
    if (travelTourId) {
      TravelTourService.getTravelTour(travelTourId)
        .then((res) => setTravelTourData(res?.data))
        .catch((err) => console.error("Lỗi lấy TravelTour:", err));
    }

    fetchBookingData();
    fetchRePaymentData(stored.data?.data?.id);
  }, []);

  const fetchRePaymentData = async (bookingId) => {
    try {
      const response = await BookingService.getRePaymentAmount(bookingId);
      console.log("RePaymentData:", response.data);

      const data = response.data;

      if (data.data === 0) {
        navigate("/bookingComplete");
      } else {
        setPaymentData(data.data);
      }
    } catch (error) {
      console.error("Lỗi lấy thông tin booking:", error);
    }
  };

  if (!bookingData) return <div>Không có dữ liệu xác nhận!</div>;

  const data = bookingData.data?.data;
  const passengerData = bookingData.data?.passengers;

  // console.log("PaymentData:", paymentData);
  console.log("BookingData:", bookingData);
  

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
              <Component bookingData={data} setBookingData={setBookingData} passengerData={passengerData} travelTourData={travelTourData.data} paymentData={paymentData}/>
            </div>
          ))}
        </div>

        <div className="w-1/3 bg-white rounded-xl">
          <BookingConfirmation bookingData={data} paymentData={paymentData} onRePaymentUpdate={() => fetchRePaymentData(data.id)}/>
        </div>
      </div>
    </LayoutBookingTour>
  );
}
