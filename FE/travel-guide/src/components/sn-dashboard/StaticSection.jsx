import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { getGuideTourStatistics } from "../../services/API/guide-tour.service";

const StaticSection = ({ guideId }) => {
    const [stats, setStats] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStatistics = async (month) => {
        try {
            setLoading(true);
            const data = await getGuideTourStatistics(guideId, month ? { month } : {});
            setStats(data.data);
        } catch (error) {
            console.error("Lỗi khi fetch thống kê:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (guideId) {
            fetchStatistics(selectedMonth ?? undefined);
        }
    }, [guideId, selectedMonth]);

    const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1);

    const statList = stats
        ? [
            {
                title: "Lịch trình hiện có",
                value: stats.currentSchedule,
                compare: stats.comparison?.currentScheduleCompare ?? 0,
            },
            {
                title: "Lịch trình đã hoàn thành",
                value: stats.completedSchedule,
                compare: stats.comparison?.completedScheduleCompare ?? 0,
            },
            {
                title: "Lịch trình đang chờ",
                value: stats.pendingSchedule,
                compare: stats.comparison?.pendingScheduleCompare ?? 0,
            },
            {
                title: "Lịch trình đã hủy",
                value: stats.cancelledSchedule,
                compare: stats.comparison?.cancelledScheduleCompare ?? 0,
            },
        ]
        : [];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold">Thống kê tổng quan</h2>
                <select
                    className="border rounded-md px-3 py-1 text-sm"
                    value={selectedMonth ?? ""}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSelectedMonth(value ? Number(value) : null);
                    }}
                >
                    <option value="">Tháng hiện tại</option>
                    {monthOptions.map((month) => (
                        <option key={month} value={month}>
                            Tháng {month}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p>Đang tải dữ liệu...</p>
            ) : statList.length === 0 ? (
                <p className="text-gray-500 italic">Không có dữ liệu thống kê cho tháng này.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {statList.map((stat, index) => {
                        const isPositive = stat.compare >= 0;
                        const arrowClass = isPositive
                            ? "border-green-800 bg-green-50 text-green-800"
                            : "border-red-800 bg-red-50 text-red-800";
                        const ArrowIcon = isPositive ? TrendingUp : () => (
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 18l9.5-9.5 5 5L23 5" />
                            </svg>
                        );

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-2xl py-4 px-4 sm:px-5 lg:px-10 flex flex-col gap-2"
                            >
                                <h3 className="text-base sm:text-lg font-medium">{stat.title}</h3>
                                <div className="flex flex-row justify-between items-center">
                                    <h2 className="text-xl sm:text-2xl font-semibold">{stat.value}</h2>
                                    <div className={`border rounded-full px-2 py-0.5 flex flex-row gap-2 items-center ${arrowClass}`}>
                                        <p className="text-xs sm:text-sm font-medium">
                                            {isPositive ? "+" : ""}
                                            {stat.compare}
                                        </p>
                                        <ArrowIcon />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StaticSection;
