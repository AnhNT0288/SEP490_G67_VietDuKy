import { useEffect, useState } from "react";

const LocationSelector = ({ locations, value, onChange }) => {
  const [query, setQuery] = useState(value || "");
  const [showOptions, setShowOptions] = useState(false);

  const filteredLocations = locations.filter((loc) =>
    loc.name_location.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (locationName) => {
    setQuery(locationName);
    onChange(locationName);
    setShowOptions(false);
  };

  useEffect(() => {
    setQuery(value || "");
  }, [value]);

  return (
    <div className="relative w-60">
      <input
        type="text"
        placeholder="Nhập hoặc chọn địa điểm"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowOptions(true);
          onChange(e.target.value); // Nếu cần lọc theo từ khóa
        }}
        onFocus={() => setShowOptions(true)}
        onBlur={() => setTimeout(() => setShowOptions(false), 100)}
        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-red-300"
      />
      {showOptions && (
        <ul className="absolute left-0 right-0 bg-white border border-gray-200 rounded shadow-md z-10 max-h-60 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((loc) => (
              <li
                key={loc.id}
                onClick={() => handleSelect(loc.name_location)}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {loc.name_location}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-400 italic">Không tìm thấy</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default LocationSelector;
