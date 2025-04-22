import React, { useState, useEffect } from "react";

const TourFilter = ({ onFilter, locations, typeTours, activeTopics, initialDeparture, initialDate, initialDestination }) => {
  const [selectedBudget, setSelectedBudget] = useState("");
  const [departure, setDeparture] = useState(initialDeparture);
  const [destination, setDestination] = useState(initialDestination);
  const [date, setDate] = useState(initialDate);
  const [selectedTourType, setSelectedTourType] = useState("");
  const [selectedTourTheme, setSelectedTourTheme] = useState("");

  const budgetOptions = [
    { label: "Dưới 5 triệu", value: "under5m" },
    { label: "Từ 5 - 10 triệu", value: "5mTo10m" },
    { label: "Từ 10 - 20 triệu", value: "10mTo20m" },
    { label: "Trên 20 triệu", value: "over20m" },
  ];

  const tourTypeOptions = typeTours.map((type) => ({
    id: type.id,
    name: type.name_type,
  }));

  const tourThemeOptions = activeTopics.map((topic) => ({
    id: topic.id,
    name: topic.name,
  }));

  useEffect(() => {
    onFilter({
      departure,
      destination,
      date,
      priceRange: selectedBudget,
      tourType: selectedTourType,
      tourTheme: selectedTourTheme,
    });
  }, [departure, destination, date, selectedBudget, selectedTourType, selectedTourTheme]); // Gọi lại khi các giá trị thay đổi

  return (
    <div className="w-full max-w-[350px] rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Ngân sách */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Ngân sách:</h3>
        <div className="grid grid-cols-2 gap-2">
          {budgetOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                const newBudget = option.value === selectedBudget ? "" : option.value;
                setSelectedBudget(newBudget);
              }}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedBudget === option.value
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Điểm khởi hành */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Điểm khởi hành</label>
        <select
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option>Tất cả</option>
          {locations.map((location) => (
            <option key={location.id} value={location.name_location}>
              {location.name_location}
            </option>
          ))}
        </select>
      </div>
      {/* Điểm khởi hành */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Điểm khởi hành</label>
        <select
          value={departure}
          onChange={(e) => setDeparture(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option>Tất cả</option>
          {locations.map((location) => (
            <option key={location.id} value={location.name_location}>
              {location.name_location}
            </option>
          ))}
        </select>
      </div>

      {/* Điểm đến */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Điểm đến</label>
        <select
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        >
          <option>Tất cả</option>
          {locations.filter(location => location.name_location !== departure).map((location) => (
            <option key={location.id} value={location.name_location}>
              {location.name_location}
            </option>
          ))}
        </select>
      </div>

      {/* Ngày đi */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ngày đi</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>
      {/* Ngày đi */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Ngày đi</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border rounded-md px-3 py-2 text-sm"
        />
      </div>

      {/* Dòng tour */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-medium">Dòng Tour</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {tourTypeOptions.map(({ name, id }) => (
            <button
              key={id}
              onClick={() => {
                const newTourType = selectedTourType === id ? "" : id;
                setSelectedTourType(newTourType);
              }}
              className={`px-3 py-1 rounded-full border text-sm ${
                selectedTourType === id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-600 border-gray-300"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Chủ đề */}
      <div className="mb-4">
        <h3 className="text-sm font-medium mb-2">Tours theo chủ đề</h3>
        <div className="flex flex-col gap-2">
          {tourThemeOptions.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => {
                const newTourTheme = selectedTourTheme === id ? "" : id;
                setSelectedTourTheme(newTourTheme);
              }}
              className={`w-full text-left px-3 py-2 rounded-md text-sm border ${
                selectedTourTheme === id
                  ? "bg-primary text-white border-primary"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      </div>

      {/* Nút Clear Filter */}
      <button
        onClick={() => {
          setSelectedBudget("");
          setDeparture("Tất cả");
          setDestination("Tất cả");
          setDate("");
          setSelectedTourType("");
          setSelectedTourTheme("");
        }}
        className="w-full mt-2 bg-gray-300 text-black py-2 rounded-md text-sm font-semibold hover:bg-gray-400 transition duration-200"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
};

export default TourFilter;
