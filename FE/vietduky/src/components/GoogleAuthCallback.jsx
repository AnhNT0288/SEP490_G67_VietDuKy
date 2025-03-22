import { StorageService } from "@/services/storage/StorageService";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = {
      id: params.get("id"),
      email: params.get("email"),
      avatar: params.get("avatar"),
    };

    if (token) {
      StorageService.setToken(token);
      StorageService.setUser(user);
      setTimeout(() => {
        navigate("/");
      }, 100);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default GoogleAuthCallback;
