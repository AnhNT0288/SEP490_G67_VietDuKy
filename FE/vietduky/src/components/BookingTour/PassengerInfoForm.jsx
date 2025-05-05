import Icons from "../Icons/Icon";
import { excelDateToJSDate, formatDate } from "@/utils/dateUtil";
import { exportTemplate } from "@/utils/excelUtils";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const PassengerInfoForm = ({
  passengers,
  onPassengerDataChange,
  setPassengers,
  roomCost,
  setRoomCost,
  assistance,
  setAssistance,
  currentSlot,
}) => {
  const [passengerData, setPassengerData] = useState([]);
  
  const [touchedFields, setTouchedFields] = useState({});
  const [manualPassenger, setManualPassenger] = useState([false]);
  const validatePhoneNumber = (phone) => /^0\d{9,10}$/.test(phone);

  const isDateInRange = (dateStr) => {
    if (!dateStr) return false;
    const date = new Date(dateStr);
    return date.getFullYear() >= 1900 && date <= new Date();
  };

  

  // console.log("assistance", assistance);
  console.log("currentSlot", currentSlot);
  
  
  const getPassengerErrors = (passenger) => {
    if (assistance) return {};
  
    const errors = {};
  
    // Họ tên
    if (!passenger.name?.trim()) {
      errors.name = "Họ tên không được để trống";
    }
  
    // Số điện thoại
    if (passenger.type === "adult") {
      if (!passenger.phone?.trim()) {
        errors.phone = "Số điện thoại không được để trống";
      } else if (!validatePhoneNumber(passenger.phone)) {
        errors.phone = "Số điện thoại không hợp lệ (phải bắt đầu bằng 0 và dài 10–11 số)";
      }
    }
  
    // Giới tính
    if (!passenger.gender) {
      errors.gender = "Vui lòng chọn giới tính";
    }
  
    // Ngày sinh
    if (!passenger.birthdate) {
      errors.birthdate = "Ngày tháng năm sinh không được để trống";
    } else if (!isDateInRange(passenger.birthdate)) {
      errors.birthdate = "Năm sinh phải từ 1900 đến hiện tại";
    }
  
    return errors;
  };
  

  const markFieldTouched = (passengerId, field) => {
    setTouchedFields((prev) => ({
      ...prev,
      [passengerId]: {
        ...prev[passengerId],
        [field]: true,
      },
    }));
  };

  const groupedPassengers = passengerData.reduce((acc, passenger) => {
    if (!acc[passenger.type]) {
      acc[passenger.type] = {
        label: passenger.label,
        desc: passenger.desc,
        list: [],
      };
    }
    acc[passenger.type].list.push(passenger);
    return acc;
  }, {});

  useEffect(() => {
    const newPassengers = [];

    ["adult", "children", "toddler", "infant"].forEach((type) => {
      const count = passengers[type] || 0;
      const existingPassengers = passengerData.filter((p) => p.type === type);

      for (let i = 0; i < count; i++) {
        if (existingPassengers[i]) {
          newPassengers.push(existingPassengers[i]);
        } else {
          newPassengers.push({
            id: `${type}-${i}-${Date.now()}`,
            type,
            label:
              type === "adult"
                ? "Người lớn"
                : type === "children"
                ? "Trẻ em"
                : type === "toddler"
                ? "Trẻ nhỏ"
                : "Em bé",
            desc:
              type === "adult"
                ? "Từ 12 trở lên"
                : type === "children"
                ? "Từ 5 - 11 tuổi"
                : type === "toddler"
                ? "Từ 2 - 4 tuổi"
                : "Dưới 2 tuổi",
            name: "",
            phone: "",
            gender: "",
            birthdate: "",
            passport: "",
            singleRoom: false,
          });
        }
      }
    });

    // Chỉ cập nhật state nếu dữ liệu thay đổi
    if (JSON.stringify(passengerData) !== JSON.stringify(newPassengers)) {
      setPassengerData(newPassengers);
      onPassengerDataChange(newPassengers);
    }
  }, [passengers]);

  useEffect(() => {
    onPassengerDataChange(passengerData);
    calculateRoomCost();
  }, [passengerData]);

  const handleChangeInput = (passengerId, field, value) => {
    setPassengerData((prev) => {
      const updatedPassengers = prev.map((p) => {
        if (p.id === passengerId) {
          return { ...p, [field]: value };
        }
        return p;
      });

      onPassengerDataChange(updatedPassengers);
      return updatedPassengers;
    });
  };

  const calculateRoomCost = () => {
    const roomCost = 240000; // Giá phòng đơn
    const totalRoomCost = passengerData.reduce((acc, passenger) => {
      if (passenger.type === "adult" && passenger.singleRoom) {
        acc += roomCost; // Cộng giá nếu là người lớn và có phòng đơn
      }
      return acc;
    }, 0);
    setRoomCost(totalRoomCost); // Cập nhật roomCost
  };

  

  const calculateAge = (birthdate) => {
    const birth = new Date(birthdate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.readAsBinaryString(file);
  
    reader.onload = (e) => {
      const workbook = XLSX.read(e.target.result, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet);
    
      const formattedData = data.map((row, index) => {
        const birthdate = row["Ngày sinh"] ? excelDateToJSDate(row["Ngày sinh"]) : "";
        const age = birthdate ? calculateAge(birthdate) : null;
    
        let type = "adult";
        if (age !== null) {
          if (age < 2) type = "infant";
          else if (age < 5) type = "toddler";
          else if (age < 12) type = "children";
        }
    
        return {
          id: `${type}-${index}-${Date.now()}`,
          name: row["Họ tên"] || "",
          phone: row["Số điện thoại"] || "",
          gender: row["Giới tính"]?.toLowerCase() === "nữ" ? "false" : "true",
          passport: row["CCCD/Hộ chiếu"] || "",
          birthdate,
          age,
          type,
          label: type === "adult" ? "Người lớn" : type === "children" ? "Trẻ em" : type === "toddler" ? "Trẻ nhỏ" : "Em bé",
          desc: type === "adult" ? "Từ 12 trở lên" : type === "children" ? "Từ 5 - 11 tuổi" : type === "toddler" ? "Từ 2 - 4 tuổi" : "Dưới 2 tuổi",
          singleRoom: row["Phòng đơn"]?.toLowerCase() === "có"
        };
      });
    
      // // Tổng số người hiện tại + số thêm mới
      // const currentTotal = passengerData.length;
      // const newTotal = formattedData.length;
      // const totalAfterAdd = currentTotal + newTotal;
    
      // if (totalAfterAdd > currentSlot) {
      //   alert(
      //     `Vượt quá số lượng slot còn lại! Hiện còn ${currentSlot - currentTotal} slot.`
      //   );
      //   return;
      // }
    
      const invalidPassengers = formattedData.filter((p) => {
        const errors = getPassengerErrors(p);
        return Object.keys(errors).length > 0;
      });
    
      if (invalidPassengers.length > 0) {
        alert(
          `Dữ liệu không hợp lệ trong file Excel. Vui lòng kiểm tra lại các dòng bị thiếu thông tin hoặc sai định dạng.`
        );
        return;
      }
    
      // Dữ liệu hợp lệ và không vượt slot
      setPassengerData((prev) => {
        const filledSlots = prev.filter(p => p.name || p.phone || p.gender || p.birthdate);
        const emptySlots = prev.filter(p => !p.name && !p.phone && !p.gender && !p.birthdate);
      
        const overwriteCount = Math.min(emptySlots.length, formattedData.length);
        const overwriteData = formattedData.slice(0, overwriteCount);
        const appendData = formattedData.slice(overwriteCount);
      
        const updatedPassengers = [
          ...filledSlots,
          ...overwriteData.map((data, idx) => ({
            ...data,
            id: emptySlots[idx].id, // giữ nguyên ID
          })),
          ...appendData,
        ];
      
        if (updatedPassengers.length > currentSlot) {
          alert(`Vượt quá số lượng slot còn lại! Hiện còn ${currentSlot} slot.`);
          return prev; // giữ nguyên không thay đổi
        }
      
        const passengerCounts = {
          adult: updatedPassengers.filter((p) => p.type === "adult").length,
          children: updatedPassengers.filter((p) => p.type === "children").length,
          toddler: updatedPassengers.filter((p) => p.type === "toddler").length,
          infant: updatedPassengers.filter((p) => p.type === "infant").length,
        };
      
        setPassengers(passengerCounts);
        onPassengerDataChange(updatedPassengers);
        return updatedPassengers;
      });
    };
    
  };

  console.log("Dữ liệu hành khách:", passengerData);

  return (
    <div>
      <div className="w-full flex flex-row justify-end gap-4">
        <button
          type="button"
          onClick={exportTemplate}
          className="w-1/4 py-2 bg-[#f8f8f8] border border-[#A80F21] font-semibold text-[#A80F21] rounded-md flex items-center justify-center gap-2"
        >
          <img src={Icons.FileDown} alt="FileDown" className="w-4 h-4" />
          Tải danh sách mẫu
        </button>

        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileUpload}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="w-1/4 py-2 bg-[#A80F21] text-white text-center rounded-md cursor-pointer"
        >
          Thêm danh sách khách hàng
        </label>
      </div>

      {!assistance &&
        Object.entries(groupedPassengers).map(([type, group]) => (
          <div key={type} className="space-y-4">
            <h3>
              <span className="font-bold">{group.label}</span>{" "}
              <span>({group.desc})</span>
            </h3>

            {group.list.map((passenger, index) => {
              const errors = getPassengerErrors(passenger);

              return (
                <div key={index} className="bg-white rounded-md">
                  <div className="grid grid-cols-5 gap-4 mt-2 items-start">
                    {/* Họ tên */}
                    <div className="border-r border-gray-300">
                      <label className="text-sm font-semibold block mb-1">
                        Họ tên
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={passenger.name}
                        onChange={(e) =>
                          handleChangeInput(
                            passenger.id,
                            "name",
                            e.target.value
                          )
                        }
                        onBlur={() => markFieldTouched(passenger.id, "name")}
                        placeholder="Liên hệ"
                        className="w-full p-2 rounded-md text-sm outline-none"
                        required
                      />
                      {touchedFields[passenger.id]?.name && errors.name && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Điện thoại */}
                    <div className="border-r border-gray-300">
                      <label className="text-sm font-semibold block mb-1">
                        Điện thoại
                      </label>
                      <input
                        type="text"
                        name="phone"
                        value={passenger.phone}
                        onChange={(e) =>
                          handleChangeInput(
                            passenger.id,
                            "phone",
                            e.target.value.replace(/\D/g, "")
                          )
                        }
                        onBlur={() => markFieldTouched(passenger.id, "phone")}
                        placeholder="Số điện thoại"
                        className="w-full p-2 rounded-md text-sm outline-none"
                      />
                      {touchedFields[passenger.id]?.phone && errors.phone && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Giới tính */}
                    <div className="border-r border-gray-300">
                      <label className="text-sm font-semibold block mb-1">
                        Giới tính
                      </label>
                      <select
                        name="gender"
                        value={passenger.gender}
                        onChange={(e) => {
                          handleChangeInput(
                            passenger.id,
                            "gender",
                            e.target.value
                          );
                          markFieldTouched(passenger.id, "gender");
                        }}
                        className={`w-full p-2 text-sm outline-none focus:border-black transition-all bg-transparent appearance-none pr-6 bg-no-repeat bg-right ${
                          passenger.gender ? "text-black" : "text-gray-400"
                        }`}
                        style={{ appearance: "none" }}
                        required
                      >
                        <option value="" disabled hidden>
                          Chọn giới tính
                        </option>
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                      </select>
                      {touchedFields[passenger.id]?.gender && errors.gender && (
                        <p className="text-xs text-red-500 mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    {/* Ngày sinh */}
                    <div className="border-r border-gray-300">
                      <label className="text-sm font-semibold block mb-1">
                        Ngày sinh
                      </label>
                      <input
                        type="text"
                        name="birthdate"
                        value={passenger.birthdate}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) => {
                          e.target.type = "text";
                          markFieldTouched(passenger.id, "birthdate");
                        }}
                        onChange={(e) =>
                          handleChangeInput(
                            passenger.id,
                            "birthdate",
                            e.target.value
                          )
                        }
                        min="1900-01-01"
                        max={new Date().toISOString().split("T")[0]}
                        placeholder="Chọn ngày sinh"
                        className="w-full p-2 text-sm outline-none"
                      />
                      {touchedFields[passenger.id]?.birthdate &&
                        errors.birthdate && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.birthdate}
                          </p>
                        )}
                    </div>

                    {/* Phòng đơn */}
                    {type === "adult" && (
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-semibold">
                          Phòng đơn
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            name="singleRoom"
                            checked={passenger.singleRoom}
                            onChange={(e) =>
                              handleChangeInput(
                                passenger.id,
                                "singleRoom",
                                e.target.checked
                              )
                            }
                            className="hidden"
                            id={`singleRoomToggle-${passenger.id}`}
                          />
                          <label
                            htmlFor={`singleRoomToggle-${passenger.id}`}
                            className={`relative cursor-pointer w-10 h-5 rounded-full flex items-center transition-all ${
                              passenger.singleRoom
                                ? "bg-red-500"
                                : "bg-gray-300"
                            }`}
                          >
                            <span
                              className={`absolute w-4 h-4 bg-white rounded-full transition-all ${
                                passenger.singleRoom
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            ></span>
                          </label>
                          <span
                            className={`text-sm font-semibold ${
                              passenger.singleRoom
                                ? "text-red-500"
                                : "text-black"
                            }`}
                          >
                            240.000 ₫
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
    </div>
  );
};

export default PassengerInfoForm;
