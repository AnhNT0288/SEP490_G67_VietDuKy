import { TravelTourService } from "@/services/API/travel_tour.service";
import { formatDayDMY } from "@/utils/dateUtil";
import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function DepartureSchedule({ id, initialSelectedDate }) {
  const [tourSchedules, setTourSchedules] = useState([]);
  const [selectedDate, setSelectedDate] = useState(initialSelectedDate || "");
  const [visibleCount, setVisibleCount] = useState(10); // 👈 hiển thị mặc định 10

  useEffect(() => {
    TravelTourService.getTravelTourByTourId(id)
      .then((response) => {
        const travelTourData = response.data.data;
        setTourSchedules(travelTourData);
      })
      .catch((error) =>
        console.error("Error fetching travel tour data:", error)
      );
  }, [id]);

  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 10);
  };

  const visibleSchedules = tourSchedules.slice(0, visibleCount);

  return (
    <div className="col-span-2 bg-white shadow-lg bg-opacity-20 p-4 rounded-lg mt-4 border border-gray-300">
      {/* Header */}
      <div className="flex justify-between items-center pb-3">
        <h2 className="text-2xl text-neutral-700 font-bold">
          Lịch khởi hành & giá Tour
        </h2>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-3 py-1 border rounded-md bg-gray-100 text-gray-600 cursor-pointer"
        />
      </div>

      {/*Body*/}
      <div className="mt-3">
        {tourSchedules.length > 0 ? (
          <div className="flex justify-between items-center border-b mt-4">
            <table className="w-full text-left text-md">
              <thead className="text-zinc-500 font-medium">
                <tr>
                  <th className="py-2">Ngày khởi hành</th>
                  <th className="py-2">Ngày về</th>
                  <th className="py-2">Tình trạng chỗ</th>
                  <th className="py-2 text-right">Giá</th>
                </tr>
              </thead>
              <tbody>
                {visibleSchedules.map((schedule, index) => (
                  <tr
                    key={schedule.id}
                    className={`border-t text-black text-sm ${
                      index % 2 ? "bg-gray-100" : ""
                    }`}
                  >
                    <td className="py-4 px-2">
                      {formatDayDMY(schedule.start_day)}
                    </td>
                    <td className="py-4 px-2">
                      {formatDayDMY(schedule.end_day)}
                    </td>
                    <td className="py-4 px-2">{schedule.max_people}</td>
                    <td className="py-4 px-2 text-right font-bold text-red-700">
                      {schedule.price_tour.toLocaleString("vi-VN")} VNĐ
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 flex justify-center">
            Chưa có lịch khởi hành
          </p>
        )}
      </div>

      {/* Nút Xem thêm */}
      {visibleCount < tourSchedules.length && (
        <div className="text-center mt-6">
          <button
            className="text-red-500 font-medium hover:underline"
            onClick={handleShowMore}
          >
            Xem thêm
          </button>
        </div>
      )}
    </div>
  );
}
