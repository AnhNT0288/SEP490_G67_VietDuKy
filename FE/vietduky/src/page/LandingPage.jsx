import { useState, useRef } from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import {useNavigate} from "react-router-dom";

export default function LandingPage() {
    const [search, setSearch] = useState('');
    const [activeTab, setActiveTab] = useState("Khách sạn");
    const tabs = ["Khách sạn", "Nhà và Căn hộ", "Vé máy bay", "Hoạt động", "Đưa đón sân bay"];
    const [selected, setSelected] = useState("tour");
    const cities = ["Hồ Chí Minh", "Hà Nội", "Đà Nẵng", "Hải Phòng", "Cần Thơ"];
    const scrollRefs = useRef([]);
    const navigate = useNavigate(); // Khai báo hook điều hướng

    const handleMouseDown = (index, e) => {
        if (!scrollRefs.current[index]) return;

        e.preventDefault(); // Ngăn chặn hành vi kéo thả mặc định
        const startX = e.clientX;
        const scrollLeft = scrollRefs.current[index].scrollLeft;

        const onMouseMove = (moveEvent) => {
            const x = moveEvent.clientX;
            const walk = (x - startX) * 2; // Điều chỉnh tốc độ cuộn
            scrollRefs.current[index].scrollLeft = scrollLeft - walk;
        };

        const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FaStar key={i} className="text-yellow-400" />);
            } else if (i - 0.5 === rating) {
                stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
            } else {
                stars.push(<FaRegStar key={i} className="text-yellow-400" />);
            }
        }
        return stars;
    };

    return (
        <div className="bg-white" style={{ backgroundImage: "url('/Image/Background.png')" }}>

<<<<<<< Updated upstream
            {/* Header */}
            <header className="bg-red-700 text-white py-4 px-6 flex items-center justify-between">
                <img src="/Image/Logo.png" alt="Viet Du Ky" width={150} height={100}  />
                <div className="flex items-center space-x-6">
                    <nav className="flex space-x-16">
                        <a href="#" className="hover:underline">Trang Chủ</a>
                        <a href="#" className="hover:underline">Du lịch trọn gói</a>
                        <a href="#" className="hover:underline">Hợp tác với chúng tôi</a>
                        <a href="#" className="hover:underline">Hỗ Trợ</a>
                    </nav>
                    <img src="/Image/avatar.png" alt="Avatar" width={50} height={50} className="rounded-full" />
=======
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i - 0.5 === rating) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  return (
      <div className="bg-white" style={{backgroundImage: "url('/Image/Background.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100%", minHeight: "100vh",}}>

        {/* Header */}
        <Header/>

        <div className="relative">
        <SearchTour />
        </div>

         {/* Search Button */}
         <SearchButton />

        {/* Gói quà chào mừng cho người dùng! */}
        <div className="p-6 relative w-4/5 mx-auto">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">
            🎁 Gói quà chào mừng cho người dùng!
          </h2>
        </div>
        <div
          className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab"
          ref={(el) => (scrollRefs.current[0] = el)}
          onMouseDown={(e) => handleMouseDown(0, e)}
        >
          <img
            src="/Image/Qua chao mung.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Qua chao mung.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Qua chao mung.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Qua chao mung.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
        </div>
      </div>

        {/* Chương trình khuyến mại */}
        <div className="p-6 relative w-3/5 mx-auto">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">Chương trình khuyến mại</h2>
          <a href="#" className="text-red-600 hover:underline">
            Xem tất cả
          </a>
        </div>
        <div
          className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab"
          style={{ scrollbarWidth: "none" }}
          ref={(el) => (scrollRefs.current[1] = el)}
          onMouseDown={(e) => handleMouseDown(1, e)}
        >
          <img
            src="/Image/Uudai.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Uudai.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Uudai.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Uudai.png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
        </div>
      </div>

        {/* Khuyến mãi chuyến bay và hoạt động  */}
        <div className="p-6 relative w-3/5 mx-auto scrollbar-hide">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">
            Khuyến mại Chuyến bay và Hoạt động
          </h2>
          <a href="#" className="text-red-600 hover:underline">
            Xem tất cả
          </a>
        </div>
        <div
          className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab"
          style={{ scrollbarWidth: "none" }}
          ref={(el) => (scrollRefs.current[2] = el)}
          onMouseDown={(e) => handleMouseDown(2, e)}
        >
          <img
            src="/Image/Image [sc-fFubgz].png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Image [sc-fFubgz].png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Div [afa2c-box].png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
          <img
            src="/Image/Div [afa2c-box].png"
            alt="Khuyến mãi"
            width={800}
            height={200}
            className="rounded-lg pointer-events-none"
          />
        </div>
      </div>

        {/* Tour trong nước nổi bật */}
        <div className="p-6 relative w-3/5 mx-auto">
        <h2 className="text-xl font-bold">Tour trong nước nổi bật</h2>

        <div className="flex justify-between items-center border-b pb-2">
          <div className="flex space-x-4">
            {cities.map((city) => (
              <button
                key={city}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === city
                    ? "text-red-700 border-b-2 border-red-700"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab(city)}
              >
                {city}
              </button>
            ))}
          </div>
          <p className="text-red-600 font-medium">
            Xem tất cả các chỗ nghỉ ({activeTab})
          </p>
        </div>

        <div
          className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab"
          style={{ scrollbarWidth: "none" }}
          ref={(el) => (scrollRefs.current[3] = el)}
          onMouseDown={(e) => handleMouseDown(3, e)}
        >
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="w-72 bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <img
                src="/Image/Image [sc-fFubgz] (1).png"
                alt="Khách sạn"
                width={300}
                height={200}
                className="w-full"
              />
              <div className="p-4">
                <h3 className="font-bold text-lg">Tên khách sạn {index + 1}</h3>
                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 text-xs">
                    {renderStars(4.5)}
                  </div>
                  <p className="text-gray-500 text-xs">
                    📍 Quận {index + 1}, Hồ Chí Minh
                  </p>
>>>>>>> Stashed changes
                </div>
            </header>

<<<<<<< Updated upstream
            <div className="relative">
                {/* Background Image */}
                <div style={{position: "relative", width: "100%", height: "300px", overflow: "hidden", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px",}}>
                    <img
                        src="/Image/Div.png"
                        alt="Background"
                        style={{
                            width: "100%", // Ảnh rộng bằng div
                            height: "100%", // Ảnh cao bằng div
                            objectFit: "cover", // Cắt ảnh để phù hợp div mà không méo
                            filter: "brightness(50%)", // Làm tối ảnh 75%
                        }}
                    />

                    {/* Hashtag */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                        <h2 className="text-2xl md:text-3xl font-semibold -mt-40">
                            RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN <span className="text-yellow-400">"YÊU THƯƠNG"</span>
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
                                    className={`py-2 px-4 text-sm font-medium ${activeTab === tab ? "text-red-700 border-b-2 border-red-700" : "text-gray-500"
                                    }`}
                                    onClick={() => {
                                        setSelected("ai");
                                        navigate("/personal-ai"); // Điều hướng mà không reload trang
                                    }}                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex space-x-4 mt-4">
                        <button
                            className={`px-4 py-2 rounded-full font-medium shadow-sm transition ${selected === "tour" ? "bg-red-700 text-white" : "bg-red-100 text-red-700"
                            }`}
                            onClick={() => {
                                setSelected("ai");
                                navigate("/"); // Điều hướng mà không reload trang
                            }}                         >
                            Tìm kiếm Tour
                        </button>

                        <button
                            className={`px-4 py-2 rounded-full font-medium shadow-sm transition ${selected === "ai" ? "bg-red-700 text-white" : "bg-red-100 text-red-700"
                            }`}
                            onClick={() => {
                                setSelected("ai");
                                navigate("/personalAI"); // Điều hướng mà không reload trang
                            }}                        >
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

            {/* Search Button */}
            <div className="flex justify-center relative -mt-10 z-10">
                <button className="w-full max-w-2xl bg-red-700 text-white py-3 rounded-full text-lg font-semibold shadow-lg mt-8">
                    TÌM
                </button>
            </div>

            {/* Gói quà chào mừng cho người dùng! */}
            <div className="p-6 relative w-4/5 mx-auto">
                <div className="flex justify-between items-center ">
                    <h2 className="text-xl font-bold">🎁 Gói quà chào mừng cho người dùng!</h2>
                </div>
                <div
                    className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab"
                    ref={(el) => (scrollRefs.current[0] = el)}
                    onMouseDown={(e) => handleMouseDown(0, e)}
                >
                    <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Qua chao mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                </div>
            </div>

            {/* Chương trình khuyến mại */}
            <div className="p-6 relative w-3/5 mx-auto">
                <div className="flex justify-between items-center ">
                    <h2 className="text-xl font-bold">Chương trình khuyến mại</h2>
                    <a href="#" className="text-red-600 hover:underline">Xem tất cả</a>
                </div>
                <div
                    className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab" style={{ scrollbarWidth: "none" }}
                    ref={(el) => (scrollRefs.current[1] = el)}
                    onMouseDown={(e) => handleMouseDown(1, e)}
                >
                    <img src="/Image/Uudai.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Uudai.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Uudai.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Uudai.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                </div>
            </div>

            {/* Khuyến mãi chuyến bay và hoạt động  */}
            <div className="p-6 relative w-3/5 mx-auto scrollbar-hide">
                <div className="flex justify-between items-center ">
                    <h2 className="text-xl font-bold">Khuyến mại Chuyến bay và Hoạt động</h2>
                    <a href="#" className="text-red-600 hover:underline">Xem tất cả</a>
                </div>
                <div
                    className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab" style={{ scrollbarWidth: "none" }}
                    ref={(el) => (scrollRefs.current[2] = el)}
                    onMouseDown={(e) => handleMouseDown(2, e)}
                >
                    <img src="/Image/Image [sc-fFubgz].png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Image [sc-fFubgz].png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Div [afa2c-box].png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Div [afa2c-box].png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                </div>
            </div>

            {/* Tour trong nước nổi bật */}
            <div className="p-6 relative w-3/5 mx-auto">
                <h2 className="text-xl font-bold">Tour trong nước nổi bật</h2>

                <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex space-x-4">
                        {cities.map((city) => (
                            <button
                                key={city}
                                className={`px-4 py-2 text-sm font-medium ${activeTab === city ? "text-red-700 border-b-2 border-red-700" : "text-gray-500"}`}
                                onClick={() => setActiveTab(city)}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                    <p className="text-red-600 font-medium">Xem tất cả các chỗ nghỉ ({activeTab})</p>
                </div>

                <div
                    className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab" style={{ scrollbarWidth: "none" }}
                    ref={(el) => (scrollRefs.current[3] = el)}
                    onMouseDown={(e) => handleMouseDown(3, e)}
                >
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="w-72 bg-white shadow-lg rounded-lg overflow-hidden">
                            <img src="/Image/Image [sc-fFubgz] (1).png" alt="Khách sạn" width={300} height={200} className="w-full" />
                            <div className="p-4">
                                <h3 className="font-bold text-lg">Tên khách sạn {index + 1}</h3>
                                <div className="flex items-center space-x-2">
                                    <div className="flex items-center space-x-1 text-xs">{renderStars(4.5)}</div>
                                    <p className="text-gray-500 text-xs">📍 Quận {index + 1}, Hồ Chí Minh</p>
                                </div>
                                <p className="text-gray-400 text-xs">Giá mỗi đêm chưa gồm thuế và phí</p>
                                <p className="text-red-600 font-bold">VND: {450000 + index * 100000}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Khám phá địa điểm vui chơi ở Việt Nam */}
            <div className="p-6 relative w-3/5 mx-auto scrollbar-hide">
                <div className="flex justify-between items-center ">
                    <h2 className="text-xl font-bold">Khám phá địa điểm vui chơi ở Việt Nam</h2>
                    <a href="#" className="text-red-600 hover:underline">Xem tất cả</a>
                </div>
                <div
                    className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab" style={{ scrollbarWidth: "none" }}
                    ref={(el) => (scrollRefs.current[4] = el)}
                    onMouseDown={(e) => handleMouseDown(4, e)}
                >
                    {[...Array(6)].map((_, index) => (
                        <div key={index} style={{ textAlign: "center" }}>
                            <img
                                src="/Image/Div [afa2c-box] (1).png"
                                alt="Khuyến mãi"
                                className="rounded-lg pointer-events-none"
                                style={{ display: "block", margin: "0 auto" }} // Căn giữa ảnh
                            />
                            <p style={{marginTop: "8px", fontSize: "1rem", fontWeight: "500", textAlign: "center"}}>
                                Hồ Chí Minh
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-red-700 text-white py-8 mt-16">
                <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4">
                    <div>
                        <h3 className="text-lg font-semibold">Về Việt Du Ký</h3>
                        <p className="text-sm mt-2">
                            Việt Du Ký là nền tảng trực tuyến tiên phong trong việc sử dụng trí tuệ nhân tạo (AI) để tạo ra lịch trình du lịch cá nhân hóa.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Liên hệ</h3>
                        <p className="text-sm">📍 Hòa Lạc, Hà Nội</p>
                        <p className="text-sm">📞 +84 963 858 005</p>
                        <p className="text-sm">✉ vietduky.tour@gmail.com</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">Mạng xã hội</h3>
                        <div className="flex space-x-4 mt-2">
                            <span>📘</span>
                            <span>🎵</span>
                        </div>
                        <div className="mt-4">
                            <input type="text" placeholder="Email" className="w-full p-2 rounded-lg text-gray-700" />
                            <button className="w-full mt-2 p-2 border rounded-lg text-white">Đăng ký</button>
                        </div>
                    </div>
                </div>
            </footer>
        </div >
    );
=======
        {/* Khám phá địa điểm vui chơi ở Việt Nam */}
        <div className="p-6 relative w-3/5 mx-auto scrollbar-hide">
        <div className="flex justify-between items-center ">
          <h2 className="text-xl font-bold">
            Khám phá địa điểm vui chơi ở Việt Nam
          </h2>
          <a href="#" className="text-red-600 hover:underline">
            Xem tất cả
          </a>
        </div>
        <div
          className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab"
          style={{ scrollbarWidth: "none" }}
          ref={(el) => (scrollRefs.current[4] = el)}
          onMouseDown={(e) => handleMouseDown(4, e)}
        >
          {[...Array(6)].map((_, index) => (
            <div key={index} style={{ textAlign: "center" }}>
              <img
                src="/Image/Div [afa2c-box] (1).png"
                alt="Khuyến mãi"
                className="rounded-lg pointer-events-none"
                style={{ display: "block", margin: "0 auto" }} // Căn giữa ảnh
              />
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "1rem",
                  fontWeight: "500",
                  textAlign: "center",
                }}
              >
                Hồ Chí Minh
              </p>
            </div>
          ))}
        </div>
      </div>

        {/* Footer */}
        <Footer/>
    </div>
  );
>>>>>>> Stashed changes
}
