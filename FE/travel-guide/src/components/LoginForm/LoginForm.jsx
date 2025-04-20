import { login } from "../../services/API/auth.service";
import AuthProviders from "../AuthProviders/AuthProviders";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      if (!username || !password) {
        alert("Vui lòng nhập đủ thông tin");
        return;
      }
      const response = await login(username, password);
      if (response.status === 200) {
        localStorage.setItem("access_token", response.data.access_token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            email: response.data.email,
            role_name: response.data.role_name,
            avatar: response.data.avatar,
            name: response.data.name,
          })
        );
        navigate("/dashboard");
      } else {
        alert("Đăng nhập thất bại: " + response.data.message);
      }
    } catch (error) {
      alert(
        "Đăng nhập thất bại: " +
          (error.response ? error.response.data.message : error.message)
      );
    }
  };

  return (
    <div className="  w-[400px]">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Chào mừng trở lại
      </h2>
      {/* <p className="text-gray-500 text-center mb-6">
        Đăng nhập bằng tài khoản Google của bạn
      </p>

      <AuthProviders /> */}

      {/* <div className="text-center my-4 text-gray-400">Hoặc bằng</div> */}

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Nhập địa chỉ Email"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập một mật khẩu"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <label className="flex items-center">
          <input type="checkbox" className="mr-2" /> Nhớ mật khẩu
        </label>
        <a href="#" className="text-red-500 hover:underline">
          Quên mật khẩu?
        </a>
      </div>

      {/* Login Button */}
      <button
        onClick={handleLogin}
        className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
      >
        Đăng nhập
      </button>

      {/* Register Link */}
      <p className="text-center text-gray-600 mt-4">
        Chưa có tài khoản?{" "}
        <a href="register" className="text-red-500 hover:underline">
          Đăng ký ngay
        </a>
      </p>
    </div>
  );
}
