import React from "react";

const HeaderSidebar = ({ active, navigate }) => {
  return (
    <div className="">
      <span
        className="cursor-pointer hover:underline"
        onClick={() => navigate("/")}
      >
        Trang chủ
      </span>{" "}
      / <span className="cursor-pointer hover:underline">Tài khoản</span> /{" "}
      <span className="text-red-500 cursor-pointer hover:underline">
        {active}
      </span>
    </div>
  );
};

export default HeaderSidebar;
