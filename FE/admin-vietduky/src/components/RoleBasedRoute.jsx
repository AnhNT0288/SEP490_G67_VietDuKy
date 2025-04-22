import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import axios from "axios";
import { StorageService } from "../services/storage/StorageService";
import LayoutAdmin from "../layouts/LayoutAdmin";
import LayoutStaff from "../layouts/LayoutStaff";

export default function RoleBasedRoute({ allowedRoles }) {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const access_token = StorageService.getToken();
  const refresh_token = StorageService.getRefreshToken();
  const user = StorageService.getUser();

  useEffect(() => {
    const checkAuth = async () => {
      if (access_token && !StorageService.isExpired()) {
        // Access token còn hạn
        setIsValid(true);
        setCheckingAuth(false);
      } else if (refresh_token) {
        // Access token hết hạn, dùng refresh token
        try {
          const res = await axios.post(`http://localhost:3000/api/auth/refresh-token`, {
            token: refresh_token,
          });
          const newAccessToken = res.data.access_token;
          StorageService.setToken(newAccessToken);
          setIsValid(true);
        } catch (error) {
          console.error("🔒 Lỗi refresh token:", error);
          StorageService.signout(() => {}); // hoặc navigate nếu cần
          setIsValid(false);
        } finally {
          setCheckingAuth(false);
        }
      } else {
        // Không có access token và refresh token
        setIsValid(false);
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Khi đang kiểm tra token, không render gì cả
  if (checkingAuth) return null;

  if (!isValid || !user || !allowedRoles.includes(user.role_name)) {
    return <Navigate to="/" replace />;
  }

  const Layout = user.role_name === "admin" ? LayoutAdmin : LayoutStaff;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}
