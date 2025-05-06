import { useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

const requestData = [
  {
    id: 1,
    name: "Phạm Đức Mạnh",
    date: "T4, 06/03/2025",
    tour: "Tour Đà Lạt 2 ngày 1 đêm",
    from: "Hà Nội",
    to: "Đà Lạt",
    startDate: "CN, 02/03/2025",
    endDate: "T4, 05/03/2025",
    status: "Chờ duyệt",
  },
  {
    id: 2,
    name: "Phạm Đức Mạnh",
    date: "T4, 06/03/2025",
    tour: "Tour Đà Lạt 2 ngày 1 đêm",
    from: "Đà Lạt",
    to: "Hà Nội",
    startDate: "CN, 02/03/2025",
    endDate: "T4, 05/03/2025",
    status: "Duyệt yêu cầu",
  },
  {
    id: 3,
    name: "Phạm Đức Mạnh",
    date: "T4, 06/03/2025",
    tour: "Tour Đà Lạt 2 ngày 1 đêm",
    from: "Đà Lạt",
    to: "Hà Nội",
    startDate: "CN, 02/03/2025",
    endDate: "T4, 05/03/2025",
    status: "Từ chối",
  },
];

const statusColor = {
  "Chờ duyệt": "text-blue-600",
  "Duyệt yêu cầu": "text-green-600",
  "Từ chối": "text-red-500",
};

export default function ManagementAprovalTour() {
  const [filterStatus, setFilterStatus] = useState("");

  const filteredData = requestData.filter((item) =>
    filterStatus ? item.status === filterStatus : true
  );

  return (
    <div className="p-4">
      {/* Filter */}
      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Tìm kiếm bằng từ khóa"
          className="border px-3 py-1 rounded w-1/3"
        />
        <select
          className="border px-3 py-1 rounded"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">Trạng thái</option>
          <option value="Chờ duyệt">Chờ duyệt</option>
          <option value="Duyệt yêu cầu">Duyệt yêu cầu</option>
          <option value="Từ chối">Từ chối</option>
        </select>
      </div>

      {/* Table */}
      <table className="w-full border-collapse table-auto">
        <thead>
          <tr className="bg-gray-100 text-sm text-gray-700">
            <th className=" p-2">Người gửi yêu cầu</th>
            <th className=" p-2">Thời gian gửi</th>
            <th className=" p-2">Tên Tour</th>
            <th className=" p-2">Điểm khởi hành</th>
            <th className=" p-2">Điểm kết thúc</th>
            <th className=" p-2">Ngày khởi hành</th>
            <th className=" p-2">Ngày về</th>
            <th className=" p-2">Trạng thái</th>
            <th className=" p-2">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="text-sm text-gray-800">
              <td className=" px-2 py-1">{item.name}</td>
              <td className=" px-2 py-1">{item.date}</td>
              <td className=" px-2 py-1">{item.tour}</td>
              <td className=" px-2 py-1">{item.from}</td>
              <td className=" px-2 py-1">{item.to}</td>
              <td className=" px-2 py-1">{item.startDate}</td>
              <td className=" px-2 py-1">{item.endDate}</td>
              <td className={` px-2 py-1 font-semibold ${statusColor[item.status]}`}>
                {item.status}
              </td>
              <td className=" px-2 py-1 text-center space-x-2">
                <button className="text-green-600 hover:scale-110">
                  <FaCheck />
                </button>
                <button className="text-red-600 hover:scale-110">
                  <FaTimes />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
