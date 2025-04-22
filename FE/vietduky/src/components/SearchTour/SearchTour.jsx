import Banner from "../../assets/images/banner-landing.png";
import Icons from "../Icons/Icon";
import { LocationService } from "@/services/API/location.service";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchTour() {
  const [selected, setSelected] = useState("tour");
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedStart, setSelectedStart] = useState("");
  const [date, setDate] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [destination, setDestination] = useState(""); // Thêm state cho destination

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
    // Điều hướng đến trang listTour với các tham số
    navigate("/listTour", {
      state: {
        departure: selectedStart,
        date: date,
        destination: destination, // Truyền destination vào
      },
    });
  };

  return (
    <div className="relative">
      {/* Background Image */}
      <div className="relative w-full h-[500px] overflow-hidden rounded-b-[48px]">
        <img
          src={Banner}
          alt="Background"
          className="w-full h-full object-cover brightness-[70%] scale-[1.1] transition-transform duration-500"
        />

        <div className="absolute bg-[rgba(0,0,0,0.3)] inset-0 flex flex-col justify-center items-center px-4 sm:px-10">
          <div className="text-white text-center max-w-4xl">
            <h2 className="text-3xl sm:text-5xl font-bold leading-snug sm:leading-[3.5rem] search-tour-title">
              Thế giới tour trong tay bạn
            </h2>
            <p className="text-sm sm:text-xl font-normal mt-2 search-tour-subtitle">
              Phục vụ tận tâm, giá siêu ưu đãi
            </p>
          </div>

          {/* Search Form */}
          <div className="w-full max-w-4xl bg-white rounded-lg mt-6 p-4 shadow-md">
            <div className="flex items-center bg-gray-100 rounded mb-4 px-3 py-2">
              <img src={Icons.LocationThin} className="w-5 h-5 mr-2" />
              <input
                type="text"
                placeholder="Nhập điểm du lịch"
                className="w-full bg-transparent outline-none text-sm sm:text-lg"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
              {/* Ngày khởi hành */}
              <div className="flex items-center bg-gray-100 rounded p-2 col-span-1 sm:col-span-2">
                <img
                  src={Icons.CalendarThin}
                  className="w-5 h-5 text-gray-400 ml-1"
                />
                <div className="ml-3 flex flex-col">
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
                className="relative col-span-1 sm:col-span-2"
                ref={dropdownRef}
              >
                <div
                  className="flex items-center bg-gray-100 rounded p-2 cursor-pointer"
                  onClick={() => setIsOpen(!isOpen)}
                >
                  <img
                    src={Icons.PlanePaper}
                    className="w-5 h-5 text-gray-400"
                  />
                  <div className="ml-3 flex flex-col">
                    <span className="text-gray-400 text-sm">
                      Điểm khởi hành
                    </span>
                    <span className="text-black text-sm">
                      {selectedStart ? selectedStart : "Chọn điểm khởi hành"}
                    </span>
                  </div>
                </div>
                {isOpen && (
                  <div className="absolute left-0 top-full mt-1 w-full border rounded bg-white shadow-md z-50">
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
              <div className="col-span-1">
                <button
                  onClick={handleSearch}
                  className="w-full bg-[#A80F21] text-white py-3 rounded text-base sm:text-xl font-semibold hover:bg-[#991b1b] transition"
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
