import Icons from "../Icons/Icon";
import { useNavigate, useLocation } from "react-router-dom";

const BookingHeader = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate
  const location = useLocation(); // Khởi tạo useLocation

  const handleGoBack = () => {
    navigate(-1); // Quay lại trang trước đó
  };

  // Xác định bước hiện tại dựa trên đường dẫn
  const getCurrentStep = () => {
    if (location.pathname.includes("bookingConfirm")) {
      return 2; // Bước 2: Thanh toán
    } else if (location.pathname.includes("bookingComplete")) {
      return 3; // Bước 3: Hoàn tất
    }
    return 1; // Mặc định là Bước 1: Nhập thông tin
  };

  const currentStep = getCurrentStep();

  return (
    <div className="w-full flex flex-col items-center bg-white ">
      {/* Header Title */}
      <div className="relative w-[90rem] h-[65px] gap-[1.5rem] flex items-center justify-between">
        {/* Nút Quay lại */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleGoBack}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M5.47 12.53C5.33 12.39 5.25 12.2 5.25 12s.08-.39.22-.53l4-4a1.002 1.002 0 011.41 1.41L7.81 11.25H18a1 1 0 110 2H7.81l3.62 3.62a1 1 0 11-1.41 1.41l-4-4z"
              fill="black"
            />
          </svg>
          <span className="text-neutral-900 text-base font-normal font-['Be Vietnam Pro']">
            Quay lại
          </span>
        </div>

        {/* Tiêu đề Đặt tour */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-[20.5px] text-[#a80f21] text-4xl font-bold font-['Be Vietnam Pro']">
          Đặt tour
        </div>
      </div>

      {/* Progress Steps */}
      <div className="w-[58.125rem] h-[117px] p-[0.875rem] flex justify-between items-center mt-4">
        {/* Bước 1: Nhập thông tin */}
        <div className="flex flex-col items-center gap-[15px]">
          <div className={`w-12 h-12 rounded-full ${currentStep >= 1 ? 'bg-[#a80f21]' : '#b1b1b1'} flex items-center justify-center text-white font-bold`}>
            <img src={Icons.IconBooking1} className="w-8 h-8" />
          </div>
          <div className={`text-${currentStep >= 1 ? 'a80f21' : 'b1b1b1'} text-base font-bold font-['Be Vietnam Pro']`}>
            Nhập thông tin
          </div>
        </div>

        {/* Icon tiến trình */}
        {currentStep >=2 ? (
          <img src={Icons.StepBlack} alt="" />
        ):(
          <img src={Icons.StepGray} alt="" />
        )}

        {/* Bước 2: Thanh toán */}
        <div className="flex flex-col items-center gap-[15px]">
          <div className={`w-12 h-12 rounded-full ${currentStep >= 2 ? 'bg-[#a80f21]' : 'bg-[#b1b1b1]'} flex items-center justify-center text-white font-bold`}>
            <img src={Icons.IconBooking2} className="w-8 h-8" />
          </div>
          <div className={`text-${currentStep >= 2 ? 'a80f21' : 'b1b1b1'} text-base font-bold font-['Be Vietnam Pro']`}>
            Thanh toán
          </div>
        </div>

        {/* Icon tiến trình */}
        {currentStep >=3 ? (
          <img src={Icons.StepBlack} alt="" />
        ):(
          <img src={Icons.StepGray} alt="" />
        )}

        {/* Bước 3: Hoàn tất */}
        <div className="flex flex-col items-center gap-[15px]">
          <div className={`w-12 h-12 rounded-full ${currentStep === 3 ? 'bg-[#a80f21]' : 'bg-[#b1b1b1]'} flex items-center justify-center text-white font-bold`}>
            <img src={Icons.IconBooking3} className="w-8 h-8" />
          </div>
          <div className={`text-${currentStep === 3 ? 'a80f21' : 'b1b1b1'} text-base font-bold font-['Be Vietnam Pro']`}>
            Hoàn tất
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;