import PromotionCard from "./PromotionCard";
import { VoucherService } from "@/services/API/voucher.service";
import { useEffect, useState } from "react";

const promotions = [
  {
    discount: "12",
    title: "Giảm đến 12%",
    description: "Đơn đặt khách sạn đầu tiên trên ứng dụng",
    code: "HELLOSGCAVN",
  },
  {
    discount: "10",
    title: "Giảm đến 10%",
    description: "Đơn đặt khách sạn đầu tiên trên ứng dụng",
    code: "HELLOSGCAVN",
  },
  {
    discount: "08",
    title: "Giảm đến 8%",
    description: "Đơn đặt khách sạn đầu tiên trên ứng dụng",
    code: "HELLOSGCAVN",
  },
  {
    discount: "08",
    title: "Giảm đến 8%",
    description: "Đơn đặt khách sạn đầu tiên trên ứng dụng",
    code: "HELLOSGCAVN",
  },
  {
    discount: "08",
    title: "Giảm đến 8%",
    description: "Đơn đặt khách sạn đầu tiên trên ứng dụng",
    code: "HELLOSGCAVN",
  },
];

const PromotionSection = () => {
  const [vouchers, setVouchers] = useState([]);

  useEffect(() => {
    VoucherService.getAllVouchers()
      .then((response) => {
        if (response?.data) {
          setVouchers(response.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching voucher data:", error);
      });
  }, []);

  return (
    <div className="p-6 mx-auto w-4/5 relative mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chương trình khuyến mại</h2>
        <a href="#" className="text-red-500 text-sm font-bold hover:underline">
          Xem tất cả
        </a>
      </div>

      <div className="bg-[#ffe4e6] relative rounded-2xl px-3 py-8 mt-6 shadow-lg overflow-hidden">
        {/* Danh sách thẻ khuyến mãi */}
        <div className="flex space-x-4 overflow-x-auto overflow-y-hidden cursor-grab draggable">
          {vouchers.map((voucher, index) => (
            <PromotionCard key={index} {...voucher} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PromotionSection;
