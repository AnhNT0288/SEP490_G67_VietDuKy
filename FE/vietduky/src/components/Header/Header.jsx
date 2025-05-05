import Icons from "../Icons/Icon";
import ModalLogin from "../ModalLogin/ModalLogin";
import { StorageService } from "@/services/storage/StorageService";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderMenu from "./HeaderMenu";
import { FaBars } from "react-icons/fa";
import { useNotifications } from "@/hooks/useNotifications";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function Header() {
  const navigate = useNavigate();
  const [isOpenLogin, setIsOpenLogin] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenHamburger, setIsOpenHamburger] = useState(false);
  const [avatar, setAvatar] = useState(Icons.User);
  const [user, setUser] = useState(null);
  const menuRef = useRef(null);
  const hamburgerRef = useRef(null);
  const notificationRef = useRef(null);
  const [isShowNotification, setIsShowNotification] = useState(false);

  const { notifications, markNotificationAsRead } = useNotifications({
    userId: user?.id,
  });

  // Lấy thông tin user khi component mount
  useEffect(() => {
    const storedUser = StorageService.getUser();
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.avatar) setAvatar(storedUser.avatar);
    }
  }, []);

  // Đóng menu khi click ra ngoài
  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpenMenu(false);
    }

    if (
      hamburgerRef.current &&
      !hamburgerRef.current.contains(event.target) &&
      !event.target.closest(".hamburger-toggle") // tránh đóng khi click icon hamburger
    ) {
      setIsOpenHamburger(false);
    }
  };

  const handleClickOutsideNotification = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setIsShowNotification(false);
    }
  };
  const handleSignout = () => {
    StorageService.signout(navigate);
    setUser(null);
    setAvatar(Icons.User);
    setIsOpenMenu(false);
    setIsOpenHamburger(false);
  };

  const handleAvatarClick = () => {
    if (user) {
      setIsOpenMenu(!isOpenMenu);
    } else {
      setIsOpenLogin(true);
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleClickNotification = (notification) => {
    if (!notification.isRead) {
      markNotificationAsRead(notification.id, user.id);
    }
    navigate(getLinkNotification(notification));
    setIsShowNotification(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("mousedown", handleClickOutsideNotification);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleClickOutsideNotification);
    };
  }, []);

  // Tắt scroll khi hamburger mở

  // Tắt scroll khi hamburger mở
  useEffect(() => {
    document.body.style.overflow = isOpenHamburger ? "hidden" : "auto";
  }, [isOpenHamburger]);

  return (
    <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between relative z-50">
      <img
        src="/Image/Logo.png"
        alt="Viet Du Ky"
        width={150}
        height={100}
        onClick={() => navigate("/")}
        className="cursor-pointer transition duration-300 hover:scale-105"
      />

      {/* Desktop menu */}
      <div className="flex items-center gap-12 lg:gap-16">
        <nav className="hidden md:flex space-x-6 lg:space-x-16">
          <a href="/" className="hover:underline text-white">
            Trang Chủ
          </a>
          <a href="/article/home" className="hover:underline text-white">
            Bài viết
          </a>
          <a href="/listTour" className="hover:underline text-white">
            Du lịch trọn gói
          </a>
          <a
            href="/about-us?tab=gioi-thieu"
            className="hover:underline text-white"
          >
            Về chúng tôi
          </a>
          <a href="/about-us?tab=ho-tro" className="hover:underline text-white">
            Hỗ Trợ
          </a>
        </nav>

        {/* Avatar + Hamburger */}
        <div className="flex items-center gap-4 md:gap-6 md:flex-row-reverse">
          {/* Avatar */}

          <div className="relative" ref={notificationRef}>
            <IoMdNotificationsOutline
              size={24}
              onClick={() => setIsShowNotification(!isShowNotification)}
              className="cursor-pointer"
            />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-red-500 text-[10px] px-1.5 py-[1px] rounded-full font-semibold">
                {unreadCount}
              </span>
            )}
            {isShowNotification && (
              <div className="absolute right-0 mt-2 w-[300px] max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-lg p-2 border border-gray-200 z-50">
                <p className="text-sm text-gray-700 font-medium px-3 py-1">
                  {notifications.length} thông báo
                </p>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleClickNotification(notification)}
                    className={`flex flex-row justify-between items-center border-t bg-gray-100 border-gray-200 p-2 hover:bg-gray-100 cursor-pointer ${
                      !notification?.isRead && "bg-white"
                    }`}
                  >
                    <div className="flex flex-col">
                      <p className="text-md font-medium text-black">
                        {notification.title}
                      </p>
                      {notification.body && (
                        <p className="text-sm text-gray-700 font-medium text-black">
                          {notification.body}
                        </p>
                      )}
                    </div>
                    {!notification?.isRead && (
                      <div className="bg-red-700 w-2 h-2 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="relative" ref={menuRef}>
            <img
              onClick={handleAvatarClick}
              src={avatar}
              alt="Avatar"
              width={user ? 36 : 28}
              height={user ? 36 : 28}
              className={`rounded-full cursor-pointer transition duration-300 ${
                user
                  ? ""
                  : "hover:filter hover:invert hover:sepia hover:saturate hover:hue-rotate-180"
              }`}
            />
            {/* Dropdown menu */}
            {isOpenMenu && (
              <>
                {/* Desktop dropdown (ngay dưới avatar) */}
                <div className="hidden md:block absolute right-0 mt-2 w-96 bg-white text-black rounded-md border border-gray-300 shadow-lg z-50">
                  {user ? (
                    <HeaderMenu user={user} handleSignout={handleSignout} />
                  ) : (
                    <></>
                  )}
                </div>

                {/* Mobile dropdown (cố định góc phải màn hình) */}
                <div className="block md:hidden fixed top-16 right-4 w-80 bg-white text-black rounded-md border border-gray-300 shadow-lg z-50">
                  {user ? (
                    <HeaderMenu user={user} handleSignout={handleSignout} />
                  ) : (
                    <></>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Hamburger icon */}
          <button
            className="md:hidden hamburger-toggle"
            onClick={() => setIsOpenHamburger(!isOpenHamburger)}
          >
            <FaBars size={24} className="text-white" />
          </button>
        </div>
      </div>

      {/* Off-canvas menu mobile */}
      <div
        ref={hamburgerRef}
        className={`fixed top-0 right-0 h-full w-[75%] bg-red-700 text-white z-50 shadow-lg transform transition-transform duration-300 ${
          isOpenHamburger ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 flex flex-col gap-4">
          <a href="/" className="text-lg font-semibold">
            Trang Chủ
          </a>
          <a href="/article/home" className="text-lg font-semibold">
            Bài viết
          </a>
          <a href="/listTour" className="text-lg font-semibold">
            Du lịch trọn gói
          </a>
          <a href="/about-us?tab=gioi-thieu" className="text-lg font-semibold">
            Hợp tác với chúng tôi
          </a>
          <a href="/about-us?tab=ho-tro" className="text-lg font-semibold">
            Hỗ Trợ
          </a>
        </div>
      </div>

      {/* Modal đăng nhập */}
      {isOpenLogin && <ModalLogin onClose={() => setIsOpenLogin(false)} />}
    </header>
  );
}

const getLinkNotification = (notification) => {
  switch (notification?.type) {
    case "booking":
      return `/booking`;
    case "booking_detail":
      return `/bookingHistory`;
    default:
      return `#`;
  }
};
