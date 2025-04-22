import { useState } from "react";
import Icons from "../Icons/Icon";
import { toast } from "react-toastify";

const PromotionCard = ({ discount_percentage, voucher_code, image }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(voucher_code)
      .then(() => toast.success("Copy to clipboard!"))
      .catch(() => toast.error("Có lỗi xảy ra khi sao chép."));
  };

  return (
    <div
      className="relative w-[430px] h-[230px] perspective-1000 cursor-pointer flex-none"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${isFlipped ? "" : "rotate-y-180"
          }`}
      >
        {/* Mặt trước */}
        <div className="absolute w-full h-full bg-white rounded-lg shadow-lg backface-hidden flex flex-col">
          <div className="flex items-start mt-3 mx-2 mb-8 pt-4 px-4">
            {/* Badge % */}
            <div className="relative w-16 h-16">
              <img
                src={Icons.ImageVoucher}
                className="w-full h-full"
                alt="Voucher"
              />

              {/* Text trên hình */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-red-700 font-bold leading-none">
                <div
                  id="logo-saleup"
                  className="flex items-center justify-center"
                >
                  <div
                    id="text-saleup"
                    className="flex flex-col items-center text-red-800 font-bold leading-none"
                  >
                    <span className="absolute text-[8px]">Upto</span>
                    <span className="text-xl">{discount_percentage}</span>
                  </div>
                  <div
                    id="text-saleup"
                    className="flex flex-col items-center text-red-800 font-bold leading-none"
                  >
                    <span className="text-xs">%</span>
                    <span className="text-[8px]">off</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung khuyến mãi */}
            <div className="flex-1 ml-4">
              <h3 className="text-lg font-semibold"></h3>
              <p className="text-gray-500 text-sm"></p>
            </div>

            {/* Icon thông tin */}
            <div className="cursor-pointer">
              <img src={Icons.Info} className="w-5 h-5" />
            </div>
          </div>

          <div className="relative flex items-center justify-between h-5 bg-white">
            <div className="absolute left-[-8px] w-4 h-4 bg-[#ffe4e6] rounded-full" />
            <div className="flex-1 border-t border-dashed border-neutral-300" />
            <div className="absolute right-[-8px] w-4 h-4 bg-[#ffe4e6] rounded-full" />
          </div>

          {/* Mã khuyến mãi */}
          <div className="flex items-center p-3">
            <div className="flex items-center bg-[#f9fafb] rounded px-3 py-1 text-sm font-semibold text-[#71717a] w-full">
              <img src={Icons.Copy} onClick={handleCopy} className="w-5 h-5 mr-3 cursor-pointer" />
              <input type="text" value={voucher_code} readOnly className="flex-1 bg-transparent outline-none py-1" />
            </div>
            <button onClick={handleCopy} className="ml-2 px-5 py-2 bg-[#ffe4e6] text-[#991b1b] font-bold rounded-3xl text-sm">
              Copy
            </button>
          </div>
        </div>

        {/* Mặt sau */}
        <div className="absolute w-full h-full bg-[#ffe4e6] rounded-lg rotate-y-180 backface-hidden">
          <img src="https://pos.nvncdn.com/d75ecc-146199/art/artCT/20230807_oG6YHK3q.jpeg" alt="Cover" className="w-full h-full rounded-xl object-cover" />
        </div>
      </div>
    </div>
  );
};

export default PromotionCard;
