import { useEffect, useState } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import {MdEdit, MdDelete, MdOutlineStickyNote2} from "react-icons/md";
import { deleteTour } from "../../services/API/tour.service";
import { BsCalendar3 } from "react-icons/bs";
import {GoMultiSelect} from "react-icons/go";
import {toast} from "react-toastify";

// eslint-disable-next-line react/prop-types
export default function DropdownMenu({ tour, onDelete, onManageTravelTour, onEdit, isOpen, setOpenDropdown, onOpenManagementProgram, onOpenNoteTour }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setOpenDropdown]);

  const confirmDelete = (id) => {
    setPendingDeleteId(id);
    setIsConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      await deleteTour(pendingDeleteId);
      onDelete(pendingDeleteId);
      toast.success("Xóa tour thành công");
    } catch (error) {
      toast.error("Có lỗi xảy ra, vui lòng thử lại!");
      console.log("Lỗi khi xóa tour", error);
    } finally {
      setIsConfirmOpen(false);
      setOpenDropdown(null);
    }
  };

  return (
      <div
          className="relative dropdown-container flex items-center gap-2 justify-end"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
      >
        <button onClick={() => setOpenDropdown(isOpen ? null : tour.id)} className="p-2">
          <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
        </button>

        {isOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
              <button
                  onClick={() => {
                    onOpenManagementProgram(tour);
                    setOpenDropdown(null);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <GoMultiSelect className="mr-2 text-gray-700" />
                Chương trình Tour
              </button>

              {/*<button*/}
              {/*    onClick={() => {*/}
              {/*      onOpenAddProgram(tour);*/}
              {/*      setOpenDropdown(null);*/}
              {/*    }}*/}
              {/*    className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"*/}
              {/*>*/}
              {/*  <GoMultiSelect className="mr-2 text-gray-700" />*/}
              {/*  Chương trình Tour*/}
              {/*</button>*/}

              <button
                  onClick={() => {
                    onManageTravelTour();
                    setOpenDropdown(null);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <BsCalendar3 className="mr-2 text-gray-700" />
                Danh sách lịch khởi hành
              </button>
              <button
                  onClick={() => {
                    onEdit(tour);
                    setOpenDropdown(null);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <MdEdit className="mr-2 text-gray-700" />
                Cập nhật chuyến đi
              </button>

              <button
                  onClick={() => {
                    onOpenNoteTour(tour);
                    setOpenDropdown(null);
                  }}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
              >
                <MdOutlineStickyNote2 className="mr-2 text-gray-700" />
                Thông tin lưu ý
              </button>

              <button
                  onClick={() => confirmDelete(tour.id)}
                  className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
              >
                <MdDelete className="mr-2" />
                Xóa chuyến đi
              </button>
            </div>
        )}
        {isConfirmOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-[320px] p-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-center mb-2">Xác nhận xoá</h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Bạn có chắc chắn muốn xoá chuyến đi này không?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                      className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
                      onClick={() => setIsConfirmOpen(false)}
                  >
                    Hủy
                  </button>
                  <button
                      className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
                      onClick={handleDelete}
                  >
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>

  );
}
