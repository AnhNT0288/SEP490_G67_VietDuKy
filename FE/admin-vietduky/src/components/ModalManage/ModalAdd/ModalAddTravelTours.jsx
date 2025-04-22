// import { useEffect, useState } from "react";
// import { FaArrowRight } from "react-icons/fa";
// import { useLocation } from "react-router-dom";
//
// export default function TestModal({ onClose, onAddTravelTour }) {
//   const [loading, setLoading] = useState(false);
//   const [travelTourData, setTravelTourData] = useState({
//     start_day: new Date().toISOString().split("T")[0], // Định dạng YYYY-MM-DD
//     end_day: new Date().toISOString().split("T")[0],
//     max_people: "",
//     price_tour: "",
//   });
//
//   const location = useLocation();
//   const searchParams = new URLSearchParams(location.search);
//
//   useEffect(() => {
//     const start_day = searchParams.get("start_day");
//     const end_day = searchParams.get("end_day");
//     const max_people = searchParams.get("max_people");
//     const price_tour = searchParams.get("price_tour");
//
//     if (start_day && end_day && max_people && price_tour) {
//       const newTravelTour = {
//         start_day,
//         end_day,
//         max_people: parseInt(max_people, 10),
//         price_tour: parseInt(price_tour, 10),
//       };
//
//       setTourData((prev) => ({
//         ...prev,
//         travel_tour: [...prev.travel_tour, newTravelTour],
//       }));
//     }
//   }, [location.search]); // Chạy lại khi query string thay đổi
//
//   // Cập nhật state khi nhập dữ liệu
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setTravelTourData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//
//   // Submit form
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     const newTravelTour = {
//       start_day: travelTourData.start_day,
//       end_day: travelTourData.end_day,
//       max_people: travelTourData.max_people,
//       price_tour: travelTourData.price_tour,
//     };
//
//     onAddTravelTour(newTravelTour);
//     // onClose();
//   };
//
//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-[9999]">
//       <div className="bg-white p-6 rounded-lg shadow-lg w-[500px] max-h-[90vh] overflow-auto relative">
//         <form onSubmit={handleSubmit}>
//           <h2 className="text-lg font-semibold">Thêm lịch khởi hành</h2>
//           <h6 className="text-sm mb-4">
//             Quản trị viên thêm lịch khởi hành vào Tour
//           </h6>
//
//           <div className="flex items-center gap-4 mt-4">
//             {/* Ngày khởi hành */}
//             <div>
//               <label className="block mb-2 font-medium">
//                 Ngày khởi hành <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="start_day"
//                 value={travelTourData.start_day}
//                 onChange={handleChange}
//                 className="w-[200px] p-2 border rounded text-gray-500"
//                 required
//               />
//             </div>
//
//             <FaArrowRight className="text-gray-400 text-lg" />
//
//             {/* Ngày về */}
//             <div>
//               <label className="block mb-2 font-medium">
//                 Ngày về <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 name="end_day"
//                 value={travelTourData.end_day}
//                 onChange={handleChange}
//                 className="w-[200px] p-2 border rounded text-gray-500"
//                 required
//               />
//             </div>
//           </div>
//
//           {/* Số lượng người */}
//           <label className="block mt-4 mb-2 font-medium">
//             Số lượng người <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             name="max_people"
//             value={travelTourData.max_people}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Nhập số lượng người"
//             required
//           />
//
//           {/* Giá tour */}
//           <label className="block mt-4 mb-2 font-medium">
//             Giá lịch khởi hành <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="number"
//             name="price_tour"
//             value={travelTourData.price_tour}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             placeholder="Nhập giá Travel Tour"
//             required
//           />
//
//           {/* Button Actions */}
//           <div className="flex justify-end gap-4 mt-4">
//             <button
//               type="button"
//               className="bg-gray-300 px-4 py-2 rounded"
//               onClick={onClose}
//             >
//               Hủy
//             </button>
//             <button
//               type="button"
//               onClick={handleSubmit}
//               className="bg-red-700 text-white px-4 py-2 rounded"
//               disabled={loading}
//             >
//               {loading ? "Đang xử lý..." : "Tạo Tour mới"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }
