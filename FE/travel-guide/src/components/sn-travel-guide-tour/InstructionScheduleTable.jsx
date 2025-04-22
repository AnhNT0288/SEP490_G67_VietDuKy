import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { formatDate } from "../../utils/dateUtil";
import { Loader } from "lucide-react";

const InstructionScheduleTable = ({ tours, loading, setTourSelected }) => {

    return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-SmokyGray text-left bg-gray-100 ">
          <th className="p-2">STT</th>
          <th className="p-2 ">Tên tour</th>
          <th className="p-2 text-center">Điểm khởi hành</th>
          <th className="p-2 text-center">Điểm kết thúc</th>
          <th className="p-2 text-center">Ngày khởi hành</th>
          <th className="p-2 text-center">Ngày về</th>
          <th
            className="text-end p-2"
            style={{ width: "1%", whiteSpace: "nowrap" }}
          >
            Thao tác
          </th>
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td colSpan="8">
              <Loader className="animate-spin mx-auto py-5" />
            </td>
          </tr>
        ) : tours.length > 0 ? (
          tours.map((tour, index) => (
            <tr key={tour.id} className="border-t h-5">
              <td className=" p-2">{index + 1}</td>
              <td className=" p-2">{tour?.travelTour?.Tour?.name_tour}</td>
              <td className=" p-2 text-center">
                {tour?.travelTour?.Tour?.startLocation?.name_location}
              </td>
              <td className=" p-2 text-center">
                {tour?.travelTour?.Tour?.endLocation?.name_location}
              </td>
              <td className=" p-2 text-center">
                {tour?.travelTour?.start_day
                  ? formatDate(tour?.travelTour?.start_day)
                  : ""}
              </td>
              <td className=" p-2 text-center">
                {tour?.travelTour?.end_day
                  ? formatDate(tour?.travelTour?.end_day)
                  : ""}
              </td>
              <td className="flex justify-end p-2">
                <button
                  className="hover:text-red-500"
                  onClick={() => setTourSelected(tour)}
                >
                  <HiOutlineDotsHorizontal />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="8" className="text-center">
              <h3 className="text-gray-500 py-3">Không có dữ liệu</h3>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default InstructionScheduleTable;
