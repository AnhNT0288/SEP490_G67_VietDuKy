import React from "react";

const BreadCrumbProfile = () => {
  return (
    <div className="w-80 inline-flex justify-start items-center gap-[5px]">
      <div className="w-16 self-stretch relative">
        <div className="left-0 top-[2px] absolute justify-center text-zinc-500 text-sm font-normal font-['Be_Vietnam_Pro'] leading-tight">
          Trang chủ
        </div>
      </div>
      <div className="justify-center text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
        {" "}
        /
      </div>
      <div className="justify-center text-zinc-500 text-sm font-normal font-['Be_Vietnam_Pro'] leading-tight">
        Tài khoản
      </div>
      <div className="justify-center text-zinc-500 text-base font-normal font-['Inter'] leading-normal">
        {" "}
        /
      </div>
      <div className="justify-center text-red-800 text-sm font-semibold font-['Be_Vietnam_Pro'] leading-tight">
        Hồ sơ của tôi
      </div>
    </div>
  );
};

export default BreadCrumbProfile;
