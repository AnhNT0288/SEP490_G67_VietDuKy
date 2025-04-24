import React from "react";
import Modal from "react-modal";

const ModalQRPayment = ({
  isOpen,
  countdown,
  qrSrc,
  booking,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="QR Code Thanh Toán"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 z-10"
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <div className="bg-white p-6 rounded-md shadow-lg text-center z-40 w-[90%] max-w-4xl">
        <div className="flex flex-col">
          <div className="text-left flex items-center justify-between mb-4">
            <div className="flex-1">
              <p className="text-zinc-900 font-bold">Thanh toán chuyến đi</p>
              <p className="text-zinc-500 text-xs">
                Khách hàng xem thông tin đơn hàng và quét mã QR
              </p>
            </div>
            <p className="text-zinc-500 text-xs font-semibold">
              Giao dịch hết hạn sau:
              <span className="ml-2 bg-black rounded-lg py-2 px-1 text-white font-semibold inline-block w-[80px] text-center font-mono">
                {Math.floor(countdown / 60).toString().padStart(2, "0")}:
                {(countdown % 60).toString().padStart(2, "0")}
              </span>
            </p>
          </div>
          <div className="flex mt-4 gap-6">
            <div className="w-2/5 bg-gray-50 rounded p-4 shadow-md">
              <div className="flex flex-col text-left mt-4 gap-6">
                <p className="text-zinc-800 text-lg font-semibold">Thông tin đơn hàng</p>
                <div className="flex flex-col gap-2">
                  <p className="text-zinc-500 text-sm font-semibold">Số tiền thanh toán</p>
                  <p className="text-red-800 text-lg font-semibold">
                    {booking?.data?.total_cost.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-semibold">Giá trị đơn hàng</p>
                  <p className="text-zinc-900 text-lg font-semibold">
                    {booking?.data?.total_cost.toLocaleString("vi-VN")} VND
                  </p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-semibold">Phí giao dịch</p>
                  <p className="text-zinc-900 text-lg font-semibold">0 VND</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-semibold">Mã đơn hàng</p>
                  <p className="text-zinc-900 text-lg font-semibold">xxxxx</p>
                </div>
                <div>
                  <p className="text-zinc-500 text-sm font-semibold">Nhà cung cấp</p>
                  <p className="text-zinc-900 font-semibold">VietDuKy</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between mt-4 mb-2 w-3/5">
              <img src={qrSrc} alt="QR Code" className="rounded-lg mx-auto" />
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-500 rounded-md hover:bg-gray-400"
              >
                Hủy thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalQRPayment;
