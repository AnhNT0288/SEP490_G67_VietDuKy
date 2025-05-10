import { StorageService } from "@/services/storage/StorageService";
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const AuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const error = params.get("error");

    if (error === "account_locked") {
      navigate("/?error=account_locked");
      return;
    }

    const accessToken = params.get("accessToken");
    const refreshToken = params.get("refreshToken");
    const user = {
      id: params.get("id"),
      email: params.get("email"),
      avatar: params.get("avatar"),
      name: params.get("name"),
      role_name: params.get("role_name"),
    };

    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      StorageService.setUser(user);

      // Điều hướng về trang trước đó nếu có
      const from = location.state?.from || "/";
      setTimeout(() => {
        navigate(from);
      }, 100);
    } else {
      navigate("/login");
    }
  }, [navigate, location]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default AuthCallback;