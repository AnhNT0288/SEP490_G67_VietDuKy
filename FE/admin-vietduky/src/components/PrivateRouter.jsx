import { Navigate, Outlet } from "react-router-dom";
import { StorageService } from "../services/storage/StorageService";

const ProtectedRoute = () => {
  const token = StorageService.getToken();
  const isAuthenticated = token && !StorageService.isExpired();

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
