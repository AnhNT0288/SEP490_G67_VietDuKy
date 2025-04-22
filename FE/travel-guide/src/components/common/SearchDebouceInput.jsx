"use client";

import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";

export default function SearchDebounceInput({
  value = "",
  onChange,
  placeholder = "Tìm kiếm...",
  delay = 500,
}) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(inputValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, delay, onChange]);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  return (
    <div className="relative w-full h-full">
      <LuSearch className="absolute left-3 top-3 text-gray-500" />
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={placeholder}
        className="pl-10 pr-4 py-2 border rounded-md w-full"
      />
    </div>
  );
}
