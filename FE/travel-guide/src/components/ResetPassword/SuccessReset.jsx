import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../Icons/Icons";

export default function SuccessReset() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(timer);
          navigate("/");
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen bg-white">
      <div className="w-1/2 bg-[#B60000] text-white p-10 rounded-r-3xl">
        <img src={Icons.Plane} className="absolute right-0 top-10" />

        <div className="text-2xl font-bold mb-10">Việt Du Ký</div>
        <div className="space-y-8">
          {steps.map((step, idx) => (
            <StepItem key={idx} index={idx + 1} {...step} active={idx === 3} />
          ))}
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center px-10">
        <div className="w-full max-w-md text-center">
          <span className="text-3xl mb-4">✅</span>
          <h2 className="text-xl font-semibold mb-2">
            Đổi mật khẩu thành công
          </h2>
          <p className="text-gray-500 mb-4">
            Mật khẩu của bạn đã được cập nhật thành công.
          </p>
          <p className="text-sm text-gray-400 mb-6">
            Tự động chuyển về trang đăng nhập sau {countdown}s
          </p>

          <a
            href="/"
            className="inline-block bg-[#B60000] text-white py-2 px-6 rounded-lg hover:bg-red-700 transition"
          >
            Đăng nhập ngay
          </a>
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
