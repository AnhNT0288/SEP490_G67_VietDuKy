import React from "react";

const LayoutModal = ({ isOpen, handleClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-5 w-11/12 max-w-2xl shadow-lg">
        <div className="flex justify-between items-center pb-3 mb-3">
          <h2 className="text-sm text-black font-bold">Điều khoản & điều kiện</h2>
          <button onClick={handleClose} className="text-red-500 float-right">
            Đóng
          </button>
        </div>
        <div className="mt-3">{children}</div>
      </div>
    </div>
  );
};

export default LayoutModal;
