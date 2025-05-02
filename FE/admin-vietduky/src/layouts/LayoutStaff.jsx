import SidebarStaff from "../components/Sidebar/SidebarStaff";
import { Outlet } from "react-router-dom";
import HeaderManage from "../components/HeaderManage/HeaderManage.jsx";
import {useState} from "react";

export default function LayoutStaff() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [breadcrumb, setBreadcrumb] = useState(["Quản lý Tour"]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex min-h-screen">
            <SidebarStaff setBreadcrumb={setBreadcrumb} isCollapsed={isCollapsed} />
            <div className="flex-1">
                <HeaderManage
                    toggleSidebar={toggleSidebar}
                    breadcrumb={breadcrumb}
                />
                <Outlet />
            </div>
        </div>
    );
}
