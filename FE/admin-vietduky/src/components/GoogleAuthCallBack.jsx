import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StorageService } from "../services/storage/StorageService";

const GoogleAuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const user = {
      id: params.get("id"),
      email: params.get("email"),
      avatar: params.get("avatar"),
      name: params.get("name"),
      role_name: params.get("role_name"),
    };

    if (token) {
      StorageService.setToken(token);
      StorageService.setUser(user);
      setTimeout(() => {
        navigate("/managementTour");
      }, 100);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <div>Đang xử lý đăng nhập...</div>;
};

export default GoogleAuthCallback;
