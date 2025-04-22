import TextEditor from "../../../lib/TextEditor.jsx";
import { FaArrowRight } from "react-icons/fa";
import { useEffect, useState } from "react";
import {fetchLocations, fetchServices, fetchTypeTours} from "../../../services/service.js";
import { createTour } from "../../../services/API/tour.service.js";
import ModalConfirmTravelTour from "../ModalConfirm/ModalConfirmTravelTour.jsx";
import Select from "react-select"; // Import React Select đúng cách

// eslint-disable-next-line react/prop-types
export default function ModalAddTour({ onClose, onCreateSuccess }) {
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [typeTours, setTypeTours] = useState([]);
  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingTourData, setPendingTourData] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const [tourData, setTourData] = useState({
    name_tour: "",
    price_tour: "",
    day_number: "",
    max_people: "10",
    activity_description: "",
    start_location: "",
    end_location: "",
    available_month: "3",
    type_id: "",
    service_id: [],
    rating_tour: "5",
    album: [],
    travel_tours: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLocations(await fetchLocations());
      setServices(await fetchServices());
      setTypeTours(await fetchTypeTours());
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "price_tour") {
      const raw = value.replace(/[^\d]/g, "");
      setTourData((prev) => ({ ...prev, [name]: raw }));
    } else {
      setTourData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditorChange = (content) => {
    setTourData((prev) => ({ ...prev, activity_description: content }));
  };

  const handleServiceChange = (selectedOptions) => {
    setTourData((prev) => ({
      ...prev,
      service_id: selectedOptions.map((option) => option.value),
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      setTourData((prev) => ({
        ...prev,
        album: [...prev.album, ...newFiles], // ✅ giữ ảnh cũ + ảnh mới
      }));
      setPreviewImages((prev) => [
        ...prev,
        ...newFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!tourData.activity_description.trim()) {
      alert("Vui lòng nhập mô tả hành trình!");
      return;
    }

    setPendingTourData(tourData);
    setIsConfirmModalOpen(true);
  };

  const handleCreateTour = async (callback) => {
    try {
      const formData = new FormData();

      Object.keys(pendingTourData).forEach((key) => {
        if (key === "travel_tours") {
          formData.append(key, JSON.stringify(pendingTourData[key]));
        } else if (key === "album") {
          pendingTourData.album.forEach((file) => {
            formData.append("album", file);
          });
        } else if (key === "service_id") {
          formData.append("service_ids", JSON.stringify(pendingTourData.service_id.map(Number)));
          formData.append("service_id", pendingTourData.service_id[0]);
          console.log("== FormData Preview ==");
          for (let pair of formData.entries()) {
            console.log(pair[0] + ": " + pair[1]);
          }
        } else if (
            pendingTourData[key] !== null &&
            pendingTourData[key] !== undefined
        ) {
          formData.append(key, pendingTourData[key]);
        }
      });
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }
      const response = await createTour(formData);
      console.log("API response:", response);

      const tour = response?.tour;
      if (tour) {
        callback?.(tour);
      } else {
        alert("Tạo Tour thất bại!");
      }
    } catch (error) {
      alert(`Lỗi: ${JSON.stringify(error.response?.data)}`);
      console.error("Lỗi API:", error.response?.data || error.message);
    }
  };

  const handleConfirm = () => {
    setIsConfirmModalOpen(false);
    handleCreateTour((tour) => {
      onCreateSuccess?.(tour);
    });
  };

  const handleCancel = () => {
    setIsConfirmModalOpen(false);
    handleCreateTour(() => {
      alert("Tạo Tour thành công!");
      onClose();
    });
  };

  const formatCurrency = (value) => {
    return Number(value).toLocaleString("vi-VN");
  };

  const handleWrapperClick = () => {
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center" onClick={handleWrapperClick}>
      <div className="bg-white p-6 rounded-lg shadow-lg w-3/4 h-5/7" onClick={handleModalClick}>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-6">
            {/* Cột trái */}
            <div className="w-2/5">
              <h2 className="text-lg font-semibold">Thêm Tour du lịch</h2>
              <h6 className="text-sm mb-4 text-SmokyGray">
                Quản trị viên thêm Tour du lịch mới
              </h6>

              {/* Mã Tour */}

              <input type="text" name="name_tour" className="w-full p-2 border rounded mb-4 hidden" placeholder="Mã Tour" disabled/>

              {/* Tên Tour */}
              <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                Tên Tour
              </label>
              <input type="text" name="name_tour" className="w-full p-2 border rounded mb-4 " placeholder="Nhập tên tour" value={tourData.name_tour} onChange={handleChange} required/>

              <div className="flex items-center gap-4">

                {/* Điểm khởi hành */}
                <div>
                  <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                    Điểm khởi hành
                  </label>
                  <select name="start_location" className="w-[250px] p-2 border rounded text-gray-600" value={tourData.start_location} onChange={handleChange} required>
                    <option value="" disabled>
                      Chọn điểm khởi hành
                    </option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name_location}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Mũi tên */}
                <FaArrowRight className="text-gray-400 text-lg" />

                {/* Điểm đến */}
                <div>
                  <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                    Điểm đến
                  </label>
                  <select name="end_location" className="w-[250px] p-2 border rounded text-gray-600" value={tourData.end_location} onChange={handleChange} required>
                    <option value="" disabled>
                      Chọn điểm đến
                    </option>
                    {locations.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name_location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Số ngày */}
              <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                Số ngày
              </label>
              <input type="number" name="day_number" className="w-full p-2 border rounded mb-4" placeholder="Nhập số ngày" value={tourData.day_number} onChange={handleChange} required/>

              {/* Giá tour */}
              <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                Giá tour
              </label>
              <input
                  type="text"
                  name="price_tour"
                  className="w-full p-2 border rounded mb-4"
                  placeholder="Nhập giá tour"
                  value={formatCurrency(tourData.price_tour)}
                  onChange={handleChange}
                  onBlur={(e) => {
                    const raw = e.target.value.replace(/[^\d]/g, "");
                    setTourData((prev) => ({ ...prev, price_tour: raw }));
                  }}
                  required
              />

              {/* loại Tour */}
              <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                Loại Tour
              </label>
              <select
                name="type_id"
                value={tourData.type_id}
                onChange={(e) => {
                  setTourData((prev) => ({
                    ...prev,
                    type_id: e.target.value,
                  }));
                }}
                required
                className="w-full p-2 border rounded text-gray-600"
              >
                <option value="" disabled>
                  Chọn loại Tour
                </option>
                {typeTours.length > 0 ? (
                  typeTours.map((typeTours) => (
                    <option key={typeTours.id} value={typeTours.id}>
                      {typeTours.name_type}
                    </option>
                  ))
                ) : (
                  <option disabled>Không có loại Tour</option>
                )}
              </select>

              {/* Dịch vụ */}
              <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                Dịch vụ
              </label>
              <Select
                  isMulti
                  options={services.map((service) => ({
                    value: service.id,
                    label: service.name_service,
                  }))}
                  value={tourData.service_id.map((id) => ({
                    value: id,
                    label: services.find((service) => service.id === id)?.name_service,
                  }))}
                  onChange={handleServiceChange}
                  className="w-full mb-2"
                  placeholder="Chọn dịch vụ kèm theo"
                  isSearchable
              />

              {/* Ảnh minh họa */}
              <label className="block mb-2 font-medium before:content-['*'] before:text-red-500 before:mr-1">
                Ảnh bìa
              </label>
              <div
                  className="w-full h-36 border-2 border-dashed border-gray-400 rounded-lg flex items-center justify-center text-center bg-gray-50 text-gray-600 cursor-pointer hover:bg-gray-100 transition"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const newFiles = Array.from(e.dataTransfer.files);
                    if (newFiles.length > 0) {
                      setTourData((prev) => ({
                        ...prev,
                        album: [...prev.album, ...newFiles],
                      }));
                      setPreviewImages((prev) => [
                        ...prev,
                        ...newFiles.map((file) => URL.createObjectURL(file)),
                      ]);
                    }
                  }}
                  onClick={() => document.getElementById("fileInput")?.click()}
              >
                {previewImages.length > 0 ? (
                    <div className="flex gap-2 overflow-x-auto">
                      {previewImages.slice(0, 3).map((src, index) => {
                        const remaining = previewImages.length - 3;
                        return (
                            <div key={index} className="relative group">
                              <img
                                  src={src}
                                  alt={`Ảnh ${index + 1}`}
                                  className="h-36 w-auto object-cover rounded"
                              />

                              {/* Hiển thị lớp phủ +n nếu là ảnh thứ 3 và còn ảnh dư */}
                              {index === 2 && remaining > 0 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl font-bold rounded">
                                    +{remaining}
                                  </div>
                              )}

                              {/* Nút xoá ảnh */}
                              <button
                                  type="button"
                                  className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded px-1 text-xs hidden group-hover:block"
                                  onClick={(e) => {
                                    e.stopPropagation(); // ✅ Ngăn lan truyền sự kiện ra ngoài
                                    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
                                    setTourData((prev) => ({
                                      ...prev,
                                      album: prev.album.filter((_, i) => i !== index),
                                    }));
                                  }}
                              >
                                ✕
                              </button>
                            </div>
                        );
                      })}
                    </div>
                ) : (
                    <span>Kéo & thả ảnh Tour tại đây (.png .jpg .jpeg)</span>
                )}
              </div>
              <input
                  type="file"
                  id="fileInput"
                  accept=".png,.jpg,.jpeg"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
              />

            </div>

            {/* Cột phải */}
            <div className="w-3/5">

              <div>
                <label className="block mb-2 font-medium">
                  Mô tả hành trình
                </label>
                <TextEditor value={tourData.activity_description} onChange={handleEditorChange}/>
              </div>
            </div>
          </div>

          {/* Button Actions */}
          <div className="flex justify-end gap-4 mt-4">
            <button type="button" className="bg-gray-300 px-4 py-2 rounded-md" onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className="bg-red-700 text-white px-4 py-2 rounded-md">
              Tạo Tour mới
            </button>
          </div>
        </form>
      </div>
      {isConfirmModalOpen && (
          <ModalConfirmTravelTour
              open={isConfirmModalOpen}
              onCancel={handleCancel}
              onConfirm={handleConfirm}
          />
      )}
    </div>
  );
}
