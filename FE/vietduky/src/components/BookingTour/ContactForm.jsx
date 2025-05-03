import PassengerInfoForm from "./PassengerInfoForm";
import { CustomerService } from "@/services/API/customer.service";
import { StorageService } from "@/services/storage/StorageService";
import { useEffect, useState } from "react";

const ContactForm = ({
  formData,
  setFormData,
  passengers,
  setPassengers,
  user,
  travelTourData,
  roomCost,
  setRoomCost,
  assistance,
  setAssistance,
}) => {
  const [passengerData, setPassengerData] = useState([]);

  useEffect(() => {
    if (assistance) {
      setPassengerData([]);
      setFormData((prev) => ({
        ...prev,
        passengers: [],
      }));
    }
  }, [assistance]);

  useEffect(() => {
    const adults = passengerData.filter((p) => p.type === "adult").length;
    const children = passengerData.filter((p) => p.type === "children").length;
    const toddlers = passengerData.filter((p) => p.type === "toddler").length;
    const infants = passengerData.filter((p) => p.type === "infant").length;

    setFormData((prev) => ({
      ...prev,
      travel_tour_id: travelTourData[0]?.id || "",
      number_adult: adults + passengers.adult,
      number_children: children + passengers.children,
      number_toddler: toddlers + passengers.toddler,
      number_newborn: infants + passengers.infant,
      passengers: passengerData ?? [],
    }));
  }, [passengers, passengerData, travelTourData]);

  console.log("Dữ liệu booking", formData);
  // console.log("Hành khách đã chọn:", passengerData);
  // console.log("Giá phòng đơn", roomCost);

  const handlePassengerDataChange = (data) => {
    // console.log("Received new passengerData:", data);

    if (!Array.isArray(data)) {
      // console.error("Invalid passengerData format:", data);
      setPassengerData([]);
      return;
    }

    const formattedPassengers = data.map((p) => ({
      name: p.name || "",
      birth_date: p.birthdate || "",
      gender: p.gender || "",
      phone_number: p.phone || "",
      single_room: p.singleRoom,
    }));

    setPassengerData(formattedPassengers);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePassengerChange = (type, increment) => {
    setPassengers((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] + increment),
    }));
  };

  const handleAssistanceChange = (e) => {
    setAssistance(e.target.checked);
  };

  console.log("Passenger data:", passengerData);

  // console.log("Hành khách", passengers);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Thông tin liên lạc */}
      <div className="text-xl font-bold">Thông tin liên lạc</div>
      {!user && (
        <div className="p-4 bg-[#ffe8ea] rounded-lg flex items-center gap-2">
          <span className="text-[#9e2418] font-semibold">Đăng nhập</span>
          <span className="text-zinc-900/90">
            để nhận ưu đãi, tích điểm và quản lý đơn hàng dễ dàng hơn!
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-bold after:content-['*'] after:text-red-500 after:ml-1">
            Họ tên
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Liên hệ"
            className="w-full py-2 rounded outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold after:content-['*'] after:text-red-500 after:ml-1">
            Điện thoại
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Nhập số điện thoại"
            className="w-full py-2 rounded outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold after:content-['*'] after:text-red-500 after:ml-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Nhập email"
            className="w-full py-2 rounded outline-none"
            required
          />
        </div>
        <div>
          <label className="block font-bold">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ"
            className="w-full py-2 rounded outline-none"
          />
        </div>
      </div>
      {/* Hành khách */}
      <div className="text-xl font-bold mb-4">Hành khách</div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: "Người lớn", type: "adult", desc: "Từ 12 trở lên", min: 0 },
          { label: "Trẻ em", type: "children", desc: "Từ 5 - 11 tuổi", min: 0 },
          {
            label: "Trẻ nhỏ",
            type: "toddler",
            desc: "Từ 2 - 4 tuổi",
            min: 0,
          },
          { label: "Em bé", type: "infant", desc: "Dưới 2 tuổi", min: 0 },
        ].map(({ label, type, desc, min }) => (
          <div
            key={type}
            className="flex items-center justify-between border rounded-lg p-4"
          >
            <div className="flex flex-col">
              <span className="font-bold">{label}</span>
              <span className="text-xs text-gray-500">{desc}</span>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => handlePassengerChange(type, -1)}>-</button>
              <span className="text-lg font-bold">{passengers[type]}</span>
              <button onClick={() => handlePassengerChange(type, 1)}>+</button>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-6 mt-4">
        <h2 className="text-xl font-bold text-neutral-900">
          Thông tin hành khách
        </h2>
        <div className="p-4 bg-[#ffe8eb] rounded-lg flex items-center gap-2.5">
          <input
            type="checkbox"
            name="assistance"
            checked={assistance}
            onChange={handleAssistanceChange}
            className="w-6 h-6 border border-[#5d5d5d] rounded-md"
          />
          <span className="text-sm font-semibold text-zinc-900/90">
            Tôi cần được nhân viên tư vấn VietDuKy trợ giúp nhập thông tin đăng
            ký dịch vụ
          </span>
        </div>
        {!assistance && (
          <PassengerInfoForm
            passengers={passengers}
            setPassengers={setPassengers}
            roomCost={roomCost}
            setRoomCost={setRoomCost}
            onPassengerDataChange={handlePassengerDataChange}
            setFormData={setFormData}
            assistance={assistance}
            setAssistance={setAssistance}
          />
        )}
      </div>

      <div className="border-b border-[#b1b1b1]" />
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Ghi chú</h3>
        <p className="text-base text-neutral-900">
          Quý khách có ghi chú lưu ý gì, hãy nói với chúng tôi
        </p>
        <textarea
          name="note"
          value={formData.note}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, note: e.target.value }))
          }
          placeholder="Vui lòng nhập nội dung lời nhắn bằng tiếng Anh hoặc tiếng Việt"
          className="p-4 w-full h-40 border rounded-md bg-[#f8f8f8]"
        ></textarea>
      </div>

      {/* <div>
        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Xác nhận thông tin
        </button>
      </div> */}
    </div>
  );
};

export default ContactForm;
