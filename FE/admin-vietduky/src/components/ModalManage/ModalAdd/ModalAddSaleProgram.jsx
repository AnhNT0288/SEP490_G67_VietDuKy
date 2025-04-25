import {useEffect, useState} from "react";
import {FaArrowRight} from "react-icons/fa";
import TextEditor from "../../../lib/TextEditor.jsx";
import {fetchLocations, fetchServices, fetchTypeTours} from "../../../services/service.js";
import {createTour} from "../../../services/API/tour.service.js";
import {toast} from "react-toastify";

export default function ModalAddSaleProgram({ onClose }) {
    const [locations, setLocations] = useState([]);
    const [services, setServices] = useState([]);
    const [typeTours, setTypeTours] = useState([]);
    const [tourData, setTourData] = useState({
        name_tour: "",
        price_tour: "",
        day_number: "",
        max_people: "10",
        activity_description: "",
        start_location: "",
        end_location: "",
        available_month: "3",
        type_id: "",
        service_id: "",
        rating_tour: "5",
        image: null,
        travel_tours: [],
    });
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLocations(await fetchLocations());
            setServices(await fetchServices());
            setTypeTours(await fetchTypeTours());
        };
        fetchData();
    }, []);

    // Xử lý khi thay đổi input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTourData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditorChange = (content) => {
        setTourData((prev) => ({ ...prev, activity_description: content }));
    };

    // Xử lý tải ảnh
    const handleFileChange = (e) => {
        setTourData((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    // Xử lý gửi dữ liệu lên API
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tourData.activity_description.trim()) {
            toast.error("Vui lòng nhập mô tả hành trình!");
            return;
        }

        try {
            const formData = new FormData();
            Object.keys(tourData).forEach((key) => {
                if (key === "travel_tours") {
                    formData.append(key, JSON.stringify(tourData[key]));
                } else if (tourData[key] !== null && tourData[key] !== undefined) {
                    formData.append(key, tourData[key]);
                }
            });

            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }

            const response = await createTour(formData);
            if (response) {
                toast.success("Tạo Tour mới thành công");
                setTourData({
                    ...tourData,
                    name_tour: "",
                    price_tour: "",
                    travel_tours: [],
                });
            } else {
                toast.error("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            toast.error(`Lỗi: ${JSON.stringify(error.response?.data)}`);
            console.error("Lỗi API:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        console.log("Updated travel tour:", tourData.travel_tours);
    }, [tourData.travel_tours]);

    const handleWrapperClick = () => {
        onClose();
    };
    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50" onClick={handleWrapperClick} >
            <div className="bg-white rounded-md shadow-lg w-3/5 p-6" onClick={handleModalClick}>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6">
                        {/* Cột trái */}
                        <div className="w-2/5">
                            <h2 className="text-lg font-semibold">Thêm chương trình chiết khấu</h2>
                            <h6 className="text-sm mb-4 text-SmokyGray">
                                Quản trị viên thêm chương trình triết khấu cho tour
                            </h6>

                            {/* Mã Tour */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Tên chương trình
                            </label>
                            <input
                                type="text"
                                name="name_tour"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Tên chương trình"
                                disabled
                            />

                            <div className="flex items-center gap-4">
                                {/* Ngày bắt đầu */}
                                <div>
                                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                        Ngày bắt đầu
                                    </label>
                                    <select
                                        name="start_location"
                                        className="w-auto p-2 border rounded text-gray-500"
                                        value={tourData.start_location}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Ngày bắt đầu
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

                                {/* Ngày kết thúc */}
                                <div>
                                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                        Ngày kết thúc
                                    </label>
                                    <select
                                        name="end_location"
                                        className="w-auto p-2 border rounded text-gray-500"
                                        value={tourData.end_location}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="" disabled>
                                            Ngày kết thúc
                                        </option>
                                        {locations.map((location) => (
                                            <option key={location.id} value={location.id}>
                                                {location.name_location}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Giá trị giảm giá */}
                            <label className="block mb-2 font-medium before:text-red-500 before:mr-1 mt-2">
                                Giá trị giảm giá
                            </label>
                            <input
                                type="number"
                                name="day_number"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Nhập giá trị giảm giá"
                                value={tourData.day_number}
                                onChange={handleChange}
                                required
                            />

                            {/* Phần trăm giảm giá */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Phần trăm giảm giá
                            </label>
                            <input
                                type="number"
                                name="price_tour"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Nhập phần trăm giảm giá"
                                value={tourData.price_tour}
                                onChange={handleChange}
                                required
                            />
                            {/* Số lượng */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Số lượng
                            </label>
                            <input
                                type="number"
                                name="price_tour"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Số lượng"
                                value={tourData.price_tour}
                                onChange={handleChange}
                                required
                            />

                            {/* Ảnh minh họa */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Ảnh minh họa
                            </label>
                            <input
                                type="file"
                                className="w-full border p-2 rounded mb-4"
                                onChange={handleFileChange}
                                required
                            />
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-gray-700">Kích hoạt</span>
                                <button
                                    className={`w-10 h-5 flex items-center bg-gray-300 rounded-full p-1 transition ${
                                        isActive ? "bg-red-700" : "bg-gray-300"
                                    }`}
                                    onClick={() => setIsActive(!isActive)}
                                >
                                    <div
                                        className={`w-4 h-4 bg-white rounded-full shadow-md transform transition ${
                                            isActive ? "translate-x-5" : ""
                                        }`}
                                    ></div>
                                </button>
                            </div>
                        </div>

                        {/* Cột phải */}
                        <div className="w-3/5">
                            <div className="mt-10">
                                <label className="block mb-2 font-medium">
                                    Chính sách và điều khoản
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
                            Tạo chương trình
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
