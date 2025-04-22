import { FcGoogle } from "react-icons/fc";

export default function GoogleAuth() {
  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
  };
  
  return (
    <button
      onClick={handleGoogleLogin}
      className="w-full flex items-center gap-14 bg-white border border-gray-300 text-black py-2 px-4 rounded-md hover:bg-gray-100"
    >
      <FcGoogle className="" size={26} />
      Đăng nhập bằng Google
    </button>
  );
}
