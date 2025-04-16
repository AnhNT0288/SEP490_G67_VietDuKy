export default function ModalViewToursOfTopic({ tours = [], onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
            <div className="bg-white w-2/3 max-h-[80%] rounded p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-lg font-semibold mb-4">Danh sách Tour thuộc Chủ đề</h2>

                {tours.length === 0 ? (
                    <p className="text-gray-500">Chưa có tour nào.</p>
                ) : (
                    <ul className="space-y-3">
                        {tours.map((tour) => (
                            <li key={tour.id} className="border p-3 rounded shadow-sm">
                                <div className="font-medium">{tour.name_tour}</div>
                                <div className="text-sm text-gray-600">
                                    Số ngày: {tour.day_number} • Giá: {Number(tour.price_tour).toLocaleString()}₫
                                </div>
                                <div className="text-xs text-gray-500">
                                    Bắt đầu: {tour.startLocation?.name_location} → Kết thúc: {tour.endLocation?.name_location}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}

                <div className="flex justify-end mt-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-red-600 text-red-600 rounded"
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
