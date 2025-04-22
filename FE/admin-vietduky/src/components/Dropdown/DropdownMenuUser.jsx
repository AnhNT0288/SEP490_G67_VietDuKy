import PropTypes from "prop-types";
import { useEffect } from "react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { MdEdit, MdLock, MdUpdate } from "react-icons/md";

export default function DropdownMenuUser({ user, onLockAccount, onUpdatePermissions, onEditUser, isOpen, setOpenDropdown }) {
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.closest(".dropdown-container")) {
                setOpenDropdown(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, [setOpenDropdown]);

    return (
        <div className="relative dropdown-container flex items-center gap-2 justify-end">
            <button onClick={() => setOpenDropdown(isOpen ? null : user.id)} className="p-2">
                <HiOutlineDotsHorizontal className="text-xl cursor-pointer" />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-10">
                    <button
                        onClick={() => {
                            onUpdatePermissions(user);
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdUpdate className="mr-2 text-gray-700" />
                        Cập nhật quyền người dùng
                    </button>
                    <button
                        onClick={() => {
                            onEditUser(user);
                            setOpenDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left"
                    >
                        <MdEdit className="mr-2 text-gray-700" />
                        Cập nhật thông tin
                    </button>
                    <button
                    onClick={() => {
                        onLockAccount(user.id);
                        setOpenDropdown(null);
                    }}
                    className="flex items-center px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                >
                    <MdLock className="mr-2" />
                    Khóa tài khoản
                </button>
                </div>
            )}
        </div>
    );
}

DropdownMenuUser.propTypes = {
    user: PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    }).isRequired,
    onLockAccount: PropTypes.func.isRequired,
    onUpdatePermissions: PropTypes.func.isRequired,
    onEditUser: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setOpenDropdown: PropTypes.func.isRequired,
};