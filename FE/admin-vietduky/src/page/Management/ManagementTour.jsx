  import { useEffect, useState } from "react";
  import Layout from "../../layouts/LayoutManagement";
  import ModalAddTour from "../../components/ModalManage/ModalAdd/ModalAddTour.jsx";
  import { LuSearch } from "react-icons/lu";
  import DropdownMenu from "../../components/Dropdown/DropdownMenuTour";
  import ModalManageTravelTour from "../../components/ModalManage/ModalList/ModalManageTravelTour.jsx";
  import { getTours } from "../../services/API/tour.service";
  import ModalUpdateTour from "../../components/ModalManage/ModalUpdate/ModalUpdateTour.jsx";
  import ModalManageActivity from "../../components/ModalManage/ModalList/ModalManageActivity.jsx";
  import { getTourById } from "../../services/API/tour.service";

  export default function ManagementTour() {
    const [tours, setTours] = useState([]);
    const [location, setLocation] = useState("");
    const [priceFilter, setPriceFilter] = useState("");
    const [selectedTour, setSelectedTour] = useState(null);
    const [isAddTourModalOpen, setIsAddTourModalOpen] = useState(false);
    const [isManageTravelTourModalOpen, setIsManageTravelTourModalOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [locationsList, setLocationsList] = useState([]);
    const [isUpdateTourModalOpen, setIsUpdateTourModalOpen] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [newCreatedTourId, setNewCreatedTourId] = useState(null);
    const [isManagementProgramModalOpen, setIsManagementProgramModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const toursPerPage = 12;
    const [selectedProgramTour, setSelectedProgramTour] = useState(null);

    const toggleDropdown = (id) => {
      setOpenDropdown(openDropdown === id ? null : id);
    };

    const toggleAddTourModal = () => {
      setIsAddTourModalOpen(!isAddTourModalOpen);
    };

    const toggleManageTravelTourModal = () => {
      setIsManageTravelTourModalOpen(!isManageTravelTourModalOpen);
    };

    const fetchTours = async () => {
      try {
        const toursData = await getTours();
        if (Array.isArray(toursData)) {
          setTours(toursData);
          const uniqueLocations = [
            ...new Set(
                toursData
                    .map((tour) => tour?.startLocation?.name_location)
                    .filter(Boolean)
            ),
          ];
          setLocationsList(uniqueLocations);
        } else {
          console.error("Dữ liệu API không đúng định dạng:", toursData);
          setTours([]);
        }
      } catch (error) {
        console.log("Lỗi khi lấy dữ liệu từ API", error);
        setTours([]);
      }
    };

    useEffect(() => {
      fetchTours();
    }, []);

    useEffect(() => {
      setCurrentPage(1);
    }, [location, priceFilter]);

    const handleDeleteTour = (id) => {
      setTours((prev) => prev.filter((tour) => tour.id !== id));
    };

    const handleEditTour = (tour) => {
      setEditingTour(tour.id);
      setOpenDropdown(null);
      setIsUpdateTourModalOpen(true);
    };

    const handleManageTravelTour = (tourId) => {
      setSelectedTour(tourId);
      setOpenDropdown(null);
      toggleManageTravelTourModal();
    };

    const handleOpenManagementProgram = async (tour) => {
      try {
        const fullTour = await getTourById(tour.id);
        setSelectedProgramTour(fullTour);
        setIsManagementProgramModalOpen(true);
        setOpenDropdown(null);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết tour:", error);
        alert("Không thể tải chi tiết chương trình tour.");
      }
    };

    const filteredTours = tours.filter((tour) => {
      if (location && tour?.startLocation?.name_location !== location) return false;
      const price = tour.price_tour;
      if (priceFilter === "low" && price >= 5_000_000) return false;
      if (priceFilter === "medium" && (price < 5_000_000 || price > 10_000_000)) return false;
      if (priceFilter === "high" && price <= 10_000_000) return false;
      return true;
    });

    const totalPages = Math.ceil(filteredTours.length / toursPerPage);
    const indexOfLastTour = currentPage * toursPerPage;
    const indexOfFirstTour = indexOfLastTour - toursPerPage;
    const currentTours = filteredTours.slice(indexOfFirstTour, indexOfLastTour);

    return (
        <div title="Quản lý Tour">
          <div>
            <div className="bg-white p-4 rounded-md flex gap-4 items-center">
              <div className="relative flex-1 ">
                <LuSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                    type="text"
                    placeholder="Tìm kiếm bằng từ khóa"
                    className="pl-10 pr-4 py-2 border rounded-md w-1/3"
                />
              </div>
              <div className="flex gap-3">
                <button className="border border-red-700 text-red-700 hover:bg-red-300 px-4 py-2 rounded-md">
                  Nhập danh sách chủ đề
                </button>
              </div>
              <div>
                <select
                    className="px-4 py-2 border border-red-600 text-red-700 rounded-md"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                  <option value="">Tất cả địa điểm</option>
                  {locationsList.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              <div>
                <select
                    className="px-4 py-2 border border-red-600 text-red-700 rounded-md"
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                >
                  <option value="">Tất cả </option>
                  <option value="low">Dưới 5 triệu</option>
                  <option value="medium">5 - 10 triệu</option>
                  <option value="high">Trên 10 triệu</option>
                </select>
              </div>
              <button
                  className="bg-red-700 text-white px-4 py-2 rounded-md shadow-md"
                  onClick={toggleAddTourModal}
              >
                Thêm Tour mới
              </button>
            </div>

            <div className="relative">
              {openDropdown !== null && (
                  <div className="fixed inset-0 bg-transparent" onClick={() => setOpenDropdown(null)}></div>
              )}

              <div className="mt-4 bg-white p-4">
                <table className="w-full border-collapse">
                  <thead>
                  <tr className="text-SmokyGray">
                    <th className="p-2 text-left">Tên Tour</th>
                    <th className="p-2 text-left">Địa điểm</th>
                    <th className="p-2">Số ngày</th>
                    <th className="p-2">Số lượng hành trình</th>
                    <th className="p-2 text-left">Giá Tour</th>
                    <th className="text-end p-2">Thao tác</th>
                  </tr>
                  </thead>
                  <tbody>
                  {currentTours.map((tour) => (
                      <tr key={tour.id} className="border-t text-center">
                        <td className="p-2 text-left">{tour.name_tour}</td>
                        <td className="p-2 text-left">
                          {tour?.startLocation?.name_location} → {tour?.endLocation?.name_location}
                        </td>
                        <td className="p-2">{tour.day_number}</td>
                        <td className="p-2">{tour.max_people}</td>
                        <td className="p-2 text-red-600 font-semibold text-left">
                          {Number(tour.price_tour).toLocaleString("vi-VN")} VND
                        </td>
                        <td className="flex justify-end p-2 relative">
                          <button onClick={() => toggleDropdown(tour.id)} className="relative">
                            <DropdownMenu
                                tour={tour}
                                onDelete={handleDeleteTour}
                                onManageTravelTour={() => handleManageTravelTour(tour.id)}
                                onEdit={() => handleEditTour(tour)}
                                isOpen={openDropdown === tour.id}
                                setOpenDropdown={setOpenDropdown}
                                onOpenManagementProgram={handleOpenManagementProgram}
                            />
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>

                {/* Pagination */}
                <div className="flex justify-center items-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                          key={page}
                          className={`px-3 py-1 border rounded ${
                              page === currentPage ? "bg-red-600 text-white" : "bg-white text-gray-700"
                          }`}
                          onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                  ))}
                </div>
              </div>
            </div>

            {isAddTourModalOpen && (
                    <ModalAddTour
                        onClose={toggleAddTourModal}
                        onCreateSuccess={(newTour) => {
                          setTours((prev) => [...prev, newTour]); // 👈 thêm vào cuối
                          setIsAddTourModalOpen(false);
                          setSelectedTour(newTour.id);
                          setIsManageTravelTourModalOpen(true);
                          alert("Tạo Tour thành công!");
                        }}
                    />
                )}

            {isManageTravelTourModalOpen && (
                <ModalManageTravelTour
                    tourId={selectedTour}
                    onClose={toggleManageTravelTourModal}
                    tours={tours}
                />
            )}

            {isUpdateTourModalOpen && (
                <ModalUpdateTour
                    tourId={editingTour}
                    onClose={() => setIsUpdateTourModalOpen(false)}
                    onCreateSuccess={(updatedId) => {
                      fetchTours();
                      setIsUpdateTourModalOpen(false);
                    }}
                />
            )}
            {isManagementProgramModalOpen && selectedProgramTour && (
                <ModalManageActivity
                    tour={selectedProgramTour}
                    onClose={() => setIsManagementProgramModalOpen(false)}
                />
            )}
          </div>
        </div>
    );
  }
