import { useState } from "react";
import Modal from "react-modal";
import {approveDiscountService} from "../../../services/API/lastminutedeals.service.js";

// eslint-disable-next-line react/prop-types
export default function ModalApproveDiscount({ isOpen, onClose, discountService }) {
    const [priceDiscount, setPriceDiscount] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false); // ✅ tránh double submit

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) return; // ✅ chặn double submit
        setIsSubmitting(true);

        try {
            await approveDiscountService({
                discount_service_id: discountService.id,
                price_discount: parseInt(priceDiscount),
            });
            alert("Cập nhật thành công!");
            onClose(true); // đóng modal và báo cha reload
        } catch (err) {
            alert("Đã có lỗi xảy ra khi cập nhật!");
            onClose(false);
        } finally {
            setIsSubmitting(false); // ✅ reset trạng thái submit
        }
    };


    return (
        <Modal isOpen={isOpen} onRequestClose={() => onClose(false)} className="bg-white rounded-md p-6 max-w-md mx-auto mt-24 shadow-lg">
            <h2 className="text-lg font-semibold mb-1">Cập nhật lịch khởi hành</h2>
            <p className="text-sm text-gray-500 mb-4">Quản trị viên thêm lịch khởi hành vào Tour</p>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                    <label className="text-sm text-gray-700">Ngày khởi hành</label>
                    <input
                        type="text"
                        value={new Date(discountService?.travelTour?.start_day).toLocaleDateString("vi-VN")}
                        disabled
                        className="w-full border px-3 py-2 rounded-md bg-gray-10"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-700">Ngày về</label>
                    <input
                        type="text"
                        value={new Date(discountService?.travelTour?.end_day).toLocaleDateString("vi-VN")}
                        disabled
                        className="w-full border px-3 py-2 rounded-md bg-gray-10"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-700">Số lượng người</label>
                    <input
                        type="text"
                        value={`${discountService?.travelTour?.current_people}/${discountService?.travelTour?.max_people}`}
                        disabled
                        className="w-full border px-3 py-2 rounded-md bg-gray-10"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-700">Giá gốc</label>
                    <input
                        type="text"
                        value={discountService?.travelTour?.price_tour?.toLocaleString("vi-VN")}
                        disabled
                        className="w-full border px-3 py-2 rounded-md bg-gray-10"
                    />
                </div>
                <div>
                    <label className="text-sm text-gray-700">Giá sau giảm giá</label>
                    <input
                        type="number"
                        placeholder="Nhập giá giảm giá"
                        value={priceDiscount}
                        onChange={(e) => setPriceDiscount(e.target.value)}
                        required
                        className="w-full border px-3 py-2 rounded-md"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-2">
                    <button type="button" onClick={() => onClose(false)} className="border px-4 py-2 rounded-md">
                        Hủy
                    </button>
                    <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded-md">
                        Cập nhật thông tin
                    </button>
                </div>
            </form>
        </Modal>
    );
}
