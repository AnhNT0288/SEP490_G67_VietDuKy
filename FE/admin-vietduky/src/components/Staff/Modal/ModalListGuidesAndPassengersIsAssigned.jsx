import { useEffect, useState } from "react";
import { format } from "date-fns";
import {getGuidesAndPassengersByTravelTourId} from "../../../services/API/travel_tour.service.js";

// eslint-disable-next-line react/prop-types
export default function ModalListGuidesAndPassengersIsAssigned({ travelTourId, onClose }) {
    const [groups, setGroups] = useState([]);
    const [expandedGuides, setExpandedGuides] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!travelTourId) return;
        getGuidesAndPassengersByTravelTourId(travelTourId)
            .then((data) => {
                setGroups(data || []);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy danh sách guide/passenger:", err);
            })
            .finally(() => setLoading(false));
    }, [travelTourId]);

    const toggleGuide = (guideId) => {
        setExpandedGuides((prev) =>
            prev.includes(guideId) ? prev.filter((id) => id !== guideId) : [...prev, guideId]
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center" onClick={onClose}>
            <div className="bg-white w-4/5 h-5/6 rounded-xl shadow-lg flex flex-col" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 overflow-y-auto flex-1">
                    <h2 className="text-2xl font-bold mb-6 text-center">Danh sách Hướng Dẫn Viên & Khách Hàng</h2>

                    {loading ? (
                        <p className="text-center">Đang tải dữ liệu...</p>
                    ) : groups.length === 0 ? (
                        <p className="text-center text-gray-500">Không có nhóm nào cả.</p>
                    ) : (
                        groups.map((group, index) => (

                            <div key={index} className="mb-8">
                                <h3 className="text-lg font-semibold mb-2">
                                    {group.group === "ungrouped" ? "" : `Nhóm ${group.group}`}
                                </h3>

                                {group.guides.length > 0 ? (
                                    <div className="space-y-4">
                                        {group.guides.map((g) => (
                                            <div key={g.id}>
                                                <div
                                                    onClick={() => toggleGuide(g.id)}
                                                    className="cursor-pointer p-2 bg-gray-50 rounded-md hover:bg-gray-100 flex justify-between items-center"
                                                >
                                                    <div className="grid grid-cols-4 gap-4">
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={`${g.travelGuide?.first_name || ""} ${g.travelGuide?.last_name || ""}`}
                                                            className="border px-3 py-1 rounded-md text-md bg-gray-50"
                                                            placeholder="Họ tên"
                                                        />
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={g.travelGuide?.gender_guide === "male" ? "Nam" : g.travelGuide?.gender_guide === "female" ? "Nữ" : "Khác"}
                                                            className="border px-3 py-1 rounded-md text-md bg-gray-50"
                                                            placeholder="Giới tính"
                                                        />
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={g.travelGuide?.birth_date ? format(new Date(g.travelGuide.birth_date), "dd/MM/yyyy") : ""}
                                                            className="border px-3 py-1 rounded-md text-md bg-gray-50"
                                                            placeholder="Ngày sinh"
                                                        />
                                                        <input
                                                            type="text"
                                                            readOnly
                                                            value={g.travelGuide?.number_phone || ""}
                                                            className="border px-3 py-1 rounded-md text-md bg-gray-50"
                                                            placeholder="Số điện thoại"
                                                        />
                                                    </div>
                                                    <span>{expandedGuides.includes(g.id) ? "-" : "+"}</span>
                                                </div>

                                                {expandedGuides.includes(g.id) && (
                                                    <div>
                                                        {/* Danh sách khách hàng */}
                                                        {group.passengers.length > 0 ? (
                                                            <table className="w-full text-sm">
                                                                <thead>
                                                                <tr className="text-gray-500">
                                                                    <th className="p-2 text-left">Tên khách hàng</th>
                                                                    <th className="p-2 text-left">Ngày sinh</th>
                                                                    <th className="p-2 text-left">Giới tính</th>
                                                                    <th className="p-2 text-left">Số điện thoại</th>
                                                                </tr>
                                                                </thead>
                                                                <tbody>
                                                                {group.passengers.map((p) => (
                                                                    <tr key={p.id} className="border-t">
                                                                        <td className="p-2">{p.name || "-"}</td>
                                                                        <td className="p-2">
                                                                            {p.birth_date && !isNaN(new Date(p.birth_date))
                                                                                ? format(new Date(p.birth_date), "dd/MM/yyyy")
                                                                                : "-"
                                                                            }
                                                                        </td>                                                                        <td className="p-2">{p.gender ? "Nam" : "Nữ"}</td>
                                                                        <td className="p-2">{p.phone_number || "-"}</td>
                                                                    </tr>
                                                                ))}
                                                                </tbody>
                                                            </table>
                                                        ) : (
                                                            <p className="text-gray-500 pl-4">Không có khách hàng.</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500"></p>
                                )}
                            </div>
                        ))
                    )}
                </div>

                <div className="border-t p-4 flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}
