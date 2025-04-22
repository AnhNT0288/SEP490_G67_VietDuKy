import { useState } from "react";
import LayoutModal from "@/layouts/LayoutModal";
import { TermsAndConditionsDoc } from "./Terms&ConditionsDoc";

const TermsAndConditions = ({ agreed, setAgreed }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  }

  const handleClose = () => {
    setIsOpen(false);
  }
  
  return (
    <div className="w-full flex flex-col gap-2.5">
      <div className="flex items-center gap-2.5">
        <input
          type="checkbox"
          className="w-6 h-6 rounded-md border border-gray-600 cursor-pointer"
          checked={agreed}
          onChange={() => setAgreed(!agreed)}
        />
        <p className="text-sm font-bold text-neutral-900">
          Tôi đồng ý với
          <span onClick={handleOpen} className="text-[#a80f21] cursor-pointer"> Chính sách </span>
          bảo vệ dữ liệu cá nhân và
          <span onClick={handleOpen} className="text-[#a80f21] cursor-pointer">
            {" "}
            các điều khoản.
          </span>
        </p>
      </div>

      {/* Modal */}
      <LayoutModal isOpen={isOpen} handleClose={handleClose}>
        <TermsAndConditionsDoc />
      </LayoutModal>
    </div>
  );
};

export default TermsAndConditions;
