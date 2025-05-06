import { useState, useEffect } from 'react';
import {getDashboardData} from "../../services/API/dashboard.service.js";
import {getLocations} from "../../services/API/location.service.js";
import RevenueChart from "../../components/DashBoard/RevenueChart.jsx";
import {generateFullMonthlyStats} from "../../utils/chartUtils.js";

export default function Dashboard() {
    const [dashboardData, setDashboardData] = useState(null);
    const [timeRange, setTimeRange] = useState("7ngay");
    const [timeRangeLow, setTimeRangeLow] = useState("7ngay");
    const [locations, setLocations] = useState([]);
    const [ratingFilter, setRatingFilter] = useState("");
    const [areaFilter, setAreaFilter] = useState("");
    const [guidePage, setGuidePage] = useState(1);
    const guidesPerPage = 5;
    const [feedbackPage, setFeedbackPage] = useState(1);
    const feedbacksPerPage = 10;


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDashboardData({ time: timeRange });
                setDashboardData(data);
            } catch (err) {
                console.error("Fetch dashboard data failed", err);
            }
        };
        fetchData();
    }, [timeRange]);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await getLocations();
                setLocations(res);
            } catch (err) {
                console.error("Lỗi khi fetch location", err);
            }
        };
        fetchLocations();
    }, []);

    // const generateFullMonthlyStats = (statsFromAPI) => {
    //     const fullStats = Array.from({ length: 12 }, (_, i) => ({
    //         month: i + 1,
    //         revenue: 0,
    //     }));
    //
    //     statsFromAPI.forEach(({ month, revenue }) => {
    //         const index = fullStats.findIndex((m) => m.month === month);
    //         if (index !== -1) {
    //             fullStats[index].revenue = parseInt(revenue);
    //         }
    //     });
    //
    //     return fullStats;
    // };

    if (!dashboardData) {
        return <div className="p-6">Loading...</div>;
    }

    const { today_revenue, monthly_revenue, total_bookings, total_customers, monthly_stats, top_tours, guides, feedbacks } = dashboardData;

    const filteredGuides = guides.filter((guide) => {
        // Lọc theo đánh giá (average_rating)
        const passRating =
            ratingFilter === "" || Math.floor(guide.average_rating || 0) === parseInt(ratingFilter);

        // Lọc theo khu vực (tạm thời dựa vào group_name nếu chưa có location_id)
        const guideArea = guide.GuideTours?.[0]?.group_name?.split(" ")[0] || "";
        const passArea =
            areaFilter === "" || guideArea.toLowerCase().includes(areaFilter.toLowerCase());

        return passRating && passArea;
    });


    const timeOptions = [
        { value: "7ngay", label: "7 ngày qua" },
        { value: "1thang", label: "1 tháng" },
        { value: "1quy", label: "1 quý" },
        { value: "1nam", label: "1 năm" },
    ];
    const paginatedGuides = filteredGuides.slice(
        (guidePage - 1) * guidesPerPage,
        guidePage * guidesPerPage
    );

    const paginatedFeedbacks = feedbacks.slice(
        (feedbackPage - 1) * feedbacksPerPage,
        feedbackPage * feedbacksPerPage
    );
    return (
        <div className="p-6 space-y-6 bg-gray-100 min-h-screen">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 shadow rounded-2xl">
                    <div className="text-sm font-medium text-gray-600">Doanh số hôm nay</div>
                    <div className="mt-2 text-2xl font-bold">{today_revenue?.toLocaleString()} VND</div>
                </div>
                <div className="bg-white p-4 shadow rounded-2xl">
                    <div className="text-sm font-medium text-gray-600">Tổng doanh số tháng</div>
                    <div className="mt-2 text-2xl font-bold">{monthly_revenue?.toLocaleString()} VND</div>
                </div>
                <div className="bg-white p-4 shadow rounded-2xl">
                    <div className="text-sm font-medium text-gray-600">Tổng số dịch vụ</div>
                    <div className="mt-2 text-2xl font-bold">{total_bookings}</div>
                </div>
                <div className="bg-white p-4 shadow rounded-2xl">
                    <div className="text-sm font-medium text-gray-600">Tổng số khách hàng</div>
                    <div className="mt-2 text-2xl font-bold">{total_customers}</div>
                </div>
            </div>

            {/* Revenue Chart + Top Tours */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded-2xl col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Báo cáo doanh thu</h2>
                        <button className="px-3 py-1 border rounded text-sm">Xuất Excel</button>
                    </div>
                    <div className="bg-gray-50 p-2 rounded">
                        <RevenueChart data={generateFullMonthlyStats(dashboardData.monthly_stats)} />
                    </div>
                </div>

                {/* top 4 tour duoc quan tam */}
                <div className="bg-white p-4 shadow rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Top 4 Tour được yêu thích</h2>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="border text-sm px-2 py-1 rounded-2xl text-gray-600"
                        >
                            {timeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        {top_tours?.map((tour) => (
                            <div key={tour.id} className="flex gap-3 items-center">
                                <img
                                    src={tour.album?.[0]}
                                    alt={tour.name_tour}
                                    className="w-20 h-16 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{tour.name_tour}</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                                        <span
                                            className={`text-xs text-white px-2 py-0.5 rounded-2xl ${
                                            tour.rating_tour >= 4.5
                                                ? 'bg-green-600'
                                                : tour.rating_tour >= 3
                                                ? 'bg-yellow-500' 
                                                    : 'bg-red-600'
                                                        }`}
                                        >
                                            {tour.rating_tour?.toFixed(1)}
                                        </span>
                                        <span className="text-green-600 font-medium">Tuyệt vời</span>
                                        <span className="text-gray-500">| {tour.feedback_count} đánh giá</span>
                                        <span className="text-gray-500">| {tour.travel_tour_count} chuyến đi</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-sm text-gray-800 mt-4 cursor-pointer">
                        Xem tất cả Tour
                    </div>
                </div>
            </div>

            {/* Guides and Customer Reviews */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 shadow rounded-2xl col-span-2">
                    <div className="flex justify-between items-center mb-1">
                        <h2 className="text-lg font-semibold">Danh sách Hướng dẫn viên</h2>
                        <div className="text-sm text-gray-800 cursor-pointer hover:text-gray-700">Xem tất cả</div>
                    </div>

                    <div className="flex flex-wrap gap-4 items-center justify-between mt-2 mb-3">
                        <div className="flex gap-2">
                            <select
                                value={ratingFilter}
                                onChange={(e) => setRatingFilter(e.target.value)}
                                className="border text-sm px-2 py-1 rounded-2xl text-gray-600"
                            >
                                <option value="">Tất cả đánh giá</option>
                                <option value="5">5 sao</option>
                                <option value="4">4 sao</option>
                                <option value="3">3 sao</option>
                                <option value="2">2 sao</option>
                                <option value="1">1 sao</option>
                            </select>

                            <select
                                value={areaFilter}
                                onChange={(e) => setAreaFilter(e.target.value)}
                                className="border text-sm px-2 py-1 rounded-2xl text-gray-600"
                            >
                                <option value="">Khu vực</option>
                                {locations.map((loc) => (
                                    <option key={loc.id} value={loc.name_location}>
                                        {loc.name_location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                            <tr className="bg-gray-100 text-gray-700">
                                <th className="p-2">Tên Hướng dẫn viên</th>
                                <th className="p-2">Khu vực</th>
                                <th className="p-2">Lượng lịch trình</th>
                                <th className="p-2">Đánh giá</th>
                                <th className="p-2 text-right">Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedGuides.map((guide) => (
                                <tr key={guide.id} className="border-b hover:bg-gray-50">
                                    <td className="p-2">
                                        <div className="flex items-center gap-2">
                                            <img
                                                src={guide.user?.avatar || "/default-avatar.png"}
                                                alt="avatar"
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className="font-medium">{guide.user?.displayName}</div>
                                                <div className="text-xs text-gray-500">{guide.user?.email || "Chưa cập nhật"}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-2">{guide.GuideTours?.[0]?.group_name?.split(" ")[0] || "N/A"}</td>
                                    <td className="p-2">{guide.approved_tour_count}</td>
                                    <td className="p-2">
                                        <div className="flex text-yellow-500 text-lg">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <span key={i}>{i < guide.average_rating ? "★" : "☆"}</span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-2 text-right">⋯</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-center mt-4 gap-2">
                        {Array.from({ length: Math.ceil(filteredGuides.length / guidesPerPage) }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => setGuidePage(i + 1)}
                                className={`px-3 py-1 rounded border text-sm ${guidePage === i + 1 ? 'bg-gray-200 font-semibold' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-4 shadow rounded-2xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Tour ít được quan tâm</h2>
                        <select
                            value={timeRangeLow}
                            onChange={(e) => setTimeRangeLow(e.target.value)}
                            className="border text-sm px-2 py-1 -2xl text-gray-600"
                        >
                            {timeOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-3">
                        {dashboardData?.lowest_rated_tours?.map((tour) => (
                            <div key={tour.id} className="flex gap-3 items-center">
                                <img
                                    src={tour.album?.[0]}
                                    alt={tour.name_tour}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm truncate">{tour.name_tour}</div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1 flex-wrap">
                                        <span
                                            className={`text-xs text-white px-2 py-0.5 rounded-2xl ${
                                            (tour.rating_tour ?? 0) >= 4.5
                                            ? 'bg-green-600'
                                            : (tour.rating_tour ?? 0) >= 3
                                            ? 'bg-yellow-500'
                                            : 'bg-red-600'
                                            }`}
                                        >
                                            {(tour.rating_tour ?? 0).toFixed(1)}
                                        </span>
                                        <span className="text-red-600 font-medium">Chưa tốt</span>
                                        <span className="text-gray-500">| {tour.feedback_count} đánh giá</span>
                                        <span className="text-gray-500">| {tour.travel_tour_count} chuyến đi</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-sm text-gray-800 mt-4 cursor-pointer">
                        Xem tất cả Tour
                    </div>
                </div>
            </div>

            {/* Customer Reviews */}
            <div className="bg-white p-4 shadow rounded-2xl">
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
                        {paginatedFeedbacks.map((feedback, index) => (
                            <tr key={feedback.feedback_id} className="border-b">
                                <td className="p-2">{index + 1}</td>
                                <td className="p-2">{feedback.tour?.name_tour || "Chưa cập nhật"}</td>
                                <td className="p-2">{feedback.description_feedback}</td>
                                <td className="p-2">
                                    <div className="flex text-yellow-500 text-lg">
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <span key={i}>{i < feedback.rating ? "★" : "☆"}</span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                    {Array.from({ length: Math.ceil(feedbacks.length / feedbacksPerPage) }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => setFeedbackPage(i + 1)}
                            className={`px-3 py-1 rounded border text-sm ${feedbackPage === i + 1 ? 'bg-gray-200 font-semibold' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
