import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function CarList({ tourId }) {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCars() {
            try {
                // TODO: gọi API lấy danh sách xe theo tourId
                // const data = await getCarsByTourId(tourId);
                const data = []; // Tạm giả lập data
                setCars(data);
            } catch (error) {
                console.error("Lỗi lấy danh sách xe:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchCars();
    }, [tourId]);

    if (loading) return <div className="text-center py-10">Đang tải xe...</div>;

    if (cars.length === 0) return <div className="text-center py-10 text-gray-400">Chưa có xe nào.</div>;

    return (
        <div className="overflow-y-auto h-full">
            <table className="w-full text-sm border-t">
                <thead>
                <tr className="bg-gray-100 text-left">
                    <th className="p-2">Tên xe</th>
                    <th className="p-2">Biển số</th>
                    <th className="p-2">Số chỗ</th>
                </tr>
                </thead>
                <tbody>
                {cars.map((car) => (
                    <tr key={car.id} className="border-t">
                        <td className="p-2">{car.name}</td>
                        <td className="p-2">{car.plate_number}</td>
                        <td className="p-2">{car.capacity}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
