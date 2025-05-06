import { useState, useEffect } from "react";
import { FiSidebar, FiMoon, FiUser } from "react-icons/fi";
import { IoMdNotificationsOutline } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { StorageService } from "@/services/storage/StorageService.js";
import { useNotifications } from "@/hooks/useNotifications";
import { Check, Trash } from "lucide-react";
// import { getLinkNotification } from "../../utils";

export default function HeaderManage({ toggleSidebar, title }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isShowNotification, setIsShowNotification] = useState(false);
  console.log(user);

  const { notifications, markNotificationAsRead, markAllAsRead, deleteAllNotifications } = useNotifications({
    userId: user?.id,
  });

  const handleClickNotification = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id, user.id);
    }
    navigate(getLinkNotification(notification));
    setIsShowNotification(false);
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const handleClickOutside = (e) => {
    if (!e.target.closest("#notification-container")) {
      setIsShowNotification(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    const storedUser = StorageService.getUser();
    if (storedUser) {
      setUser(storedUser);
      document.removeEventListener("click", handleClickOutside);
    }
  }, []);

  const handleSignout = () => {
    StorageService.signout();
    setUser(null);
    setIsOpenMenu(false);
    navigate("/");
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
        <div id="notification-container" className="relative">
          <IoMdNotificationsOutline
            size={24}
            onClick={() => setIsShowNotification(!isShowNotification)}
            className="cursor-pointer"
          />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
              {unreadCount}
            </span>
          )}
          {isShowNotification && (
            <div className="absolute right-0 mt-2 w-[300px] bg-white shadow-lg rounded-lg p-2 border border-gray-200 z-50">
              <div className="flex flex-row justify-between items-center">
                  <p className="text-sm text-gray-700 font-medium px-3 py-1">
                    {notifications.length} thông báo
                  </p>
                  <div className="flex flex-row gap-2">
                    <button onClick={markAllAsRead}>
                      <Check size={18} className="text-gray-700" />
                    </button>
                    <button onClick={deleteAllNotifications}>
                      <Trash size={18} className="text-red-700" />
                    </button>
                  </div>
                </div>
                <div className="overflow-y-auto max-h-[400px]">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleClickNotification(notification)}
                  className={`flex flex-row justify-between items-center border-t bg-gray-100 border-gray-200 p-2 hover:bg-gray-100 cursor-pointer ${
                    !notification?.isRead && "bg-white"
                  }`}
                >
                  <div className="flex flex-col">
                    <p className="text-md font-medium">{notification.title}</p>
                    <p className="text-sm text-gray-700 font-medium ">
                      {notification.body}
                    </p>
                  </div>
                  {!notification?.isRead && (
                    <div className="bg-red-700 w-2 h-2 rounded-full" />
                  )}
                </div>
              ))}
              </div>
            </div>
          )}
        </div>

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

          {/* Dropdown Menu */}
          {isOpenMenu && user && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 border border-gray-200 z-50">
              <p className="text-sm text-gray-700 font-medium px-3 py-1">
                {user.email}
              </p>
              <hr className="my-1" />
              <button
                className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                onClick={() => navigate("/account/profile")}
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

const getLinkNotification = (notification) => {
  switch (notification?.type) {
    case "BOOKING":
      return `/booking`;
    case "guide_tour_approved":
      return `/travel-guide-tour`;
    case "guide_tour_assigned":
      return `/travel-guide-tour`;
    default:
      return `#`;
  }
};
