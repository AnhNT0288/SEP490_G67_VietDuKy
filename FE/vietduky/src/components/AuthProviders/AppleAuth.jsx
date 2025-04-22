import React from "react";
import { FaApple } from "react-icons/fa";

const AppleAuth = () => {
  return (
    <button className="w-full flex items-center gap-14 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-900">
      <FaApple className="text-white" size={26} />
      Đăng nhập bằng Apple
    </button>
  );
};

export default AppleAuth;
