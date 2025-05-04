export function generateFullMonthlyStats(stats) {
    const fullData = Array(12).fill(null);
    const now = new Date();
    const currentMonth = now.getMonth() + 1;

    stats.forEach(({ month, revenue }) => {
        if (month <= currentMonth) {
            fullData[month - 1] = Number(revenue);
        }
    });

    for (let i = 0; i < currentMonth; i++) {
        if (fullData[i] === null) fullData[i] = 0;
    }

    return fullData;
}
