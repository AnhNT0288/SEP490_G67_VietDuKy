import { LuSearch } from "react-icons/lu";
import { useEffect, useState } from "react";
import ModalAddHotel from "../../components/ModalManage/ModalAdd/ModalAddHotel.jsx";
import {deleteHotel, getAllHotels} from "../../services/API/hotel.service.js";
import DropdownHotel from "../../components/Dropdown/DropdownHotel.jsx";
import {toast} from "react-toastify";
import ModalUpdateHotel from "../../components/ModalManage/ModalUpdate/ModalUpdateHotel.jsx";

export default function ManagementHotel() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [hotelEditing, setHotelEditing] = useState(null);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      const response = await getAllHotels();
      const data = response || [];
      setHotels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu khách sạn:", error);
      setHotels([]);
    }
  };

  const filteredHotels = hotels.filter(hotel =>
      (hotel?.name_hotel || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteHotel = async (hotelId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách sạn này?")) {
      return;
    }

    try {
      await deleteHotel(hotelId);
      // Xoá thành công, cập nhật lại danh sách
      setHotels(prevHotels => prevHotels.filter(hotel => hotel.id !== hotelId));
      toast.success("Đã xóa khách sạn thành công!");
    } catch (error) {
      console.error("Lỗi khi xóa khách sạn:", error);
      toast.error("Xóa khách sạn thất bại!");
    }
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  return (
      <div title="Quản lý Khách sạn">
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

            {/* Nút thêm khách sạn */}
            <button
                className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
                onClick={toggleModal}
            >
              Thêm khách sạn
            </button>
          </div>

          {/* Hotel table */}
          <div className="mt-2 bg-white p-4">
            <table className="w-full border-collapse">
              <thead>
              <tr className="text-SmokyGray text-left">
                <th className="p-2">Tên Khách sạn</th>
                <th className="p-2">Địa chỉ</th>
                <th className="p-2">Số điện thoại</th>
                <th className="p-2">Vị trí</th>
                <th className="text-end p-2" style={{ width: "1%", whiteSpace: "nowrap" }}>
                  Thao tác
                </th>
              </tr>
              </thead>
              <tbody>
              {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="border-t">
                    <td className="p-2">{hotel.name_hotel}</td>
                    <td className="p-2">{hotel.address_hotel}</td>
                    <td className="p-2">{hotel.phone_number}</td>
                    <td className="p-2">
                      {hotel.Location ? hotel.Location.name_location : "Chưa cập nhật"}
                    </td>
                    <td className="flex justify-end p-2">
                      <DropdownHotel
                          hotelId={hotel.id}
                          isOpen={openDropdown === hotel.id}
                          setOpenDropdown={setOpenDropdown}
                          onEditHotel={() => {
                            setHotelEditing(hotel);
                            setIsModalUpdateOpen(true);
                          }}
                          onDeleteHotel={() => handleDeleteHotel(hotel.id)}
                      />
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
            {filteredHotels.length === 0 && (
                <div className="text-center text-gray-500 mt-4">Không tìm thấy khách sạn nào</div>
            )}
          </div>

          {/* Modal thêm khách sạn */}
          {isModalOpen && <ModalAddHotel onClose={toggleModal} onAddSuccess={fetchHotels} />}

          {isModalUpdateOpen && (
              <ModalUpdateHotel
                  hotelData={hotelEditing}
                  onClose={() => setIsModalUpdateOpen(false)}
                  onUpdateSuccess={fetchHotels} // Load lại sau khi sửa
              />
          )}
        </div>
      </div>
  );
}
