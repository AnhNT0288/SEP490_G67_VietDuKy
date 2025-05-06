import { useRef } from "react";
import { FileUp } from "lucide-react";

const ImportExcelButton = ({ onFileSelect }) => {
  const inputRef = useRef(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".xlsx, .xls"
        onChange={handleChange}
        className="hidden"
      />
      <button
        className="border border-gray-300 px-4 py-2 rounded-md whitespace-nowrap flex gap-2 items-center"
        onClick={handleClick}
      >
        <FileUp className="w-4 h-4" />
        Nhập danh sách
      </button>
    </>
  );
};

export default ImportExcelButton;
