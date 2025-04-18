import TextEditor from "../../../lib/TextEditor.jsx";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import { HiOutlineInbox } from "react-icons/hi";
import { fetchLocations, fetchServices, fetchTypeTours } from "../../../services/service.js";
import ModalAddActivity from "../ModalAdd/ModalAddActivity.jsx";
import { createTour, updateTour, getTourById } from "../../../services/API/tour.service.js";
import Select from "react-select";

// eslint-disable-next-line react/prop-types
export default function ModalUpdateTour({ mode = "update", tourId = null, onClose, onCreateSuccess }) {
    const [locations, setLocations] = useState([]);
    const [services, setServices] = useState([]);
    const [typeTours, setTypeTours] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [previewImages, setPreviewImages] = useState([]);
    const [removedImageUrls, setRemovedImageUrls] = useState([]);
    const [tourData, setTourData] = useState({
        code_tour: "",
        name_tour: "",
        price_tour: "",
        day_number: "",
        max_people: "10",
        activity_description: "",
        start_location: "",
        end_location: "",
        available_month: "3",
        type_id: "",
        service_id: [],
        rating_tour: "5",
        album: [],
        travel_tours: [],
        activities: []
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locs, servs, types] = await Promise.all([
                    fetchLocations(),
                    fetchServices(),
                    fetchTypeTours()
                ]);
                setLocations(locs);
                setServices(servs);
                setTypeTours(types);

                if (mode === "update" && tourId) {
                    const tour = await getTourById(tourId);
                    console.log("Dữ liệu tour:", tour);
                    setTourData({
                        code_tour: tour.code_tour ||"",
                        name_tour: tour.name_tour || "",
                        price_tour: tour.price_tour || "",
                        day_number: tour.day_number || "",
                        max_people: tour.max_people || "10",
                        activity_description: tour.activity_description || "",
                        start_location: tour.start_location || "",
                        end_location: tour.end_location || "",
                        available_month: tour.available_month || "3",
                        type_id: tour.type_id || tour.typeTour?.id || "",
                        service_id: tour.services?.map((s) => String(s.id)) || [],
                        rating_tour: tour.rating_tour || "5",
                        album: [],
                        travel_tours: tour.travel_tours || [],
                        activities: tour.activities || [],
                    });
                    let preview = [];
                    try {
                        if (typeof tour.album === "string") {
                            const urlMatches = tour.album.match(/https?:\/\/[^,\s"]+/g);
                            if (Array.isArray(urlMatches)) {
                                preview = urlMatches;
                            }
                        }
                    } catch (e) {
                        console.warn("Không thể parse album:", e, "\nAlbum gốc:", tour.album);
                    }

                    setPreviewImages(preview);
                }
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
                alert("Không thể tải thông tin tour hoặc danh mục!");
            }
        };
        fetchData();
    }, [mode, tourId]);

    const handleRemoveImage = (index) => {
        const imageToRemove = previewImages[index];
        const isOldImage = imageToRemove.startsWith("http");

        if (isOldImage) {
            setRemovedImageUrls((prev) => [...prev, imageToRemove]);
        } else {
            const fileIndex = tourData.album.findIndex(
                (file) => URL.createObjectURL(file) === imageToRemove
            );

            if (fileIndex !== -1) {
                setTourData((prev) => ({
                    ...prev,
                    album: prev.album.filter((_, i) => i !== fileIndex),
                }));
            }
        }

        setPreviewImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDeleteActivity = (activityId) => {
        if (!activityId) return;
        const confirm = window.confirm("Bạn có chắc chắn muốn xoá chương trình này?");
        if (!confirm) return;

        setTourData((prev) => ({
            ...prev,
            activities: prev.activities.filter((item) => item.id !== activityId),
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (content) => {
        setTourData((prev) => ({ ...prev, activity_description: content }));
    };

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files);
        if (newFiles.length > 0) {
            // Gán vào album (chỉ file)
            setTourData((prev) => ({
                ...prev,
                album: [...(Array.isArray(prev.album) ? prev.album : []), ...newFiles],
            }));

            // Gán vào preview
            setPreviewImages((prev) => [
                ...prev,
                ...newFiles.map((file) => URL.createObjectURL(file)),
            ]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tourData.activity_description.trim()) {
            alert("Vui lòng nhập mô tả hành trình!");
            return;
        }

        try {
            const formData = new FormData();

            // Add normal fields
            Object.entries(tourData).forEach(([key, value]) => {
                if (key === "activities") {
                    formData.append("activities", JSON.stringify(value));
                } else if (key === "album") {
                    // Chỉ thêm file
                    value.forEach((file) => {
                        if (file instanceof File) {
                            formData.append("album", file);
                        }
                    });
                } else if (key === "service_id") {
                    // Gửi nhiều field `service_ids`
                    value.forEach((id) => {
                        formData.append("service_ids", id);
                    });
                } else {
                    // Gửi bình thường
                    if (value !== null && value !== undefined) {
                        formData.append(key, value);
                    }
                }
            });

            // Thêm các URL ảnh cũ bị xoá
            if (removedImageUrls.length > 0) {
                formData.append("removed_urls", JSON.stringify(removedImageUrls));
            }

            // Gửi dữ liệu
            const response = mode === "update"
                ? await updateTour(tourId, formData)
                : await createTour(formData);

            const id = response?.tour?.id || tourId;
            if (id) {
                alert(`${mode === "update" ? "Cập nhật" : "Tạo"} Tour thành công!`);
                onCreateSuccess?.(id);
                onClose();
            } else {
                alert(`${mode === "update" ? "Cập nhật" : "Tạo"} Tour thất bại!`);
            }
        } catch (error) {
            console.error("Lỗi cập nhật tour:", error);
            if (error.response) {
                console.error("Server response:", error.response.data);
                alert(`Lỗi từ server: ${error.response.data.message || "Không xác định"}`);
            } else {
                alert(`Lỗi: ${error.message}`);
            }
        }
    };
    const toggleModal = () => {
        setIsModalOpen(!isModalOpen);
    };

    const handleAddActivity = (activitiesAdded) => {
        const newList = Array.isArray(activitiesAdded) ? activitiesAdded : [activitiesAdded];
        setTourData((prev) => ({
            ...prev,
            activities: [...prev.activities, ...newList],
        }));

        alert("Tạo chương trình tour thành công!");
        setIsModalOpen(false); // ✅ Chỉ đóng modal thêm, giữ nguyên ModalUpdateTour
    };

    const handleWrapperClick = () => {
        onClose();
    };

    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center" onClick={handleWrapperClick}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-5/7" onClick={handleModalClick}>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6">
                        {/* Cột trái */}
                        <div className="w-2/5">
                            <h2 className="text-lg font-semibold">Thêm Tour du lịch</h2>
                            <h6 className="text-sm mb-4 text-SmokyGray">
                                Quản trị viên thêm Tour du lịch mới
                            </h6>

                            {/* Mã Tour */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Mã Tour
                            </label>
                            <input
                                type="text"
                                name="name_tour"
                                value={tourData.code_tour}
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Mã Tour"
                                disabled
                            />

                            {/* Tên Tour */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Tên Tour
                            </label>
                            <input
                                type="text"
                                name="name_tour"
                                className="w-full p-2 border rounded mb-4 "
                                placeholder="Nhập tên tour"
                                value={tourData.name_tour}
                                onChange={handleChange}
                                required
                            />

                            <div className="flex items-center gap-4">
                                {/* Điểm khởi hành */}
                                <div>
                                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                        Điểm khởi hành
                                    </label>
                                    <select
                                        name="start_location"
                                        className="w-[250px] p-2 border rounded text-gray-600"
                                        value={tourData.start_location}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Chọn điểm khởi hành
                                        </option>
                                        {locations.map((location) => (
                                            <option key={location.id} value={location.id}>
                                                {location.name_location}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Mũi tên */}
                                <FaArrowRight className="text-gray-400 text-lg" />

                                {/* Điểm đến */}
                                <div>
                                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                        Điểm đến
                                    </label>
                                    <select
                                        name="end_location"
                                        className="w-[250px] p-2 border rounded text-gray-600"
                                        value={tourData.end_location}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Chọn điểm đến
                                        </option>
                                        {locations.map((location) => (
                                            <option key={location.id} value={location.id}>
                                                {location.name_location}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Số ngày */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Số ngày
                            </label>
                            <input
                                type="number"
                                name="day_number"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Nhập số ngày"
                                value={tourData.day_number}
                                onChange={handleChange}
                                required
                            />

                            {/* Giá tour */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Giá tour
                            </label>
                            <input
                                type="number"
                                name="price_tour"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Nhập giá tour"
                                value={tourData.price_tour}
                                onChange={handleChange}
                                required
                            />

                            {/* loại Tour */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Loại Tour
                            </label>
                            <select
                                name="type_id"
                                value={tourData.type_id}
                                onChange={(e) => {
                                    setTourData((prev) => ({
                                        ...prev,
                                        type_id: e.target.value,
                                    }));
                                }}
                                required
                                className="w-full p-2 border rounded text-gray-600"
                            >
                                <option value="" disabled>
                                    Chọn loại Tour
                                </option>
                                {typeTours.length > 0 ? (
                                    typeTours.map((typeTours) => (
                                        <option key={typeTours.id} value={typeTours.id}>
                                            {typeTours.name_type}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Không có loại Tour</option>
                                )}
                            </select>

                            {/* Dịch vụ */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Dịch vụ
                            </label>
                            <Select
                                isMulti
                                isSearchable
                                placeholder="Chọn dịch vụ kèm theo"
                                className="w-full"
                                options={services.map((service) => ({
                                    value: String(service.id),
                                    label: service.name_service,
                                }))}
                                value={tourData.service_id.map((id) => {
                                    const service = services.find((s) => String(s.id) === String(id));
                                    return {
                                        value: String(id),
                                        label: service?.name_service || 'Không tìm thấy',
                                    };
                                })}
                                onChange={(selectedOptions) => {
                                    const selectedIds = selectedOptions.map((option) => option.value);
                                    setTourData((prev) => ({
                                        ...prev,
                                        service_id: selectedIds,
                                    }));
                                }}
                            />

                            {/* Ảnh minh họa */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Ảnh bìa
                            </label>
                            <div
                                className="w-full h-36 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100 transition"
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    const newFiles = Array.from(e.dataTransfer.files);
                                    if (newFiles.length > 0) {
                                        setTourData((prev) => ({
                                            ...prev,
                                            album: [...(Array.isArray(prev.album) ? prev.album : []), ...newFiles],
                                        }));
                                        setPreviewImages((prev) => [
                                            ...prev,
                                            ...newFiles.map((file) => URL.createObjectURL(file)),
                                        ]);
                                    }
                                }}
                                onClick={() => document.getElementById("fileInput")?.click()}
                            >
                                {previewImages.length > 0 ? (
                                    <div className="flex gap-2 overflow-x-auto">
                                        {previewImages.slice(0, 3).map((src, index) => {
                                            const remaining = previewImages.length - 3;
                                            return (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={src}
                                                        alt={`Ảnh ${index + 1}`}
                                                        className="h-36 w-auto object-cover rounded"
                                                    />

                                                    {index === 2 && remaining > 0 && (
                                                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold rounded">
                                                            +{remaining}
                                                        </div>
                                                    )}

                                                    <button
                                                        type="button"
                                                        className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded px-2 text-sm hidden group-hover:block"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleRemoveImage(index);
                                                        }}
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <span>Kéo & thả ảnh Tour tại đây (.png .jpg .jpeg)</span>
                                )}
                            </div>

                            <input
                                type="file"
                                id="fileInput"
                                accept=".png,.jpg,.jpeg"
                                multiple
                                className="hidden"
                                onChange={handleFileChange}
                            />


                        </div>

                        {/* Cột phải */}
                        <div className="w-3/5">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <label className="font-medium">
                                            Chương trình Tour
                                        </label>
                                    </div>
                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            className="bg-red-700 text-white px-4 py-2 rounded-md"
                                            onClick={toggleModal}
                                        >
                                            Thêm chương trình
                                        </button>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="mt-4 mb-4 bg-white max-h-[250px] overflow-y-auto rounded-lg border">
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
                                            {tourData.activities.length === 0 ? (
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
                                                tourData.activities.map((prog, idx) => (
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
                                                        <td className="p-3 font-semibold">{prog.day}</td>
                                                        <td className="p-3">{prog.title}</td>
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
                                            tour={{ id: tourId, name_tour: tourData.name_tour }}
                                        />
                                    )}

                                </div>
                            </div>
                            <div>
                                <label className="block mb-2 font-medium">
                                    Mô tả hành trình
                                </label>
                                <TextEditor
                                    value={tourData.activity_description}
                                    onChange={handleEditorChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Button Actions */}
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
                            {mode === "update" ? "Cập nhật Tour" : "Tạo Tour mới"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
