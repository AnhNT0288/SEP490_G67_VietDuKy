import SidebarStaff from "../components/Sidebar/SidebarStaff";
import { Outlet } from "react-router-dom";
import HeaderManage from "../components/HeaderManage/HeaderManage.jsx";
import { useState } from "react";

export default function LayoutStaff() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [breadcrumb, setBreadcrumb] = useState(["Quản lý Tour"]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <SidebarStaff setBreadcrumb={setBreadcrumb} isCollapsed={isCollapsed} />
      <div className="flex-1 flex flex-col">
        <HeaderManage toggleSidebar={toggleSidebar} breadcrumb={breadcrumb} />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
