import { LuSearch } from "react-icons/lu";
import Layout from "../../layouts/LayoutManagement";
import { formatDate } from '../../utils/dateUtil'
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { useEffect, useState } from "react";
import ModalAddVehicle from "../../components/ModalManage/ModalAdd/ModalAddVehicle.jsx";

const vehicles = [
  {
    id: 1,
    name: "Khách sạn Mặt Trời Vàng",
    licensePlate: "024123456",
  },
  {
    id: 2,
    name: "Khách sạn Ngôi sao Sapa",
    licensePlate: "024123456",
  },
  {
    id: 3,
    name: "Khách sạn Hương Sapa",
    licensePlate: "024123456",
  },
];

export default function ManagementVehicle() {
  const [isModalOpen, setIsModalOpen] = useState(false);
//   const [travelTours, setTravelTours] = useState([]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  // call API
//   useEffect(() => {    
//     const fetchTravelTours = async () => {
//       try {
//         const response = await getTravelTour();
//         const data = response.travelTours || response;
//         // console.log("Dữ liệu nhận được:", data);
        
//         setTravelTours(Array.isArray(data) ? data : []);
//       } catch (error) {
//         console.log("Lỗi khi lấy dữ liệu từ API", error);
//         setTravelTours([]);        
//       }
//     };

//     fetchTravelTours();
//   }, []);

  return (
    <div title="Quản lý Phương tiện">
      <div>
        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-md flex gap-4 items-center">
          <div className="relative flex-1 ">
            <LuSearch className="absolute left-3 top-3 text-gray-500" />
            <input
              type="text"
              placeholder="Tìm kiếm bằng từ khóa"
              className="pl-10 pr-4 py-2 border rounded-md w-1/3"
            />
          </div>

          {/* Nút thêm Phương tiện */}
          <button
            className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
            onClick={toggleModal}
          >
            Thêm Phương tiện 
          </button>
        </div>

        {/* Travel Tour table */}
        <div className="mt-2 bg-white p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-SmokyGray text-left">
                <th className="p-2">Tên Phương tiện</th>
                <th className="p-2">Biển số xe</th>
                <th
                  className="text-end p-2"
                  style={{ width: "1%", whiteSpace: "nowrap" }}
                >
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="border-t">
                  <td className=" p-2">{vehicle.name}</td>
                  <td className=" p-2">{vehicle.licensePlate}</td>
                  <td className="flex justify-end p-2">
                    <HiOutlineDotsHorizontal />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal thêm tour */}
        {isModalOpen && <ModalAddVehicle onClose={toggleModal} />}
      </div>
    </div>
  );
}
