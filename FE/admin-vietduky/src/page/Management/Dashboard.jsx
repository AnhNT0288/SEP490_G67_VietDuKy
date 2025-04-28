import { useState } from 'react';

export default function Dashboard() {
    const [currentPage, setCurrentPage] = useState(1);

    return (
        <div className="p-6 space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {['Doanh số hôm nay', 'Tổng doanh số tháng', 'Tổng số dịch vụ', 'Tổng số khách hàng'].map((item, idx) => (
                    <div key={idx} className="bg-white p-4 shadow rounded">
                        <div className="text-sm font-medium text-gray-600">{item}</div>
                        <div className="mt-2 text-2xl font-bold">20.600.000 VND</div>
                        <div className="text-green-500 text-sm">+36%</div>
                    </div>
                ))}
            </div>

            {/* Revenue Chart + Top Tours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Báo cáo doanh thu</h2>
                        <button className="px-3 py-1 border rounded text-sm">Xuất Excel</button>
                    </div>
                    <div className="h-60 bg-gray-100 flex items-center justify-center">[Biểu đồ]</div>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="text-lg font-semibold mb-4">Top 4 Tour được yêu thích</h2>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="p-2 bg-gray-50 rounded mb-2">[Tour {item}]</div>
                    ))}
                </div>
            </div>

            {/* Guides and Customer Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Danh sách Hướng dẫn viên</h2>
                        <button className="px-3 py-1 border rounded text-sm">Xem tất cả</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2">Tên</th>
                                <th className="p-2">Khu vực</th>
                                <th className="p-2">Lượng lịch trình</th>
                                <th className="p-2">Đánh giá</th>
                            </tr>
                            </thead>
                            <tbody>
                            {[1, 2, 3].map((i) => (
                                <tr key={i} className="border-b">
                                    <td className="p-2">Nguyễn Văn A</td>
                                    <td className="p-2">Hà Giang</td>
                                    <td className="p-2">25</td>
                                    <td className="p-2">⭐⭐⭐⭐⭐</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <h2 className="text-lg font-semibold mb-4">Tour được quan tâm</h2>
                    {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="p-2 bg-gray-50 rounded mb-2">[Tour {item}]</div>
                    ))}
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white p-4 shadow rounded">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-lg font-semibold">Đánh giá của Khách hàng</h2>
                    <div className="flex gap-2">
                        <select className="border rounded px-2 py-1 text-sm">
                            <option>Tất cả đánh giá</option>
                            <option>Tích cực</option>
                            <option>Tiêu cực</option>
                        </select>
                        <select className="border rounded px-2 py-1 text-sm">
                            <option>Khu vực</option>
                        </select>
                        <select className="border rounded px-2 py-1 text-sm">
                            <option>Hôm nay</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">STT</th>
                            <th className="p-2">Tên Tour</th>
                            <th className="p-2">Nội dung đánh giá</th>
                            <th className="p-2">Đánh giá</th>
                            <th className="p-2">Trạng thái</th>
                        </tr>
                        </thead>
                        <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="border-b">
                                <td className="p-2">{i}</td>
                                <td className="p-2">Tour HCM 4N3D</td>
                                <td className="p-2">Có kiến thức sâu rộng</td>
                                <td className="p-2">⭐⭐⭐⭐⭐</td>
                                <td className="p-2 text-green-500">Tích cực</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center items-center mt-4 gap-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="px-3 py-1 border rounded">Previous</button>
                    <span>Page {currentPage}</span>
                    <button onClick={() => setCurrentPage((p) => p + 1)} className="px-3 py-1 border rounded">Next</button>
                </div>
            </div>
        </div>
    );
}