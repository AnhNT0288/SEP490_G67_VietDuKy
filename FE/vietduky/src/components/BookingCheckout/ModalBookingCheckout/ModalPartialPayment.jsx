import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const ModalPartialPayment = ({ isOpen, onClose, paidAmount, remaining }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="fixed inset-0 flex items-center justify-center z-50"
      overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-40"
    >
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl text-center">
        <h2 className="text-2xl font-bold text-[#a80f21] mb-4">
          Thanh toán chưa đủ
        </h2>
        <p className="text-base mb-2">
          Bạn đã thanh toán:{" "}
          <strong className="text-green-600">
            {paidAmount.toLocaleString()} VNĐ
          </strong>
        </p>
        <p className="text-base mb-6">
          Còn thiếu:{" "}
          <strong className="text-red-600">
            {remaining?.toLocaleString()} VNĐ
          </strong>
        </p>
        <button
          onClick={onClose}
          className="bg-[#a80f21] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#c2172c] transition"
        >
          Đóng
        </button>
      </div>
    </Modal>
  );
};

export default ModalPartialPayment;