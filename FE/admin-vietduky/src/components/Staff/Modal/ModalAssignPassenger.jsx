import React, { useEffect, useState } from "react";
import {assignPassengersToGuide, getPassengersByTravelTourId} from "../../../services/API/passenger.service.js";
import {SlArrowDown, SlArrowUp} from "react-icons/sl";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalAssignPassenger({ tourId, guide, onClose }) {
    const [passengersByBooking, setPassengersByBooking] = useState([]);
    const [expandedBookings, setExpandedBookings] = useState([]);
    const [selectedPassengers, setSelectedPassengers] = useState({});
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchPassengers() {
            try {
                const data = await getPassengersByTravelTourId(tourId);
                const grouped = data.map((booking) => ({
                    booking_id: booking.booking_id,
                    label: `Mã đặt Tour: ${booking.booking_code}`,
                    passengers: booking.passengers.map((p, index) => ({
                        id: `${booking.booking_id}_${index}`,
                        original_id: p.id,
                        name: p.name,
                        birth_date: p.birth_date,
                        gender: p.gender ? "Nam" : "Nữ",
                        phone: p.phone_number,
                        age_group: classifyAge(p.birth_date),
                        single_room: !!p.single_room,
                    })),
                }));
                setPassengersByBooking(grouped);
            } catch (err) {
                console.error("Lỗi lấy danh sách hành khách:", err);
            }
        }

        fetchPassengers();
    }, [tourId]);

    const toggleExpand = (bookingId) => {
        setExpandedBookings((prev) =>
            prev.includes(bookingId)
                ? prev.filter((id) => id !== bookingId)
                : [...prev, bookingId]
        );
    };

    const toggleGroupSelection = (group) => {
        const allSelected = group.passengers.every((p) => selectedPassengers[p.id]);
        const newSelections = { ...selectedPassengers };
        group.passengers.forEach((p) => {
            newSelections[p.id] = !allSelected;
        });
        setSelectedPassengers(newSelections);
    };

    const togglePassenger = (id) => {
        setSelectedPassengers((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const classifyAge = (birthDateStr) => {
        try {
            const birth = new Date(birthDateStr);
            const age = new Date().getFullYear() - birth.getFullYear();
            if (age >= 12) return "Người lớn";
            if (age >= 5 && age <= 11) return "Trẻ em";
            if (age >= 2 && age <= 4) return "Trẻ nhỏ";
            if (age <= 2) return "Em bé";
            return "Không rõ";
        } catch {
            return "Không rõ";
        }
    };

    const handleAssign = async () => {
        const passengerIds = selectedStats.map((p) => p.original_id);
        if (!passengerIds.length) {
            toast.error("Vui lòng chọn ít nhất một hành khách.");
            return;
        }

        try {
            const res = await assignPassengersToGuide(guide.id, tourId, passengerIds);

            if (res.message?.includes("Một số hành khách")) {
                const conflictedNames = res.data?.map((p) => p.name).join(", ");
                toast.error(`Một số hành khách đã được phân công hướng dẫn viên khác:\n${conflictedNames}`);
            } else {
                toast.success("Phân công thành công!");
                onClose();
            }
        } catch (err) {
            const messageFromServer =
                err?.response?.data?.message ||
                err?.message ||
                "Đã xảy ra lỗi khi phân công.";
            toast.error(`${messageFromServer}`);
        }
    };

    const selectedStats = Object.entries(selectedPassengers)
        .filter(([, isSelected]) => isSelected)
        .map(([id]) => {
            for (const group of passengersByBooking) {
                const passenger = group.passengers.find((p) => p.id === id);
                if (passenger) return passenger;
            }
            return null;
        })
        .filter(Boolean);

    const total = selectedStats.length;
    const countByAge = {
        "Người lớn": 0,
        "Trẻ em": 0,
        "Trẻ nhỏ": 0,
        "Em bé": 0,
    };
    const countByGender = {
        "Nam": 0,
        "Nữ": 0,
    };

    selectedStats.forEach((p) => {
        if (countByAge[p.age_group] !== undefined) countByAge[p.age_group]++;
        if (countByGender[p.gender] !== undefined) countByGender[p.gender]++;
    });

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
            <div className="bg-white  w-4/5 h-5/6 rounded-xl shadow-lg flex flex-col">
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">Danh sách khách hàng</h2>
                        <h4 className="text-sm text-gray-600">Chỉ định khách hàng cho HDV</h4>

                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-2">
                        <h4 className="text-sm ml-2 font-semibold">Họ tên HDV</h4>
                        <h4 className="text-sm ml-2 font-semibold">Giới tính</h4>
                        <h4 className="text-sm ml-2 font-semibold">Ngày sinh</h4>
                        <h4 className="text-sm ml-2 font-semibold">Số điện thoại</h4>
                    </div>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                        {/* eslint-disable-next-line react/prop-types */}
                        <input className="border px-3 py-2 rounded-md text-sm text-gray-500" readOnly value={guide?.display_name || ""} placeholder="Họ tên HDV" />
                        {/* eslint-disable-next-line react/prop-types */}
                        <input className="border px-3 py-2 rounded-md text-sm text-gray-500" readOnly value={guide?.gender === "male" ? "Nam" : guide?.gender === "female" ? "Nữ" : "Khác"} placeholder="Giới tính" />
                        {/* eslint-disable-next-line react/prop-types */}
                        <input className="border px-3 py-2 rounded-md text-sm text-gray-500" readOnly value={guide?.birth_date || ""} placeholder="Ngày sinh" />
                        {/* eslint-disable-next-line react/prop-types */}
                        <input className="border px-3 py-2 rounded-md text-sm text-gray-500" readOnly value={guide?.phone || ""} placeholder="Số điện thoại" />
                    </div>
                    <input
                        type="text"
                        placeholder="Tìm kiếm hướng dẫn viên..."
                        className="border px-3 py-2 rounded-md text-sm w-64 mb-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <table className="w-full text-sm">
                        <thead className=" text-gray-500">
                        <tr>
                            <th className="p-2 text-left w-2/6">Họ tên khách hàng</th>
                            <th className="p-2">Ngày sinh</th>
                            <th className="p-2">Giới tính</th>
                            <th className="p-2">Độ tuổi</th>
                            <th className="p-2">Số điện thoại</th>
                            <th className="p-2">Phòng đơn</th>
                        </tr>
                        </thead>
                        <tbody>
                        {passengersByBooking.map((group) => (
                            <React.Fragment key={group.booking_id}>
                                <tr
                                    className=" cursor-pointer border-t  transition w-full"
                                    onClick={() => toggleExpand(group.booking_id)}
                                >
                                    <td className="p-2 font-medium text-gray-700 flex items-center gap-2 w-25" colSpan={6}>
                                        <input
                                            type="checkbox"
                                            className="accent-red-600"
                                            checked={group.passengers.every((p) => selectedPassengers[p.id])}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleGroupSelection(group);
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                        <span>{group.label}</span>
                                        <span className="ml-auto text-sm text-gray-400">
                                            {expandedBookings.includes(group.booking_id) ? <SlArrowDown /> : <SlArrowUp />}
                                        </span>
                                    </td>
                                </tr>

                                {expandedBookings.includes(group.booking_id) &&
                                    group.passengers.map((p) => (
                                        <tr key={p.id} className="border-t hover:bg-gray-50">
                                            <td className="p-2 flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    className="accent-red-600"
                                                    checked={!!selectedPassengers[p.id]}
                                                    onChange={() => togglePassenger(p.id)}
                                                />
                                                {p.name}
                                            </td>
                                            <td className="p-2 text-center">{p.birth_date}</td>
                                            <td className="p-2 text-center">{p.gender}</td>
                                            <td className="p-2 text-center">{p.age_group}</td>
                                            <td className="p-2 text-center">{p.phone}</td>
                                            <td className="p-2 text-center">
                                                <input type="checkbox"
                                                       className="accent-red-700"
                                                       checked={p.single_room} />
                                            </td>
                                        </tr>
                                    ))}
                            </React.Fragment>
                        ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex items-center justify-between gap-2 border-t p-4">
                    <div className="text-sm text-gray-700 font-semibold">
                        Tổng số KH: {total} ({countByAge["Người lớn"]} người lớn / {countByAge["Trẻ em"]} trẻ em / {countByAge["Trẻ nhỏ"]} trẻ nhỏ / {countByAge["Em bé"]} em bé) – {countByGender["Nam"]} nam {countByGender["Nữ"]} nữ
                    </div>
                   <div>
                       <button onClick={onClose} className="border border-gray-300 mr-2 px-4 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100">
                           Hủy
                       </button>
                       <button
                           onClick={handleAssign}
                           className="bg-[#A31627] text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
                       >
                           Phân công
                       </button>

                   </div>
                </div>
            </div>
        </div>
    );
}
