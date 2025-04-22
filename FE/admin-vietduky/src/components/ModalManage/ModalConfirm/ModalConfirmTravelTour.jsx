// eslint-disable-next-line react/prop-types
export default function ModalConfirmTravelTour({ open, onCancel, onConfirm }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl p-7 w-full max-w-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-2 text-gray-900">Bạn có muốn tạo lịch khởi hành</h2>
                <p className="text-gray-500 text-md mb-6">
                    Bạn có muốn tạo luôn lịch khởi hành cho Tour vừa tạo?
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-md"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white border-gray-500 rounded-md hover:bg-red-700 text-md"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
