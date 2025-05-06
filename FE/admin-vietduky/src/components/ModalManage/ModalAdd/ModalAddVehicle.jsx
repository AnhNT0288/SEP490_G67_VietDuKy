import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getLocations } from "../../../services/API/location.service.js";
import { createVehicle } from "../../../services/API/vehicle.service.js";
import Select from "react-select";

// eslint-disable-next-line react/prop-types
export default function ModalAddVehicle({ onClose, onAddSuccess }) {
  const [vehicleName, setVehicleName] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        setLocations(Array.isArray(res) ? res : []);
      } catch (error) {
        console.error("❌ Lỗi khi lấy danh sách địa điểm:", error);
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(phoneNumber)) {
      toast.error("Số điện thoại chỉ được chứa số!");
      setLoading(false);
      return;
    }

    try {
      await createVehicle({
        name_vehicle: vehicleName,
        plate_number: plateNumber,
        phone_number: phoneNumber,
        location_id: locationId,
      });

      toast.success("Thêm phương tiện thành công!");
      onAddSuccess && onAddSuccess();
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi tạo phương tiện:", error);
      toast.error("Tạo phương tiện thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
        <div className="bg-white rounded-md shadow-lg w-1/4 p-6" onClick={(e) => e.stopPropagation()}>
          <form onSubmit={handleSubmit}>
            <div className="relative pb-3">
              <h2 className="text-lg font-semibold">Thêm Phương tiện</h2>
              <p className="text-gray-500 mb-4">Quản trị viên thêm Phương tiện mới</p>
              <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            {/* Tên phương tiện */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                Tên Phương tiện
              </label>
              <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Nhập tên phương tiện"
                  value={vehicleName}
                  onChange={(e) => setVehicleName(e.target.value)}
                  required
              />
            </div>

            {/* Biển số */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                Biển số xe
              </label>
              <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Nhập biển số"
                  value={plateNumber}
                  onChange={(e) => setPlateNumber(e.target.value)}
                  required
              />
            </div>

            {/* Số điện thoại */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                Số điện thoại
              </label>
              <input
                  type="text"
                  className="w-full border rounded-md p-2"
                  placeholder="Nhập số điện thoại"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
              />
            </div>

            {/* Chọn địa điểm */}
            <div className="mb-4">
              <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                Chọn địa điểm
              </label>
              <Select
                  options={locations.map((loc) => ({
                    value: loc.id,
                    label: loc.name_location,
                  }))}
                  value={
                      locations
                          .filter((loc) => loc.id === locationId)
                          .map((loc) => ({
                            value: loc.id,
                            label: loc.name_location,
                          }))[0] || null
                  }
                  onChange={(selectedOption) => {
                    setLocationId(selectedOption ? selectedOption.value : "");
                  }}
                  placeholder="Tìm kiếm và chọn địa điểm"
                  isSearchable
                  className="w-full"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-12">
              <button
                  type="button"
                  className="hover:bg-gray-300 hover:text-white border border-solid border-gray-300 px-4 py-2 rounded-md"
                  onClick={onClose}
              >
                Hủy
              </button>
              <button
                  type="submit"
                  className="bg-red-700 text-white px-4 py-2 rounded-md"
                  disabled={loading}
              >
                {loading ? "Đang tạo..." : "Tạo mới"}
              </button>
            </div>
          </form>
        </div>
      </div>
  );
}
