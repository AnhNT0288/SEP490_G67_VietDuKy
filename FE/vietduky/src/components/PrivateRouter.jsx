import { useState, useEffect } from "react";
import { StorageService } from "@/services/storage/StorageService";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài đặt react-toastify
import ModalLogin from "./ModalLogin/ModalLogin";

const ProtectedRoute = () => {
  const token = StorageService.getToken();
  const isAuthenticated = token && !StorageService.isExpired();
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setShowModal(true);
    }
  }, [isAuthenticated]);

  const handleLoginSuccess = () => {
    setShowModal(false);
    navigate(location.state?.from || "/");
  };

  if (isAuthenticated) {
    return <Outlet />;
  }

  return (
    <>
      {showModal && (
        <ModalLogin onClose={() => setShowModal(false)} onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default ProtectedRoute;