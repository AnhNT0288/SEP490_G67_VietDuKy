import Icons from "@/components/Icons/Icon";
import { useState } from "react";

const settingsData = {
  email: [
    {
      group: "Khuyến mãi và ưu đãi",
      options: [
        {
          label: "Khuyến mãi Việt Du Ký",
          description: "Khuyến mãi và ưu đãi",
          key: "promotion",
        },
      ],
    },
    {
      group: "Tài khoản và đặt chỗ",
      options: [
        {
          label: "Nhật ký hoạt động",
          description:
            "Đăng nhập tài khoản, thay đổi mật khẩu, mã PIN và bảo mật",
          key: "activityLog",
        },
        {
          label: "Đặt chỗ",
          description: "Trạng thái đặt chỗ, cập nhật và nhắc nhở",
          key: "booking",
        },
        {
          label: "Tài chính",
          description: "Thông báo các dịch vụ tài chính",
          key: "finance",
        },
      ],
    },
    {
      group: "Phản hồi",
      options: [
        {
          label: "Lời nhắc đưa ra nhận xét",
          description: "Mời bạn chia sẻ suy nghĩ về trải nghiệm gần đây.",
          key: "reviewReminder",
        },
        {
          label: "Khảo sát",
          description: "Cơ hội nhận thưởng để nâng cao trải nghiệm của bạn.",
          key: "survey",
        },
      ],
    },
  ],
  sms: [
    {
      group: `Zalo`,
      options: [
        {
          label: "Khuyến mãi Việt Du Ký",
          description: "Khuyến mãi và ưu đãi",
          key: "promotionZalo",
        },
        {
          label: "Nhật ký hoạt động",
          description:
            "Đăng nhập tài khoản, thay đổi mật khẩu, mã PIN và bảo mật",
          key: "activityLogZalo",
        },
        {
          label: "Đặt chỗ",
          description: "Trạng thái đặt chỗ, cập nhật và nhắc nhở",
          key: "bookingZalo",
        },
        {
          label: "Tài chính",
          description: "Thông báo các dịch vụ tài chính",
          key: "financeZalo",
        },
      ],
    },
    {
      group: "Tin nhắn",
      options: [
        {
          label: "Khuyến mãi Việt Du Ký",
          description: "Khuyến mãi và ưu đãi",
          key: "promotion",
        },
        {
          label: "Nhật ký hoạt động",
          description:
            "Đăng nhập tài khoản, thay đổi mật khẩu, mã PIN và bảo mật",
          key: "activityLog",
        },
        {
          label: "Đặt chỗ",
          description: "Trạng thái đặt chỗ, cập nhật và nhắc nhở",
          key: "booking",
        },
        {
          label: "Tài chính",
          description: "Thông báo các dịch vụ tài chính",
          key: "finance",
        },
      ],
    },
  ],
};

export default function AccountSettings() {
  const [tab, setTab] = useState("email");
  const [toggles, setToggles] = useState({
    promotion: true,
    activityLog: true,
    booking: true,
    finance: true,
    reviewReminder: true,
    survey: true,
    promotionZalo: true,
    activityLogZalo: true,
    bookingZalo: true,
    financeZalo: true,
  });

  const handleToggle = (key) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Cài đặt thông báo</h2>

      {/* Tabs */}
      <div className="flex border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            tab === "email"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("email")}
        >
          Email
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ml-4 ${
            tab === "sms"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-500"
          }`}
          onClick={() => setTab("sms")}
        >
          {/* <img src={Icons.Zalo} className="mr-1" /> */}
          Tin nhắn
        </button>
      </div>

      {/* Settings */}
      <div className="space-y-6">
        {settingsData[tab].map((group, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              {group.group}
            </h3>
            <div className="space-y-4">
              {group.options.map((option) => (
                <div
                  key={option.key}
                  className="flex justify-between items-center bg-white p-4 border rounded"
                >
                  <div>
                    <div className="text-sm font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>
                  {/* Toggle switch */}
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toggles[option.key]}
                      onChange={() => handleToggle(option.key)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-red-600 relative transition">
                      <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform peer-checked:translate-x-5" />
                    </div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        {settingsData[tab].length === 0 && (
          <div className="text-sm text-gray-500">
            Không có cài đặt trong mục này.
          </div>
        )}
      </div>
    </div>
  );
}
