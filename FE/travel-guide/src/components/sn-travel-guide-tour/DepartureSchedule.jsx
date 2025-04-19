import { useState, useEffect } from "react";
import { Loader } from "lucide-react";
import { getTravelTourCanAccept } from "../../services/API/guide-tour.service";
import { LuSearch } from "react-icons/lu";
import SearchDebounceInput from "../common/SearchDebouceInput";
import { getLocations } from "../../services/API/location.service";
import Pagination from "../common/Pagination";
import { formatDate } from "../../utils/dateUtil";
import ConfirmSendRequest from "./ConfirmSendRequest";

const DepartureSchedule = () => {
  const [open, setOpen] = useState(false);
  const [tourId, setTourId] = useState(null);
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
    limit: 10,
  });

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const response = await getTravelTourCanAccept({
          ...pagination,
          name_tour: search,
          start_location_id: startLocation,
          end_location_id: endLocation,
          start_day: startDate, // ✅ đảm bảo truyền đúng field
        });

        const { items = [], totalPages = 0 } = response?.data || {};
        setTours(items);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Error fetching tours:", error);
        setTours([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, [search, startLocation, endLocation, startDate, pagination]); // ✅ có startDate

  useEffect(() => {
    const fetchLocations = async () => {
      const response = await getLocations(null, null);
      if (response) {
        setLocationsList(response);
      }
    };
    fetchLocations();
  }, []);

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
                onChange={(e) => {
                  setStartLocation(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
            >
              <option value="">Địa điểm khởi hành</option>
              {locationsList.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name_location}
                  </option>
              ))}
            </select>
          </div>
          <div className="col-span-3 w-full">
            <select
                className="px-4 py-2 border rounded-md w-full"
                value={endLocation}
                onChange={(e) => {
                  setEndLocation(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
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
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
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
              <th className="p-2">Điểm khởi hành</th>
              <th className="p-2">Điểm kết thúc</th>
              <th className="p-2">Ngày khởi hành</th>
              <th className="p-2">Giá Tour</th>
              <th className="text-end p-2" style={{ width: "1%", whiteSpace: "nowrap" }}>Thao tác</th>
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
                    <tr key={index} className="border-t">
                      <td className="p-2">{index + 1}</td>
                      <td className="p-2">{tour?.Tour?.name_tour}</td>
                      <td className="p-2">{tour?.Tour?.startLocation?.name_location}</td>
                      <td className="p-2">{tour?.Tour?.endLocation?.name_location}</td>
                      <td className="p-2">{tour?.start_day ? formatDate(tour?.start_day) : ""}</td>
                      <td className="p-2 text-left">{tour?.end_day ? formatDate(tour?.end_day) : ""}</td>
                      <td className="flex justify-end p-2">
                        <button
                            className="text-[#A80F21] whitespace-nowrap"
                            onClick={() => {
                              setTourId(tour?.id);
                              setOpen(true);
                            }}
                        >
                          Gửi yêu cầu
                        </button>
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
        <ConfirmSendRequest
            tourId={tourId}
            open={open}
            onClose={() => {
              setOpen(false);
              setTourId(null);
            }}
        />
      </div>
  );
};

export default DepartureSchedule;
