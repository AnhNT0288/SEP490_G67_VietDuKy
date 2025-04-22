import { FaComment, FaEnvelope, FaHeart, FaHistory, FaUser } from "react-icons/fa";

export default function SidebarProfile() {
  const menuItems = [
    { icon: <FaUser />, text: "Hồ sơ của tôi", active: true },
    { icon: <FaHistory />, text: "Lịch sử đặt Tour" },
    { icon: <FaHeart />, text: "Danh sách yêu thích" },
    { icon: <FaComment />, text: "Đánh giá" },
    { icon: <FaEnvelope />, text: "Cài đặt thông báo" },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md inline-flex flex-col w-72 overflow-hidden">
      {menuItems.map((item, index) => (
        <div
          key={index}
          className={`flex items-center gap-2 px-4 py-3 cursor-pointer ${
            item.active
              ? "text-red-800 font-semibold border-l-4 border-red-800 bg-red-50"
              : "text-zinc-900 hover:text-red-800 hover:bg-red-50 transition"
          }`}
        >
          <span className="text-lg">{item.icon}</span>
          <span className="text-base">{item.text}</span>
        </div>
      ))}
    </div>
  );
}
