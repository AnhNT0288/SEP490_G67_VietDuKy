import { useState } from "react";
import { Button } from "@/components/ui/button";
import ModalAddTravelTour from "./ModalAddTravelTour";

export default function TravelTourManagement() {
  const [tours, setTours] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddTour = (newTour) => {
    setTours([...tours, newTour]);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Lịch khởi hành & Giá tour</h1>
      <Button onClick={() => setIsModalOpen(true)}>Thêm hành trình</Button>

      <div className="mt-4">
        {tours.length > 0 ? (
          <ul className="border rounded-lg p-4">
            {tours.map((tour, index) => (
              <li key={index} className="border-b py-2">
                <strong>Ngày:</strong> {tour.date} - <strong>Giá:</strong>{" "}
                {tour.price} VND
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">Chưa có hành trình nào.</p>
        )}
      </div>

      {isModalOpen && (
        <ModalAddTravelTour
          onClose={() => setIsModalOpen(false)}
          onSave={handleAddTour}
        />
      )}
    </div>
  );
}
