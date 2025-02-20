import Footer from "../components/Footer/Footer.jsx";
import Header from "../components/Header/Header.jsx";

export default function DealsPage() {

    const deals = [
        {
            id: 1,
            title: "Giảm tới 5%",
            description: "Giảm tới $40 tiền khách sạn. Hết hạn trong 3 ngày | Mã khuyến mãi: AGODADEAL5",
            button: "NHẬN PHIẾU GIẢM GIÁ",
            color: "bg-blue-500",
        },
        {
            id: 2,
            title: "Giảm tới 8%",
            description: "Giảm tới $50 tiền khách sạn. Chi tiêu tối thiểu $120 | Hết hạn trong 3 ngày",
            button: "NHẬN PHIẾU GIẢM GIÁ",
            color: "bg-green-500",
        },
        {
            id: 3,
            title: "Giảm giá giới hạn",
            description: "Mở khóa giá khách sạn đặc biệt tại các điểm đến trong mơ. Đặt ngay.",
            button: "KÍCH HOẠT NGAY",
            color: "bg-yellow-400",
        },
        {
            id: 4,
            title: "Giá chớp nhoáng VIP",
            description: "Hạ giá chớp nhoáng cuối tuần – Đặt ngay để có ưu đãi VIP!",
            button: "ĐẶT NGAY",
            color: "bg-indigo-500",
        },
        {
            id: 5,
            title: "ECO Deals",
            description: "Tiết kiệm tiền khách sạn và Bảo vệ môi trường cùng WWF!",
            button: "ĐẶT NGAY",
            color: "bg-green-700",
        },
        {
            id: 6,
            title: "Elite Offers",
            description: "Ưu đãi đẳng cấp – Giảm đến 30% cho khách sạn cao cấp!",
            button: "ĐẶT NGAY",
            color: "bg-purple-600",
        },
    ];

    return (
        <div className="bg-white" style={{backgroundImage: "url('/Image/Background.png')", backgroundSize: "cover", backgroundPosition: "center", width: "100%", minHeight: "100vh",}}>
            {/* Header */}
            <Header/>

            {/* Banner */}
            <div style={{ position: "relative", width: "100%", height: "300px", overflow: "hidden",}}>
                    <img
                        src="/Image/Div [deals_banner].png"
                        alt="Background"
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </div>

            {/* Content */}
            <div className="max-w-6xl mx-auto py-8 grid grid-cols-4 gap-6">

                {/* Filter Section */}
                <div className="p-4 rounded-lg ">
                    <h3 className="font-semibold">Sản phẩm áp dụng được</h3>
                    <ul className="mt-2">
                        <li><input type="checkbox" /> Khách sạn và Nhà (9)</li>
                        <li><input type="checkbox" /> Chuyến bay (0)</li>
                        <li><input type="checkbox" /> Chuyến bay + Khách sạn (0)</li>
                    </ul>
                    <h3 className="font-semibold mt-4">Ưu đãi</h3>
                    <ul className="mt-2">
                        <li><input type="checkbox" /> Phiếu giảm giá (2)</li>
                        <li><input type="checkbox" /> Thẻ tín dụng (0)</li>
                        <li><input type="checkbox" /> Chiến dịch đặc biệt (3)</li>
                        <li><input type="checkbox" /> Khuyến mãi có thời hạn (4)</li>
                    </ul>
                </div>

                {/* Deals List */}
                <div className="col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {deals.map((deal) => (
                        <div key={deal.id} className="border rounded-lg overflow-hidden flex flex-col h-full shadow-lg bg-white">
                            <div className="p-4">
                                <img src={"/Image/Imagedeals.png"} alt="Deal" className="w-full h-32 object-cover" />
                            </div>
                            <div className="p-4 flex-grow flex flex-col">
                                <h2 className="text-lg font-bold text-gray-800">{deal.title}</h2>
                                <p className="text-sm text-gray-600 mt-2 flex-grow">{deal.description}</p>
                                <div className="p-4 mt-auto flex justify-center">
                                    <button className="w-full bg-red-600 text-white py-2 rounded-md font-medium">
                                        {deal.button}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <Footer/>
        </div >
    );
}
