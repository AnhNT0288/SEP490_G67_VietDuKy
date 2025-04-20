import { useState } from "react";
import { resetPassword } from "../../services/API/auth.service";
import { toast } from "react-toastify";
import Icons from "../Icons/Icons";

export default function ChangePassword({ email, onSuccess }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!password || !confirm) {
      setError("Vui lòng nhập đầy đủ thông tin");
    } else if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
    } else if (password !== confirm) {
      setError("Mật khẩu không khớp");
    } else {
      setError("");

      try {
        const res = await resetPassword(email, password, confirm);
        if (res.status === 200) {
          toast.success("Đổi mật khẩu thành công!");
          onSuccess();
        } else {
          toast.error("Đổi mật khẩu thất bại!");
        }
      } catch (error) {
        console.error("Lỗi reset:", error);
        toast.error(error.response?.data?.message || "Đổi mật khẩu thất bại!");
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 bg-[#B60000] text-white p-10 rounded-r-3xl">
        <div className="text-2xl font-bold mb-10">Việt Du Ký</div>
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <StepItem key={idx} index={idx + 1} {...step} active={idx === 2} />
          ))}
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center px-10">
        <img src={Icons.Plane} className="absolute right-0 top-10" />
        <div className="w-full max-w-md">
          <span className="text-3xl mb-4">🔒</span>
          <h2 className="text-xl font-semibold mb-2">Đổi mật khẩu</h2>
          <p className="text-gray-500 mb-6">Vui lòng nhập mật khẩu mới</p>

          <label className="block text-sm font-medium mb-1">Mật khẩu mới</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <label className="block text-sm font-medium mb-1">
            Xác nhận mật khẩu
          </label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded-lg mb-2"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full bg-[#B60000] text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Điền địa chỉ Email",
    desc: "Hãy điền Email bạn đã dùng để nhận mã",
  },
  { title: "Nhập OTP", desc: "Bạn hãy kiểm tra mã từ địa chỉ Email" },
  { title: "Đổi mật khẩu", desc: "Hãy nhập mật khẩu mới" },
  { title: "Đổi thành công", desc: "Đăng nhập bằng mật khẩu mới" },
];

function StepItem({ index, title, desc, active }) {
  return (
    <div className="flex items-start gap-4">
      <span
        className={`rounded-full w-7 h-7 flex items-center justify-center font-bold bg-white text-[#B60000] ${
          active ? "ring-2 ring-yellow-300" : ""
        }`}
      >
        {index}
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-white/80">{desc}</p>
      </div>
    </div>
  );
}
