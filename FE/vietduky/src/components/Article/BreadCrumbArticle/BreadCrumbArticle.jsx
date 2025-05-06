import { DirectoryService } from "@/services/API/directory.service";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const BreadCrumbArticle = () => {
  const [directory, setDirectory] = useState([]);
  const location = useLocation(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const response = await DirectoryService.getAllDirectory();
        setDirectory(response.data.data);
      } catch (error) {
        console.error("Error fetching directory:", error);
      }
    };

    fetchDirectory();
  }, []);

  // Định nghĩa navItems với tất cả các mục thư mục
  const navItems = [
    { label: "TRANG CHỦ", path: "/article/home" },
    { label: "BÀI VIẾT CHIA SẺ", path: "/article/post-experience" },
    ...directory.map((item) => ({
      label: item.name_directory,
      path: `/article/${item.alias}`,
    })),
  ];

  return (
    <div className="container mx-auto px-4 pt-6 mt-4">
      <nav className="border-b-4 border-neutral-900">
        <ul className="flex flex-wrap items-center space-x-4 text-sm font-bold uppercase py-2 px-4">
          {navItems.map((item, index) => (
            <li key={index} className="flex items-center">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-red-500 transition-colors ${
                    location.pathname.startsWith(item.path)
                      ? "text-red-600"
                      : "text-zinc-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
              {index < navItems.length - 1 && (
                <span className="mx-2 text-neutral-900">/</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default BreadCrumbArticle;
