import SidebarAdmin from "../components/Sidebar/SidebarAdmin";
import { Outlet } from "react-router-dom";
import {useState} from "react";
import HeaderManage from "../components/HeaderManage/HeaderManage.jsx";

export default function LayoutAdmin() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [breadcrumb, setBreadcrumb] = useState(["Quản lý Tour"]);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="flex md:flex-row h-full min-h-screen">
            <SidebarAdmin setBreadcrumb={setBreadcrumb} isCollapsed={isCollapsed} />
            <div className="flex-1 flex flex-col">
                <HeaderManage
                    toggleSidebar={toggleSidebar}
                    breadcrumb={breadcrumb}
                />
                <div className="flex-1 bg-gray-50">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}