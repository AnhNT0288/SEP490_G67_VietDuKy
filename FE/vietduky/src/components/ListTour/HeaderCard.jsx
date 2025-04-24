import Banner from "@/assets/images/HeaderBanner.jpeg";
import { LocationService } from "@/services/API/location.service";
import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import { FaSearch, FaDotCircle, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Icons from "../Icons/Icon";

export default function HeaderCard({ onSearch }) {
  const [selected, setSelected] = useState("tour");
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedStart, setSelectedStart] = useState("");
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [destination, setDestination] = useState("");

  // Đóng dropdown khi click ra ngoài
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  // Lắng nghe sự kiện click ngoài
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await LocationService.getAllLocations();
        setLocations(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleSearch = () => {
    if (onSearch) {
      onSearch(destination, selectedStart, date);
    }
  };

  return (
    <div className="relative">
      {/* Background container */}
      <div
        className="w-full pb-5 lg:pb-20 bg-cover bg-center overflow-visible"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        {/* Overlay phủ màu */}
        <div className="absolute inset-0 bg-black opacity-50"></div>

        {/* Nội dung bên trên lớp phủ */}
        <div className="relative z-10">
          {/* Breadcrumb */}
          <div className="text-white w-4/5 mx-auto px-4 pt-10 text-lg font-light sm:text-lg">
            Việt Du Ký /{" "}
            <span className="text-red-600 font-semibold">
              Du lịch Việt Du Ký
            </span>
          </div>

          {/* Search Bar */}
          <div className="w-full max-w-6xl flex mx-auto rounded-lg mt-6 p-4">
            <div className="bg-transparent pt-4 p-4 flex flex-col md:flex-row md:items-stretch md:space-x-4 space-y-4 md:space-y-0 w-full">
              {/* Ô nhập điểm du lịch */}
              <div className="flex items-center flex-1 bg-gray-100 rounded px-3 py-2 h-full">
                <img src={Icons.LocationThin} className="w-5 h-5 mr-2" />
                <input
                  type="text"
                  placeholder="Nhập điểm du lịch"
                  className="w-full bg-transparent outline-none text-sm sm:text-lg h-full"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>

              {/* Ngày khởi hành */}
              <div className="flex items-center flex-1 bg-gray-100 rounded p-2 col-span-1 sm:col-span-2 h-full">
                <img
                  src={Icons.CalendarThin}
                  className="w-5 h-5 text-gray-400 ml-1"
                />
                <div className="ml-3 flex flex-col h-full">
                  <span className="text-gray-400 text-sm">Ngày khởi hành</span>
                  <span
                    className="text-black text-sm cursor-pointer"
                    onClick={() =>
                      document.getElementById("datePicker").showPicker()
                    }
                  >
                    {date ? date : "Chọn ngày khởi hành"}
                  </span>
                </div>
                <input
                  type="date"
                  id="datePicker"
                  className="absolute opacity-0 w-0 h-0"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>

              {/* Điểm khởi hành */}
              <div
                className="relative flex-1 col-span-1 sm:col-span-2 h-full"
                ref={dropdownRef}
              >
                <div
                  className="flex items-center bg-gray-100 rounded p-2 cursor-pointer h-full"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <img
                    src={Icons.PlanePaper}
                    className="w-5 h-5 text-gray-400"
                  />
                  <div className="ml-3 flex flex-col h-full">
                    <span className="text-gray-400 text-sm">
                      Điểm khởi hành
                    </span>
                    <span className="text-black text-sm">
                      {selectedStart ? selectedStart : "Chọn điểm khởi hành"}
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div className="absolute left-0 top-full mt-1 w-full border rounded bg-white shadow-md z-10">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => {
                          setSelectedStart(location.name_location);
                          setIsOpen(false);
                        }}
                      >
                        {location.name_location}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Nút TÌM */}
              <div className="col-span-1 flex-1 sm:col-span-2 h-full">
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#A80F21] text-white py-4 rounded text-base sm:text-xl font-semibold hover:bg-[#991b1b] transition"
                >
                  TÌM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
