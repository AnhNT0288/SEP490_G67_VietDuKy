import { useState, useEffect } from 'react';
import {getDashboardData} from "../../services/API/dashboard.service.js";

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        getDashboardData()
            .then(data => setDashboardData(data))
            .catch(error => console.error("Fetch dashboard data failed", error));
    }, []);

    if (!dashboardData) {
        return <div className="p-6">Loading...</div>; // Loading state
    }

    const { today_revenue, monthly_revenue, total_bookings, total_customers, monthly_stats, top_tours, guides, feedbacks } = dashboardData;

    return (
        <div className="p-6 space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 shadow rounded">
                    <div className="text-sm font-medium text-gray-600">Doanh số hôm nay</div>
                    <div className="mt-2 text-2xl font-bold">{today_revenue?.toLocaleString()} VND</div>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <div className="text-sm font-medium text-gray-600">Tổng doanh số tháng</div>
                    <div className="mt-2 text-2xl font-bold">{monthly_revenue?.toLocaleString()} VND</div>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <div className="text-sm font-medium text-gray-600">Tổng số dịch vụ</div>
                    <div className="mt-2 text-2xl font-bold">{total_bookings}</div>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <div className="text-sm font-medium text-gray-600">Tổng số khách hàng</div>
                    <div className="mt-2 text-2xl font-bold">{total_customers}</div>
                </div>
            </div>

            {/* Revenue Chart + Top Tours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Báo cáo doanh thu</h2>
                        <button className="px-3 py-1 border rounded text-sm">Xuất Excel</button>
                    </div>
                    <div className="h-60 bg-gray-100 flex items-center justify-center">
                        {/* Nếu có monthly_stats bạn có thể vẽ chart ở đây sau */}
                        [Biểu đồ doanh thu đang phát triển]
                    </div>
                </div>
                <div className="bg-white p-4 shadow rounded">
                    <h2 className="text-lg font-semibold mb-4">Top 4 Tour được yêu thích</h2>
                    {top_tours?.map((tour) => (
                        <div key={tour.id} className="p-2 bg-gray-50 rounded mb-2">
                            {tour.name_tour}
                        </div>
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
                                <th className="p-2">Email</th>
                                <th className="p-2">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody>
                            {guides?.map((guide) => (
                                <tr key={guide.id} className="border-b">
                                    <td className="p-2">{guide.displayName}</td>
                                    <td className="p-2">{guide.email || "Chưa cập nhật"}</td>
                                    <td className="p-2">{guide.status ? "Đang hoạt động" : "Ngừng"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white p-4 shadow rounded">
                    <h2 className="text-lg font-semibold mb-4">Tour được quan tâm</h2>
                    {top_tours?.map((tour) => (
                        <div key={tour.id} className="p-2 bg-gray-50 rounded mb-2">
                            {tour.name_tour}
                        </div>
                    ))}
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white p-4 shadow rounded">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 gap-4">
                    <h2 className="text-lg font-semibold">Đánh giá của Khách hàng</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2">STT</th>
                            <th className="p-2">Tên Tour</th>
                            <th className="p-2">Nội dung đánh giá</th>
                            <th className="p-2">Đánh giá</th>
                        </tr>
                        </thead>
                        <tbody>
                        {feedbacks?.map((feedback, index) => (
                            <tr key={feedback.feedback_id} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{feedback.tour?.name_tour || "Chưa cập nhật"}</td>
                                <td className="p-2">{feedback.description_feedback}</td>
                                <td className="p-2">{'⭐'.repeat(feedback.rating)}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
