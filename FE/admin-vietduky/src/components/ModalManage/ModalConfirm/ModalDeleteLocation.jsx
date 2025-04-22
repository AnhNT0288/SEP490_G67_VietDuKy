export default function ModalDeleteLocation({ open, onCancel, onConfirm, locationName = "" }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
                <h2 className="text-xl font-semibold mb-3">Bạn có hoàn toàn chắc chắn không?</h2>
                <p className="text-gray-700 mb-6">
                    Không thể hoàn tác hành động này. Điều này sẽ xóa vĩnh viễn vị trí{" "}
                    <span className="text-red-600 font-bold">{locationName}</span> khỏi hệ thống.
                </p>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 border rounded-md hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}