import { useState, useEffect } from "react";
import { Calendar, Table } from "lucide-react";
import { LuSearch } from "react-icons/lu";
import SearchDebounceInput from "../common/SearchDebouceInput";
import { getGuideTourByUserId } from "../../services/API/guide-tour.service";
import { getLocations } from "../../services/API/location.service";
import Pagination from "../common/Pagination";
import TravelTourDetailsModal from "./TravelTourDetailsModal";
import TabsTour from "./TabsTour";
import InstructionScheduleTable from "./InstructionScheduleTable";
import CalendarTravelTour from "./CalendarTravelTour";
import { TravelGuideService } from "../../services/API/travel_guide.service";

const InstructionSchedule = () => {
  const [viewType, setViewType] = useState("table");
  const [tourSelected, setTourSelected] = useState(null);
  const [tab, setTab] = useState("all");
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [locationsList, setLocationsList] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 14,
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

  const userId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const matchedGuide = travelGuides.find((guide) => guide.user_id === userId);
    if (matchedGuide) {
      setTravelGuideId(matchedGuide.id);
    }
  }, [travelGuides, userId]);

  console.log("travelGuideId", travelGuideId);
  

  useEffect(() => {
    const fetchTours = async () => {
      if (!travelGuideId) {
        console.warn("⛔ travelGuideId is null or undefined. Không gọi API.");
        return;
      }

      setLoading(true);
      try {
        const response = await getGuideTourByUserId(travelGuideId, {
          ...pagination,
          name_tour: search,
          start_location_id: startLocation,
          end_location_id: endLocation,
          start_day: startDate, // ✅ Thêm lọc ngày khởi hành
          status: tab !== "all" && tab !== 1 ? tab : null,
          upcoming: tab === 1 ? true : false,
        });

        if (response?.data?.items) {
          setTours(response.data.items);
          setTotalPages(response.data.totalPages || 1);
        } else {
          console.warn("⚠️ Unexpected API response:", response);
          setTours([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error("❌ Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [search, startLocation, endLocation, pagination, tab, travelGuideId, startDate]); // ✅ Đảm bảo thêm `startDate`

  // Reset về trang 1 mỗi khi filter thay đổi
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [search, startLocation, endLocation, startDate, tab]);

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

  return (
      <div className="bg-white p-4 rounded flex-1 flex flex-col">
        <TabsTour tabs={tabs} value={tab} onChange={setTab} />
        <div className="grid grid-cols-10 gap-4 items-center justify-start my-4">
          <div className="col-span-3 relative w-full">
            <LuSearch className="absolute left-3 top-3 text-gray-500" />
            <SearchDebounceInput
                onChange={setSearch}
                value={search}
                placeholder="Tên tour ..."
            />
          </div>
          <div className="col-span-2 w-full">
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
          </div>
          <div className="col-span-2 w-full">
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
          <div className="col-span-2 w-full">
            <input
                className="px-4 py-2 border rounded-md w-full"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                type="date"
            />
          </div>
          <div className="col-span-1 flex justify-end">
            <button
                className="border rounded-md bg-primary p-2"
                onClick={() =>
                    setViewType(viewType === "calendar" ? "table" : "calendar")
                }
            >
              {viewType === "calendar" ? <Calendar /> : <Table />}
            </button>
          </div>
        </div>

        <div className="flex-1">
          {viewType === "calendar" ? (
              <CalendarTravelTour travelTours={tours} />
          ) : (
              <InstructionScheduleTable
                  loading={loading}
                  tours={tours}
                  setTourSelected={setTourSelected}
              />
          )}
        </div>

        <Pagination
            pagination={pagination}
            onPageChange={setPagination}
            totalPages={totalPages}
        />

        <TravelTourDetailsModal
            tourSelected={tourSelected}
            open={!!tourSelected}
            onClose={() => setTourSelected(null)}
        />
      </div>
  );
};

export default InstructionSchedule;

const tabs = [
  {
    label: "Tất cả",
    value: "all",
  },
  {
    label: "Lịch trình sắp khởi hành",
    value: 1,
  },
  {
    label: "Lịch trình đã hoàn thành",
    value: 2,
  },
  {
    label: "Lịch trình đã hủy",
    value: 3,
  },
];
