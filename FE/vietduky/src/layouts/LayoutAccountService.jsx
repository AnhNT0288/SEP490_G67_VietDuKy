import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import HeaderSidebar from "@/components/Sidebar/HeaderSidebar";
import SideBarAccount from "@/components/Sidebar/SideBarAccount";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LayoutAccountService({ children }) {
  const [active, setActive] = useState("Hồ sơ của tôi");
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname;
    if (path === "/profile") {
      setActive("Hồ sơ của tôi");
    } else if (path === "/bookingHistory") {
      setActive("Lịch sử đặt Tour");
    } else if (path === "/reviews") {
      setActive("Đánh giá");
    } else if (path === "/favorites") {
      setActive("Danh sách yêu thích");
    } else if (path === "/notifications") {
      setActive("Cài đặt thông báo");
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div>
        <Header />
      </div>
      <div className="flex w-4/5 py-6 mt-8 mx-auto flex-col gap-2">
        <HeaderSidebar active={active} navigate={navigate}/>
        <div className="flex flex-row gap-6 flex-grow">
          <SideBarAccount active={active} setActive={setActive} />
          <div className="flex-grow">
            {children}
          </div>
        </div>
      </div>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
