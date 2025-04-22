import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Lấy token từ URL hoặc localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token") || localStorage.getItem("access_token");

    if (urlParams.get("token")) {
      // Nếu có token trong URL, lưu vào localStorage
      localStorage.setItem("access_token", token);
      window.history.replaceState({}, document.title, "/profile"); // Xóa token trên URL
    }

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/");
      return;
    }

    // Gọi API để lấy profile user
    const fetchProfile = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/auth/profile", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (response.ok) {
          setUser(data);
        } else {
          alert(data.message || "Lỗi khi lấy thông tin người dùng!");
          localStorage.removeItem("access_token");
          navigate("/login");
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-4">Hồ Sơ Cá Nhân</h2>
      <div className="text-center">
        <img
          src={user.avatar || "https://via.placeholder.com/150"}
          alt="Avatar"
          className="w-24 h-24 rounded-full mx-auto mb-4"
        />
        <h3 className="text-xl font-semibold">{user.username}</h3>
      </div>
      <button
        onClick={() => {
          localStorage.removeItem("access_token");
          navigate("/");
        }}
        className="w-full bg-red-500 text-white py-2 mt-4 rounded-lg hover:bg-red-600 transition"
      >
        Đăng xuất
      </button>
    </div>
  );
}
