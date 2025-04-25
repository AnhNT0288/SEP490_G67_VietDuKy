// pages/ModalSuccessPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalPaymentSuccess from "./ModalPaymentSuccess";

const ModalSuccessPage = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  const handleClose = () => {
    setIsOpen(false);
    navigate("/"); // Hoặc "/bookingHistory" nếu bạn muốn điều hướng sau khi đóng
  };

  return (
    <ModalPaymentSuccess isOpen={isOpen} onClose={handleClose} />
  );
};

export default ModalSuccessPage;
