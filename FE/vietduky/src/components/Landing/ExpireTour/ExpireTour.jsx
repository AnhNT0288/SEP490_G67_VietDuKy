import { useNavigate } from "react-router-dom";
import ExpireTourCard from "./ExpireTourCard";
import { useEffect, useState } from "react";
import { DiscountService } from "@/services/API/discount_service.service";
import { formatDate } from "@/utils/dateUtil";

export default function ExpireTour() {
  const navigate = useNavigate();
  const [discountTours, setDiscountTours] = useState([]);

  useEffect(() => {
    const fetchDiscountTours = async () => {
      try {
        const response = await DiscountService.getApproveDiscounts();
        setDiscountTours(response.data.data);
      } catch (error) {
        console.error("Error fetching discount tours:", error);
      }
    };

    fetchDiscountTours();
  }, []);

  console.log("discountTours", discountTours);

  return (
    <div className="bg-white">
      <div className="py-10 sm:w-full md:w-full lg:w-4/5 mx-auto relative p-2 md:p-4 lg:p-6">
        <div className="flex flex-col">
          <p className="text-3xl font-bold text-[#A80F21]">Ưu đãi phút chót</p>
          <p className="text-zinc-900 mt-2">
            Hãy nhanh tay nắm bắt cơ hội giảm giá cuối cùng.
          </p>
          <div className="w-1/5 h-1 bg-red-800 rounded-sm mt-2" />
        </div>
        <div className="flex flex-wrap justify-between gap-12 items-center mt-6 mx-auto">
          {Array.isArray(discountTours) &&
            discountTours
              .filter(
                (item) =>
                  new Date(item.travelTour?.start_day).getTime() > Date.now()
              )
              .map((item) => (
                <ExpireTourCard
                  key={item.id}
                  image={item.travelTour?.Tour?.album?.[0]}
                  title={item.travelTour?.Tour?.name_tour}
                  duration={`${item.travelTour?.Tour?.day_number} ngày`}
                  seatsLeft={
                    item.travelTour?.max_people -
                    (item.travelTour?.current_people || 0)
                  }
                  start_day={item.travelTour?.start_day}
                  end_day={item.travelTour?.end_day}
                  originalPrice={`${Number(
                    item.travelTour?.price_tour
                  ).toLocaleString()} VNĐ`}
                  discountPrice={
                    item?.price_discount?.toLocaleString() || "NaN"
                  }
                  onClick={() =>
                    navigate(`/tour/${item.travelTour?.Tour?.id}`, {
                      state: {
                        selectedDate: formatDate(item.travelTour?.start_day),
                        discountInfo: {
                          discountId: item.id,
                          value: item.programDiscount?.discount_value,
                          percent: item.programDiscount?.percent_discount,
                        },
                        discountList: discountTours,
                      },
                    })
                  }
                />
              ))}
        </div>
        <div className="text-center mt-9">
          <button
            onClick={() => navigate("/listTour")}
            className="bg-white border border-red-500 text-red-500 px-10 py-3 font-semibold rounded-md hover:bg-red-500 hover:text-white transition duration-300"
          >
            Xem thêm Tours
          </button>
        </div>
      </div>
    </div>
  );
}
