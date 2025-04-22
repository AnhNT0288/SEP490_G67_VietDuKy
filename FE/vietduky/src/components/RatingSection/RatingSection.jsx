export default function RatingSection() {
    return (
        <div className="bg-white p-4">
            {/* Tiêu đề */}
            <h2 className="text-xl font-bold text-gray-900">Du lịch Hà Nội</h2>

            {/* Đánh giá */}
            <div className="flex items-center space-x-2 mt-1 text-gray-700">
                <span className="font-semibold">Đánh giá:</span>

                {/* Icon sao */}
                <div className="flex space-x-1 text-red-500">
                    {Array(5)
                        .fill(0)
                        .map((_, i) => (
                            <span key={i}>⭐</span>
                        ))}
                </div>

                {/* Điểm đánh giá */}
                <span className="font-semibold text-gray-900">4.95/5</span>

                {/* Tổng số đánh giá */}
                <span className="text-gray-500 text-sm">trong 2461 Đánh giá</span>
            </div>

            {/* Mô tả tour */}
            <p className="mt-2 text-gray-800 text-sm">
                <strong>Du Lịch Hà Nội 2025</strong> cùng <strong>Du Lịch Việt</strong>, chúng tôi luôn tổ chức{" "}
                <strong>Tour Du Lịch Hà Nội 2025</strong>, những{" "}
                <strong>Tour Hà Nội 2025</strong> chất lượng, giá rẻ để phục vụ khách du lịch trên toàn quốc.
            </p>
        </div>
    );
}
