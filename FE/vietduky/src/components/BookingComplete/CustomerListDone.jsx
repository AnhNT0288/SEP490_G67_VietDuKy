import { PassengerService } from "@/services/API/passenger.service";
import { BookingService } from "@/services/API/booking.service"; // Import BookingService
import { useEffect, useState } from "react";

export default function CustomerListDone({ passengerData, bookingData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [passengerList, setPassengerList] = useState([]);
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    phone_number: "",
    gender: "true", // Mặc định là Nam
    birth_date: "",
    passport_number: "", // Thêm trường passport_number
    booking_id: bookingData?.id, // Thêm trường booking_id
  });

  const toggleList = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    PassengerService.getPassengerByBookingId(bookingData?.id)
      .then((response) => {
        if (response?.data) {
          setPassengerList(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching passenger data:", error);
      });
  }, [bookingData?.id]);

  console.log("Passenger List:", passengerList);

  // Hàm tính độ tuổi và loại
  const calculateAgeAndType = (birthDate) => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }

    // Xác định loại dựa trên độ tuổi
    let type = "adult"; // Mặc định là người lớn
    if (age < 2) {
      type = "infant"; // Em bé
    } else if (age < 12) {
      type = "child"; // Trẻ em
    }

    // Gán label cho từng type
    const label =
      type === "adult" ? "Người lớn" : type === "child" ? "Trẻ em" : "Em bé";

    return { age, type, label };
  };

  return (
    <div className="border border-gray-400 rounded-lg overflow-hidden">
      {/* Header */}
      <div
        className="h-18 px-8 py-5 bg-[#f8f8f8] flex justify-between items-center cursor-pointer"
        onClick={toggleList}
      >
        <div className="text-[#a80f21] text-lg font-bold">
          DANH SÁCH KHÁCH HÀNG
        </div>
        <div
          className={`transition-transform duration-300 ${
            isExpanded ? "rotate-180" : ""
          }`}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M17.586 14.469C17.4618 14.6243 17.2809 14.7238 17.0833 14.7457C16.8856 14.7677 16.6873 14.7102 16.532 14.586L12 10.96L7.46803 14.586C7.31261 14.7103 7.1142 14.7677 6.91644 14.7456C6.71869 14.7236 6.53778 14.6239 6.41353 14.4685C6.28928 14.3131 6.23185 14.1147 6.25388 13.9169C6.27592 13.7192 6.37561 13.5383 6.53103 13.414L11.531 9.414C11.6641 9.30737 11.8295 9.24927 12 9.24927C12.1705 9.24927 12.336 9.30737 12.469 9.414L17.469 13.414C17.546 13.4755 17.6102 13.5517 17.6577 13.638C17.7053 13.7244 17.7354 13.8193 17.7463 13.9172C17.7571 14.0152 17.7486 14.1144 17.7211 14.2091C17.6936 14.3037 17.6477 14.3921 17.586 14.469Z"
              fill="black"
            />
          </svg>
        </div>
      </div>

      {/* Content (table) */}
      {isExpanded && (
        <div className="p-4">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 ">Họ tên</th>
                <th className="p-2 ">Điện thoại</th>
                <th className="p-2 ">Giới tính</th>
                <th className="p-2 ">Ngày sinh</th>
                <th className="p-2 ">Độ tuổi</th>
                <th className="p-2 ">Số CCCD/Passport</th>
                <th className="p-2 ">Phòng đơn</th>
              </tr>
            </thead>
            <tbody>
              {passengerList.map((passenger, index) => {
                const { age, type, label } = calculateAgeAndType(
                  passenger.birth_date
                ); // Tính toán độ tuổi và loại
                return (
                  <tr key={index}>
                    <td className="p-2 ">{passenger.name}</td>
                    <td className="p-2 ">{passenger.phone_number}</td>
                    <td className="p-2 ">{passenger.gender ? "Nam" : "Nữ"}</td>
                    <td className="p-2 ">{passenger.birth_date}</td>
                    <td className="p-2 ">{label}</td>
                    <td className="p-2 ">{passenger.passport_number}</td>{" "}
                    {/* Hiển thị số passport */}
                    {type === "adult" && (
                      <td className="p-2  text-center">
                        <input
                          type="checkbox"
                          checked={passenger.singleRoom}
                          readOnly
                        />
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
