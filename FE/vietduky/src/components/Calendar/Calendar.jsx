import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "dayjs/locale/vi";
import { TourService } from "@/services/API/tour.service";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatYMD } from "@/utils/dateUtil";

dayjs.locale("vi");

const Calendar = ({ id, initialSelectedDate }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("calendar");
  const [tourDates, setTourDates] = useState({});
  const [tourEndDates, setTourEndDates] = useState({});
  const [tourPrice, setTourPrice] = useState(0);
  const [travelTourData, setTravelTourData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // console.log(selectedDate);
  // console.log(initialSelectedDate);

  useEffect(() => {
    const fetchTravelTours = async () => {
      try {
        const response = await TravelTourService.getTravelTourByTourId(id);
        setTravelTourData(response.data.data);
      } catch (error) {
        console.error("Error fetching travel tours:", error);
      }
    };

    fetchTravelTours();
  }, [id]);

  useEffect(() => {
    const fetchTourDates = async () => {
      const response = await TravelTourService.getTravelTourByTourId(id);
      const tour = response.data.data;

      // console.log(tour)

      try {
        if (!Array.isArray(tour)) {
          setTourDates({});
          return;
        }

        const formattedTourDates = tour.reduce((acc, tour) => {
          if (tour.start_day) {
            const dateStr = dayjs(tour.start_day).format("YYYY-MM-DD");
            acc[dateStr] =
              (tour.price_tour / 1000).toLocaleString("vi-VN") + "k";
          }
          return acc;
        }, {});

        const formattedTourEndDates = tour.reduce((acc, tour) => {
          if (tour.end_day) {
            const dateStr = dayjs(tour.start_day).format("YYYY-MM-DD");
            acc[dateStr] = dayjs(tour.end_day).format("DD/MM/YYYY");
          }
          return acc;
        }, {});

        const initialTourPrice = tour.reduce((acc, tour) => {
          if (tour.price_tour) {
            return acc + tour.price_tour;
          }
          return acc;
        }, 0);

        setTourPrice(initialTourPrice / 1000); // Chia cho 1000 để chuyển đổi sang triệu
        setTourEndDates(formattedTourEndDates);
        setTourDates(formattedTourDates);

        if (initialSelectedDate) {
          setSelectedDate(formatYMD(initialSelectedDate));
        } else {
          const firstTourDate = Object.keys(formattedTourDates)[0];
          if (firstTourDate) {
            setSelectedDate(firstTourDate);
          }
        }
      } catch (error) {
        console.error("Error fetching travel tour data:", error);
      }
    };

    fetchTourDates();
  }, [id]);

  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day();
  const totalDays = 42;

  const days = Array.from({ length: totalDays }, (_, index) => {
    return startOfMonth.subtract(startDay, "day").add(index, "day");
  });

  const startYear = Math.floor(currentDate.year() / 16) * 16;
  const years = Array.from({ length: 16 }, (_, i) => startYear + i);
  const months = Array.from({ length: 12 }, (_, i) =>
    `Thg${i + 1}`
  );

  const canGoBack = !currentDate.isSame(dayjs(), "month");

  const handlePrev = () => {
    if (viewMode === "calendar" && !currentDate.isSame(dayjs(), "month")) {
      setCurrentDate(currentDate.subtract(1, "month"));
    } else if (viewMode === "month") {
      setCurrentDate(currentDate.subtract(1, "year"));
    } else if (viewMode === "year") {
      setCurrentDate(currentDate.subtract(16, "year"));
    }
  };

  const handleNext = () => {
    if (viewMode === "calendar") setCurrentDate(currentDate.add(1, "month"));
    else if (viewMode === "month") setCurrentDate(currentDate.add(1, "year"));
    else if (viewMode === "year") setCurrentDate(currentDate.add(16, "year"));
  };

  const toggleDateSelection = (dateStr) => {
    // Chỉ cho phép chọn một ngày
    if (selectedDate === dateStr) {
      setSelectedDate(null); // Bỏ chọn nếu đã chọn ngày này
    } else {
      setSelectedDate(dateStr); // Chọn ngày mới
    }
  };

  const handleBooking = async () => {
    if (!selectedDate) {
      toast.error("Vui lòng chọn ngày khởi hành trước khi đặt tour.");
      return;
    }

    const selectedTours = travelTourData.filter(
      (tour) => selectedDate === dayjs(tour.start_day).format("YYYY-MM-DD")
    );

    if (selectedTours.length === 0) {
      toast.error("Không tìm thấy tour nào phù hợp.");
      return;
    }

    navigate("/booking/" + id, { state: { selectedTours, id } });
  };

  // console.log("travel Tour", travelTourData);
  // console.log("tour date", tourDates)


  return (
    <div className="">
      <div className="bg-amber-100 p-5 rounded-md shadow-lg">
        <h2 className="text-red-800 font-bold text-2xl">
          Lịch Trình và Giá Tour
        </h2>

        <div className="bg-white p-5 rounded-md mt-6 shadow-xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-2">
            <div>
              {canGoBack && (
                <button onClick={handlePrev}>
                  <FaChevronLeft />
                </button>
              )}
            </div>
            <div className="flex items-center gap-1">
              {viewMode === "calendar" && (
                <span
                  className="font-semibold cursor-pointer"
                  onClick={() => setViewMode("month")}
                >
                  {currentDate.format("MMMM").charAt(0).toUpperCase() +
                    currentDate.format("MMMM").slice(1)}
                  ,{" "}
                  <span
                    className="font-semibold cursor-pointer"
                    onClick={() => setViewMode("month")}
                  >
                    {currentDate.year()}
                  </span>
                </span>
              )}
              {viewMode !== "year" && viewMode !== "calendar" && (
                <span
                  className="font-semibold cursor-pointer"
                  onClick={() => setViewMode("year")}
                >
                  {currentDate.year()}
                </span>
              )}
            </div>

            <div>
              <button onClick={handleNext}>
                <FaChevronRight />
              </button>
            </div>
          </div>

          {/* Calendar */}
          {viewMode === "calendar" && (
            <div>
              <div className="grid grid-cols-7 text-center mt-3 text-zinc-900">
                {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
                  <div
                    key={day}
                    className={`font-semibold ${
                      day === "CN" ? "text-red-700" : ""
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1 mt-2">
                {days.map((date, i) => {
                  const dateStr = date.format("YYYY-MM-DD");
                  const isTourDate = tourDates[dateStr];
                  const isSelected = selectedDate === dateStr;
                  const isCurrentMonth = date.month() === currentDate.month();
                  const isPastDate = date.isBefore(dayjs(), "day");
                  return (
                    <div
                      key={i}
                      className={`h-16 w-16 flex flex-col items-center justify-center rounded-md transition duration-300 
                        ${
                          isTourDate
                            ? "border border-[#A80F21] text-red-600 cursor-pointer hover:bg-[#A80F21] hover:text-white"
                            : "cursor-default"
                        }
                        ${isSelected ? "bg-[#A80F21] text-white" : "bg-white"}
                        ${!isCurrentMonth ? "text-gray-400" : "text-black"}`}
                      onClick={() =>
                        !isPastDate &&
                        isTourDate &&
                        toggleDateSelection(dateStr)
                      }
                      onMouseEnter={() => isTourDate && setHoveredDate(dateStr)}
                      onMouseLeave={() => setHoveredDate(null)}
                    >
                      <span className="text-sm font-normal">{date.date()}</span>
                      {isTourDate && (
                        <span className="text-xs font-normal mt-1">
                          {tourDates[dateStr]}
                        </span>
                      )}
                      {hoveredDate === dateStr && isTourDate && (
                        <div className="absolute bg-red-500 text-sm text-white border border-gray-300 p-2 rounded shadow-lg mt-36">
                          <p>Ngày đi: {date.format("DD/MM/YYYY")}</p>
                          <p>Ngày về: {tourEndDates[dateStr] || date.add(1, "day").format("DD/MM/YYYY")}</p>
                          <p>Giá: {(parseFloat(tourDates[dateStr]) * 1000000).toLocaleString('vi-VN')} VNĐ</p>                        
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col gap-1 items-end mt-2 border-t pt-4 text-xs italic">
                <p className="text-[#9FC43A]">* Màu xanh lá: ngày khởi hành giá tốt nhất</p>
                <p className="text-red-500">* Màu đỏ: ngày khởi hành giá cao điểm</p>
                <p className="text-zinc-400">* Giá hiển thị trên 1 khách</p>
              </div>
            </div>
          )}

          {/* Month and Year View */}
          {viewMode === "month" && (
            <div className="grid grid-cols-4 gap-10 mt-2">
              {months.map((month, index) => (
                <div
                  key={index}
                  className={`px-3 py-7 text-center rounded-[50%] cursor-pointer transition  ${
                    currentDate.month() === index
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "hover:bg-gray-100 hover:text-black"
                  }`}
                  onClick={() => {
                    setCurrentDate(currentDate.month(index));
                    setViewMode("calendar");
                  }}
                >
                  {month}
                </div>
              ))}
            </div>
          )}

          {viewMode === "year" && (
            <div className="grid grid-cols-4 gap-10 mt-2">
              {years.map((year) => (
                <div
                  key={year}
                  className={`py-7 text-center rounded-[50%] cursor-pointer transition  ${
                    currentDate.year() === year
                      ? "bg-blue-600 text-white hover:bg-blue-500"
                      : "hover:bg-gray-100 hover:text-black"
                  }`}
                  onClick={() => {
                    setCurrentDate(currentDate.year(year));
                    setViewMode("month");
                  }}
                >
                  {year}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Button */}
        {viewMode === "calendar" && (
          <button
            onClick={handleBooking}
            className="bg-[#F79321] text-white font-bold w-full mt-4 py-4 rounded hover:bg-orange-500"
          >
            Đặt Tour
          </button>
        )}
      </div>
    </div>
  );
};

export default Calendar;
