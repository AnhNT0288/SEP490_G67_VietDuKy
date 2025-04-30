import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Icons from "../Icons/Icon";

// eslint-disable-next-line react/prop-types
export default function SidebarAdmin({ isCollapsed, setBreadcrumb }) {
  const [selected, setSelected] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 1, name: "Thống kê", icon: Icons.Sidebar, path: "/dashboard" },
    {
      id: 2,
      name: "Quản lý Tour",
      icon: Icons.TourIcon,
      subItems: [
        { id: 201, name: "Vị trí", path: "/managementLocation" },
        { id: 202, name: "Chuyến du lịch", path: "/managementTour" },
        { id: 203, name: "Chủ đề", path: "/managementTheme" },
      ],
    },
    {
      id: 3,
      name: "Quản lý khách sạn",
      icon: Icons.HotelIcon,
      path: "/managementHotel",
    },
    {
      id: 4,
      name: "Quản lý nhà hàng",
      icon: Icons.RestaurantIcon,
      path: "/managementRestaurant",
    },
    {
      id: 5,
      name: "Quản lý phương tiện",
      icon: Icons.VehicleIcon,
      path: "/managementVehicle"
    },
    {
      id: 6,
      name: "Quản lý khuyến mãi",
      icon: Icons.PromotionIcon,
      subItems: [
        {
          id: 601,
          name: "Chương trình triết khấu",
          path: "/managementSaleProgram"
        },
        { id: 602,
          name: "Mã giảm giá",
          path: "/managementDiscount"
        },
        { id: 603,
          name: "Ưu đãi phút chót",
          path: "/managementLastMinuteDeals"
        },
      ],
    },
    {
      id: 7,
      name: "Quản lý dịch vụ",
      icon: Icons.ServiceIcon,
      path: "/managementService",
    },
  ];

  const systemItems = [
    {
      id: 8,
      name: "Quản lý tin tức",
      icon: Icons.SystemConfigIcon,
      subItems: [
        { id: 801, name: "Danh mục", path: "/managementCategory" },
        { id: 802, name: "Bài viết", path: "/managementPost" },
      ],
    },
    {
      id: 9,
      name: "Quản lý tài khoản",
      icon: Icons.AccountIcon,
      subItems: [
        { id: 901, name: "Nhân viên", path: "/managementStaff" },
        { id: 902, name: "Phân quyền", path: "/managementUserRole" },
      ],
    },
  ];

  useEffect(() => {
    let activeParent = null;
    let activeChild = null;

    [...menuItems, ...systemItems].forEach((item) => {
      if (item.subItems) {
        const foundChild = item.subItems.find((sub) =>
          location.pathname.includes(sub.path)
        );
        if (foundChild) {
          activeParent = item.id;
          activeChild = foundChild.id;
        }
      } else if (location.pathname.includes(item.path)) {
        activeChild = item.id;
      }
    });

    if (activeChild) {
      setSelected(activeChild);
    }
    if (activeParent) {
      setOpenSubMenu(activeParent);
    }
  }, [location.pathname]);

  return (
    <aside
      className={`fixed md:relative h-full bg-[#9A1B21] text-white p-4 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      } ${isMobileOpen ? "block" : "hidden"} md:block`}
    >
      <button
        className="md:hidden bg-red-700 text-white p-2 rounded-md"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
      >
        Menu
      </button>
      <a href="/" className="flex justify-center">
        <img
          src="/Image/Logo.png"
          alt="Viet Du Ky"
          width={isCollapsed ? 50 : 175}
          height={isCollapsed ? 50 : 125}
          className="transition-all duration-300"
        />
      </a>

      <nav className="mb-6">
        <ul>
          {menuItems.map((item) => {
            const isParentSelected =
              selected && item.subItems?.some((sub) => sub.id === selected);
            const isSelected =
              selected === item.id ||
              isParentSelected ||
              openSubMenu === item.id;

            return (
              <li key={item.id}>
                <div
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    isSelected
                      ? "bg-[#F4F4F5] text-black"
                      : "hover:bg-[#B22222]"
                  }`}
                  onClick={() => {
                    if (item.subItems?.length) {
                      setOpenSubMenu(openSubMenu === item.id ? null : item.id);
                    } else {
                      navigate(item.path);
                      setSelected(item.id);
                      setOpenSubMenu(null);
                      setBreadcrumb([item.name]);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                      className={`filter ${isSelected ? "invert-0" : "invert"}`}
                    />
                    {!isCollapsed && item.name}
                  </div>
                  {!isCollapsed &&
                    item.subItems?.length > 0 &&
                    (openSubMenu === item.id ? (
                      <img src={Icons.ArrowBottom} className="filter invert" />
                    ) : (
                      <img src={Icons.ArrowRight} className="filter invert" />
                    ))}
                </div>

                {!isCollapsed &&
                  item.subItems?.length > 0 &&
                  openSubMenu === item.id && (
                    <ul className="ml-6 border-l border-gray-300 pl-3 mt-1">
                      {item.subItems.map((subItem) => (
                        <li
                          key={subItem.id}
                          className={`py-1 cursor-pointer ${
                            selected === subItem.id
                              ? "text-gray font-medium border-l-4 border-red-500 pl-2"
                              : "hover:text-gray-300"
                          }`}
                          onClick={() => {
                            navigate(subItem.path);
                            setSelected(subItem.id);
                            setOpenSubMenu(item.id);
                            setBreadcrumb([item.name, subItem.name]);
                          }}
                        >
                          {subItem.name}
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            );
          })}
        </ul>
      </nav>

      <p className="text-sm opacity-70 mb-2">{!isCollapsed && "Hệ thống"}</p>

      <nav>
        <ul>
          {systemItems.map((item) => {
            const isParentSelected =
              selected && item.subItems?.some((sub) => sub.id === selected);
            const isSelected =
              selected === item.id ||
              isParentSelected ||
              openSubMenu === item.id;

            return (
              <li key={item.id}>
                <div
                  className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                    isSelected
                      ? "bg-[#F4F4F5] text-black"
                      : "hover:bg-[#B22222]"
                  }`}
                  onClick={() => {
                    if (item.subItems?.length) {
                      setOpenSubMenu(openSubMenu === item.id ? null : item.id);
                    } else {
                      navigate(item.path);
                      setSelected(item.id);
                      setOpenSubMenu(null);
                      setBreadcrumb([item.name]);
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                      className={`filter ${isSelected ? "invert-0" : "invert"}`}
                    />
                    {!isCollapsed && item.name}
                  </div>
                  {!isCollapsed &&
                    item.subItems?.length > 0 &&
                    (openSubMenu === item.id ? (
                      <img src={Icons.ArrowBottom} className="filter invert" />
                    ) : (
                      <img src={Icons.ArrowRight} className="filter invert" />
                    ))}
                </div>

                {!isCollapsed &&
                  item.subItems?.length > 0 &&
                  openSubMenu === item.id && (
                    <ul className="ml-6 border-l border-gray-300 pl-3 mt-1">
                      {item.subItems.map((subItem) => (
                        <li
                          key={subItem.id}
                          className={`py-1 cursor-pointer ${
                            selected === subItem.id
                              ? "text-gray font-medium border-l-4 border-red-500 pl-2"
                              : "hover:text-gray-300"
                          }`}
                          onClick={() => {
                            navigate(subItem.path);
                            setSelected(subItem.id);
                            setOpenSubMenu(item.id);
                            setBreadcrumb([item.name, subItem.name]);
                          }}
                        >
                          {subItem.name}
                        </li>
                      ))}
                    </ul>
                  )}
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
