import { useState, useRef } from 'react';
import Header from "../components/Header/Header.jsx";
import Footer from "../components/Footer/Footer.jsx";
import {useNavigate} from "react-router-dom";
import PromotionalProgram from "../components/Landing/PromotionalProgram.jsx";
import ExpireTour from "../components/Landing/ExpireTour/ExpireTour.jsx";
import FeaturedTour from "../components/Landing/FeaturedTour.jsx";
import LocationVN from "../components/Landing/LocationVN.jsx";

export default function PersonalAIPage() {
    const [selected, setSelected] = useState("tour");
    const scrollRefs = useRef([]);
    const navigate = useNavigate();

    return (
        <div className="bg-white" style={{backgroundImage: "url('/Image/Background.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100%", minHeight: "100vh",}}>

            {/* Header */}
            <Header/>

            <div className="relative">
                {/* Background Image */}
                <div style={{position: "relative", width: "100%", height: "300px", overflow: "hidden", borderBottomLeftRadius: "24px", borderBottomRightRadius: "24px",}}>
                    <img src="/Image/Div.png" alt="Background" style={{width: "100%", height: "100%", objectFit: "cover", filter: "brightness(75%)",}}/>
                    {/* Hashtag */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                        <h2 className="text-2xl md:text-3xl font-semibold -mt-40">
                            RONG CHƠI BỐN PHƯƠNG, GIÁ VẪN <span className="text-yellow-400">"YÊU THƯƠNG"</span>
                        </h2>
                    </div>
                </div>

                {/* Search Box */}
                <div className="relative w-full bg-white shadow-lg rounded-lg p-6 max-w-6xl mx-auto -mt-40">

                    {/* Buttons */}
                    <div className="flex space-x-4 mt-4">
                        {/* Button "Tìm kiếm Tour" */}
                        <button
                            className="px-4 py-2 rounded-full font-medium shadow-sm transition border ${border-gray-300 text-gray-400 bg-white"
                            onClick={() => {
                                setSelected("tour");
                                navigate("/");
                            }}>
                            Tìm kiếm Tour
                        </button>

                        {/* Button "Cá nhân hóa bằng AI" */}
                        <button className=" px-4 py-2 rounded-full font-medium shadow-sm transition border border-red-700 text-red-700 bg-white">
                            Cá nhân hóa bằng AI
                        </button>
                    </div>

                    {/* Search Form */}
                    <h2 className="mt-4 text-3xl font-bold text-red-700">
                        Tạo tour cá nhân hóa bằng AI!
                    </h2>
                    <p className="text-gray-600 mt-2">
                        Khám phá di sản văn hóa Việt theo cách của bạn.
                    </p>

                    {/* Search Box */}
                    <div className="mt-4 flex items-center border rounded-lg overflow-hidden bg-white shadow-sm">
                        <input
                            type="text"
                            placeholder="Bạn muốn đi đâu"
                            className="w-full px-4 py-3 outline-none text-gray-700"
                        />
                        <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 flex items-center rounded-md whitespace-nowrap">
                            <span className="mr-2">🔍</span> <span>Tạo tour</span>
                        </button>
                    </div>
                </div>
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
                    <img src="/Image/Qua%20chao%20mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Qua%20chao%20mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Qua%20chao%20mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                    <img src="/Image/Qua%20chao%20mung.png" alt="Khuyến mãi" width={800} height={200} className="rounded-lg pointer-events-none" />
                </div>
            </div>

            {/* Chương trình khuyến mại */}
            <PromotionalProgram/>

            {/* Chương trình khuyến mại */}
            <ExpireTour/>

            {/* Tour trong nước nổi bật */}
            <FeaturedTour/>

            {/* Khám phá địa điểm vui chơi ở Việt Nam */}
            <LocationVN/>

            {/* Footer */}
            <Footer/>
        </div >
    );
}
