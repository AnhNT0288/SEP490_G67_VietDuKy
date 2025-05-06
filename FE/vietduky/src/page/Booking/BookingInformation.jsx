import ContactForm from "../../components/BookingTour/ContactForm";
import PaymentMethod from "../../components/BookingTour/PaymentMethod";
import TourBooking from "../../components/BookingTour/TourBooking";
import LayoutBookingTour from "../../layouts/LayoutBookingTour";
import { CustomerService } from "@/services/API/customer.service";
import { StorageService } from "@/services/storage/StorageService";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function BookingTour() {
  const location = useLocation();
  const user = StorageService.getUser();
  const [assistance, setAssistance] = useState(false);
  const [travelTourData, setTravelTourData] = useState([]);
  const { selectedTours, id, discountInfo } = location.state || {
    selectedTours: [],
    id: null,
    discountInfo: null,
  };
  const [passengers, setPassengers] = useState({
    adult: 1,
    children: 0,
    toddler: 0,
    infant: 0,
  });
  const [formData, setFormData] = useState({
    user_id: user?.id || "",
    travel_tour_id: travelTourData[0]?.id || "",
    number_adult: passengers.adult,
    number_children: passengers.children,
    number_toddler: passengers.toddler,
    number_newborn: passengers.infant,
    total_cost: "",
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: user?.address || "",
    voucher_id: "",
    note: "",
    need_support: assistance,
    passengers: [],
  });
  const [roomCost, setRoomCost] = useState(0);

  useEffect(() => {
    if (user) {
      CustomerService.getProfile()
        .then((response) => {
          if (response?.data) {
            setFormData((prev) => ({
              ...prev,
              name: response.data.displayName || prev.name,
              phone: response.data.Customer?.number_phone || prev.phone,
              email: response.data.email || prev.email,
              address: response.data.Customer?.address || prev.address,
            }));
          }
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin khách hàng:", error);
        });
    }
  }, [user.id]);

  useEffect(() => {
    const fetchTravelTour = async () => {
      try {
        if (selectedTours.length > 0) {
          // Nếu có discountInfo thì cập nhật giá tour luôn
          let updatedTours = selectedTours.map((tour) => {
            if (discountInfo) {
              return {
                ...tour,
                price_tour: discountInfo.priceDiscount, // Gán giá discount vào price_tour
              };
            }
            return tour;
          });
          setTravelTourData(updatedTours);
        }
      } catch (error) {
        console.error("Error fetching travel tour:", error);
      }
    };
  
    fetchTravelTour();
  }, [selectedTours, discountInfo]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      need_support: assistance,
    }));
  }, [assistance]);
console.log("FormData", formData);
console.log("Assistance", assistance);


  return (
    <LayoutBookingTour title="Đặt tour">
      <div className="w-full mx-auto p-6 flex gap-12">
        {/* Cột trái */}
        <div className="flex flex-col gap-8 w-2/3">
          <div className="p-6 rounded-xl">
            <ContactForm
              user={user}
              formData={formData}
              setFormData={setFormData}
              passengers={passengers}
              setPassengers={setPassengers}
              travelTourData={travelTourData}
              roomCost={roomCost}
              setRoomCost={setRoomCost}
              assistance={assistance}
              setAssistance={setAssistance}
            />
          </div>
        </div>

        {/* Cột phải */}
        <div className="w-1/3 bg-white rounded-xl">
          <TourBooking
            formData={formData}
            setFormData={setFormData}
            tourId={id}
            travelTour={selectedTours}
            roomCost={roomCost}
            assistance={assistance}
            discountInfo={discountInfo} 
          />
        </div>
      </div>
    </LayoutBookingTour>
  );
}
