import { useEffect, useState } from "react";
import Select from "react-select";
import { getLocations } from "../../../services/API/location.service";
import { updateTravelGuide } from "../../../services/API/accounts.services";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalUpdateUser({ onClose, user, refreshUserList }) {
    const [locations, setLocations] = useState([]);
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [roleId, setRoleId] = useState(null);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const data = await getLocations();
                setLocations(data.map((location) => ({
                    value: location.id,
                    label: location.name_location,
                })));
            } catch (error) {
                console.error("Error fetching locations:", error);
            }
        };

        fetchLocations();
    }, []);

    const handleLocationChange = (selectedOptions) => {
        setSelectedLocations(selectedOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const locationIds = selectedLocations.map((location) => location.value);

        try {
            await updateTravelGuide(user.id, {
                locations: locationIds,
                role_id: roleId,
            });

            toast.success("Cập nhật thành công!");
            onClose();
            refreshUserList();
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const getRoleLabel = (roleId) => {
        switch (roleId) {
            case 1: return "Người dùng";
            case 2: return "Nhân viên";
            case 3: return "Admin";
            case 4: return "Hướng dẫn viên";
            default: return "Không xác định";
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={onClose}>
            <div className="bg-white rounded-md shadow-lg w-2/5 p-6" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6">
                        <div className="w-full">
                            <h2 className="text-lg font-semibold">Cập nhật quyền người dùng</h2>
                            <h6 className="text-sm mb-4 text-SmokyGray">
                                Quản trị viên cập nhật quyền người dùng
                            </h6>

                            <label className="block mb-2 font-medium">Tên người dùng</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full p-2 border rounded mb-4"
                                value={user?.displayName || ""}
                                readOnly
                            />

                            <label className="block mb-2 font-medium">Email</label>
                            <input
                                type="email"
                                name="email"
                                className="w-full p-2 border rounded mb-4"
                                value={user?.email || ""}
                                readOnly
                            />

                            <label className="block mb-2 font-medium">Chọn địa điểm</label>
                            <Select
                                isMulti
                                options={locations}
                                value={selectedLocations}
                                onChange={handleLocationChange}
                                className="w-full mb-2"
                                placeholder="Chọn địa điểm"
                                isSearchable
                            />

                            <label className="block mb-2 font-medium">Quyền</label>
                            <Select
                                options={[
                                    { value: 1, label: "Người dùng" },
                                    { value: 2, label: "Nhân viên" },
                                    { value: 3, label: "Admin" },
                                    { value: 4, label: "Hướng dẫn viên" },
                                ]}
                                value={
                                    roleId
                                        ? { value: roleId, label: getRoleLabel(roleId) }
                                        : null
                                }
                                onChange={(option) => setRoleId(option.value)}
                                className="w-full mb-4"
                                placeholder="Chọn quyền"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                        <button
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded-md"
                            onClick={onClose}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="bg-red-700 text-white px-4 py-2 rounded-md"
                        >
                            Cập nhật
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
