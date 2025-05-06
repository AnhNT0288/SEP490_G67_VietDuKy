import { useEffect, useState } from "react";
import { XIcon } from "lucide-react";
import {getPassengersByGuideId, getServiceForGuide, getTravelTourDetailForGuide} from "../../services/API/guide-tour.service";
import { formatDate } from "../../utils/dateUtil";
import BookingListModal from "./BookingListModal";
import BookingDetailsModal from "./BookingDetailsModal";
import {toast} from "react-toastify";
import {exportPassengerExcel} from "../../services/API/exportExcels.service.js";

const TravelTourDetailsModal = ({ tourSelected, onClose, open, guideId }) => {
  const [travelTourDetail, setTravelTourDetail] = useState(null);
  const [booking, setBooking] = useState(null);
  const [openBookingListModal, setOpenBookingListModal] = useState(false);
  const [passengers, setPassengers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [serviceAssignments, setServiceAssignments] = useState([]);
  const [tab, setTab] = useState("hotel");


  useEffect(() => {
    const fetchTravelTourDetailAndPassengers = async () => {
      if (tourSelected) {
        setLoading(true);
        try {
          const resDetail = await getTravelTourDetailForGuide(
              tourSelected.travel_tour_id,
              guideId
          );
          if (resDetail.status === 200) {
            setTravelTourDetail(resDetail.data.data);
          }

          const res = await getPassengersByGuideId(
              guideId,
              tourSelected.travel_tour_id
          );

          const bookings = res.data || [];

          const passengersArray = bookings.flatMap((bookingItem) => {
            const passengerList = bookingItem.passengers || [];
            const bookingInfo = bookingItem.booking || {};
            return passengerList.map((passenger) => ({
              ...passenger,
              booking: bookingInfo,
            }));
          });

          // console.log("Mapped Passengers:", passengersArray);
          setPassengers(passengersArray);

          const hotels = passengersArray.flatMap((passenger) =>
              passenger.booking?.HotelBookings?.map((hb) => hb.Hotel) || []
          );

          const restaurants = passengersArray.flatMap((passenger) =>
              passenger.booking?.RestaurantBookings?.map((rb) => rb.Restaurant) || []
          );
          setHotels(hotels);
          setRestaurants(restaurants);


        } catch (error) {
          console.error("Lỗi khi fetch detail, passenger và services", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTravelTourDetailAndPassengers();
  }, [tourSelected, guideId]);
  useEffect(() => {
    const fetchServiceAssignments = async () => {
      if (tourSelected) {
        try {
          const res = await getServiceForGuide(
              tourSelected.travel_tour_id,
              guideId
          );
          if (res.status === 200) {
            setServiceAssignments(res.data.data);

          }
        } catch (error) {
          console.error("Lỗi khi fetch service assignments", error);
        }
      }
    };

    fetchServiceAssignments();
  }, [tourSelected,guideId]);

  const handleExportExcel = async () => {
    try {
      const blob = await exportPassengerExcel(tourSelected.travel_tour_id, guideId);

      // Nếu blob không phải file Excel thật → đọc thử nội dung text
      if (blob.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
        const text = await blob.text();
        console.error("❌ Nội dung thực sự của blob (không phải Excel):", text);
        throw new Error("Server trả về không đúng định dạng Excel");
      }

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `passenger_export_${tourSelected.travel_tour_id}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Xuất file Excel thất bại");
      console.error("Lỗi khi export Excel:", error);
    }
  };

  const getAge = (birthDateStr) => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (!open) return null;

  const handleClose = () => {
    onClose();
    setTravelTourDetail(null);
  };

  return (
    <div className="fixed inset-0 z-10 bg-black/40 flex items-center justify-center">
      <div className="bg-white w-[90%] h-[90%] max-w-6xl rounded-2xl p-6 overflow-hidden shadow-xl flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-xl font-semibold">Thông tin lịch khởi hành</h2>
          <button
            className="text-gray-500 hover:text-black"
            onClick={handleClose}
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1">
          {/* Left column */}
          <div className="space-y-4 col-span-4">
            <div>
              <p className="text-red-600 text-sm">
                {travelTourDetail?.tour?.name_tour}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Điểm khởi hành
                </label>
                <input
                  className="input w-full border rounded-md p-1"
                  disabled
                  value={travelTourDetail?.tour?.start_location?.name_location}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Điểm đến</label>
                <input
                  className="input w-full border rounded-md p-1"
                  disabled
                  value={travelTourDetail?.tour?.end_location?.name_location}
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Ngày khởi hành
                </label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={
                    travelTourDetail?.start_day
                      ? formatDate(travelTourDetail?.start_day)
                      : ""
                  }
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Ngày về</label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={
                    travelTourDetail?.end_day
                      ? formatDate(travelTourDetail?.end_day)
                      : ""
                  }
                  disabled
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium">
                  Tình trạng chỗ
                </label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={travelTourDetail?.current_people || 0 + "/" + travelTourDetail?.max_people || 0}
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Giá Tour</label>
                <input
                  className="input w-full border rounded-md p-1"
                  value={tourSelected?.travelTour?.price_tour?.toLocaleString(
                    "vi-VN"
                  )}
                  disabled
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium">
                Nội dung ghi chú
              </label>
              <textarea
                className="input w-full h-20 resize-none rounded-md border p-1"
                disabled
                value={travelTourDetail?.note}
              />
            </div>

            {/* Tabs */}
            <div className="mt-4">
              <div className="flex gap-6 border-b pb-2 mb-4">
                <button
                    className={`pb-2 ${tab === 'hotel' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                    onClick={() => setTab('hotel')}
                >
                  Khách sạn
                </button>
                <button
                    className={`pb-2 ${tab === 'restaurant' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                    onClick={() => setTab('restaurant')}
                >
                  Nhà hàng
                </button>
                <button
                    className={`pb-2 ${tab === 'car' ? 'text-red-600 border-b-2 border-red-600' : 'text-gray-600'}`}
                    onClick={() => setTab('car')}
                >
                  Xe
                </button>
              </div>

              {/* Nội dung theo tab */}
              <div className="space-y-2 max-h-[230px] overflow-y-auto">
                {tab === 'hotel' && (
                    <div className="space-y-3">
                      {serviceAssignments.map((passenger, idx) => {
                        const hotelName = passenger.booking?.HotelBookings?.[0]?.Hotel?.name_hotel;
                        return (
                            <div key={idx} className="p-3 border rounded shadow-sm text-sm flex">
                              <p><span>{passenger.name}  -</span></p>
                              <p> {hotelName || 'Chưa gán'}</p>
                            </div>
                        );
                      })}
                    </div>
                )}

                {tab === 'restaurant' && (
                    <div className="space-y-3">
                      {serviceAssignments.map((passenger, idx) => {
                        const restaurantName = passenger.booking?.RestaurantBookings?.[0]?.Restaurant?.name_restaurant;
                        const restaurantMeal = passenger.booking?.RestaurantBookings?.[0]?.meal;
                        return (
                            <div key={idx} className="p-3 border rounded shadow-sm text-sm flex">
                              <p><span>{passenger.name}  -</span></p>
                              <p> {restaurantName || 'Chưa gán'} -</p>
                                <p>{restaurantMeal === "breakfast"
                                    ? "Bữa sáng"
                                    : restaurantMeal === "lunch"
                                        ? "Bữa trưa"
                                        : restaurantMeal === "dinner"
                                            ? "Bữa tối"
                                            : "Không rõ"}</p>
                            </div>
                        );
                      })}
                    </div>
                )}

                {tab === 'car' && (
                    <div className="space-y-3">
                      {serviceAssignments.map((passenger, idx) => {
                        const carName = passenger.booking?.VehicleBookings?.[0]?.Vehicle?.name_vehicle;
                        const plate = passenger.booking?.VehicleBookings?.[0]?.Vehicle?.plate_number;
                        return (
                            <div key={idx} className="p-3 border rounded shadow-sm text-sm flex flex-col">
                              <span className="font-medium">{passenger.name}</span>
                              <span>
                                {carName ? `${carName} - Biển số: ${plate || "?"}` : "Chưa gán"}
                              </span>
                            </div>
                        );
                      })}
                    </div>
                )}

              </div>
            </div>

          </div>

          {/* Right column */}
          <div className="flex flex-col h-full col-span-8">
            <div className="mb-4 h-2/5 overflow-y-auto">
              <h3 className="font-semibold">Danh sách hướng dẫn viên Tour</h3>
              <p className="text-sm text-gray-500">
                Danh sách hướng dẫn viên Tour du lịch có trong lịch
              </p>

              <table className="w-full mt-2 text-sm border">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2">Tên hướng dẫn viên</th>
                    <th className="p-2">Giới tính</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Số điện thoại</th>
                  </tr>
                </thead>
                <tbody>
                {travelTourDetail?.guides?.map((guide) => {
                  const isValidName = (name) =>
                      typeof name === "string" && name.trim().toUpperCase() !== "N/A";

                  const fullName = [
                    isValidName(guide.last_name) ? guide.last_name : "",
                    isValidName(guide.first_name) ? guide.first_name : "",
                  ]
                      .filter(Boolean)
                      .join(" ");

                  return (
                      <tr key={guide.id}>
                        <td
                            className={`p-2 ${guide.id === guideId ? "text-red-700 font-semibold" : ""}`}
                        >
                          {fullName}
                          {guide.id === guideId && " (Bạn)"}
                        </td>
                        <td className="p-2">
                          {guide.gender === "male" ? "Nam" : guide.gender === "female" ? "Nữ" : ""}
                        </td>
                        <td className="p-2">{guide.email || ""}</td>
                        <td className="p-2">{guide.phone || ""}</td>
                      </tr>
                  );
                })}
                </tbody>
              </table>
            </div>

            <div className="h-3/5">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Danh sách khách hàng được gán</h3>
                <a
                  href="#"
                  className="text-red-600 text-sm"
                  onClick={() => setOpenBookingListModal(true)}
                >
                  Xem tất cả danh sách &gt;
                </a>
              </div>

              <div className="h-full">
                <table className="w-full text-sm border mt-2">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="p-2">Tên khách</th>
                      <th className="p-2">Ngày sinh</th>
                      <th className="p-2">Giới tính</th>
                      <th className="p-2">Số điện thoại</th>
                      <th className="p-2">Độ tuổi</th>
                      <th className="p-2">Phòng đơn</th>
                    </tr>
                  </thead>
                  <tbody>
                  {passengers?.length > 0 ? (
                      passengers.map((p) => (
                          <tr key={p.id} className="border-t">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2">{formatDate(p.birth_date)}</td>
                            <td className="p-2">{p.gender ? "Nam" : "Nữ"}</td>
                            <td className="p-2">{p.phone_number}</td>
                            <td className="p-2">{getAge(p.birth_date)}</td>
                            <td className="p-2">{p.single_room === true ? "Có" : "Không"}</td>
                          </tr>
                      ))
                  ) : (
                      <tr>
                        <td className="p-2 text-center" colSpan={6}>
                          Không có hành khách được gán
                        </td>
                      </tr>
                  )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-4 gap-2">
          <button
              className="btn border rounded-md px-4 py-2 text-sm"
              onClick={handleClose}
          >
            Hủy
          </button>
          <button
              className="btn bg-green-600 text-white rounded-md px-4 py-2 text-sm"
              onClick={handleExportExcel}
          >
            Xuất Excel
          </button>
        </div>

      </div>
      <BookingDetailsModal
        booking={booking}
        open={!!booking}
        onClose={() => setBooking(null)}
        onSubmit={() => {
          setBooking(null);
          handleClose();
        }}
      />
      <BookingListModal
        bookingList={travelTourDetail?.bookings}
        open={openBookingListModal}
        onClose={() => setOpenBookingListModal(false)}
      />
    </div>
  );
};

export default TravelTourDetailsModal;
