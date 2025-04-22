import { useState } from "react";
import { emailRegex } from "../../utils/emailUtil";
import { forgotPassword } from "../../services/API/auth.service";
import { toast } from "react-toastify";
import Icons from "../Icons/Icon";

export default function ForgotPassword({ onNext }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Vui lòng nhập email");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Email không hợp lệ");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await forgotPassword(email);
      if (res.status === 200) {
        toast.success("Đã gửi mã đặt lại mật khẩu về email!");
        onNext(email);
      }
    } catch (error) {
      const message =
        error.response?.data?.message || "Đã xảy ra lỗi, vui lòng thử lại!";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Hướng dẫn các bước */}
      <div className="w-1/2 bg-[#B60000] text-white p-10 rounded-r-3xl">
        <img src={Icons.Plane} className="absolute right-0 top-10" />

        <div className="text-2xl font-bold mb-10 flex items-center gap-2">
            <img src={Icons.Logo}/>
            <img src={Icons.VietDuKy}/>
        </div>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <span className="bg-white text-[#B60000] rounded-full w-7 h-7 flex items-center justify-center font-bold">
              1
            </span>
            <div>
              <p className="font-semibold">Điền địa chỉ Email</p>
              <p className="text-sm text-white/80">
                Hãy điền Email bạn đã dùng để nhận mã
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="bg-white text-[#B60000] rounded-full w-7 h-7 flex items-center justify-center font-bold">
              2
            </span>
            <div>
              <p className="font-semibold">Nhập OTP</p>
              <p className="text-sm text-white/80">
                Bạn hãy kiểm tra mã từ địa chỉ Email
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="bg-white text-[#B60000] rounded-full w-7 h-7 flex items-center justify-center font-bold">
              3
            </span>
            <div>
              <p className="font-semibold">Đổi mật khẩu</p>
              <p className="text-sm text-white/80">Hãy nhập mật khẩu mới</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <span className="bg-white text-[#B60000] rounded-full w-7 h-7 flex items-center justify-center font-bold">
              4
            </span>
            <div>
              <p className="font-semibold">Đổi thành công</p>
              <p className="text-sm text-white/80">
                Tiếp tục đăng nhập bằng mật khẩu mới
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Form bên phải */}
      <div className="w-1/2 flex items-center justify-center px-10">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-4">
            <span className="bg-gray-100 p-3 rounded-full">🔑</span>
          </div>
          <h2 className="text-center text-xl font-semibold mb-2">
            Quên mật khẩu
          </h2>
          <p className="text-center text-gray-500 mb-6">
            Chúng tôi sẽ hướng dẫn bạn đặt lại mật khẩu.
          </p>

          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            className={`w-full p-2 border rounded-lg mb-2 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Nhập địa chỉ Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full bg-[#B60000] text-white py-2 rounded-lg transition ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
            }`}
          >
            {loading ? "Đang gửi..." : "Gửi mã đặt lại"}
          </button>

          <p className="text-center mt-4">
            <a href="/" className="text-[#B60000] hover:underline">
              ← Quay lại trang đăng nhập
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
