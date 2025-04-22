import { CustomerService } from "@/services/API/customer.service";
import { formatDate } from "@/utils/dateUtil";
import React, { useEffect, useState } from "react";

const ProfileDetail = () => {
  const [customer, setCustomer] = useState(null);
  const [editField, setEditField] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    CustomerService.getProfile()
      .then((res) => {
        setCustomer(res.data);
        setFormData({
          displayName: res.data.displayName || "",
          email: res.data.email || "",
          number_phone: res.data.Customer?.number_phone || "",
          birth_date: res.data.Customer?.birth_date || "",
          gender: res.data.Customer?.gender || "",
          address: res.data.Customer?.address || "",
        });
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      });
  }, []);

  const handleEdit = (field) => {
    setEditField(field);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [editField]: e.target.value });
  };

  const handleSave = () => {
    CustomerService.updateProfile(formData)
      .then(() => {
        setCustomer((prev) => ({
          ...prev,
          displayName: formData.displayName,
          Customer: {
            ...prev.Customer,
            number_phone: formData.number_phone,
            birth_date: formData.birth_date,
            gender: formData.gender,
            address: formData.address,
          },
        }));
        setEditField(null);
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
      });
  };

  const handleCancel = () => {
    setEditField(null); // Hủy chỉnh sửa
    // Khôi phục lại dữ liệu ban đầu
    setFormData({
      displayName: customer.displayName || "",
      email: customer.email || "",
      number_phone: customer.Customer?.number_phone || "",
      birth_date: customer.Customer?.birth_date || "",
      gender: customer.Customer?.gender || "",
      address: customer.Customer?.address || "",
    });
  };

  if (!customer) {
    return <div className="text-center py-10">Loading...</div>;
  }

  return (
    <div className="w-full mx-auto bg-transparent rounded-lg">
      {/* Thông tin cá nhân */}
      <div className="flex items-center justify-between bg-white rounded-t-lg shadow-md px-6 py-4 mb-6">
        <div>
          <h2 className="text-zinc-900 text-2xl font-bold mb-2">
            Thông tin cá nhân
          </h2>
          <p className="text-zinc-500 text-xl">
            Lưu thông tin của Quý khách để đặt dịch vụ nhanh hơn
          </p>
        </div>
        <div className="">
          <img
            src={customer.avatar || "/Image/avatar.png"}
            alt="Avatar"
            className="w-16 h-16 rounded-full mx-auto"
          />
        </div>
      </div>
      <div className="bg-white shadow-md p-6 rounded-b-md">
        <div className="divide-y">
          {[
            {
              key: "displayName",
              label: "Họ tên",
              value: customer.displayName || "Chưa cập nhật",
            },
            {
              key: "email",
              label: "Địa chỉ Email",
              value: customer.email,
              description:
                "Đây là email Quý khách đã xác thực. VietDuKy sẽ gửi các xác nhận đến địa chỉ email này.",
            },
            {
              key: "number_phone",
              label: "Số điện thoại",
              value: customer.Customer?.number_phone || "Chưa cập nhật",
              description:
                "VietDuKy sẽ liên hệ với Quý khách đến số điện thoại này.",
            },
            {
              key: "birth_date",
              label: "Ngày sinh",
              value:
                formatDate(customer.Customer?.birth_date) || "Chưa cập nhật",
              type: "date",
            },
            {
              key: "gender",
              label: "Giới tính",
              value: customer.Customer?.gender || "Chưa cập nhật",
              type: "select",
              options: [
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" },
              ],
            },
            {
              key: "address",
              label: "Địa chỉ",
              value: customer.Customer?.address || "Chưa cập nhật",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex flex-row justify-between items-center py-3 "
            >
              <span className="text-zinc-500 text-lg w-1/5">{item.label}</span>
              {editField === item.key ? (
                item.type === "select" ? (
                  <select
                    className="border border-gray-300 rounded px-2 py-1 w-1/3"
                    value={formData[item.key]}
                    onChange={handleChange}
                    autoFocus
                  >
                    {item.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : item.type === "date" ? (
                  <input
                    type="date"
                    className="border border-gray-300 rounded px-2 py-1 w-1/3"
                    value={formData[item.key]}
                    onChange={handleChange}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    className="border border-gray-300 rounded px-2 py-1 w-1/3"
                    value={formData[item.key]}
                    onChange={handleChange}
                    autoFocus
                  />
                )
              ) : (
                <span className="text-zinc-900 text-lg font-normal text-left w-1/3">
                  {formData[item.key] || "Chưa cập nhật"}
                </span>
              )}

              {/* Nút chỉnh sửa / lưu */}
              {editField === item.key ? (
                <div className="flex space-x-4">
                  <button
                    onClick={handleSave}
                    className="text-green-600 text-lg"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={handleCancel}
                    className="text-red-600 text-lg"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(item.key)}
                  className="text-blue-700 text-lg ml-4"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Thông tin thẻ ngân hàng */}
      {/* <div className="bg-white shadow-md px-6 py-4 mt-6 mb-6">
        <h2 className="text-zinc-900 text-2xl font-bold mb-2">
          Thông tin thẻ ngân hàng
        </h2>
        <p className="text-zinc-500 text-lg">
          Lưu thông tin của Quý khách để đặt dịch vụ nhanh hơn
        </p>
      </div>

      <div className="bg-white rounded-b-lg shadow-md p-6 mt-6">
        <div className="divide-y">
          {[
            { label: "Tên chủ thẻ", value: "Dương Thế Toàn" },
            { label: "Số thẻ", value: "**** **** **** 1234" },
            { label: "Hết hạn", value: "02/2025" },
            { label: "CVV", value: "***" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col md:flex-row justify-between items-start md:items-center py-3"
            >
              <span className="text-zinc-500 text-lg w-1/5">{item.label}</span>
              <span className="text-zinc-900 text-lg font-normal w-1/3 text-left">
                {item.value}
              </span>
              <a href="#" className="text-blue-700 text-lg md:ml-4">
                Chỉnh sửa
              </a>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ProfileDetail;
