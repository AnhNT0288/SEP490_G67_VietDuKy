import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowBigDown,
  ArrowBigUp,
  BaggageClaim,
  ChartColumn,
  Loader,
  Map,
} from "lucide-react";

export default function Sidebar({ isCollapsed }) {
  const [selected, setSelected] = useState(null);
  const [openSubMenu, setOpenSubMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 1, name: "Thống kê", icon: ChartColumn, path: "/dashboard" },
    {
      id: 2,
      name: "Danh sách lịch trình",
      icon: BaggageClaim,
      path: "/travel-guide-tour",
    },
    {
      id: 3,
      name: "Lịch trình còn trống",
      icon: Map,
      path: "/departure-schedule",
    },
    {
      id: 4,
      name: "Tour chờ duyệt",
      icon: Loader,
      path: "/travel-tour-pending",
    },
  ];

  useEffect(() => {
    let activeParent = null;
    let activeChild = null;

    menuItems.forEach((item) => {
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
      className={`h-screen bg-[#9A1B21] text-white p-4 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
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
          {" "}
          {menuItems.map((item) => {
            const isParentSelected =
              selected && item.subItems?.some((sub) => sub.id === selected);
            const isSelected =
              selected === item.id ||
              isParentSelected ||
              openSubMenu === item.id;

            return (
              <li key={item.id}>
                {/* Mục Cha */}
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
                    }
                  }}
                >
                  <div className="flex items-center gap-2">
                    <item.icon
                      width={20}
                      height={20}
                      className={`filter ${
                        isSelected ? "text-black" : "text-white"
                      }`}
                    />
                    {!isCollapsed && item.name}
                  </div>
                  {!isCollapsed &&
                    item.subItems?.length > 0 &&
                    (openSubMenu === item.id ? (
                      <ArrowBigDown />
                    ) : (
                      <ArrowBigUp />
                    ))}
                </div>

                {/* Danh sách Sub Items */}
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
