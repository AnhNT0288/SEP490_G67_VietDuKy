import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutManagement from "../../layouts/LayoutManagement";
import ModalEditProfile from "./ModalEditProfile";
import { toast } from "react-toastify";
import {
  getStaffProfile,
  updateStaffProfile,
} from "../../services/API/user.service";
import { displayName } from "react-quill";

export default function Profile() {
  const [userId] = useState(() => JSON.parse(localStorage.getItem("user"))?.id);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editField, setEditField] = useState(null);
  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("token");
    const storedToken = localStorage.getItem("access_token");

    if (urlToken) {
      localStorage.setItem("access_token", urlToken);
      window.history.replaceState({}, document.title, "/profile");
    }

    const token = urlToken || storedToken;

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await getStaffProfile(userId);
        if (res.status === 200) {
          setUser(res.data);
        }
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchProfile();
  }, [userId, navigate]);

  if (!user) {
    return <div className="text-center mt-10">Đang tải...</div>;
  }

  console.log(user);

  const staff = user.StaffProfile || {};

  const formatDateVN = (dateStr) => {
    return dateStr
      ? new Date(dateStr).toLocaleDateString("vi-VN")
      : "Chưa cập nhật";
  };

  const fields = [
    {
      label: "Họ tên",
      value: user.displayName || "Chưa cập nhật",
    },
    { label: "Địa chỉ Email", value: user.email || "Chưa cập nhật" },
    { label: "Số điện thoại", value: staff.phone || "Chưa cập nhật" },
    { label: "Ngày sinh", value: formatDateVN(staff.date_of_birth) },
    {
      label: "Giới tính",
      value:
        staff.gender === "male"
          ? "Nam"
          : staff.gender === "female"
          ? "Nữ"
          : "Chưa cập nhật",
    },
  ];

  const handleSave = async (formData) => {
    const updatedData = {
      displayName: formData.displayName,
      phone: formData.phone,
      date_of_birth: formData.date_of_birth,
      gender: formData.gender,
    };

    try {
      const res = await updateStaffProfile(user.id, updatedData);
      if (res.status === 200) {
        setUser((prev) => ({
          ...prev,
          displayName: updatedData.displayName, // cập nhật displayName
          StaffProfile: {
            ...prev.StaffProfile,
            phone: updatedData.phone,
            date_of_birth: updatedData.date_of_birth,
            gender: updatedData.gender,
          },
        }));
        setIsModalOpen(false);
        toast.success("Cập nhật thông tin thành công!");
      } else {
        toast.error("Cập nhật thất bại!");
      }
    } catch (err) {
      console.error("Lỗi cập nhật", err);
      toast.error("Đã xảy ra lỗi trong quá trình cập nhật!");
    }
  };

  return (
    <LayoutManagement title="Thông tin cá nhân">
      <div className="min-h-screen bg-gray-100 px-4">
        <div className="mx-auto flex flex-col lg:flex-row gap-6">
          <div className="w-full">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
                  <p className="text-gray-500 text-sm">
                    Cập nhật thông tin cá nhân Hướng dẫn viên
                  </p>
                </div>
                <div className="flex items-center gap-10">
                  <div className="text-right">
                    <p className="text-sm text-gray-700 font-medium">
                      {user.email}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-lg overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Avatar"
                        className="w-10 h-10 object-cover"
                      />
                    ) : (
                      user.displayName?.charAt(0)?.toUpperCase() || "U"
                    )}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto border-t border-b">
                  <tbody>
                    {fields.map((item, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-3 px-4 text-gray-600">
                          {item.label}
                        </td>
                        <td className="py-3 px-4 text-gray-800">
                          {item.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-right mt-4">
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg border border-red-600 font-semibold hover:bg-white hover:text-red-600 transition"
                  onClick={() => {
                    setEditField("Thông tin cá nhân");
                    setFormValue({
                      displayName: user.displayName || "",
                      phone: staff.phone || "",
                      date_of_birth: staff.date_of_birth || "",
                      gender: staff.gender || "",
                    });
                    setIsModalOpen(true);
                  }}
                >
                  Cập nhật thông tin cá nhân
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ModalEditProfile
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        field={editField}
        initialValue={formValue}
        onSave={handleSave}
      />
    </LayoutManagement>
  );
}
