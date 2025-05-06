import React from "react";
import {useNavigate} from "react-router-dom";

const HeaderMenu = ({handleSignout, user}) => {
    const navigate = useNavigate();

    return (
        <>
            <div className="flex items-center py-4 px-4 border-b border-gray-200">
                <img
                    src={user?.avatar || Icons.User}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                    onClick={() => navigate("/profile")}
                />
                <div className="ml-4 flex flex-col cursor-pointer" onClick={() => navigate("/profile")}>
                    <span className="text-md">{user?.name}</span>
                    <span className="text-sm text-gray-500">{user?.email}</span>
                </div>
            </div>
            <div className="p-2">
                {/* <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
          onClick={() => navigate("/profile")}
        >
          Giao diện: Theo hệ thống
        </button> */}
                {/* <div className="border-b border-gray-200"/> */}
                <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                    onClick={() => navigate("/bookingHistory")}
                >
                    Lịch sử đặt tour
                </button>
                {/* <button
          className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
          onClick={() => navigate("/profile")}
        >
          Mã khuyến mãi
        </button> */}
                <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                    onClick={() => navigate("/favorites")}
                >
                    Danh sách yêu thích
                </button>
                <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"
                    onClick={() => navigate("/reviews")}
                >
                    Đánh giá
                </button>
                {/*<button*/}
                {/*  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded-md"*/}
                {/*  onClick={() => navigate("/settings")}*/}
                {/*>*/}
                {/*  Cấu hình hệ thống*/}
                {/*</button>*/}
                <div className="border-b border-gray-200"/>
                <button
                    className="block w-full text-left px-4 p-2 hover:bg-gray-100 hover:text-red-600 rounded-md text-black"
                    onClick={handleSignout}
                >
                    Đăng xuất
                </button>
            </div>
        </>
    );
};

export default HeaderMenu;
