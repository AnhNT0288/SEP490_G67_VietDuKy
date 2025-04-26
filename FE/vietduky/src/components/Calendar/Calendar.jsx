import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "dayjs/locale/vi";
import { TravelTourService } from "@/services/API/travel_tour.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formatYMD } from "@/utils/dateUtil";

dayjs.locale("vi");

export default function Calendar({ id, initialSelectedDate }) {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [viewMode, setViewMode] = useState("calendar");
  const [travelTourData, setTravelTourData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  useEffect(() => {
    TravelTourService.getTravelTourByTourId(id)
      .then((res) => setTravelTourData(res.data.data || []))
      .catch((err) => console.error("Error fetching travel tours:", err));
  }, [id]);

  const startOfMonth = currentDate.startOf("month");
  const startDay = startOfMonth.day();
  const totalDays = 42;
  const days = Array.from({ length: totalDays }, (_, index) => startOfMonth.subtract(startDay, "day").add(index, "day"));

  useEffect(() => {
    if (initialSelectedDate) {
      setSelectedDate(formatYMD(initialSelectedDate));
    } else {
      const firstTour = travelTourData[0];
      if (firstTour) setSelectedDate(dayjs(firstTour.start_day).format("YYYY-MM-DD"));
    }
  }, [travelTourData, initialSelectedDate]);

  const findTourByDate = (dateStr) => travelTourData.find(tour => dayjs(tour.start_day).format("YYYY-MM-DD") === dateStr);

  const handleBooking = () => {
    if (!selectedDate) return toast.error("Vui lòng chọn ngày khởi hành trước khi đặt tour.");
    const selectedTours = travelTourData.filter(tour => dayjs(tour.start_day).format("YYYY-MM-DD") === selectedDate);
    if (!selectedTours.length) return toast.error("Không tìm thấy tour nào phù hợp.");
    navigate("/booking/" + id, { state: { selectedTours, id } });
  };

  useEffect(() => {
    if (selectedDate) {
      const selectedMonth = dayjs(selectedDate);
      if (!currentDate.isSame(selectedMonth, "month")) {
        setCurrentDate(selectedMonth.startOf("month"));
      }
    }
  }, [selectedDate]);

  return (
    <div className="bg-amber-100 p-5 rounded-md shadow-lg">
      <h2 className="text-red-800 font-bold text-2xl">Lịch Trình và Giá Tour</h2>
      <div className="bg-white p-5 rounded-md mt-6 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setCurrentDate(currentDate.subtract(viewMode === "calendar" ? 1 : viewMode === "month" ? 12 : 16, "month"))}><FaChevronLeft /></button>
          <div className="flex items-center gap-1">
            <span className="font-semibold cursor-pointer" onClick={() => setViewMode(viewMode === "calendar" ? "month" : viewMode === "month" ? "year" : "calendar")}>{currentDate.format(viewMode === "calendar" ? "MMMM, YYYY" : viewMode === "month" ? "YYYY" : "")}</span>
          </div>
          <button onClick={() => setCurrentDate(currentDate.add(viewMode === "calendar" ? 1 : viewMode === "month" ? 12 : 16, "month"))}><FaChevronRight /></button>
        </div>

        {viewMode === "calendar" && (
          <div>
            <div className="grid grid-cols-7 text-center mt-3 text-zinc-900">
              {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((d) => (<div key={d} className={`font-semibold ${d === "CN" ? "text-red-700" : ""}`}>{d}</div>))}
            </div>
            <div className="grid grid-cols-7 gap-1 mt-2">
              {days.map((date, i) => {
                const dateStr = date.format("YYYY-MM-DD");
                const tour = findTourByDate(dateStr);
                const isTourDate = !!tour;
                const isTourDisabled = tour && tour.active === false;
                const isPastDate = date.isBefore(dayjs(), "day");
                const isSelected = selectedDate === dateStr;

                return (
                  <div
                    key={i}
                    className={`h-16 w-16 flex flex-col items-center justify-center rounded-md transition duration-300 ${
                      isTourDate ?
                        isPastDate || isTourDisabled ? "bg-gray-200 text-gray-500 cursor-not-allowed" :
                        "border border-[#A80F21] text-red-600 cursor-pointer hover:bg-[#A80F21] hover:text-white" :
                        "cursor-default"
                    } ${isSelected ? "bg-[#A80F21] text-white" : "bg-white"} ${date.month() !== currentDate.month() ? "text-gray-400" : "text-black"}`}
                    onClick={() => !isPastDate && isTourDate && !isTourDisabled && setSelectedDate(dateStr)}
                    onMouseEnter={() => isTourDate && setHoveredDate(dateStr)}
                    onMouseLeave={() => setHoveredDate(null)}
                  >
                    <span className="text-sm font-normal">{date.date()}</span>
                    {isTourDate && (
                      <span className="text-xs font-normal mt-1">
                        {tour.active ? (tour.price_tour / 1000).toLocaleString("vi-VN") + "k" : "Đủ người"}
                      </span>
                    )}
                    {hoveredDate === dateStr && isTourDate && (
                      <div className="absolute bg-red-500 text-white p-2 rounded shadow-lg text-xs mt-36">
                        <p>Ngày đi: {date.format("DD/MM/YYYY")}</p>
                        <p>Ngày về: {dayjs(tour.end_day).format("DD/MM/YYYY")}</p>
                        <p>
                          {tour.active
                            ? `Giá: ${(tour.price_tour).toLocaleString("vi-VN")} VNĐ`
                            : "Tour đã đủ người"}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === "month" && (
          <div className="grid grid-cols-4 gap-10 mt-2">
            {Array.from({ length: 12 }, (_, i) => i).map((month) => (
              <div key={month} className="py-7 text-center rounded-full cursor-pointer hover:bg-gray-200" onClick={() => { setCurrentDate(currentDate.month(month)); setViewMode("calendar"); }}>{`Thg${month + 1}`}</div>
            ))}
          </div>
        )}

        {viewMode === "year" && (
          <div className="grid grid-cols-4 gap-10 mt-2">
            {Array.from({ length: 16 }, (_, i) => currentDate.year() - (currentDate.year() % 16) + i).map((year) => (
              <div key={year} className="py-7 text-center rounded-full cursor-pointer hover:bg-gray-200" onClick={() => { setCurrentDate(currentDate.year(year)); setViewMode("month"); }}>{year}</div>
            ))}
          </div>
        )}

        {viewMode === "calendar" && (
          <button onClick={handleBooking} className="bg-[#F79321] text-white font-bold w-full mt-4 py-4 rounded hover:bg-orange-500">
            Đặt Tour
          </button>
        )}
      </div>
    </div>
  );
}
