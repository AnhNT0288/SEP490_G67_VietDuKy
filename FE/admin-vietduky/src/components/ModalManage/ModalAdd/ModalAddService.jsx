import { useState } from "react";
import { createService } from "../../../services/API/service.service.js"; // Import createService

// eslint-disable-next-line react/prop-types
export default function ModalAddService({ onClose, onSuccess }) {
    const [serviceData, setServiceData] = useState({
        name_service: "",
        description_service: "",
        price_service: "",
    });
    const [errors, setErrors] = useState({
        name_service: false,
    });
    const [loading, setLoading] = useState(false);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setServiceData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        const newErrors = {
            name_service: !serviceData.name_service.trim(),
        };
        setErrors(newErrors);

        // If there's an error, stop the submission
        if (Object.values(newErrors).includes(true)) {
            return;
        }

        setLoading(true);

        try {
            const response = await createService(serviceData);
            if (response) {
                alert("Thêm dịch vụ mới thành công");
                setServiceData({
                    name_service: "",
                    description_service: "",
                    price_service: "",
                });
                onSuccess(response.data); // Passing newly added service data
                onClose(); // Close the modal
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            alert(`Lỗi: ${JSON.stringify(error.response?.data)}`);
            console.error("Lỗi API:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleWrapperClick = () => {
        onClose();
    };

    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleWrapperClick}
        >
            <div className="bg-white rounded-md shadow-lg w-2/5 p-6" onClick={handleModalClick}>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-semibold">Thêm dịch vụ</h2>
                    <h6 className="text-sm mb-4 text-SmokyGray">Quản trị viên thêm dịch vụ cho hệ thống</h6>

                    {/* Service Name */}
                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">Tên dịch vụ</label>
                    <input
                        type="text"
                        name="name_service"
                        className={`w-full p-2 border rounded mb-4 ${errors.name_service ? 'border-red-500' : ''}`}
                        placeholder="Tên dịch vụ"
                        value={serviceData.name_service}
                        onChange={handleChange}
                        required
                    />
                    {errors.name_service && <p className="text-red-500 text-sm">Vui lòng nhập tên dịch vụ</p>}

                    {/* Service Description */}
                    <label className="block mb-2 font-medium ">Mô tả</label>
                    <textarea
                        name="description_service"
                        className={`w-full p-2 border rounded mb-4 h-[80px] ${errors.description_service ? 'border-red-500' : ''}`}
                        placeholder="Mô tả dịch vụ"
                        value={serviceData.description_service}
                        onChange={handleChange}
                    />
                    {errors.description_service && <p className="text-red-500 text-sm">Vui lòng nhập mô tả dịch vụ</p>}

                    {/* Service Price */}
                    <label className="block mb-2 font-medium ">Giá dịch vụ</label>
                    <input
                        type="number"
                        name="price_service"
                        className={`w-full p-2 border rounded mb-4 ${errors.price_service ? 'border-red-500' : ''}`}
                        placeholder="Giá dịch vụ"
                        value={serviceData.price_service}
                        onChange={handleChange}
                    />
                    {errors.price_service && <p className="text-red-500 text-sm">Vui lòng nhập giá dịch vụ hợp lệ</p>}

                    {/* Buttons */}
                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded-md"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-red-700 text-white px-4 py-2 rounded-md"
                            disabled={loading}
                        >
                            {loading ? "Đang tạo..." : "Thêm dịch vụ mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
