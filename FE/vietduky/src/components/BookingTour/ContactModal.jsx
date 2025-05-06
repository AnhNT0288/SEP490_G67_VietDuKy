import { UserService } from "@/services/API/user.service";
import { formatDayDMY } from "@/utils/dateUtil";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function ContactModal({ open, onClose, travelTour }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
console.log("Travel Tour", travelTour);

useEffect(() => {
  if (travelTour?.Tour?.name_tour && travelTour?.start_day && travelTour?.end_day) {
    setForm((prev) => ({
      ...prev,
      message: `Tôi cần tư vấn về ${travelTour.Tour.name_tour} - ${formatDayDMY(travelTour.start_day)} - ${formatDayDMY(travelTour.end_day)}`,
    }));
  }
}, [travelTour]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await UserService.sendAdviceRequest(form);

      if (res.status === 200) {
        toast.success("Gửi thông tin thành công!");
        setForm({
          name: "",
          phone: "",
          message: "Tôi cần tư vấn về tour du lịch",
        });
        onClose();
      } else {
        toast.error("Gửi thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      toast.error("Lỗi kết nối server.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-2 text-center text-gray-800">
          Liên hệ tư vấn
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center leading-relaxed">
          Chúng tôi mong muốn lắng nghe ý kiến của quý khách. <br />
          Vui lòng gửi mọi yêu cầu, thắc mắc theo thông tin bên dưới, chúng tôi
          sẽ liên lạc với bạn sớm nhất có thể.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Họ và tên
            </label>
            <input
              name="name"
              type="text"
              placeholder="Nhập họ và tên"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Số điện thoại
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="Nhập số điện thoại"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-gray-700 font-medium">
              Nội dung cần tư vấn
            </label>
            <textarea
              name="message"
              placeholder="Tôi cần tư vấn về tour du lịch..."
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
              value={form.message}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white font-semibold py-2 rounded-lg hover:bg-red-600 transition duration-200"
          >
            {loading ? "Đang gửi..." : "Gửi thông tin"}
          </button>
        </form>
      </div>
    </div>
  );
}
