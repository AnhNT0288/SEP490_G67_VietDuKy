import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SearchBar({ tours, travelTours, filteredTours }) {
  const [sortOption, setSortOption] = useState("Ngày khởi hành gần nhất");

  return (
    <div>
      <div className="flex items-center justify-between bg-transparent border-b border-gray-200 py-4">
        {/* Danh sách Tour */}
        <div className="mt-4 space-y-4">
          <div className="text-lg font-medium text-gray-800">
            Chúng tôi tìm thấy{" "}
            <span className="font-bold text-red-600">
              {" "}
              {filteredTours.length}
            </span>{" "}
            chương trình tour cho quý khách
          </div>
        </div>

        {/* Bộ lọc sắp xếp */}
        {/* <div className="flex items-center gap-2 cursor-pointer">
          <span className="text-gray-600">Sắp xếp theo:</span>
          <button className="flex items-center gap-1 px-3 py-2 border rounded-md bg-white hover:bg-gray-200">
            {sortOption} <ChevronDown size={16} />
          </button>
        </div> */}
      </div>
    </div>
  );
}
