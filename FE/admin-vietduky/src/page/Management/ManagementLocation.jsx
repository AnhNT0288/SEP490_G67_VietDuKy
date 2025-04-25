import { useEffect, useState, useRef } from "react";
import Layout from "../../layouts/LayoutManagement";
import { getLocations, deleteLocation } from "../../services/API/location.service";
import { LuSearch } from "react-icons/lu";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import ModalAddLocation from "../../components/ModalManage/ModalAdd/ModalAddLocation.jsx";
import { MdEdit, MdDelete } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import ModalUpdateLocation from "../../components/ModalManage/ModalUpdate/ModalUpdateLocation.jsx";
import ModalDeleteLocation from "../../components/ModalManage/ModalConfirm/ModalDeleteLocation.jsx";
import {toast} from "react-toastify";

export default function ManagementLocation() {
  const [locations, setLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

  const toggleDropdown = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setIsEditModalOpen(true);
    setOpenDropdown(null);
  };

  const handleSuccess = async () => {
    try {
      const data = await getLocations();
      setLocations(Array.isArray(data) ? data : []);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi khi làm mới danh sách vị trí sau khi thêm:", error);
    }
  };

  const confirmDelete = async () => {
    if (!locationToDelete) return;
    try {
      await deleteLocation(locationToDelete.id);
      toast.success("Xóa vị trí thành công");
      setLocations((prev) => prev.filter((loc) => loc.id !== locationToDelete.id));
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.log("Lỗi khi xóa vị trí", error);
    } finally {
      setIsDeleteModalOpen(false);
      setLocationToDelete(null);
    }
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const data = await getLocations();
        setLocations(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu từ API", error);
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
      <div title="Quản lý vị trí">
        <div className="overflow-visible">
          <div className="bg-white p-4 mb-4 rounded-md flex gap-4 items-center">
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
              Thêm vị trí
            </button>
          </div>

          <div className="mt-2 bg-white p-4">
            <table className="w-full border-collapse">
              <thead>
              <tr className="text-SmokyGray text-left">
                <th className="p-2">Tên vị trí</th>
                <th className="p-2">Ảnh</th>
                <th className="text-end p-2" style={{ width: "1%", whiteSpace: "nowrap" }}>
                  Thao tác
                </th>
              </tr>
              </thead>
              <tbody>
              {locations.map((location) => (
                  <tr key={location.id} className="border-t">
                    <td className="p-2">{location.name_location}</td>
                    <td className="p-2">
                      <button
                          onClick={() => setSelectedImage(location.image)}
                          className="text-red-600 hover:text-red-800"
                      >
                        <FaEye />
                      </button>
                    </td>
                    <td className="flex justify-end p-2 relative">
                      <button onClick={() => toggleDropdown(location.id)}>
                        <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
                      </button>

                      {openDropdown === location.id && (
                          <div ref={dropdownRef} className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                            <button
                                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left whitespace-nowrap"
                                onClick={() => handleEditLocation(location)}
                            >
                              <MdEdit className="mr-2 text-gray-700" /> Cập nhật địa điểm
                            </button>
                            <button
                                onClick={() => {
                                  setLocationToDelete(location);
                                  setIsDeleteModalOpen(true);
                                }}
                                className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600 whitespace-nowrap"
                            >
                              <MdDelete className="mr-2" /> Xóa vị trí
                            </button>
                          </div>
                      )}
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {selectedImage !== null && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setSelectedImage(null)}>
                {selectedImage ? (
                    <img src={selectedImage} alt="Location" className="max-w-[50%] max-h-[50%] object-contain" />
                ) : (
                    <div className="text-red text-xl">Không có ảnh</div>
                )}
              </div>
          )}

          {isModalOpen && <ModalAddLocation onClose={toggleModal} onSuccess={handleSuccess} />}
          {isEditModalOpen && (
              <ModalUpdateLocation
                  onClose={() => setIsEditModalOpen(false)}
                  onSuccess={(updatedLocationResponse) => {
                    setLocations((prev) =>
                        prev.map((loc) =>
                            loc.id === updatedLocationResponse.data.id ? updatedLocationResponse.data : loc
                        )
                    );
                    setIsEditModalOpen(false);
                  }}
                  initialData={editingLocation}
              />
          )}
          <ModalDeleteLocation
              open={isDeleteModalOpen}
              onCancel={() => setIsDeleteModalOpen(false)}
              onConfirm={confirmDelete}
              locationName={locationToDelete?.name_location}
          />
        </div>
      </div>
  );
}