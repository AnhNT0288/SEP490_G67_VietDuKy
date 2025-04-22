import { useState } from "react";
import TextEditor from "../../../lib/TextEditor.jsx";
import { createVoucher } from "../../../services/API/vocher.service.js";
import DatePicker from "react-datepicker";

export default function ModalAddVocher({ onClose }) {
    const [voucherData, setVoucherData] = useState({
        voucher_code: "",
        discount_percentage: "",
        discount_amount: "",
        quantity: "",
        start_date: "",
        end_date: "",
        image: null,
        description: "",
        status: "1",
    });

    const [isActive, setIsActive] = useState(true);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setVoucherData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setVoucherData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            Object.entries(voucherData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await createVoucher(formData);
            alert("Tạo voucher thành công!");
            onClose?.();
        } catch (err) {
            alert("Tạo voucher thất bại!");
            console.error("Lỗi:", err.response?.data || err.message);
        }
    };

    const handleWrapperClick = () => onClose();
    const handleModalClick = (event) => event.stopPropagation();

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleWrapperClick}>
            <div className="bg-white rounded-md shadow-lg w-3/5 p-6" onClick={handleModalClick}>
                <form onSubmit={handleSubmit}>
                    <h2 className="text-xl font-semibold mb-4">Thêm mã giảm giá</h2>

                    <div className="flex gap-6">
                        {/* Cột trái */}
                        <div className="w-2/5 space-y-4">
                            <div>
                                <label className="block mb-2 font-medium">
                                    <span className="text-red-500">*</span> Mã giảm giá
                                </label>
                                <input
                                    type="text"
                                    name="voucher_code"
                                    value={voucherData.voucher_code}
                                    onChange={handleChange}
                                    placeholder="Mã giảm giá"
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>

                            <div className="flex gap-2 items-center">
                                <div className="w-1/2">
                                    <label className="block mb-2 font-medium">
                                        <span className="text-red-500">*</span> Ngày bắt đầu
                                    </label>
                                    <DatePicker
                                        selected={voucherData.start_date ? new Date(voucherData.start_date) : null}
                                        onChange={(date) =>
                                            setVoucherData((prev) => ({
                                                ...prev,
                                                start_date: date.toISOString(),
                                            }))
                                        }
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Chọn ngày bắt đầu"
                                        className="w-full p-2 border rounded"
                                     showMonthYearDropdown/>
                                </div>
                                <div className="w-1/2">
                                    <label className="block mb-2 font-medium">
                                        <span className="text-red-500">*</span> Ngày kết thúc
                                    </label>
                                    <DatePicker
                                        selected={voucherData.end_date ? new Date(voucherData.end_date) : null}
                                        onChange={(date) =>
                                            setVoucherData((prev) => ({
                                                ...prev,
                                                end_date: date.toISOString(),
                                            }))
                                        }
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Chọn ngày kết thúc"
                                        className="w-full p-2 border rounded"
                                     showMonthYearDropdown/>
                                </div>
                            </div>

                            <div>
                                <label className="block font-medium mb-1"><span className="text-red-500">*</span> Giảm theo %</label>
                                <input
                                    type="number"
                                    name="discount_percentage"
                                    value={voucherData.discount_percentage}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="10"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Giảm theo số tiền</label>
                                <input
                                    type="number"
                                    name="discount_amount"
                                    value={voucherData.discount_amount}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="100000"
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1"><span className="text-red-500">*</span> Số lượng</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={voucherData.quantity}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                    placeholder="999"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-medium mb-1">Ảnh minh họa</label>
                                <input
                                    type="file"
                                    name="image"
                                    accept=".jpg,.png,.jpeg"
                                    onChange={handleFileChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>

                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-gray-700">Kích hoạt</span>
                                <button
                                    type="button"
                                    className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                                        isActive ? "bg-red-500" : "bg-gray-300"
                                    }`}
                                    onClick={() => {
                                        setIsActive(!isActive);
                                        setVoucherData((prev) => ({
                                            ...prev,
                                            status: isActive ? "0" : "1",
                                        }));
                                    }}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                                            isActive ? "translate-x-5" : ""
                                        }`}
                                    ></div>
                                </button>
                            </div>
                        </div>

                        {/* Cột phải */}
                        <div className="w-3/5">
                            <label className="block font-medium mb-2">Chính sách và điều khoản</label>
                            <TextEditor
                                value={voucherData.description}
                                onChange={(content) => setVoucherData((prev) => ({ ...prev, description: content }))}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 gap-3">
                        <button type="button" className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded">
                            Tạo voucher
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
