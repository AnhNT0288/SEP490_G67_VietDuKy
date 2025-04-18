import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  format,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { vi } from "date-fns/locale";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function CalendarTravelTour({ travelTours = [], tourId, tours = [] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = new Date();

  const filteredTours = travelTours.filter((t) => t.tour_id === tourId);

  const start = startOfWeek(startOfMonth(currentMonth), { weekStartsOn: 1 });
  const end = endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 });

  const days = [];
  let current = start;
  while (current <= end) {
    days.push(new Date(current));
    current = addDays(current, 1);
  }

  const tourLineIndexMap = {};
  let nextLineIndex = 0;
  filteredTours.forEach((tour) => {
    if (!tourLineIndexMap[tour.id]) {
      tourLineIndexMap[tour.id] = nextLineIndex++;
    }
  });

  return (
      <div className="h-[500px] border rounded-md p-4 overflow-auto relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <button
                className="border px-3 py-1 rounded text-sm hover:bg-gray-100"
                onClick={() => setCurrentMonth(new Date())}
            >
              Hôm nay
            </button>
            <button
                className="text-xl px-2"
                onClick={() => setCurrentMonth((prev) => addDays(startOfMonth(prev), -1))}
            >
              <FiChevronLeft />
            </button>
            <span className="font-semibold text-sm">
            {format(currentMonth, "MMMM, yyyy", { locale: vi })}
          </span>
            <button
                className="text-xl px-2"
                onClick={() => setCurrentMonth((prev) => addDays(endOfMonth(prev), 1))}
            >
              <FiChevronRight />
            </button>
          </div>

          {/* Legend */}
          <div className="flex gap-4 text-xs items-center">
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> Sắp khởi hành
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-orange-500"></span> Đang diễn ra
            </div>
            <div className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-gray-500"></span> Đã hoàn thành
            </div>
          </div>
        </div>

        {/* Weekday Header */}
        <div className="grid grid-cols-7 text-xs font-semibold text-gray-600 mb-1">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
              <div key={d} className="text-center py-2 border-b border-gray-200">
                {d}
              </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 text-xs relative z-0">
          {days.map((day, idx) => {
            const isCurrentMonth = isSameMonth(day, currentMonth);
            const isToday = format(day, "yyyy-MM-dd") === format(today, "yyyy-MM-dd");

            const toursInDay = filteredTours.filter((tour) => {
              const start = parseISO(tour.start_day);
              const end = parseISO(tour.end_day);
              return isWithinInterval(day, { start, end });
            });

            return (
                <div
                    key={idx}
                    className={`border pb-1 pt-1 relative flex flex-col justify-start ${
                        !isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                    } border border-gray-200 ${isToday ? "text-red-500 font-bold" : ""}`}
                >
                  <div className="absolute top-1 left-1 text-[11px]">
                    {format(day, "dd")}
                  </div>

                  <div className="flex flex-col mt-5 gap-[1px]">
                    {Array.from({ length: nextLineIndex }).map((_, lineIdx) => {
                      const tourAtLine = toursInDay.find(
                          (tour) => tourLineIndexMap[tour.id] === lineIdx
                      );

                      if (!tourAtLine) return <div key={lineIdx} className="h-[20px] w-full" />;

                      const start = parseISO(tourAtLine.start_day);
                      const end = parseISO(tourAtLine.end_day);
                      const tourInfo = tours.find((t) => t.id === tourAtLine.tour_id);
                      const tourName = tourInfo?.name_tour || `#${tourAtLine.id}`;
                      const isStart = format(day, "yyyy-MM-dd") === format(start, "yyyy-MM-dd");
                      const isEnd = format(day, "yyyy-MM-dd") === format(end, "yyyy-MM-dd");

                      let bg = "bg-blue-100 text-blue-700";
                      if (today >= start && today <= end) bg = "bg-orange-100 text-orange-700";
                      if (today > end) bg = "bg-gray-300 text-gray-600";

                      const borderRadiusClass =
                          isStart && isEnd
                              ? "rounded-lg"
                              : isStart
                                  ? "rounded-l-lg"
                                  : isEnd
                                      ? "rounded-r-lg"
                                      : "!rounded-none";

                      return (
                          <div
                              key={lineIdx}
                              className={`h-[20px] w-full text-[11px] relative flex items-center ${bg} ${borderRadiusClass} group`}
                          >
                            {/* Stripes */}
                            {isStart && (
                                <div className={`absolute left-0 top-0 h-full w-[4px] ${
                                    bg.includes("blue")
                                        ? "bg-blue-600"
                                        : bg.includes("orange")
                                            ? "bg-orange-600"
                                            : "bg-gray-600"
                                } rounded-l`} />
                            )}
                            {isEnd && (
                                <div className={`absolute right-0 top-0 h-full w-[4px] ${
                                    bg.includes("blue")
                                        ? "bg-blue-600"
                                        : bg.includes("orange")
                                            ? "bg-orange-600"
                                            : "bg-gray-600"
                                } rounded-r`} />
                            )}

                            {isStart && (
                                <div className="truncate pl-4 z-10 cursor-pointer">
                                  {tourName} - {tourAtLine.max_people} chỗ
                                </div>
                            )}

                            {/* Hover tooltip card */}
                            <div className="absolute z-50 hidden group-hover:block bg-white shadow-lg rounded-lg p-3 text-[12px] w-[300px] top-[100%] left-0 mt-1 border">
                              <div className="font-semibold">{tourName}</div>
                              <div className="text-gray-500">
                                {format(start, "EEE, dd/MM/yyyy", { locale: vi })} →{" "}
                                {format(end, "EEE, dd/MM/yyyy", { locale: vi })}
                              </div>
                              <div className="mt-1">
                                <span className="font-medium">Tình trạng đặt chỗ:</span>{" "}
                                {tourAtLine?.booked || 0}/{tourAtLine?.max_people}
                              </div>
                              <div className="mt-1">
                                <span className="font-medium">Hướng dẫn viên:</span>{" "}
                                {tourAtLine?.guides?.join(", ") || "Chưa cập nhật"}
                              </div>
                            </div>
                          </div>
                      );
                    })}
                  </div>
                </div>
            );
          })}
        </div>
      </div>
  );
}
