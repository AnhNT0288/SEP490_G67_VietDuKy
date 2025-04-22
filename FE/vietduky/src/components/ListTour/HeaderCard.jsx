import Banner from "@/assets/images/HeaderBanner.jpeg";
import { LocationService } from "@/services/API/location.service";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaSearch, FaDotCircle, FaRegCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function HeaderCard() {
  const [selected, setSelected] = useState("tour");
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [selectedStart, setSelectedStart] = useState("");
  const [date, setDate] = useState("");

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

  return (
    <div className="relative">
      {/* Background container */}
      <div
        className="relative w-full pb-5 lg:pb-20 bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: `url(${Banner})` }}
      >
        {/* Overlay phủ màu */}
        <div className="absolute inset-0 bg-black opacity-30"></div>

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
          <div className="lg:w-4/5 mx-auto px-4 mt-6">
            <div className="bg-transparent pt-4 p-4 flex flex-col md:flex-row md:items-stretch md:space-x-4 space-y-4 md:space-y-0 w-full">
              {/* Ô nhập điểm du lịch */}
              <div className="flex items-start flex-1 bg-white border rounded-lg px-4 py-6 h-full">
                <FaSearch className="text-gray-500 mr-3 mt-1" />
                <input
                  type="text"
                  placeholder="Nhập điểm du lịch"
                  className="w-full h-full outline-none text-gray-700"
                />
              </div>

              {/* Ngày khởi hành */}
              <div className="flex items-start flex-1 bg-white border rounded-lg px-4 py-3 h-full">
                <FaRegCalendarAlt className="text-gray-500 text-xl mr-4 mt-1" />
                <div className="flex flex-col w-full">
                  <span className="text-sm text-gray-500">Ngày khởi hành</span>
                  {!date ? (
                    <div
                      className="text-base text-black cursor-pointer"
                      onClick={() => {
                        const input =
                          document.getElementById("hidden-date-picker");
                        if (input) input.showPicker?.();
                      }}
                    >
                      Chọn ngày khởi hành
                      <input
                        id="hidden-date-picker"
                        type="date"
                        className="sr-only"
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  ) : (
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="text-base text-black outline-none"
                    />
                  )}
                </div>
              </div>

              {/* Điểm khởi hành */}
              <div className="flex items-start flex-1 bg-white border rounded-lg px-4 py-3 h-full">
                <FaDotCircle className="text-gray-500 mr-3 mt-1" />
                <div className="flex flex-col w-full">
                  <span className="text-sm text-gray-500 ml-1">
                    Điểm khởi hành
                  </span>
                  <select
                    className="w-full outline-none text-black bg-transparent"
                    value={selectedStart}
                    onChange={(e) => setSelectedStart(e.target.value)}
                  >
                    <option value="">Chọn điểm khởi hành</option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.name_location}>
                        {location.name_location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Nút TÌM */}
              <div className="flex flex-1 h-full">
                <button className="w-full h-full bg-[#A31627] hover:bg-red-800 transition text-white px-8 py-5 rounded-lg text-xl font-semibold">
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
