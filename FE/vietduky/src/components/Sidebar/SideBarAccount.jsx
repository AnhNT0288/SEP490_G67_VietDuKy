import { Bell, CalendarDays, Heart, Star, User } from "lucide-react";
import { FaHistory, } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";

export default function SideBarAccount() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { key: "Hồ sơ của tôi", icon: User, path: "/profile" },
    { key: "Lịch sử đặt Tour", icon: FaHistory, path: "/bookingHistory" },
    { key: "Đánh giá", icon: Star, path: "/reviews" },
    { key: "Danh sách yêu thích", icon: Heart, path: "/favorites" },
    { key: "Cài đặt thông báo", icon: Bell, path: "/settings" },
  ];

  return (
    <div className="py-6">
      <Card className="py-2 w-80 bg-white shadow-lg rounded-lg">
        <ul className="space-y-2 m-4">
          {menuItems.map(({ key, icon: Icon, path }) => {
            const isActive = location.pathname === path; // Kiểm tra xem path có khớp với URL không

            return (
              <li
                key={key}
                className={`flex items-center font-medium cursor-pointer border-b-2 border-transparent py-2 px-4 transition-colors duration-300
                  ${isActive ? "text-white bg-red-500 rounded-lg" : "text-gray-700 hover:bg-gray-200 hover:text-zinc-900 rounded-lg"}`}
                onClick={() => navigate(path)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {key}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
