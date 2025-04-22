import AuthProviders from "../AuthProviders/AuthProviders";
import { useState } from "react";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className=" w-[400px]">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Đăng ký tài khoản
      </h2>
      <p className="text-gray-500 text-center mb-6">
        Đăng nhập bằng tài khoản Google của bạn
      </p>

      {/* Google Sign-In */}
      <AuthProviders />

      <div className="text-center my-4 text-gray-400">Hoặc bằng</div>

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Nhập địa chỉ Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">
          Xác nhận mật khẩu
        </label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      {/* Password Requirements */}
      <div className="text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" checked disabled /> Phải có ít
          nhất 8 ký tự
        </div>
        <div className="flex items-center">
          <input type="checkbox" className="mr-2" checked disabled /> Phải chứa
          một ký tự đặc biệt
        </div>
      </div>

      {/* Register Button */}
      <button className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition">
        Đăng ký
      </button>

      {/* Already Have Account */}
      <p className="text-center text-gray-600 mt-4">
        Đã có tài khoản?{" "}
        <a href="/login" className="text-red-500 hover:underline">
          Đăng nhập
        </a>
      </p>
    </div>
  );
}
