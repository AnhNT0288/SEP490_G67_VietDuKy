import { useEffect, useState } from "react";
import { updateService, getServiceById } from "../../../services/API/service.service.js";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalUpdateService({ serviceId, onClose, onSuccess }) {
    const [serviceData, setServiceData] = useState({
        name_service: "",
        description_service: "",
        price_service: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchService = async () => {
            try {
                const response = await getServiceById(serviceId);
                if (response) {
                    setServiceData({
                        name_service: response.name_service,
                        description_service: response.description_service,
                        price_service: response.price_service,
                    });
                }
            } catch (error) {
                console.error("Lỗi khi lấy dịch vụ:", error);
                toast.success("Không thể tải dữ liệu dịch vụ.");
                onClose();
            }
        };

        if (serviceId) {
            fetchService();
        }
    }, [serviceId, onClose]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await updateService(serviceId, serviceData);
            toast.error("Cập nhật dịch vụ thành công!");
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            toast.success("Cập nhật thất bại, vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-md shadow-lg p-6 w-2/5" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Cập nhật dịch vụ</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Tên dịch vụ */}
                    <div>
                        <label className="block mb-1 font-medium">Tên dịch vụ</label>
                        <input
                            type="text"
                            name="name_service"
                            value={serviceData.name_service}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border rounded"
                            placeholder="Tên dịch vụ"
                        />
                    </div>

                    {/* Mô tả dịch vụ */}
                    <div>
                        <label className="block mb-1 font-medium">Mô tả</label>
                        <textarea
                            name="description_service"
                            value={serviceData.description_service}
                            onChange={handleChange}
                            className="w-full p-2 border rounded h-[80px]"
                            placeholder="Mô tả dịch vụ"
                        />
                    </div>

                    {/* Giá dịch vụ */}
                    <div>
                        <label className="block mb-1 font-medium">Giá</label>
                        <input
                            type="number"
                            name="price_service"
                            value={serviceData.price_service}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Giá dịch vụ"
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded-md">
                            Hủy
                        </button>
                        <button type="submit" disabled={loading} className="bg-red-700 text-white px-4 py-2 rounded-md">
                            {loading ? "Đang cập nhật..." : "Cập nhật"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
