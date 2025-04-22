import { login } from "../../services/API/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { emailRegex } from "../../utils/emailUtil";
import { encrypt, decrypt } from "../../utils/authUtil";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function LoginForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    const newErrors = { email: "", password: "" };

    if (!username) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!emailRegex.test(username)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }

    if (newErrors.email || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await login(username, password);
      if (response.status === 200) {
        toast.success("Đăng nhập thành công!");
        if (rememberMe) {
          localStorage.setItem("saved_email", username);
          localStorage.setItem("saved_password", encrypt(password));
          localStorage.setItem("access_token", response.data.access_token);
        } else {
          localStorage.removeItem("saved_email");
          localStorage.removeItem("saved_password");
          localStorage.removeItem("access_token");
        }
        // Lưu thông tin người dùng vào localStorage hoặc sessionStorage nếu cần
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
        setErrors({
          ...newErrors,
          password: "Tài khoản hoặc mật khẩu không đúng!",
        });
      }
    } catch (error) {
      setErrors({
        ...newErrors,
        password:
          error.response?.data?.message ||
          "Đăng nhập thất bại. Vui lòng thử lại.",
      });
    }
  };

  useEffect(() => {
    const savedEmail = localStorage.getItem("saved_email");
    const savedPasswordEncrypted = localStorage.getItem("saved_password");

    if (savedEmail && savedPasswordEncrypted) {
      setUsername(savedEmail);
      setPassword(decrypt(savedPasswordEncrypted));
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="">
      <h2 className="text-2xl font-semibold text-center mb-4">
        Chào mừng trở lại
      </h2>
      <p className="text-gray-500 text-center mb-6">
        Đăng nhập bằng tài khoản đã cấp
      </p>

      {/* <div className="text-center my-4 text-gray-400">Hoặc bằng</div> */}

      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Email</label>
        <input
          type="email"
          placeholder="Nhập địa chỉ Email"
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
            errors.email
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-red-500"
          }`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập một mật khẩu"
            className={`w-full px-4 py-2 border rounded-lg pr-10 focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-red-500"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Icon hiện/ẩn mật khẩu */}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Remember Me & Forgot Password */}
      <div className="flex justify-between text-sm text-gray-600 mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            className="mr-2"
            checked={rememberMe}
            onChange={() => setRememberMe(!rememberMe)}
          />{" "}
          Nhớ mật khẩu
        </label>
        <a href="/forgot-password" className="text-red-500 hover:underline">
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
      {/* <p className="text-center text-gray-600 mt-4">
        Chưa có tài khoản?{" "}
        <a href="register" className="text-red-500 hover:underline">
          Đăng ký ngay
        </a>
      </p> */}
    </div>
  );
}
