export default function TabsTour({ tabs, value, onChange }) {
  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex border-b border-gray-200">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => onChange(tab.value)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-200 ${
              value === tab.value
                ? "border-[#D32F44] text-[#D32F44]"
                : "border-transparent text-gray-500 hover:text-[#D32F44]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {/* <div className="mt-4">{tabs[value].content}</div> */}
    </div>
  );
}
