import { useEffect, useState } from "react";
import ModalAddNote from "../ModalAdd/ModalAddNote";
import { getTourNotes } from "../../../services/API/note.service.js";
import { RiDeleteBinLine } from "react-icons/ri";

export default function ModalNoteList({ tourId, onClose }) {
    const [notes, setNotes] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchNotes = async () => {
        try {
            const res = await getTourNotes(tourId);
            console.log("📥 Notes fetched:", res);
            setNotes(res);
        } catch (error) {
            console.error("Lỗi khi lấy danh sách note:", error);
        }
    };

    useEffect(() => {
        if (tourId) {
            console.log("🧪 Fetching notes for tourId:", tourId);
            fetchNotes();
        }
    }, [tourId]);

    const filteredNotes = notes.filter(note =>
        (note.tab || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.description || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center px-4">
            <div className="bg-white rounded-xl shadow-lg w-3/5 h-3/5 overflow-y-auto p-6 relative flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Thông tin lưu ý</h2>

                    <div className="relative w-64">
                        <input
                            type="text"
                            className="px-4 py-2 border rounded-md w-full"
                            placeholder="Tìm kiếm bằng từ khóa"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button
                        className="text-white bg-red-600 px-4 py-2 rounded"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Thêm thông tin
                    </button>
                </div>

                <table className="w-full border-collapse">
                    <thead>
                    <tr className="text-left border-b">
                        <th className="p-2">Tiêu đề</th>
                        <th className="p-2">Nội dung lưu ý</th>
                        <th className="p-2 text-center">Thao tác</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredNotes.length > 0 ? (
                        filteredNotes.map((note) => (
                            <tr key={note.id}>
                                <td className="p-2">{note.tab || "(Không có tiêu đề)"}</td>
                                <td className="p-2">{note.description}</td>
                                <td className="p-2 text-center">
                                    <button><RiDeleteBinLine /></button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center py-4 text-gray-500">
                                Không có thông tin lưu ý nào cho tour này.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {isAddModalOpen && (
                    <ModalAddNote
                        tourId={tourId}
                        onClose={() => {
                            setIsAddModalOpen(false);
                            setTimeout(fetchNotes, 200); // Delay nhẹ giúp backend ghi xong
                        }}
                    />
                )}

                <button
                    onClick={onClose}
                    className="absolute bottom-4 right-8 text-sm text-gray-800 p-2 bg-gray-100 rounded w-16"
                >
                    Hủy
                </button>
            </div>
        </div>
    );
}
