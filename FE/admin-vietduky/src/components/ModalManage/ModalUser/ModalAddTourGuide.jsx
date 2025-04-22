import {useEffect, useState} from "react";
import {fetchLocations, fetchServices, fetchTypeTours} from "../../../services/service.js";
import {createTour} from "../../../services/API/tour.service.js";

export default function ModalAddTourGuide({ onClose }) {
    const [setLocations] = useState([]);
    const [setServices] = useState([]);
    const [setTypeTours] = useState([]);
    const [isActive, setIsActive] = useState(false);
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
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        phone: "",
        birthDate: "",
        email: "",
        password: "",
        isActive: false,
    });

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

    // Xử lý gửi dữ liệu lên API
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!tourData.activity_description.trim()) {
            alert("Vui lòng nhập mô tả hành trình!");
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
                alert("Tạo Tour mới thành công");
                setTourData({
                    ...tourData,
                    name_tour: "",
                    price_tour: "",
                    travel_tours: [],
                });
            } else {
                alert("Có lỗi xảy ra, vui lòng thử lại!");
            }
        } catch (error) {
            alert(`Lỗi: ${JSON.stringify(error.response?.data)}`);
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
            <div className="bg-white rounded-md shadow-lg w-2/5 p-6" onClick={handleModalClick}>
                <form onSubmit={handleSubmit}>
                    <div className="flex gap-6">
                        {/* Cột trái */}
                        <div className="w-full">
                            <h2 className="text-lg font-semibold">Thêm tài khoản</h2>
                            <h6 className="text-sm mb-4 text-SmokyGray">
                                Quản trị viên thêm tài khoản Hướng dẫn viên
                            </h6>

                            {/* Mã Tour */}
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Tên Hướng dẫn viên
                            </label>
                            <input
                                type="text"
                                name="name_service"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Nhập tên Hướng dẫn viên"
                                required
                            />

                            <div className="flex gap-4 mb-4">
                                <div className="w-1/2">
                                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">Giới tính</label>
                                    <select
                                        name="gender"
                                        className="w-full p-2 border rounded text-gray-500"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="Nam">Nam</option>
                                        <option value="Nữ">Nữ</option>
                                        <option value="Khác">Khác</option>
                                    </select>
                                </div>
                                <div className="w-1/2">
                                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">Số điện thoại</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        className="w-full p-2 border rounded"
                                        placeholder="Nhập số điện thoại"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Ngày sinh
                            </label>
                            <input
                                type="text"
                                name="birthDate"
                                className="w-full p-2 border rounded mb-4 text-gray-500 placeholder-gray-500"
                                placeholder="Chọn ngày sinh Hướng dẫn viên"
                                onFocus={(e) => (e.target.type = 'date')}
                                onBlur={(e) => (e.target.type = formData.birthDate ? 'date' : 'text')}
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            />
                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Email
                            </label>
                            <input
                                type="text"
                                name="name_service"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Nhập email"
                                required
                            />

                            <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                                Mật khẩu
                            </label>
                            <input
                                type="text"
                                name="name_service"
                                className="w-full p-2 border rounded mb-4"
                                placeholder="Nhập mật khẩu"
                                required
                            />
                            {/* Giá trị giảm giá */}
                            <div className="mt-4 flex items-center gap-2">
                                <span className="text-gray-700">Hoạt động</span>
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
                            Tạo Tour mới
                        </button>
                    </div>
                </form>

            </div>
        </div>
    );
}
