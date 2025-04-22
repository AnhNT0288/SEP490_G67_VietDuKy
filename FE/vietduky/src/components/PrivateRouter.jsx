import { StorageService } from "@/services/storage/StorageService";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = StorageService.getToken();
  const isAuthenticated = token && !StorageService.isExpired();

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
