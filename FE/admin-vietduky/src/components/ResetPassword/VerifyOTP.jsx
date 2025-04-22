import { useState } from "react";
import { verifyOtp } from "../../services/API/auth.service";
import { toast } from "react-toastify";
import Icons from "../Icons/Icon";

export default function VerifyOtp({ email, onSuccess }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!otp || otp.length !== 6) {
      setError("Vui lòng nhập đủ 6 số OTP");
      return;
    }

    setError("");

    try {
      const res = await verifyOtp(email, otp);
      if (res.status === 200) {
        toast.success("Mã xác thực hợp lệ!");
        onSuccess(otp); // chuyển sang bước tiếp theo
      } else {
        setError("Mã xác thực không đúng!");
      }
    } catch (err) {
      console.error("OTP error:", err);
      setError(
        err.response?.data?.message ||
          "Xác thực OTP thất bại, vui lòng thử lại."
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 bg-[#B60000] text-white p-10 rounded-r-3xl">
        <div className="text-2xl font-bold mb-10">Việt Du Ký</div>
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <StepItem key={idx} index={idx + 1} {...step} active={idx === 1} />
          ))}
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center px-10">
        <img src={Icons.Plane} className="absolute right-0 top-10" />
        <div className="w-full max-w-md text-center">
          <span className="text-3xl mb-4">📨</span>
          <h2 className="text-xl font-semibold mb-2">Nhập mã OTP</h2>
          <p className="text-gray-500 mb-6">
            Chúng tôi đã gửi mã tới email bạn đăng ký
          </p>

          <input
            type="text"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center tracking-widest text-xl px-4 py-2 border rounded-lg mb-2 border-gray-300"
            placeholder="------"
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full bg-[#B60000] text-white py-2 rounded-lg hover:bg-red-700 transition"
          >
            Xác nhận
          </button>

          <p className="text-sm mt-4 text-[#B60000] hover:underline cursor-pointer">
            ← Quay lại trang đăng nhập
          </p>
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
