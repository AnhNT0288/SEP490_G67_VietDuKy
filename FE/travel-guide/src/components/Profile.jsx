import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "../services/API/user.service";
import { FaEnvelope, FaUser, FaShieldAlt, FaSignOutAlt } from "react-icons/fa";

export default function Profile() {
  const [userId] = useState(() => JSON.parse(localStorage.getItem("user"))?.id);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || localStorage.getItem("access_token");

    if (urlParams.get("token")) {
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, document.title, "/profile");
    }

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const response = await getUser(userId);
        if (response.status === 200) {
          setUser(response.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchProfile();
  }, [userId]);

  if (!user) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden max-w-lg w-full">
        <div className="bg-indigo-500 h-32 relative">
          <img
            src={user.avatar || "https://via.placeholder.com/150"}
            alt="Avatar"
            className="absolute left-1/2 transform -translate-x-1/2 top-16 w-28 h-28 rounded-full border-4 border-white object-cover shadow-md"
          />
        </div>
        <div className="mt-20 p-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{user.displayName}</h2>
          <p className="text-gray-500 mb-4">Mã người dùng: #{user.id}</p>
          <div className="text-left space-y-3 text-gray-700">
            <div className="flex items-center gap-2">
              <FaEnvelope className="text-indigo-500" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaShieldAlt className="text-indigo-500" />
              <span>Phân quyền: {user.role_id}</span>
            </div>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("access_token");
              navigate("/");
            }}
            className="mt-6 inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-full transition"
          >
            <FaSignOutAlt />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
}
