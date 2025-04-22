import { useState, useEffect } from "react";
import { FiSidebar, FiMoon, FiUser } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { StorageService } from "../../services/storage/StorageService";

// eslint-disable-next-line react/prop-types
export default function HeaderManage({ toggleSidebar, breadcrumb = [] }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  // Lấy thông tin user khi component mount
  useEffect(() => {
    const storedUser = StorageService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Xử lý đăng xuất
  const handleSignout = () => {
    StorageService.signout();
    setUser(null);
    setIsOpenMenu(false);
    navigate("/");
  };

  return (
    <div className="relative flex justify-between items-center bg-white p-4 border-b border-gray-200">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-gray-600 text-base">
        <FiSidebar
          className="cursor-pointer text-gray-600 text-[20px]"
          onClick={toggleSidebar}
        />
        <span className="text-GrayishBlue">|</span>
        <span className="text-GrayishBlue font-medium">Quản lý</span>
        <span className="text-black font-medium flex items-center gap-1">
          <IoIosArrowForward className="text-[12px] text-GrayishBlue opacity-70" />
            {breadcrumb.map((item, index) => (
                <span key={index} className="flex items-center gap-1">
                {index !== 0 && (
                    <IoIosArrowForward className="text-[12px] text-GrayishBlue opacity-70" />
                )}
                    {item}
                </span>
            ))}
        </span>
      </div>

      {/* User Icons */}
      <div className="flex gap-4 items-center relative">
        <FiMoon size={24} />
        <IoMdNotificationsOutline size={24} />

        {/* Avatar hoặc FiUser */}
        <div className="relative">
          {user ? (
            // Nếu đã đăng nhập, hiển thị avatar
            <img
              src={user.avatar || "/Image/avatar.png"}
              alt="User Avatar"
              className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
              onClick={() => setIsOpenMenu(!isOpenMenu)}
            />
          ) : (
            // Nếu chưa đăng nhập, hiển thị FiUser
            <FiUser
              size={24}
              className="cursor-pointer"
              onClick={() => navigate("/")}
            />
          )}

          {/* Dropdown Menu */}
          {isOpenMenu && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 border border-gray-200 z-50">
              <p className="text-sm text-gray-700 font-medium px-3 py-1">
                {user.email}
              </p>
              <hr className="my-1" />
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => navigate("/profile")}
              >
                Xem hồ sơ
              </button>
              <button
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                onClick={handleSignout}
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
