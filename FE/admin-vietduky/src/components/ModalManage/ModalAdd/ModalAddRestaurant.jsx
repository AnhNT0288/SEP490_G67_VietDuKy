import { useState, useEffect } from "react";
import { createRestaurant } from "../../../services/API/restaurant.service.js";
import { getLocations } from "../../../services/API/location.service.js";
import { toast } from "react-toastify";
import Select from "react-select";

export default function ModalAddRestaurant({ onClose, onAddSuccess }) {
  const [restaurantName, setRestaurantName] = useState("");
  const [locationRestaurant, setLocationRestaurant] = useState("");
  const [hotline, setHotline] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        if (Array.isArray(res)) {
          setLocations(res);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách location:", error);
        setLocations([]);
      }
    };
    fetchLocations();
  }, []);

  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate số điện thoại
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(hotline)) {
      toast.error("Số điện thoại chỉ được chứa số!");
      return;
    }

    if (!locationId) {
      toast.error("Vui lòng chọn địa điểm cho nhà hàng!");
      return;
    }

    setLoading(true);

    try {
      const newRestaurant = {
        name_restaurant: restaurantName,
        address_restaurant: locationRestaurant,
        phone_number: hotline,
        location_id: locationId,
      };

      await createRestaurant(newRestaurant);

      toast.success("Tạo nhà hàng thành công!");
      if (onAddSuccess) {
        onAddSuccess();
      }
      onClose();
    } catch (error) {
      console.error("❌ Lỗi khi tạo nhà hàng:", error);
      toast.error("Lỗi khi tạo nhà hàng!");
    } finally {
      setLoading(false);
    }
  };

  return (
      <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleWrapperClick}
      >
        <div
            className="bg-white rounded-md shadow-lg w-1/4 p-6"
            onClick={handleModalClick}
        >
          <form onSubmit={handleSubmit}>
            <div className="relative pb-3">
              <div>
                <h2 className="text-lg font-semibold">Thêm Nhà hàng</h2>
                <p className="text-gray-500 mb-4">
                  Quản trị viên thêm Nhà hàng mới
                </p>
              </div>

              <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                &times;
              </button>
            </div>

            <div>
              {/* Tên nhà hàng */}
              <div className="mb-4">
                <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                  Tên Nhà hàng
                </label>
                <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Nhập tên nhà hàng"
                    value={restaurantName}
                    onChange={(e) => setRestaurantName(e.target.value)}
                    required
                />
              </div>

              {/* Địa chỉ */}
              <div className="mb-4">
                <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                  Địa chỉ
                </label>
                <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Nhập địa chỉ của nhà hàng"
                    value={locationRestaurant}
                    onChange={(e) => setLocationRestaurant(e.target.value)}
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
                    placeholder="Nhập số điện thoại của nhà hàng"
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    required
                />
              </div>

              {/* Chọn Location */}
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
                    className="w-full mb-2"
                    placeholder="Tìm kiếm và chọn địa điểm"
                    isSearchable
                />
              </div>
            </div>

            {/* Button Actions */}
            <div className="flex justify-end gap-4 mt-12">
              <button
                  type="button"
                  className="hover:bg-gray-300 hover:text-white border border-solid border-gray-300 px-4 py-2 rounded-md"
                  onClick={onClose}
                  disabled={loading}
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
