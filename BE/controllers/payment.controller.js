const db = require("../models");
const axios = require("axios");
const { sendRoleBasedNotification } = require("../utils/sendNotification");
const { NOTIFICATION_TYPE } = require("../constants");
const Booking = db.Booking;
const User = db.User;
const Payment = db.Payment;
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});
// Format VND
const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
};

// Format ngày tháng năm
const formatDate = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const seconds = d.getSeconds().toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
};



//Lấy danh sách tất cả Payment Card
exports.checkPayment = async (req, res) => {
    const { paymentKey } = req.body;
    const { bookingId } = req.body;
    const { customerId } = req.body;
    const sheetId = "1w3jFPsqXk0aPqYGFieCDeHiArUwcj9hpzIdjsl1vEz0";
    const apiKey = process.env.GOOGLE_API;
    const range = "payment!A2:F100";
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
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
                    include: [
                        {
                            model: User,
                            as: "User",
                        },
                        {
                            model: TravelTour,
                            include: [
                                {
                                    model: Tour,
                                    as: "Tour",
                                },
                            ],
                            as: "TravelTour",
                        },
                    ],
                });
                const existingPayments = await Payment.findAll({
                    where: {
                        booking_id: bookingId,
                    },
                });
                const remainingAmount = booking.total_cost - existingPayments.reduce((acc, payment) => acc + payment.amount, 0);
                if (amount === remainingAmount) {
                    booking.status = 2;
                    console.log("Thanh toán thành công");
                    await sendRoleBasedNotification(['admin', 'staff'], {
                        title: "Có thông tin thanh toán mới!",
                        type: NOTIFICATION_TYPE.BOOKING_DETAIL,
                        bookingId: bookingId,
                    });
                } else {
                    booking.status = 1;
                    const existingPayment = await Payment.findOne({
                        where: {
                            transactionCode: paymentKey,
                        },
                    });
                    if (!existingPayment) {
                        const newPayment = await Payment.create({
                            customer_id: customerId,
                            booking_id: bookingId,
                            transactionCode: paymentKey,
                            amount: amount,
                        });
                        await newPayment.save();
                    }
                    return res.status(500).json({
                        message: "Số tiền không khớp",
                        amount: amount,
                        total_cost: booking.total_cost
                    });
                }
                await booking.save();
                const payment = await Payment.create({
                    customer_id: customerId,
                    booking_id: bookingId,
                    transactionCode: paymentKey,
                    amount: amount,
                });
                // Kiểm tra nếu booking.user tồn tại
                const userName = booking.name || "Không rõ";
                const userEmail = booking.email || "Không rõ";
                const userPhone = booking.phone || "Không rõ";

                // Tạo nội dung email
                const emailContent = `
                <html>
                <head>
                <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    background-color: #fff;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    background-color: #fef2f2;
                    position: relative;
                }
                h1 {
                    color: #d32f2f;
                    text-align: center;
                }
                p {
                    margin: 10px 0;
                }
                .info-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    table-layout: fixed;
                }
                .info-table th, .info-table td {
                    border: 1px solid #ddd;
                    padding: 10px;
                    text-align: left;
                    word-wrap: break-word;
                }
                .info-table th {
                    background-color: #d32f2f;
                    color: #fff;
                }
                .info-table td {
                    background-color: #fff;
                }
                .footer {
                    text-align: center;
                    margin-top: 20px;
                    font-size: 0.9em;
                    color: #666;
                }
                </style>
                </head>
                <body>
                <div class="email-container">
                <h1>Hóa đơn thanh toán</h1>
                <p>Xin chào <strong>${userName}</strong>,</p>
                <p>Chúng tôi đã nhận được thanh toán của bạn. Dưới đây là thông tin chi tiết:</p>
                
                <h3>Thông tin tour</h3>
                <table class="info-table">
                    <tr>
                    <th>Thông tin</th>
                    <th>Chi tiết</th>
                    </tr>
                    <tr>
                    <td>Tên tour</td>
                    <td>${booking.TravelTour.Tour.name_tour || "Không rõ"}</td>
                    </tr>
                    <tr>
                    <td>Ngày khởi hành</td>
                    <td>${booking.TravelTour.start_day} ${booking.TravelTour.start_time_depart}</td>
                    </tr>
                    <tr>
                    <td>Ngày kết thúc</td>
                    <td>${booking.TravelTour.end_day} ${booking.TravelTour.end_time_depart}</td>
                    </tr>
                </table>

                <h3>Thông tin khách hàng</h3>
                <table class="info-table">
                    <tr>
                    <th>Thông tin</th>
                    <th>Chi tiết</th>
                    </tr>
                    <tr>
                    <td>Họ và tên</td>
                    <td>${userName}</td>
                    </tr>
                    <tr>
                    <td>Email</td>
                    <td>${userEmail}</td>
                    </tr>
                    <tr>
                    <td>Số điện thoại</td>
                    <td>${userPhone}</td>
                    </tr>
                </table>

                <h3>Thông tin thanh toán</h3>
                <table class="info-table">
                    <tr>
                    <th>Thông tin</th>
                    <th>Chi tiết</th>
                    </tr>
                    <tr>
                    <td>Số tiền</td>
                    <td>${formatCurrency(amount)} VND</td>
                    </tr>
                    <tr>
                    <td>Ngày giờ thanh toán</td>
                    <td>${formatDate(new Date())}</td>
                    </tr>
                </table>

                <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúc bạn có một chuyến đi vui vẻ!</p>
                <div class="footer">
                    <p>© 2025 Việt Du Ký</p>
                </div>
                </div>
                </body>
                </html>
                `;

                // Gửi email
                const mailOptions = {
                from: '"Việt Du Ký" <vietduky.service@gmail.com>',
                to: userEmail,
                subject: "Hóa đơn thanh toán tour du lịch",
                html: emailContent,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Lỗi khi gửi email: ", error);
                } else {
                    console.log("Email đã được gửi: " + info.response);
                }
                });
                return res.status(200).json({ message: "OK", data: payment });
            } else {
                return res
                    .status(500)
                    .json({ error: "Không có giao dịch" });
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
            .json({ error: "Đã xảy ra lỗi trong quá trình xử lý" });
    }
};
exports.getPayment = async (req, res) => {
    const { paymentId } = req.body;
    const payment = await Payment.findOne({
        where: {
            id: paymentId,
        },
    });
    return res.status(200).json({ message: "OK", data: payment });
};
exports.getPaymentByBookingId = async (req, res) => {
    const { id } = req.params;

    const payment = await Payment.findAll({
        where: {
            booking_id: id,
        },
    });
    return res.status(200).json({ message: "OK", data: payment });
};
exports.getPaymentByCustomerId = async (req, res) => {
    const { id } = req.params;

    const payment = await Payment.findOne({
        where: {
            customer_id: id,
        },
    });
    return res.status(200).json({ message: "OK", data: payment });
};
exports.getAllPayment = async (req, res) => {
    const payment = await Payment.findAll();
    return res.status(200).json({ message: "OK", data: payment });
};