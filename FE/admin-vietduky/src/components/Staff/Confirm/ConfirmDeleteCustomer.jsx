const ConfirmDeleteCustomer = ({ onDelete, open, onClose, customer }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg  max-w-lg">
        <h2 className="text-xl font-bold mb-2">
          Bạn có hoàn toàn chắc chắn không?
        </h2>
        <p>
          Không thể hoàn tác hành động này. Sau khi thao tác Khách hàng{" "}
          <span className="font-bold text-[#D32F44]">{customer.name}</span> sẽ
          vĩnh viên bị xóa và không thể khôi phục.
        </p>
        <div className="flex justify-end mt-4">
          <button
            className="bg-[#D32F44] text-white px-4 py-2 rounded-md mr-2"
            onClick={() => onDelete()}
          >
            Xác nhận
          </button>
          <button
            className="border border-gray-400 text-black px-4 py-2 rounded-md"
            onClick={onClose}
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteCustomer;
