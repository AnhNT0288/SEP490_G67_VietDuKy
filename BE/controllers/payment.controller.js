const db = require("../models");
const axios = require("axios");
const Booking = db.Booking;
const Payment = db.Payment;

//Lấy danh sách tất cả Payment Card
exports.checkPayment = async (req, res) => {
    const {paymentKey} = req.body;
    const {bookingId} = req.body;
    const {customerId} = req.body;
    const sheetId = "1wCUrhNZfbT0UbjgCwtAlm2JFoYatEHhtGKpInL7-I-s";
    const apiKey = process.env.GOOGLE_API;
    const range = "Casso!A2:F100";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
    console.log(url);
    try {
        if (!paymentKey) {
            return res.status(400).json({
                message: "Không có mã thanh toán",
            });
        }
        if (!bookingId) {
            return res.status(400).json({
                message: "Không có bookingId",
            });
        }
        if (!customerId) {
            return res.status(400).json({
                message: "Không có customerId",
            });
        }


        const response = await axios.get(url);

        console.log("Data from Google Sheets API:", response.data);

        if (response.status === 200 && response.data.values) {
            let message = false;
            let amount = 0;

            response.data.values.forEach((value) => {
                const matches = value[1].toLowerCase().match(/start(.*?)end/i);
                if (matches && paymentKey.toLowerCase() === matches[1].trim()) {
                    message = true;
                    amount = parseInt(value[2], 10) * 1000;
                }
            });

            if (message) {
                // Cập nhật tất cả các fines có _id trong mảng fineId
                // const result = await Fines.updateMany(
                //     {_id: {$in: Array.isArray(fineId) ? fineId : [fineId]}},
                //     {
                //         status: "Paid",
                //         paymentMethod: "Casso",
                //         paymentDate: new Date(),
                //     }
                // );
                const booking = await Booking.findOne({
                    where: {
                        id: bookingId,
                    },
                });
                console.log(amount, booking.total_cost);
                if (amount === booking.total_cost) {
                    booking.status = 2;
                    console.log("Thanh toán thành công");
                } else {
                    booking.status = 1;
                    console.log("Thanh toán thất bại");
                }
                await booking.save();
                const payment = await Payment.create({
                    customer_id: customerId,
                    booking_id: bookingId,
                    transactionCode: paymentKey,
                    amount: amount,
                });

                return res.status(200).json({message: "OK", data: payment});
            } else {
                return res
                    .status(500)
                    .json({error: "Không có giao dịch"});
            }
        }

        return res.status(500).json({
            error: "Không thể lấy dữ liệu từ Google Sheets",
            data: response.data.values,
        });
    } catch (error) {
        console.error("Error occurred:", error);
        return res
            .status(500)
            .json({error: "Đã xảy ra lỗi trong quá trình xử lý"});
    }
};
exports.getPayment = async (req, res) => {
    const {paymentId} = req.body;
    console.log("REQ BODY:", req.body);
    const payment = await Payment.findOne({
        where: {
            id: paymentId,
        },
    });
    return res.status(200).json({message: "OK", data: payment});
};
exports.getPaymentByBookingId = async (req, res) => {
    const {id} = req.params;
    console.log("REQ BODY:", req.body);

    const payment = await Payment.findOne({
        where: {
            booking_id: id,
        },
    });
    return res.status(200).json({message: "OK", data: payment});
};
exports.getPaymentByCustomerId = async (req, res) => {
    const {id} = req.params;
    console.log("REQ BODY:", req.body);

    const payment = await Payment.findOne({
        where: {
            customer_id: id,
        },
    });
    return res.status(200).json({message: "OK", data: payment});
};
exports.getAllPayment = async (req, res) => {
    const payment = await Payment.findAll();
    return res.status(200).json({message: "OK", data: payment});
};
