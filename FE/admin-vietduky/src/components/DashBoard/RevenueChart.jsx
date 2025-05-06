import ReactApexChart from "react-apexcharts";

export default function RevenueChart({ data }) {
    const chartOptions = {
        chart: {
            type: "line",
            toolbar: { show: false },
        },
        stroke: {
            curve: "smooth",
            width: 2,
        },
        xaxis: {
            categories: Array.from({ length: 12 }, (_, i) => `Thg ${i + 1}`),
        },
        tooltip: {
            y: {
                formatter: (val) =>
                    val != null ? `${val.toLocaleString()} VND` : "Chưa có dữ liệu",
            },
        },
        markers: {
            size: 4,
        },
        colors: ["#EF4444"],
    };

    const chartSeries = [
        {
            name: "Doanh thu",
            data: data,
        },
    ];

    return (
        <div className="w-full">
            <ReactApexChart
                options={chartOptions}
                series={chartSeries}
                type="line"
                height={260}
            />
        </div>
    );
}
