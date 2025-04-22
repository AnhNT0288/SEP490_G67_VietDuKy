import { useEffect, useState } from "react";
import { formatDate } from "../../utils/dateUtil";
import { DiscountService } from "../../services/API/discount-service.service";
import { getAllLocations } from "../../services/API/topic.service";

const TourDiscountLastMinute = [
  {
    id: 1,
    name: "Tour HCM 4N3Đ: Hà Nội – Đà Nẵng – Sơn Trà – Bà Nà",
    departure: "Hà Nội",
    destination: "Sapa",
    startDate: "2025-02-28",
    returnDate: "2025-03-03",
    price: 7990000,
    salePrice: 5990000,
  },
  {
    id: 2,
    name: "Tour HCM 4N3Đ: Hà Nội – Đà Nẵng – Sơn Trà – Bà Nà",
    departure: "Hải Phòng",
    destination: "Hà Nội",
    startDate: "2025-03-02",
    returnDate: "2025-03-05",
    price: 7990000,
    salePrice: 4990000,
  },
];

export default function ManagementTourDiscountLastMinute() {
  const [TourDiscountLastMinutes, setTourDiscountLastMinutes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedDeparture, setSelectedDeparture] = useState("");
  const [selectedDestination, setSelectedDestination] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchTourDiscountLastMinutes = async () => {
      try {
        const response = await DiscountService.getAllDiscountServices();
        if (response && response.data) {
          setTourDiscountLastMinutes(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching tour discount last minutes:", error);
      }
    };

    const fetchLocations = async () => {
        try {
            const response = await getAllLocations();
            setLocations(response.data);
        } catch (error) {
            console.error("Error fetching locations:", error);
        }
    };

    fetchLocations();
    fetchTourDiscountLastMinutes();
  });

  console.log("TourDiscountLastMinutes", TourDiscountLastMinutes);
    console.log("locations", locations);
  

  const filteredData = TourDiscountLastMinutes.filter((tour) => {
    return (
      tour?.travelTour?.Tour?.start_location.toLowerCase().includes(search.toLowerCase()) &&
      (selectedDeparture ? tour.departure === selectedDeparture : true) &&
      (selectedDestination ? tour.destination === selectedDestination : true) &&
      (selectedDate ? tour.startDate === selectedDate : true)
    );
  });

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-4">
        Danh sách lịch trình phút chót
      </h2>
      <div className="flex flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm bằng từ khóa"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded flex-1 min-w-[200px]"
        />
        <select
          value={selectedDeparture}
          onChange={(e) => setSelectedDeparture(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Điểm khởi hành</option>
          <option value="Hà Nội">Hà Nội</option>
          <option value="Hải Phòng">Hải Phòng</option>
        </select>
        <select
          value={selectedDestination}
          onChange={(e) => setSelectedDestination(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Điểm đến</option>
          <option value="Sapa">Sapa</option>
          <option value="Hà Nội">Hà Nội</option>
        </select>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100 text-left text-sm">
            <th className="p-2">Tên Tour</th>
            <th className="p-2">Điểm khởi hành</th>
            <th className="p-2">Điểm đến</th>
            <th className="p-2">Ngày khởi hành</th>
            <th className="p-2">Ngày về</th>
            <th className="p-2 text-right">Giá gốc</th>
            <th className="p-2 text-right">Giá sau giảm giá</th>
            <th className="p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? (
            <tr>
              <td colSpan="8" className="text-center p-4 text-gray-500">
                Không có dữ liệu
              </td>
            </tr>
          ) : (
            filteredData.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 text-sm">
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.departure}</td>
                <td className="p-2">{item.destination}</td>
                <td className="p-2">{formatDate(item.startDate)}</td>
                <td className="p-2">{formatDate(item.returnDate)}</td>
                <td className="p-2 text-right text-red-600 font-bold">
                  {item.price.toLocaleString("vi-VN")} VND
                </td>
                <td className="p-2 text-right text-red-500 font-bold">
                  {item.salePrice.toLocaleString("vi-VN")} VND
                </td>
                <td className="p-2">
                  <button className="text-blue-500 hover:underline">
                    <i className="ri-edit-line"></i> Sửa
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
