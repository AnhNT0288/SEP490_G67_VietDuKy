import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function ModalAddUser({ onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        displayName: "",
        role_id: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Mật khẩu nhập lại không khớp!");
            return;
        }

        try {
            const payload = {
                email: formData.email,
                password: formData.password,
                displayName: formData.displayName,
                role_id: parseInt(formData.role_id, 10),
            };

            await axios.post("http://localhost:3000/api/auth/register", payload);
            toast.success("✅ Tạo tài khoản thành công!");
            onClose();
            if (onSuccess) onSuccess();
        } catch (error) {
            const msg = error?.response?.data?.message || "Tạo tài khoản thất bại!";
            toast.error("" + msg);
            console.error("Lỗi tạo tài khoản:", error);
        }
    };

    const handleWrapperClick = () => onClose();
    const handleModalClick = (e) => e.stopPropagation();

    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleWrapperClick}
        >
            <div
                className="bg-white rounded-md shadow-lg w-2/5 p-6"
                onClick={handleModalClick}
            >
                <form onSubmit={handleSubmit}>
                    <h2 className="text-lg font-semibold mb-4">Thêm tài khoản</h2>

                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Nhập email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        name="password"
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Nhập mật khẩu"
                        required
                        value={formData.password}
                        onChange={handleChange}
                    />

                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                        Nhập lại mật khẩu
                    </label>
                    <input
                        type="password"
                        name="confirmPassword"
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Nhập lại mật khẩu"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />

                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                        Họ tên hiển thị
                    </label>
                    <input
                        type="text"
                        name="displayName"
                        className="w-full p-2 border rounded mb-4"
                        placeholder="Nhập họ tên"
                        required
                        value={formData.displayName}
                        onChange={handleChange}
                    />

                    <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                        Quyền hạn
                    </label>
                    <select
                        name="role_id"
                        className="w-full p-2 border rounded mb-4"
                        required
                        value={formData.role_id}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn quyền --</option>
                        <option value="1">Khách hàng</option>
                        <option value="2">Nhân viên</option>
                        <option value="3">Quản trị viên</option>
                        <option value="4">Hướng dẫn viên</option>
                    </select>

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
                            Tạo tài khoản
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
