import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {getLocations} from "../../../services/API/location.service.js";
import {createHotel} from "../../../services/API/hotel.service.js";
import Select from "react-select";

// eslint-disable-next-line react/prop-types
export default function ModalAddHotel({ onClose, onAddSuccess }) {
  const [hotelName, setHotelName] = useState("");
  const [locationHotel, setLocationHotel] = useState("");
  const [hotline, setHotline] = useState("");
  const [locationId, setLocationId] = useState("");
  const [locations, setLocations] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await getLocations();
        console.log("💬 Kết quả getLocations trả ra:", res);

        if (Array.isArray(res)) {
          setLocations(res); // ✅ res chính là mảng locations
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
    setLoading(true);

    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(hotline)) {
      toast.error("Số điện thoại chỉ được chứa số!");
      setLoading(false);
      return;
    }

    try {
      await createHotel({
        name_hotel: hotelName,
        address_hotel: locationHotel,
        phone_number: hotline,
        location_id: locationId,
      });

      toast.success("Thêm khách sạn thành công!");
      onClose();
      onAddSuccess && onAddSuccess();
    } catch (error) {
      console.error("❌ Lỗi khi tạo khách sạn:", error);
      toast.error("Tạo khách sạn thất bại!");
    } finally {
      setLoading(false);
    }
  };


  // Filter location theo search input
  const filteredLocations = locations.filter((location) =>
      (location?.name_location || "").toLowerCase().includes(searchLocation.toLowerCase())
  );

  return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleWrapperClick}>
        <div className="bg-white rounded-md shadow-lg w-1/4 p-6" onClick={handleModalClick}>
          <form onSubmit={handleSubmit}>
            <div className="relative pb-3">
              <div>
                <h2 className="text-lg font-semibold">Thêm Khách sạn</h2>
                <p className="text-gray-500 mb-4">
                  Quản trị viên thêm Khách sạn mới
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
              {/* Tên khách sạn */}
              <div className="mb-4">
                <label className="block font-medium mb-1 before:content-['*'] before:text-red-500 before:mr-1">
                  Tên khách sạn
                </label>
                <input
                    type="text"
                    className="w-full border rounded-md p-2"
                    placeholder="Nhập tên khách sạn"
                    value={hotelName}
                    onChange={(e) => setHotelName(e.target.value)}
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
                    placeholder="Nhập địa chỉ khách sạn"
                    value={locationHotel}
                    onChange={(e) => setLocationHotel(e.target.value)}
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
                    value={hotline}
                    onChange={(e) => setHotline(e.target.value)}
                    required
                />
              </div>
                {/* Select danh sách location */}
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
                      className="w-full mb-2 p-2"
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
