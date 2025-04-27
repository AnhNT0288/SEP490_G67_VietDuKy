import { LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import ModalAddRestaurant from "../../components/ModalManage/ModalAdd/ModalAddRestaurant.jsx";
import { deleteRestaurant, getAllRestaurants } from "../../services/API/restaurant.service.js";
import DropdownRestaurant from "../../components/Dropdown/DropdownRestaurant.jsx";
import ModalUpdateRestaurant from "../../components/ModalManage/ModalUpdate/ModalUpdateRestaurant.jsx";
import { toast } from "react-toastify";

export default function ManagementRestaurant() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [restaurants, setRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [restaurantEditing, setRestaurantEditing] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await getAllRestaurants();
      const data = response || [];
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhà hàng:", error);
      setRestaurants([]);
    }
  };

  const filteredRestaurants = restaurants.filter(restaurant =>
      (restaurant?.name_restaurant || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteRestaurant = async (restaurantId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa nhà hàng này?")) {
      return;
    }

    try {
      await deleteRestaurant(restaurantId);
      setRestaurants(prev => prev.filter(r => r.id !== restaurantId));
      toast.success("Đã xóa nhà hàng thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa nhà hàng:", error);
      toast.error("Xóa nhà hàng thất bại!");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
      <div title="Quản lý Nhà hàng">
        <div>
          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-md flex gap-4 items-center">
            <div className="relative flex-1">
              <LuSearch className="absolute left-3 top-3 text-gray-500" />
              <input
                  type="text"
                  placeholder="Tìm kiếm bằng từ khóa"
                  className="pl-10 pr-4 py-2 border rounded-md w-1/3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Nút thêm nhà hàng */}
            <button
                className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
                onClick={toggleModal}
            >
              Thêm nhà hàng
            </button>
          </div>

          {/* Restaurant table */}
          <div className="mt-2 bg-white p-4">
            <table className="w-full border-collapse">
              <thead>
              <tr className="text-SmokyGray text-left">
                <th className="p-2">Tên Nhà hàng</th>
                <th className="p-2">Địa chỉ</th>
                <th className="p-2">Số điện thoại</th>
                <th className="p-2">Vị trí</th> {/* ➡️ Thêm cột vị trí */}
                <th className="text-end p-2" style={{ width: "1%", whiteSpace: "nowrap" }}>
                  Thao tác
                </th>
              </tr>
              </thead>
              <tbody>
              {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="border-t">
                    <td className="p-2">{restaurant.name_restaurant}</td>
                    <td className="p-2">{restaurant.address_restaurant}</td>
                    <td className="p-2">{restaurant.phone_number}</td>
                    <td className="p-2">
                      {restaurant.Location ? restaurant.Location.name_location : "Chưa cập nhật"}
                    </td> {/* ➡️ Hiển thị vị trí */}
                    <td className="flex justify-end p-2">
                      <DropdownRestaurant
                          restaurantId={restaurant.id}
                          isOpen={openDropdown === restaurant.id}
                          setOpenDropdown={setOpenDropdown}
                          onEditRestaurant={() => {
                            setRestaurantEditing(restaurant);
                            setIsModalUpdateOpen(true);
                          }}
                          onDeleteRestaurant={() => handleDeleteRestaurant(restaurant.id)}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            {filteredRestaurants.length === 0 && (
                <div className="text-center text-gray-500 mt-4">Không tìm thấy nhà hàng nào</div>
            )}
          </div>

          {/* Modal thêm nhà hàng */}
          {isModalOpen && (
              <ModalAddRestaurant
                  onClose={toggleModal}
                  onAddSuccess={fetchRestaurants}
              />
          )}

          {/* Modal cập nhật nhà hàng */}
          {isModalUpdateOpen && (
              <ModalUpdateRestaurant
                  restaurantData={restaurantEditing}
                  onClose={() => setIsModalUpdateOpen(false)}
                  onUpdateSuccess={fetchRestaurants}
              />
          )}
        </div>
      </div>
  );
}
