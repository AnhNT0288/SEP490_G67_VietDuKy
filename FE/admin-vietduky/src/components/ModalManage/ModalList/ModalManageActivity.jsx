import { useEffect, useState } from "react";
import { HiOutlineInbox } from "react-icons/hi";
import ModalAddActivity from "../ModalAdd/ModalAddActivity.jsx";
import { deleteTourActivity } from "../../../services/API/activity_tour.service.js";

// eslint-disable-next-line react/prop-types
function ModalActivityDetail({ activity, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-semibold mb-4">Chi tiết hoạt động</h2>
                {/* eslint-disable-next-line react/prop-types */}
                <p><strong>Tiêu đề:</strong> {activity.title}</p>
                {/* eslint-disable-next-line react/prop-types */}
                <p><strong>Mô tả:</strong> {activity.description}</p>
                {/* eslint-disable-next-line react/prop-types */}
                <p className="mb-4"><strong>Chi tiết:</strong> {activity.detail}</p>
                {/* eslint-disable-next-line react/prop-types */}
                {activity.image && (
                    <img
                        src={activity.image}
                        alt={activity.title}
                        className="w-full h-64 object-cover rounded shadow mb-4"
                    />
                )}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-gray-300 px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line react/prop-types
export default function ModalManageActivity({ tour, onClose }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const [selectedActivity, setSelectedActivity] = useState(null);

    useEffect(() => {
        // eslint-disable-next-line react/prop-types
        if (tour?.activities) {
            // eslint-disable-next-line react/prop-types
            setActivities(tour.activities);
        }
    }, [tour]);

    const toggleModal = () => setIsModalOpen(!isModalOpen);

    const handleAddActivity = (activitiesAdded) => {
        if (Array.isArray(activitiesAdded)) {
            setActivities((prev) => [...prev, ...activitiesAdded]);
        } else {
            setActivities((prev) => [...prev, activitiesAdded]);
        }
    };

    const handleDeleteActivity = async (activityId) => {
        if (!activityId) return;

        const confirmDelete = window.confirm("Bạn có chắc chắn muốn xoá chương trình này?");
        if (!confirmDelete) return;

        try {
            await deleteTourActivity(activityId);
            setActivities((prev) => prev.filter((item) => item.id !== activityId));
            alert("Đã xoá chương trình thành công.");
        } catch (error) {
            console.error("Lỗi khi xoá chương trình:", error);
            alert("Xoá chương trình thất bại.");
        }
    };

    const handleTitleClick = (activity) => {
        setSelectedActivity(activity);
    };

    const closeDetailModal = () => {
        setSelectedActivity(null);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-6/7" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold mt-2">Chương trình Tour</h2>
                        {/* eslint-disable-next-line react/prop-types */}
                        <h2 className="text-md">{tour?.name_tour}</h2>
                    </div>
                    <button
                        type="button"
                        className="bg-red-700 text-white px-4 py-2 rounded-md"
                        onClick={toggleModal}
                    >
                        Thêm chương trình
                    </button>
                </div>

                <div className="relative mb-4">
                    <div className="mt-2 bg-white max-h-[60vh] overflow-y-auto rounded-lg border">
                        <table className="w-full border-collapse text-md">
                            <thead className="bg-gray-100">
                                <tr className="text-gray-700 text-left">
                                    <th className="p-3 font-medium">Ảnh</th>
                                    <th className="p-3 font-medium">Ngày</th>
                                    <th className="p-3 font-medium">Tiêu đề</th>
                                    <th className="p-3 font-medium text-center">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {activities.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="p-6 text-center">
                                            <div className="flex flex-col items-center h-[160px]">
                                                <div className="p-4 bg-gray-100 rounded-full mb-2">
                                                    <HiOutlineInbox className="text-4xl text-gray-600" />
                                                </div>
                                                <p className="text-gray-600 text-md">Chưa có hành trình nào</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    activities.map((prog, idx) => (
                                        <tr
                                            key={prog.id || idx}
                                            className="border-t hover:bg-gray-50 transition-all"
                                        >
                                            <td className="p-3">
                                                <img
                                                    src={prog.image || prog.preview}
                                                    alt={prog.title}
                                                    className="w-28 h-20 object-cover rounded shadow"
                                                />
                                            </td>
                                            <td className="p-3 font-semibold">{prog.title}</td>
                                            <td
                                                className="p-3  cursor-pointer hover:underline"
                                                onClick={() => handleTitleClick(prog)}
                                            >
                                                {prog.description}
                                            </td>
                                            <td className="p-3 text-center">
                                                <button
                                                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                                                    onClick={() => handleDeleteActivity(prog.id)}
                                                >
                                                    Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {isModalOpen && (
                        <ModalAddActivity
                            onClose={toggleModal}
                            onAddTravelTour={handleAddActivity}
                            tour={tour}
                        />
                    )}

                    {selectedActivity && (
                        <ModalActivityDetail
                            activity={selectedActivity}
                            onClose={closeDetailModal}
                        />
                    )}
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        className="bg-gray-300 px-4 py-2 rounded-md"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    );
}