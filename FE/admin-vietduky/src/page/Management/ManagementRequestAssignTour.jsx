import {useEffect, useRef, useState} from "react";
import {
    approveGuideAssignRequest,
    getPendingAssignRequests,
    rejectGuideAssignRequest
} from "../../services/API/guide_tour.service";
import { formatDate } from "../../utils/dateUtil";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import DropdownRequest from "../../components/Dropdown/DropdownRequest.jsx";

export default function ManagementRequestAssignTour() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [dropdownOpenId, setDropdownOpenId] = useState(null);
    const ITEMS_PER_PAGE = 12;
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpenId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const res = await getPendingAssignRequests();
            if (res?.data) {
                setRequests(res.data);
            }
        } catch (error) {
            console.error("Lỗi khi tải danh sách yêu cầu:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const filteredRequests = requests.filter((item) => {
        const tourName = item.travelTour?.Tour?.name_tour || "";
        const guideName = item.travelGuide
            ? `${item.travelGuide.first_name} ${item.travelGuide.last_name}`
            : "";
        return (
            tourName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
            guideName.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    });

    const totalPages = Math.ceil(filteredRequests.length / ITEMS_PER_PAGE);
    const indexOfLast = currentPage * ITEMS_PER_PAGE;
    const indexOfFirst = indexOfLast - ITEMS_PER_PAGE;
    const currentData = filteredRequests.slice(indexOfFirst, indexOfLast);

    const handleAction = async (item, action) => {
        try {
            if (action === "accept") {
                await approveGuideAssignRequest(item.id);
                item.status = 1;
            } else if (action === "reject") {
                await rejectGuideAssignRequest(item.id);
                item.status = 2;
            }

            setRequests((prev) =>
                prev.map((req) => (req.id === item.id ? { ...req, status: item.status } : req))
            );
        } catch (err) {
            console.error("Lỗi khi xử lý yêu cầu:", err);
        } finally {
            setDropdownOpenId(null);
        }
    };
    return (
        <div title="Yêu cầu phân công HDV">
            <div className="bg-white p-4 rounded-md flex flex-wrap gap-4 items-center justify-between">
                <div className="relative flex-1 w-full sm:w-auto">
                    <input
                        type="text"
                        placeholder="Tìm kiếm tour hoặc HDV"
                        className="pl-4 pr-4 py-2 border rounded-md w-full"
                        value={searchKeyword}
                        onChange={(e) => {
                            setSearchKeyword(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
            </div>

            <div className="mt-4 bg-white p-4 overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-SmokyGray border-b ">
                        <th className="p-2 text-left">STT</th>
                        <th className="p-2 text-left">Tên Tour</th>
                        <th className="p-2 text-left">Thời gian</th>
                        <th className="p-2 text-left">Hướng dẫn viên</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Trạng thái</th>
                        <th className="p-2 text-right">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={6} className="p-4 text-center text-gray-500">
                                Đang tải dữ liệu...
                            </td>
                        </tr>
                    ) : currentData.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="p-4 text-center text-gray-500">
                                Không có yêu cầu nào phù hợp.
                            </td>
                        </tr>
                    ) : (
                        currentData.map((item, index) => {
                            const tour = item.travelTour?.Tour;
                            const guide = item.travelGuide;
                            return (
                                <tr key={item.id} className="border-t hover:bg-gray-50 relative">
                                    <td className="p-2">{indexOfFirst + index + 1}</td>
                                    <td className="p-2">
                                        {tour
                                            ? `${tour.name_tour} (${tour.code_tour})`
                                            : "Chưa cập nhật"}
                                    </td>
                                    <td className="p-2">
                                        {formatDate(item.travelTour?.start_day)} -{" "}
                                        {formatDate(item.travelTour?.end_day)}
                                    </td>
                                    <td className="p-2">
                                        {guide
                                            ? `${guide.first_name} ${guide.last_name}`
                                            : "Chưa có"}
                                    </td>
                                    <td className="p-2">
                                        {guide?.email || "Chưa có"}
                                    </td>
                                    <td className="p-2">
                                        {item.status === 1 ? (
                                            <span className="text-green-600 font-semibold">Đã chấp nhận</span>
                                        ) : item.status === 2 ? (
                                            <span className="text-red-600 font-semibold">Đã từ chối</span>
                                        ) : (
                                            <span className="text-yellow-600 font-medium">Chưa duyệt</span>
                                        )}
                                    </td>
                                    <td className="p-2 text-right relative">
                                        <DropdownRequest
                                            requestId={item.id}
                                            isOpen={dropdownOpenId === item.id}
                                            setOpenDropdown={setDropdownOpenId}
                                            onApprove={() => handleAction(item, "accept")}
                                            onReject={() => handleAction(item, "reject")}
                                        />
                                    </td>
                                </tr>
                            );
                        })
                    )}
                    </tbody>
                </table>

                {/* Pagination giống mẫu ManagementTour */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-4">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                className={`px-3 py-1 border rounded ${
                                    page === currentPage
                                        ? "bg-red-600 text-white"
                                        : "bg-white text-gray-700"
                                }`}
                                onClick={() => setCurrentPage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
