import UpcomingBookingCard from "@/components/Account/BookingHistory/UpcomingBookingCard.jsx";
import { BookingService } from "@/services/API/booking.service";
import { formatDayDMY } from "@/utils/dateUtil";
import { CalendarDays, User } from "lucide-react";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Icons from "@/components/Icons/Icon";
import LayoutAccountService from "@/layouts/LayoutAccountService";
import { LocationService } from "@/services/API/location.service";
import HistoryBookingCard from "@/components/Account/BookingHistory/HistoryBookingCard";

export default function TourBookingHistoryPage() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [historyBooking, setHistoryBooking] = useState([]);
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(""); // Thêm state cho trạng thái

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchHistoryBooking = async () => {
      try {
        const response = await BookingService.getBookingByUserId(user.id);
        setHistoryBooking(response.data);
      } catch (error) {
        console.error("Error fetching booking history:", error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await LocationService.getAllLocations();
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
    fetchHistoryBooking();
  }, [user.id]);

  const locationOptions = locations.map((location) => (
    <option key={location.id} value={location.name_location}>
      {location.name_location}
    </option>
  ));

  const upcomingBookings =
    historyBooking.data?.filter((booking) => booking.status !== 5) || [];
  const completedBookings =
    historyBooking.data?.filter((booking) => booking.status === 5) || [];

  // Sắp xếp upcomingBookings theo ngày đi gần nhất
  const sortedUpcomingBookings = upcomingBookings
    .sort((a, b) => new Date(a.TravelTour.start_day) - new Date(b.TravelTour.start_day))
    .filter((booking) => {
      // Lọc theo trạng thái
      if (selectedStatus) {
        return booking.status === parseInt(selectedStatus);
      }
      return true;
    });

  // Lọc các chuyến đi đã hoàn thành theo từ khóa tìm kiếm, vị trí và ngày
  const filteredCompletedBookings = completedBookings.filter(
    (booking) =>
      booking?.TravelTour?.Tour?.name_tour
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) &&
      (selectedLocation
        ? booking.travel_tour.location === selectedLocation
        : true) &&
      (selectedDate
        ? formatDayDMY(booking?.TravelTour?.start_day) ===
          formatDayDMY(selectedDate)
        : true)
  );

  return (
    <LayoutAccountService>
      <div className="p-6">
        <div className="space-y-6">
          <div className="mx-auto mt-6">
            {/* Tabs */}
            <div className="flex mb-4">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`mr-6 pb-2 font-semibold ${
                  activeTab === "upcoming"
                    ? "text-red-700 border-b-2 border-red-700"
                    : "text-gray-500 hover:text-red-600"
                }`}
              >
                Chuyến đi sắp tới
              </button>
              <button
                onClick={() => setActiveTab("history")}
                className={`pb-2 font-semibold ${
                  activeTab === "history"
                    ? "text-red-700 border-b-2 border-red-700"
                    : "text-gray-500 hover:text-red-600"
                }`}
              >
                Lịch sử chuyến đi
              </button>
            </div>

            {/* Nội dung của tab */}
            {activeTab === "upcoming" && (
              <div>
                <div className="flex gap-3 items-center mb-4">
                  {/* Dropdown cho trạng thái */}
                  <div className="mb-4">
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Trạng thái</option>
                      <option value="0">Chờ thanh toán</option>
                      <option value="1">Đã đặt cọc</option>
                      <option value="2">Đã thanh toán</option>
                      <option value="3">Đã hủy chuyến đi</option>
                      <option value="4">Đã hoàn tiền</option>
                      {/* Thêm các trạng thái khác nếu cần */}
                    </select>
                  </div>
                </div>

                {sortedUpcomingBookings.length > 0 ? (
                  sortedUpcomingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-md shadow border border-gray-200 p-4 mb-6 bg-opacity-60"
                    >
                      <UpcomingBookingCard booking={booking} />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 italic">
                    Bạn chưa có chuyến đi nào.
                  </div>
                )}
              </div>
            )}

            {activeTab === "history" && (
              <div>
                <div className="flex gap-3 items-center mb-4">
                  {/* Thanh tìm kiếm */}
                  <div className="bg-white flex-1 mb-4 p-2 flex border border-gray-300 rounded-lg">
                    <img src={Icons.Search} />
                    <input
                      type="text"
                      placeholder="Tìm kiếm bằng từ khóa"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="hover:outline-none focus:outline-none px-3"
                    />
                  </div>

                  {/* Dropdown cho vị trí */}
                  <div className="mb-4">
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="border border-gray-300 rounded-lg p-2"
                    >
                      <option value="">Địa điểm</option>
                      {locationOptions}
                    </select>
                  </div>

                  {/* Date Picker cho ngày */}
                  <div className="bg-white mb-4 border border-gray-300 rounded-lg p-2 flex items-center">
                    <img src={Icons.Calendar} className="mr-2 w-5 h-5" />
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      className="hover:outline-none focus:outline-none px-3"
                      placeholderText="Chọn ngày"
                      dateFormat="dd/MM/yyyy"
                      popperPlacement="bottom" // Đặt vị trí cho dropdown
                    />
                  </div>
                </div>

                {filteredCompletedBookings.length > 0 ? (
                  filteredCompletedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-white rounded-md shadow border border-gray-200 p-4 mb-6 bg-opacity-60"
                    >
                      <HistoryBookingCard booking={booking} />
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 italic">
                    Chưa có lịch sử chuyến đi nào.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </LayoutAccountService>
  );
}