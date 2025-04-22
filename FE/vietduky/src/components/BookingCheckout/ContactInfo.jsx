const ContactInfo = ({ bookingData }) => {
  return (
    <div className="p-6 bg-gray-50 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-red-600 text-lg font-bold">Thông tin liên lạc</h2>
      <div className="border-t border-gray-300 my-3"></div>

      <div className="grid grid-cols-2 gap-4 text-gray-900">
        <div>
          <p className="font-semibold">Họ tên</p>
          <p className="text-gray-700">{bookingData?.name || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Email</p>
          <p className="text-gray-700">{bookingData?.email || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Địa chỉ</p>
          <p className="text-gray-700">{bookingData?.address || "N/A"}</p>
        </div>
        <div>
          <p className="font-semibold">Điện thoại</p>
          <p className="text-gray-700">{bookingData?.phone || "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
