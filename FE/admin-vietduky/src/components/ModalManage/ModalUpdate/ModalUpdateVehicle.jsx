import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Select from "react-select";
import { getLocations } from "../../../services/API/location.service";
import { updateVehicle, getVehicleById } from "../../../services/API/vehicle.service";

// eslint-disable-next-line react/prop-types
export default function ModalUpdateVehicle({ onClose, vehicleId, onUpdateSuccess }) {
    const [vehicleName, setVehicleName] = useState("");
    const [plateNumber, setPlateNumber] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [locationId, setLocationId] = useState("");
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchVehicleDetail = async () => {
            try {
                const data = await getVehicleById(vehicleId);
                setVehicleName(data.name_vehicle);
                setPlateNumber(data.plate_number);
                setPhoneNumber(data.phone_number);
                setLocationId(data.location_id);
            } catch (error) {
                toast.error("Không thể tải thông tin phương tiện");
                onClose();
            }
        };

        const fetchLocations = async () => {
            try {
                const data = await getLocations();
                setLocations(Array.isArray(data) ? data : []);
            } catch (error) {
                setLocations([]);
                toast.error("Không thể tải danh sách địa điểm");
            }
        };

        fetchVehicleDetail();
        fetchLocations();
    }, [vehicleId, onClose]);

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
            await updateVehicle(vehicleId, {
                name_vehicle: vehicleName,
                plate_number: plateNumber,
                phone_number: phoneNumber,
                location_id: locationId,
            });

            toast.success("Cập nhật phương tiện thành công!");
            onUpdateSuccess && onUpdateSuccess();
            onClose();
        } catch (error) {
            console.error("❌ Lỗi khi cập nhật:", error);
            toast.error("Cập nhật phương tiện thất bại!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-md shadow-lg w-1/4 p-6" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="relative pb-3">
                        <h2 className="text-lg font-semibold">Cập nhật Phương tiện</h2>
                        <p className="text-gray-500 mb-4">Chỉnh sửa thông tin phương tiện</p>
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
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                    </div>

                    {/* Địa điểm */}
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
                            placeholder="Tìm và chọn địa điểm"
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
                            {loading ? "Đang cập nhật..." : "Lưu thay đổi"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
