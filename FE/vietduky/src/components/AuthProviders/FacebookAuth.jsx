import React from "react";
import { FaFacebook } from "react-icons/fa";

const handleFacebookLogin = () => {
  window.location.href = "http://localhost:3000/api/auth/facebook";
};

const FacebookAuth = () => {
  return (
    <button
      onClick={handleFacebookLogin}
      className="w-full flex items-center gap-14 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
    >
      <FaFacebook className="text-white" size={24} />
      Đăng nhập bằng Facebook
    </button>
  );
};

export default FacebookAuth;
