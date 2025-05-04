import { UserService } from "@/services/API/user.service";
import { useState } from "react";
import { toast } from "react-toastify";

export default function ContactModal({ open, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await UserService.sendAdviceRequest(form);

      if (res.status === 200) {
        toast("Gửi thông tin thành công!");
        setForm({ name: "", phone: "", message: "Tôi cần tư vấn về tour du lịch" });
        onClose();
      } else {
        toast("Gửi thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      toast("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-center">Liên hệ tư vấn</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Họ và tên"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            type="tel"
            placeholder="Số điện thoại"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Nội dung cần tư vấn"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.message}
            onChange={handleChange}
            required
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {loading ? "Đang gửi..." : "Gửi thông tin"}
          </button>
        </form>
      </div>
    </div>
  );
}
