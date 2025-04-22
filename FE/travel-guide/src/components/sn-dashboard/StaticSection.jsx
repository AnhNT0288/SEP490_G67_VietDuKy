import { TrendingUp } from "lucide-react";

const StaticSection = () => {
  return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold">Thống kê tổng quan</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
              <div
                  key={index}
                  className="bg-white rounded-2xl py-4 px-4 sm:px-5 lg:px-10 flex flex-col gap-2"
              >
                <h3 className="text-base sm:text-lg font-medium">
                  Lịch trình hiện có
                </h3>
                <div className="flex flex-row justify-between items-center">
                  <h2 className="text-xl sm:text-2xl font-semibold">100</h2>
                  <div className="border border-green-800 bg-green-50 rounded-full px-2 py-0.5 text-green-800 flex flex-row gap-2 items-center">
                    <p className="text-xs sm:text-sm font-medium">+10 Tour</p>
                    <TrendingUp width={15} height={15} strokeWidth={3} />
                  </div>
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default StaticSection;
