import { LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import { getAllVehicles, deleteVehicle } from "../../services/API/vehicle.service.js";
import ModalAddVehicle from "../../components/ModalManage/ModalAdd/ModalAddVehicle.jsx";
import ModalUpdateVehicle from "../../components/ModalManage/ModalUpdate/ModalUpdateVehicle.jsx";
import DropdownVehicle from "../../components/Dropdown/DropdownVehicle.jsx";
import { toast } from "react-toastify";

export default function ManagementVehicle() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editVehicleId, setEditVehicleId] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const fetchVehicles = async () => {
    try {
      const data = await getAllVehicles();
      setVehicles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách phương tiện:", error);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditVehicleId(vehicle.id);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá phương tiện này?")) return;

    try {
      await deleteVehicle(vehicleId);
      toast.success(" Đã xoá phương tiện thành công!");
      fetchVehicles();
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error(" Xoá phương tiện thất bại!");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
      <div title="Quản lý Phương tiện">
        <div>
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-md flex gap-4 items-center">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                  type="text"
                  placeholder="Tìm kiếm bằng từ khóa"
                  className="pl-10 pr-4 py-2 border rounded-md w-1/3"
              />
            </div>

            <button
                className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
                onClick={toggleModal}
            >
              Thêm Phương tiện
            </button>
          </div>

          {/* Vehicle Table */}
          <div className="mt-2 bg-white p-4">
            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : (
                <table className="w-full border-collapse">
                  <thead>
                  <tr className="text-SmokyGray text-left">
                    <th className="p-2">Tên Phương tiện</th>
                    <th className="p-2">Biển số xe</th>
                    <th className="p-2">Số điện thoại</th>
                    <th className="text-end p-2" style={{ width: "1%", whiteSpace: "nowrap" }}>
                      Thao tác
                    </th>
                  </tr>
                  </thead>
                  <tbody>
                  {vehicles.map((vehicle) => (
                      <tr key={vehicle.id} className="border-t">
                        <td className="p-2">{vehicle.name_vehicle}</td>
                        <td className="p-2">{vehicle.plate_number}</td>
                        <td className="p-2">{vehicle.phone_number}</td>
                        <td className="p-2 text-end">
                          <DropdownVehicle
                              vehicleId={vehicle.id}
                              isOpen={openDropdownId === vehicle.id}
                              setOpenDropdown={setOpenDropdownId}
                              onEditVehicle={() => handleEditVehicle(vehicle)}
                              onDeleteVehicle={() => handleDeleteVehicle(vehicle.id)}
                          />
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>

          {/* Modal thêm phương tiện */}
          {isModalOpen && (
              <ModalAddVehicle onClose={toggleModal} onAddSuccess={fetchVehicles} />
          )}

          {/* Modal cập nhật phương tiện */}
          {editVehicleId && (
              <ModalUpdateVehicle
                  vehicleId={editVehicleId}
                  onClose={() => setEditVehicleId(null)}
                  onUpdateSuccess={fetchVehicles}
              />
          )}
        </div>
      </div>
  );
}
