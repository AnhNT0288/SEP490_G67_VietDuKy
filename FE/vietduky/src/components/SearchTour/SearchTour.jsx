import { useState, useRef } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function SearchTour() {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Khách sạn");
  const tabs = [
    "Khách sạn",
    "Nhà và Căn hộ",
    "Vé máy bay",
    "Hoạt động",
    "Đưa đón sân bay",
  ];
  const [selected, setSelected] = useState("tour");
  const cities = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
  const scrollRefs = useRef([]);
  const navigate = useNavigate(); // Khai báo hook điều hướng
  return (
    <div className="relative">
      {/* Background Image */}
      <div style={{position: "relative", width: "100%", height: "300px", overflow: "hidden", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px",}}>
        <img
          src="/Image/Div.png"
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(50%)",
          }}/>

        {/* Hashtag */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
          <h2 className="text-2xl md:text-3xl font-semibold -mt-40">
            RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN{" "}
            <span className="text-yellow-400">"YÊU THƯƠNG"</span>
          </h2>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative w-full bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto -mt-40">
        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex border-b " style={{ justifyContent: "center" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                className={`py-2 px-4 text-sm font-medium ${
                  activeTab === tab
                    ? "text-red-700 border-b-2 border-red-700"
                    : "text-gray-500"
                }`}
                onClick={() => {
                  setSelected("ai");
                  navigate("/personal-ai");
                }}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4 mt-4">
          <button
            className={`px-4 py-2 rounded-full font-medium shadow-sm transition ${
              selected === "tour"
                ? "bg-red-700 text-white"
                : "bg-red-100 text-red-700"
            }`}
            onClick={() => {
              setSelected("ai");
              navigate("/");
            }}
          >
            Tìm kiếm Tour
          </button>

          <button
            className={`px-4 py-2 rounded-full font-medium shadow-sm transition ${
              selected === "ai"
                ? "bg-red-700 text-white"
                : "bg-red-100 text-red-700"
            }`}
            onClick={() => {
              setSelected("ai");
              navigate("/personalAI");
            }}
          >
            Cá nhân hóa bằng AI
          </button>
        </div>

        {/* Search Form */}
        <div className="mt-4 space-y-4">
          <div className="flex items-center border rounded-lg p-3">
            <span className="text-gray-500 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Nhập điểm du lịch hoặc tên khách sạn"
              className="w-full outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col border rounded-lg p-3">
              <span className="text-gray-500 text-sm">Ngày nhận phòng</span>
              <input type="date" className="outline-none text-gray-700" />
            </div>

            <div className="flex flex-col border rounded-lg p-3">
              <span className="text-gray-500 text-sm">Ngày trả phòng</span>
              <input type="date" className="outline-none text-gray-700" />
            </div>

            <div className="flex flex-col border rounded-lg p-3">
              <span className="text-gray-500 text-sm">Khách & Phòng</span>
              <select className="outline-none text-gray-700">
                <option>2 người lớn, 1 phòng</option>
                <option>1 người lớn, 1 phòng</option>
                <option>3 người lớn, 2 phòng</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
