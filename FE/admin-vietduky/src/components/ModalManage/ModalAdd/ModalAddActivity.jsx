import { useState } from "react";
import { HiOutlineInbox, HiOutlineTrash} from "react-icons/hi";
import {createTourActivity} from "../../../services/API/activity_tour.service.js";
import {IoMdAdd} from "react-icons/io";
import {toast} from "react-toastify";
import ReactQuill from "react-quill";
import TextEditor from "../../../lib/TextEditor.jsx";

// eslint-disable-next-line react/prop-types
export default function ModalAddActivity({ tour, onClose, onAddTravelTour }) {
    const [submittedPrograms, setSubmittedPrograms] = useState([]);
    const [programs, setPrograms] = useState([
        { day: "", title: "", description: "", detail: "", image: null, preview: null },
    ]);

    const handleChange = (index, field, value) => {
        const updated = [...programs];
        updated[index][field] = value;
        setPrograms(updated);
    };

    const handleImageChange = (index, file) => {
        const updated = [...programs];
        updated[index].image = file;
        updated[index].preview = file ? URL.createObjectURL(file) : null;
        setPrograms(updated);
        console.log("FILE GỬI:", programs.image);

    };

    const handleRemoveImage = (index) => {
        const updated = [...programs];
        updated[index].image = null;
        updated[index].preview = null;
        setPrograms(updated);
    };

    const handleAddProgram = () => {
        setPrograms([
            ...programs,
            { day: "", title: "", description: "", image: null, preview: null },
        ]);
    };

    const handleRemoveProgram = (index) => {
        const updated = [...programs];
        updated.splice(index, 1);
        setPrograms(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const hasInvalid = programs.some(
            (p) =>
                !p.day.trim() ||
                isNaN(p.day) ||
                Number(p.day) <= 0 ||
                !p.title.trim() ||
                !p.description.trim() ||
                !p.image
        );
        if (hasInvalid) {
            toast.error("Vui lòng nhập đúng ngày (số dương), tiêu đề, mô tả và ảnh.");
            return;
        }

        const days = programs.map((p) => Number(p.day));
        const hasDuplicateDay = days.some((day, index) => days.indexOf(day) !== index);
        if (hasDuplicateDay) {
            toast.error("Không được nhập trùng ngày trong các chương trình.");
            return;
        }

        try {
            const submitted = [];

            for (let i = 0; i < programs.length; i++) {
                const prog = programs[i];
                const dayNumber = Number(prog.day);

                const formData = new FormData();
                formData.append("tour_id", tour.id);
                formData.append("day", dayNumber);
                formData.append("title", prog.title);
                formData.append("description", prog.description);
                formData.append("detail", prog.detail);
                formData.append("image", prog.image);

                console.log(`📤 Gửi chương trình ngày ${dayNumber}`);
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}:`, value);
                }

                const response = await createTourActivity(formData);
                submitted.push({
                    ...response.data,
                    preview: response.data.image
                });
            }

            toast.success("Tạo chương trình tour thành công!");
            setSubmittedPrograms((prev) => [...prev, ...submitted]);
            setPrograms([{ day: "", title: "", description: "", detail: "", image: null, preview: null }]);
            onAddTravelTour(submitted);
            onClose();

        } catch (error) {
            console.error("🔥 Lỗi từ backend:", error.response?.data || error);
            toast.error(error.response?.data?.message || "Tạo chương trình tour thất bại.");
        }
    };

    const handleWrapperClick = () => {
        onClose();
    };

    const handleModalClick = (event) => {
        event.stopPropagation();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center z-[9999]" onClick={handleWrapperClick}>
            <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 h-[80%] overflow-y-auto scrollbar-hide" onClick={handleModalClick}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h2 className="text-lg font-semibold">Thêm chương trình</h2>
                            <p className="text-sm text-gray-600">
                                Cho Tour: <span className="text-red-700 font-medium">{tour?.name_tour || "Chưa chọn tour"}</span>
                            </p>
                        </div>
                        <button
                            type="button"
                            className="bg-red-700 text-white px-4 py-2 rounded-md"
                            onClick={handleAddProgram}
                        ><IoMdAdd/>
                        </button>
                    </div>

                    <div className="mt-4 mb-4">
                        <table className="w-full border-collapse border rounded-lg bg-white text-sm">
                            <thead className="bg-gray-50 text-gray-700 text-left">
                            <tr>
                                <th className="p-3 font-semibold">Ngày</th>
                                <th className="p-3 font-semibold">Tiêu đề</th>
                                <th className="p-3 font-semibold">Mô tả</th>
                                <th className="p-3 font-semibold">Chi tiết</th>
                                <th className="p-3 font-semibold text-center">Ảnh</th>
                                <th className="p-3 font-semibold text-center">Xoá</th>
                            </tr>
                            </thead>
                            <tbody>
                            {programs.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="p-6 text-center">
                                        <div className="flex flex-col items-center h-[160px]">
                                            <div className="p-4 bg-gray-100 rounded-full mb-2">
                                                <HiOutlineInbox className="text-4xl text-gray-600" />
                                            </div>
                                            <p className="text-gray-600 text-md">Chưa có hành trình nào</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                programs.map((prog, idx) => (
                                    <tr key={idx} className="border-t align-middle hover:bg-gray-50 transition-all">
                                        {/* Ngày */}
                                        <td className="p-3">
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="VD: 1"
                                                value={prog.day}
                                                onChange={(e) => handleChange(idx, "day", e.target.value)}
                                                className="w-full px-2 py-1 border rounded h-12"
                                                required
                                            />
                                        </td>

                                        {/* Tiêu đề */}
                                        <td className="p-3">
                                            <input
                                                type="text"
                                                placeholder="Nhập tiêu đề"
                                                value={prog.title}
                                                onChange={(e) => handleChange(idx, "title", e.target.value)}
                                                className="w-full px-2 py-1 border rounded h-12"
                                                required
                                            />
                                        </td>

                                        {/* Mô tả */}
                                        <td className="p-3">
                                            <textarea
                                                placeholder="Mô tả"
                                                value={prog.description}
                                                onChange={(e) => handleChange(idx, "description", e.target.value)}
                                                rows={2}
                                                className="w-full px-2 py-1 border rounded" required/>
                                        </td>

                                        {/* Chi tiết */}
                                        <td className="p-3 ">
                                            <textarea
                                                placeholder="Chi tiết chương trình"
                                                value={prog.detail}
                                                onChange={(e) => handleChange(idx, "detail", e.target.value)}
                                                rows={4}
                                                className="w-full px-2 py-1 border rounded"
                                                required
                                            />
                                        </td>

                                        {/* Ảnh */}
                                        <td className="p-3 text-center">
                                            <div
                                                className="w-36 h-28 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-50 transition relative mx-auto"
                                                onDragOver={(e) => e.preventDefault()}
                                                onDrop={(e) => {
                                                    e.preventDefault();
                                                    const file = e.dataTransfer.files[0];
                                                    if (file) handleImageChange(idx, file);
                                                }}
                                                onClick={() =>
                                                    document.getElementById(`fileInput-${idx}`)?.click()
                                                }
                                            >
                                                {prog.preview ? (
                                                    <div className="relative h-full flex items-center justify-center">
                                                        <img
                                                            src={prog.preview}
                                                            alt="preview"
                                                            className="max-h-full max-w-full object-contain rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveImage(idx);
                                                            }}
                                                            className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded px-2 text-sm"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-sm text-gray-500">
                                                    Kéo & thả ảnh <br /> (.png, .jpg, .jpeg)
                                                    </span>
                                                )}
                                                <input
                                                    type="file"
                                                    id={`fileInput-${idx}`}
                                                    accept=".png,.jpg,.jpeg"
                                                    className="hidden"
                                                    onChange={(e) =>
                                                        handleImageChange(idx, e.target.files[0])
                                                    }
                                                />
                                            </div>
                                        </td>

                                        {/* Xóa */}
                                        <td className="p-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveProgram(idx)}
                                                className="text-red-500 hover:text-red-700 text-lg"
                                            >
                                                <HiOutlineTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end gap-4">
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
                            Lưu & Đóng
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
