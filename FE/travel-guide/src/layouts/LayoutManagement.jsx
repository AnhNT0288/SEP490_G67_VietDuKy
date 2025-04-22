import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderManage from "../components/HeaderManage/HeaderManage";
export default function LayoutManagement({ children, title }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {" "}
      {/* full height screen */}
      <Sidebar isCollapsed={isCollapsed} />
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <HeaderManage toggleSidebar={toggleSidebar} title={title} />

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-[#f5f6fa] p-4 flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}
