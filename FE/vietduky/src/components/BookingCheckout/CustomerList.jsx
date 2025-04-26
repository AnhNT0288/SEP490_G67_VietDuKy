import { PassengerService } from "@/services/API/passenger.service";
import { BookingService } from "@/services/API/booking.service"; // Import BookingService
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

export default function CustomerList({
  bookingData,
  travelTourData,
  setBookingData,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [passengerList, setPassengerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newPassenger, setNewPassenger] = useState({
    name: "",
    phone_number: "",
    gender: "true", // Mặc định là Nam
    birth_date: "",
    passport_number: "", // Thêm trường passport_number
    booking_id: bookingData?.id, // Thêm trường booking_id
    single_room: "false", // Mặc định là không
  });
  const [editingRowId, setEditingRowId] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone_number: "",
    gender: true,
    birth_date: "",
    singleRoom: false,
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
    } else if (age < 5) {
      type = "child"; // Trẻ em
    } else if (age < 12) {
      type = "toddler";
    }
    // Gán label cho từng type
    const label =
      type === "adult"
        ? "Người lớn"
        : type === "child"
        ? "Trẻ em"
        : type === "toddler"
        ? "Trẻ nhỏ"
        : "Em bé";

    return { age, type, label };
  };

  // Hàm thêm hành khách
  const addPassenger = () => {
    PassengerService.createPassenger(newPassenger)
      .then((response) => {
        if (response?.data) {
          // Cập nhật danh sách hành khách
          const updatedPassengerList = [...passengerList, response.data.data];
          setPassengerList(updatedPassengerList);
          updateBookingInfo(updatedPassengerList);
          setNewPassenger({
            name: "",
            phone_number: "",
            gender: "true",
            birth_date: "",
            passport_number: "",
            single_room: "false",
            booking_id: bookingData?.id,
          });
        }
      })
      .catch((error) => {
        console.error("Error adding passenger:", error);
      });
  };

  const handleEditPassenger = (passenger) => {
    setEditingRowId(passenger.id);
    setEditForm({
      name: passenger.name,
      phone_number: passenger.phone_number,
      gender: passenger.gender,
      birth_date: passenger.birth_date,
      singleRoom: passenger.singleRoom,
    });
  };

  const handleSaveEdit = async (passengerId) => {
    PassengerService.updatePassenger(passengerId, editForm)
      .then(() => {
        const updatedPassengerList = passengerList.map((p) =>
          p.id === passengerId ? { ...p, ...editForm } : p
        );
        setPassengerList(updatedPassengerList);
        updateBookingInfo(updatedPassengerList);
        setEditingRowId(null);
      })
      .catch((error) => console.error("Error updating passenger:", error));
  };

  const handleCancelEdit = () => {
    setEditingRowId(null);
  };

  const handleDeletePassenger = (passengerId) => {
    if (confirm("Bạn có chắc chắn muốn xóa hành khách này?")) {
      PassengerService.deletePassenger(passengerId)
        .then(() => {
          const updatedPassengerList = passengerList.filter(
            (p) => p.id !== passengerId
          );
          setPassengerList(updatedPassengerList);
          updateBookingInfo(updatedPassengerList);
        })
        .catch((error) => console.error("Error deleting passenger:", error));
    }
  };

  const updateBookingInfo = (updatedPassengerList) => {
    const bookingId = Number(bookingData?.id);

    if (!bookingId) {
      console.error("Không tìm thấy booking ID!");
      return;
    }

    const summary = calculateBookingSummary(updatedPassengerList);

    BookingService.updateBooking(bookingId, summary)
      .then(() => {
        console.log("Booking cập nhật thành công!");
        setBookingData((prev) => ({
          ...prev,
          data: {
            ...prev.data,
            data: {
              ...prev.data.data,
              ...summary,
            },
          },
        }));
      })
      .catch((err) => {
        console.error("Lỗi update booking:", err);
      });
  };

  const calculateBookingSummary = (passengers) => {
    let number_adult = 0;
    let number_children = 0;
    let number_toddler = 0;
    let number_newborn = 0;
    let total_cost = 0;

    passengers.forEach((p, index) => {
      const { type } = calculateAgeAndType(p.birth_date);

      if (type === "adult") {
        number_adult++;
        total_cost += travelTourData.price_tour;
      } else if (type === "child") {
        number_children++;
        total_cost += travelTourData.children_price;
      } else if (type === "toddler") {
        number_toddler++;
        total_cost += travelTourData.toddler_price;
      } else if (type === "infant") {
        number_newborn++;
      }

      // Nếu có chọn phòng đơn
      if (p.singleRoom || p.single_room) {
        total_cost += 300000;
      }
    });

    return {
      number_adult,
      number_children,
      number_toddler,
      number_newborn,
      total_cost,
    };
  };

  const filteredPassengers = passengerList.filter((passenger) => {
    const lowerKeyword = searchTerm.toLowerCase();
    return (
      passenger.name.toLowerCase().includes(lowerKeyword) ||
      passenger.phone_number.toLowerCase().includes(lowerKeyword)
    );
  });

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
          <div className="flex justify-between mb-3">
            <input
              type="text"
              placeholder="Tìm kiếm bằng tên hoặc số điện thoại"
              className="border rounded px-3 py-1 w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="space-x-2">
              <button className="px-3 py-1 border bg-white border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white">
                Xuất danh sách
              </button>
              <button className="px-3 py-1 border bg-white border-red-500 text-red-600 rounded hover:bg-red-500 hover:text-white">
                Đăng tải danh sách
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white border border-red-500 rounded hover:text-red-600 hover:bg-white"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? "Ẩn" : "Thêm khách hàng"}
              </button>
            </div>
          </div>

          {/* Form thêm hành khách */}
          {showForm && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Họ tên"
                className="border rounded px-3 py-1 mb-2 "
                value={newPassenger.name}
                onChange={(e) =>
                  setNewPassenger({ ...newPassenger, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Số điện thoại"
                className="border rounded px-3 py-1 mb-2 "
                value={newPassenger.phone_number}
                onChange={(e) =>
                  setNewPassenger({
                    ...newPassenger,
                    phone_number: e.target.value,
                  })
                }
              />
              <select
                className="border rounded px-3 py-1 mb-2 "
                value={newPassenger.gender}
                onChange={(e) =>
                  setNewPassenger({ ...newPassenger, gender: e.target.value })
                }
              >
                <option value="true">Nam</option>
                <option value="false">Nữ</option>
              </select>
              <input
                type="date"
                className="border rounded px-3 py-1 mb-2 "
                value={newPassenger.birth_date}
                onChange={(e) =>
                  setNewPassenger({
                    ...newPassenger,
                    birth_date: e.target.value,
                  })
                }
              />
              {/* <input
                type="text"
                placeholder="Số passport"
                className="border rounded px-3 py-1 mb-2 "
                value={newPassenger.passport_number}
                onChange={(e) =>
                  setNewPassenger({
                    ...newPassenger,
                    passport_number: e.target.value,
                  })
                }
              /> */}
              <button
                className="px-3 py-1 mt-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={addPassenger}
              >
                Xác nhận thêm
              </button>
            </div>
          )}

          <table className="w-full ">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-2 ">Họ tên</th>
                <th className="p-2 ">Điện thoại</th>
                <th className="p-2 ">Giới tính</th>
                <th className="p-2 ">Ngày sinh</th>
                <th className="p-2 ">Độ tuổi</th>
                <th className="p-2 ">Phòng đơn</th>
                <th className="p-2 ">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {passengerList.map((passenger) => {
                const { type, label } = calculateAgeAndType(
                  passenger.birth_date
                );
                const isEditing = editingRowId === passenger.id;

                return (
                  <tr key={passenger.id}>
                    {/* Họ tên */}
                    <td className="p-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            setEditForm({ ...editForm, name: e.target.value })
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        passenger.name
                      )}
                    </td>

                    {/* Điện thoại */}
                    <td className="p-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.phone_number}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              phone_number: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        passenger.phone_number
                      )}
                    </td>

                    {/* Giới tính */}
                    <td className="p-2">
                      {isEditing ? (
                        <select
                          value={editForm.gender ? "true" : "false"}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              gender: e.target.value === "true",
                            })
                          }
                          className="border rounded px-2 py-1"
                        >
                          <option value="true">Nam</option>
                          <option value="false">Nữ</option>
                        </select>
                      ) : passenger.gender ? (
                        "Nam"
                      ) : (
                        "Nữ"
                      )}
                    </td>

                    {/* Ngày sinh */}
                    <td className="p-2">
                      {isEditing ? (
                        <input
                          type="date"
                          value={editForm.birth_date}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              birth_date: e.target.value,
                            })
                          }
                          className="border rounded px-2 py-1"
                        />
                      ) : (
                        passenger.birth_date
                      )}
                    </td>

                    {/* Độ tuổi */}
                    <td className="p-2">{label}</td>

                    {/* Phòng đơn */}
                    {type === "adult" ? (
                      <td className="p-2 text-center">
                        {isEditing ? (
                          <input
                            type="checkbox"
                            checked={editForm.singleRoom}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                singleRoom: e.target.checked,
                              })
                            }
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={passenger.singleRoom}
                            readOnly
                          />
                        )}
                      </td>
                    ) : (
                      <td className="p-2"></td>
                    )}

                    {/* Thao tác */}
                    <td className="p-2 space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(passenger.id)}
                            className="text-blue-600 hover:text-blue-800 font-semibold"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="text-red-500 hover:text-red-700 font-semibold"
                          >
                            Hủy
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditPassenger(passenger)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaRegEdit size={20} />
                          </button>
                          <button
                            onClick={() => handleDeletePassenger(passenger.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <MdDeleteOutline size={20} />
                          </button>
                        </>
                      )}
                    </td>
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
