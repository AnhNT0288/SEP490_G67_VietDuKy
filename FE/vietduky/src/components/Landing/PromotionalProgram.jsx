import { useState, useRef, useEffect } from "react";

export default function PromotionalProgram() {
  const [discounts, setDiscounts] = useState([]);
  const scrollRefs = useRef([]);
  const [tours, setTours] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [discountRes, tourRes] = await Promise.all([
          fetch("http://localhost:3000/api/discount-service/").then((res) =>
            res.json()
          ),
          fetch("http://localhost:3000/api/tour").then((res) => res.json()),
          fetch("http://localhost:3000/api/location/").then((res) =>
            res.json()
          ),
        ]);

        if (discountRes?.data) {
          setDiscounts(discountRes.data);
        }
        setTours(tourRes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleMouseDown = (index, e) => {
    if (!scrollRefs.current[index]) return;

    e.preventDefault();
    const startX = e.clientX;
    const scrollLeft = scrollRefs.current[index].scrollLeft;

    const onMouseMove = (moveEvent) => {
      const x = moveEvent.clientX;
      const walk = (x - startX) * 2;
      scrollRefs.current[index].scrollLeft = scrollLeft - walk;
    };

    const onMouseUp = () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <div>
      {/* Chương trình khuyến mại */}
      <div className="p-6 relative w-4/5 mx-auto">
        <div className="flex justify-between items-center ">
          <h2 className="text-2xl font-bold">Chương trình khuyến mại</h2>
          <a href="/deals" className="text-red-600 font-bold hover:underline">
            Xem tất cả
          </a>
        </div>
        <div
          className="flex space-x-4 mt-8 overflow-x-auto scrollbar-hide cursor-grab"
          style={{ scrollbarWidth: "none" }}
          ref={(el) => (scrollRefs.current[1] = el)}
          onMouseDown={handleMouseDown}
        >
          {discounts.map((discount) => (
            <div
              key={discount.id}
              className="bg-white shadow-lg rounded-lg p-4 min-w-[300px]"
            >
              <h3 className="text-lg font-semibold">
                {discount.programDiscount.discount_name}
              </h3>
              <p className="text-sm text-gray-600">
                {discount.programDiscount.description}
              </p>
              <p className="text-red-500 font-bold">
                Giảm {discount.programDiscount.percent_discount}%
              </p>
              <p className="text-gray-700">
                Giá gốc: {discount.travelTour.price_tour.toLocaleString()} VND
              </p>
              <p className="text-green-600 font-semibold">
                Giá sau giảm:{" "}
                {(
                  discount.travelTour.price_tour -
                  discount.programDiscount.discount_value
                ).toLocaleString()}{" "}
                VND
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
