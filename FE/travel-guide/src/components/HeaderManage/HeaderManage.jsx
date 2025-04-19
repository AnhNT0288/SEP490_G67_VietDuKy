import { useState, useEffect } from "react";
import { FiSidebar, FiMoon, FiUser } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { StorageService } from "../../services/storage/StorageService";

export default function HeaderManage({ toggleSidebar, title }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [isOpenMenu, setIsOpenMenu] = useState(false);

  useEffect(() => {
    const storedUser = StorageService.getUser();
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSignout = () => {
    StorageService.signout(navigate);
    setUser(null);
    setIsOpenMenu(false);
  };

  return (
      <div className="relative flex justify-between items-center bg-white p-4 border-b border-gray-200 sm:px-6 sm:py-3 md:px-8 md:py-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
          <FiSidebar
              className="cursor-pointer text-gray-600 text-[20px] sm:text-[22px]"
              onClick={toggleSidebar}
          />
          <span className="text-GrayishBlue hidden sm:inline">|</span>
          <span className="text-black font-medium flex items-center gap-1 truncate max-w-[150px] sm:max-w-none">
          {pathname === "/dashboard" ? "Thống kê" : title}
        </span>
        </div>

        {/* User Icons */}
        <div className="flex gap-3 items-center relative">
          <FiMoon size={20} className="sm:size-5" />
          <IoMdNotificationsOutline size={22} className="sm:size-6" />

          {/* Avatar */}
          <div className="relative">
            {user ? (
                <img
                    src={user.avatar || "/Image/avatar.png"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full cursor-pointer border border-gray-300"
                    onClick={() => setIsOpenMenu(!isOpenMenu)}
                />
            ) : (
                <FiUser
                    size={22}
                    className="cursor-pointer"
                    onClick={() => navigate("/")}
                />
            )}

            {/* Dropdown */}
            {isOpenMenu && user && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg p-2 border border-gray-200 z-50 text-sm">
                  <p className="text-gray-700 font-medium px-3 py-1 break-words">
                    {user.email}
                  </p>
                  <hr className="my-1" />
                  <button
                      className="w-full text-left px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      onClick={() => navigate("/profile")}
                  >
                    Xem hồ sơ
                  </button>
                  <button
                      className="w-full text-left px-3 py-2 text-red-600 hover:bg-gray-100 rounded-md"
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
