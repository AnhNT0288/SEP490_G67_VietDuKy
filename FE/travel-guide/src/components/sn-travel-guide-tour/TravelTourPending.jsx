import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { LuSearch } from "react-icons/lu";
import SearchDebounceInput from "../common/SearchDebouceInput";
import { getGuideTourByUserId } from "../../services/API/guide-tour.service";
import Pagination from "../common/Pagination";
import { getStatusPendingTour } from "../../utils";
import { STATUS_PENDING_TOUR } from "../../constants/app.constant";
import { formatDate } from "../../utils/dateUtil";
import { getLocations } from "../../services/API/location.service";
import { TravelGuideService } from "../../services/API/travel_guide.service";

const TravelTourPending = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [search, setSearch] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [locationsList, setLocationsList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
  });
  const [travelGuides, setTravelGuides] = useState([]);
  const [travelGuideId, setTravelGuideId] = useState(null);  

  useEffect(() => {
    const fetchTravelGuides = async () => {
      try {
        const response = await TravelGuideService.getAllTravelGuide();
        if (response.status === 200) {
          setTravelGuides(response.data.data);
        } else {
          console.error("Error fetching travel guides:", response.message);
        }
      } catch (error) {
        console.error("Error fetching travel guides:", error);
      }
    };
    fetchTravelGuides();
  }, []);

  // Lấy userId từ localStorage
  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    // Lọc danh sách để tìm travelGuideId có userId tương ứng
    const matchedGuide = travelGuides.find((guide) => guide.user_id === userId);
    if (matchedGuide) {
      setTravelGuideId(matchedGuide.id);
    }
  }, [travelGuides, userId]);

  // Fetch tours khi travelGuideId thay đổi
  useEffect(() => {
    const fetchTours = async () => {
      if (!travelGuideId) return;

      try {
        const response = await getGuideTourByUserId(userId, {
          ...pagination,
          name_tour: search,
          start_location_id: startLocation,
          end_location_id: endLocation,
          start_day: startDate,
        });
        if (response.data) {
          setTours(response.data.items);
          setTotalPages(response.data.totalPages);
        } else {
          console.log(response.message);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setLoading(false);
      }
    };

    fetchTours();
  }, [travelGuideId, search, startLocation, endLocation, startDate, pagination]);

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await getLocations(null, null);
      if (response) {
        setLocationsList(response);
      }
    };
    fetchLocations();
    return () => {
      setTours([]);
      setLocationsList([]);
      setLoading(false);
      setSearch("");
      setStartLocation("");
      setEndLocation("");
    };
  }, []);

  // console.log("tours", tours);

  return (
    <div className="bg-white p-4 rounded flex flex-col flex-1">
      <div className="grid grid-cols-12 gap-4 items-center justify-start mb-5">
        <div className="col-span-3 relative w-full">
          <LuSearch className="absolute left-3 top-3 text-gray-500" />
          <SearchDebounceInput onChange={setSearch} value={search} />
        </div>
        <div className="col-span-3 w-full">
          <select
            className="px-4 py-2 border rounded-md w-full"
            value={startLocation}
            onChange={(e) => setStartLocation(e.target.value)}
          >
            <option value="">Địa điểm khởi hành</option>
            {locationsList.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name_location}
              </option>
            ))}
          </select>
        </div>{" "}
        <div className="col-span-3 w-full">
          <select
            className="px-4 py-2 border rounded-md w-full"
            value={endLocation}
            onChange={(e) => setEndLocation(e.target.value)}
          >
            <option value="">Địa điểm kết thúc</option>
            {locationsList.map((loc) => (
              <option key={loc.id} value={loc.id}>
                {loc.name_location}
              </option>
            ))}
          </select>
        </div>
        <div className="col-span-3 w-full">
          <input
            className="px-4 py-2 border rounded-md w-full"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            type="date"
          />
        </div>
      </div>
      <div className="flex-1">
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-SmokyGray text-left bg-gray-100">
              <th className="p-2">STT</th>
              <th className="p-2">Tên tour</th>
              <th className="p-2 text-center">Điểm khởi hành</th>
              <th className="p-2 text-center">Điểm kết thúc</th>
              <th className="p-2 text-center">Ngày khởi hành</th>
              <th className="p-2 text-center">Ngày về</th>
              <th className="p-2">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8">
                  <Loader className="animate-spin mx-auto py-5" />
                </td>
              </tr>
            ) : tours.length > 0 ? (
              tours.map((tour, index) => (
                <tr key={tour.id} className="border-t">
                  <td className=" p-2">{index + 1}</td>
                  <td className=" p-2">{tour?.travelTour?.Tour?.name_tour}</td>
                  <td className=" p-2 text-center">
                    {tour?.travelTour?.Tour?.startLocation?.name_location}
                  </td>
                  <td className=" p-2 text-center">
                    {tour?.travelTour?.Tour?.endLocation?.name_location}
                  </td>
                  <td className=" p-2 text-center">
                    {tour?.travelTour?.start_day
                      ? formatDate(tour?.travelTour?.start_day)
                      : ""}
                  </td>
                  <td className=" p-2 text-center">
                    {tour?.travelTour?.end_day
                      ? formatDate(tour?.travelTour?.end_day)
                      : ""}
                  </td>
                  <td
                    className={`p-2 ${
                      tour.status === STATUS_PENDING_TOUR.ACCEPTED
                        ? "text-green-500"
                        : tour.status === STATUS_PENDING_TOUR.REJECTED
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {getStatusPendingTour(tour.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  <h3 className="text-gray-500 py-3">Không có dữ liệu</h3>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Pagination
        pagination={pagination}
        onPageChange={setPagination}
        totalPages={totalPages}
      />
    </div>
  );
};

export default TravelTourPending;
