const db = require("../models");
const Booking = db.Booking;
const Restaurant = db.Restaurant;
const RestaurantBooking = db.RestaurantBooking;
const Hotel = db.Hotel;
const HotelBooking = db.HotelBooking;
const Vehicle = db.Vehicle;
const VehicleBooking = db.VehicleBooking;
const TravelTour = db.TravelTour;
const User = db.User;
const Passenger = db.Passenger;
const Tour = db.Tour;
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
const Payment = db.Payment;
const GuideTour = db.GuideTour;
const TravelGuide = db.TravelGuide;
const Role = db.Role;
dotenv.config();

const {Op} = require("sequelize");
const {generateUniqueBookingTour} = require("../utils/booking");
const {sendRoleBasedNotification, sendNotificationToUser} = require("../utils/sendNotification");
const {NOTIFICATION_TYPE} = require("../constants");

//Cấu hình nodemailer
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
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(date));
};

// Format thời gian
const formatTime = (time) => {
    const timeRegex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;
    if (timeRegex.test(time)) {
        return time.slice(0, 5);
    }
    return "00:00";
};

// Hàm gửi email xác nhận
const sendConfirmationEmail = (userEmail, bookingDetails) => {
    const {
        name,
        email,
        travelTour,
        name_tour,
        total_cost,
        start_day,
        end_day,
        start_time_depart,
        end_time_depart,
        start_time_close,
        end_time_close,
    } = bookingDetails;
    const {price_tour} = travelTour;

    // Format tiền
    const formattedPriceTour = formatCurrency(price_tour);
    const formattedTotalCost = formatCurrency(total_cost);

    // Format ngày tháng
    const formattedStartDate = formatDate(start_day);
    const formattedEndDate = formatDate(end_day);

    // Format thời gian
    const formattedStartTimeDepart = formatTime(start_time_depart);
    const formattedEndTimeDepart = formatTime(end_time_depart);
    const formattedStartTimeClose = formatTime(start_time_close);
    const formattedEndTimeClose = formatTime(end_time_close);

    const mailOptions = {
        from: '"Việt Du Ký" <vietduky.service@gmail.com>',
        to: userEmail,
        subject: "Xác nhận đặt tour",
        html: `
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
            .logo {
              position: absolute;
              top: 20px;
              left: 20px;
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
            <h1>Xác nhận đặt tour</h1>
            <p>Xin chào <strong>${name}</strong>,</p>
            <p>Đặt tour của bạn đã được hoàn tất thành công! Dưới đây là thông tin chi tiết:</p>
            <table class="info-table">
              <tr>
                <th>Thông tin tour</th>
                <th>Chi tiết</th>
              </tr>
              <tr>
                <td>Tour</td>
                <td>${name_tour}</td>
              </tr>
              <tr>
                <td>Ngày bắt đầu</td>
                <td>${formattedStartDate}</td>
              </tr>
              <tr>
                <td>Ngày kết thúc</td>
                <td>${formattedEndDate}</td>
              </tr>
              <tr>
                <td>Giá tour</td>
                <td>${formattedPriceTour} VND</td>
              </tr>
              <tr>
                <td>Tổng chi phí</td>
                <td>${formattedTotalCost} VND</td>
              </tr>
            </table>
            <table class="info-table">
              <tr>
                <th>Ngày khởi hành Tour</th>
                <th>Chi tiết</th>
              </tr>
              <tr>
                <td>Thời gian khởi hành</td>
                <td>${formattedStartTimeDepart}</td>
              </tr>
              <tr>
                <td>Thời gian kết thúc</td>
                <td>${formattedEndTimeDepart}</td>
              </tr>
            </table>
            <table class="info-table">
              <tr>
                <th>Ngày kết thúc Tour</th>
                <th>Chi tiết</th>
              </tr>
              <tr>
                <td>Thời gian khởi hành</td>
                <td>${formattedStartTimeClose}</td>
              </tr>
              <tr>
                <td>Thời gian kết thúc</td>
                <td>${formattedEndTimeClose}</td>
              </tr>
            </table>
            <p>Cảm ơn bạn đã đặt tour cùng chúng tôi! Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
            <div class="footer">
              <p>© 2025 Việt Du Ký. Tất cả các quyền được bảo lưu.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Lỗi khi gửi email: ", error);
        } else {
            console.log("Email đã được gửi: " + info.response);
        }
    });
};
const sendPaymentReminderEmail = (userEmail, bookingDetails) => {
    const {
        name,
        name_tour,
        start_day,
        total_cost,
        paid_amount,
        remaining_amount,
        passengers
    } = bookingDetails;

    // Format tiền
    const formattedTotalCost = formatCurrency(total_cost);
    const formattedPaidAmount = formatCurrency(paid_amount);
    const formattedRemainingAmount = formatCurrency(remaining_amount);

    // Format ngày tháng
    const formattedStartDate = formatDate(start_day);

    // Tạo danh sách hành khách
    const passengerList = passengers.map(passenger => `
        <tr>
            <td>${passenger.name}</td>
            <td>${formatDate(passenger.birth_date)}</td>
            <td>${passenger.gender ? 'Nữ' : 'Nam'}</td>
            <td>${passenger.phone_number || 'N/A'}</td>
            <td>${passenger.passport_number || 'N/A'}</td>
        </tr>
    `).join('');

    const mailOptions = {
        from: '"Việt Du Ký" <vietduky.service@gmail.com>',
        to: userEmail,
        subject: "Thông báo thanh toán tour",
        html: `
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
                        .warning {
                            color: #d32f2f;
                            font-weight: bold;
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
                        <h1>Thông báo thanh toán tour</h1>
                        <p>Xin chào <strong>${name}</strong>,</p>
                        <p>Chúng tôi gửi thông báo này để nhắc nhở về việc thanh toán tour của bạn:</p>
                        <table class="info-table">
                            <tr>
                                <th>Thông tin tour</th>
                                <th>Chi tiết</th>
                            </tr>
                            <tr>
                                <td>Tour</td>
                                <td>${name_tour}</td>
                            </tr>
                            <tr>
                                <td>Ngày khởi hành</td>
                                <td>${formattedStartDate}</td>
                            </tr>
                            <tr>
                                <td>Tổng chi phí</td>
                                <td>${formattedTotalCost} VND</td>
                            </tr>
                            <tr>
                                <td>Đã thanh toán</td>
                                <td>${formattedPaidAmount} VND</td>
                            </tr>
                            <tr>
                                <td>Còn thiếu</td>
                                <td class="warning">${formattedRemainingAmount} VND</td>
                            </tr>
                        </table>
                        <h3>Danh sách hành khách:</h3>
                        <table class="info-table">
                            <tr>
                                <th>Họ tên</th>
                                <th>Ngày sinh</th>
                                <th>Giới tính</th>
                                <th>Số điện thoại</th>
                                <th>Số hộ chiếu</th>
                            </tr>
                            ${passengerList}
                        </table>
                        <p class="warning">Vui lòng hoàn tất thanh toán trước ngày khởi hành để đảm bảo chuyến đi của bạn được diễn ra suôn sẻ.</p>
                        <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                        <div class="footer">
                            <p>© 2025 Việt Du Ký. Tất cả các quyền được bảo lưu.</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Lỗi khi gửi email: ", error);
        } else {
            console.log("Email đã được gửi: " + info.response);
        }
    });
};

//Lấy danh sách tất cả booking
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [
                {model: User, attributes: ["id", "email", "avatar"]},
                {
                    model: TravelTour,
                    attributes: ["id", "tour_id", "start_day", "end_day", "price_tour"],
                },
                // {
                //     model: RestaurantBooking,
                //     include: [
                //         {
                //             model: Restaurant,
                //             attributes: [
                //                 "id",
                //                 "name_restaurant",
                //                 "address_restaurant",
                //                 "phone_number",
                //             ],
                //         },
                //     ],
                // },
                // {
                //     model: HotelBooking,
                //     include: [
                //         {
                //             model: Hotel,
                //             attributes: ["id", "name_hotel", "address_hotel", "phone_number"],
                //         },
                //     ],
                // },
                {
                    model: VehicleBooking,
                    include: [
                        {
                            model: Vehicle,
                            attributes: ["id", "name_vehicle", "plate_number"],
                        },
                    ],
                },
            ],
        });

        res.status(200).json({
            message: "Tất cả booking đã được lấy thành công!",
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching bookings",
            error: error.message,
        });
    }
};

//Lấy chi tiết một booking theo ID
exports.getBookingById = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findByPk(bookingId, {
            include: [
                {model: User, attributes: ["id", "email", "avatar"]},
                {
                    model: TravelTour,
                    attributes: ["id", "tour_id", "start_day", "end_day", "price_tour"],
                },
                // {
                //     model: RestaurantBooking,
                //     include: [
                //         {
                //             model: Restaurant,
                //             attributes: [
                //                 "id",
                //                 "name_restaurant",
                //                 "address_restaurant",
                //                 "phone_number",
                //             ],
                //         },
                //     ],
                // },
                // {
                //     model: HotelBooking,
                //     include: [
                //         {
                //             model: Hotel,
                //             attributes: ["id", "name_hotel", "address_hotel", "phone_number"],
                //         },
                //     ],
                // },
                {
                    model: VehicleBooking,
                    include: [
                        {
                            model: Vehicle,
                            attributes: ["id", "name_vehicle", "plate_number"],
                        },
                    ],
                },
            ],
        });

        if (!booking) {
            return res.status(200).json({message: "Không tìm thấy đơn hàng!"});
        }
        booking.dataValues.passengers = await Passenger.findAll({
            where: {booking_id: bookingId},
        });

        res.status(200).json({
            message: "Tất cả booking đã được lấy thành công!",
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching booking",
            error: error.message,
        });
    }
};

//Tạo mới một booking
exports.createBooking = async (req, res) => {
    try {
        const {
            user_id,
            travel_tour_id,
            number_adult,
            number_children,
            number_newborn,
            number_toddler,
            total_cost,
            name,
            phone,
            email,
            address,
            note,
            passengers,
            need_support
        } = req.body;

        // Parse passengers từ chuỗi JSON thành object JavaScript
        const passengersArray = Array.isArray(passengers) ? passengers : [];

        // Kiểm tra các trường bắt buộc
        if (!user_id || !travel_tour_id || !name || !phone || !email) {
            return res.status(400).json({
                message: "Vui lòng điền đầy đủ thông tin bắt buộc!",
            });
        }

        // Kiểm tra số lượng người
        if (number_adult < 0 || number_children < 0 || number_newborn < 0) {
            return res.status(400).json({
                message: "Số lượng người không được âm!",
            });
        }

        if (number_adult === 0 && number_children === 0 && number_newborn === 0) {
            return res.status(400).json({
                message: "Phải có ít nhất một người trong booking!",
            });
        }

        if (passengers && passengers.length > 0) {
            for (let i = 0; i < passengers.length; i++) {
            }
        }
        // Kiểm tra tổng chi phí
        if (!total_cost || total_cost <= 0) {
            return res.status(400).json({
                message: "Tổng chi phí phải lớn hơn 0!",
            });
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                message: "Email không hợp lệ!",
            });
        }

        // Kiểm tra định dạng số điện thoại
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        if (!phoneRegex.test(phone)) {
            return res.status(400).json({
                message: "Số điện thoại không hợp lệ!",
            });
        }

        // Kiểm tra tour có tồn tại không
        const travelTour = await TravelTour.findByPk(travel_tour_id);
        if (!travelTour) {
            return res.status(500).json({
                message: "Tour không tồn tại!",
            });
        }

        const tourDetails = await Tour.findByPk(travelTour.tour_id);

        const booking_code = await generateUniqueBookingTour({
            tourCode: tourDetails.code_tour,
        });

        const total_people =
            number_adult +
            number_children +
            number_toddler +
            travelTour.current_people;
        if (total_people > travelTour.max_people) {
            return res.status(500).json({
                message: "Số lượng người đã vượt quá số lượng tối đa của chuyến!",
            });
        }

        if (!travelTour.active) {
            return res.status(200).json({
                message: "Tour đã đóng!",
            });
        }
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findByPk(user_id);
        if (!user) {
            return res.status(200).json({
                message: "Người dùng không tồn tại!",
            });
        }

        const tour = await Tour.findByPk(travelTour.tour_id);

        // Tạo booking mới
        const newBooking = await Booking.create({
            user_id,
            travel_tour_id,
            number_adult,
            number_children,
            number_toddler,
            number_newborn,
            total_cost,
            booking_date: new Date(),
            name,
            phone,
            email,
            address,
            status: 0,
            note,
            booking_code,
        });
        // Xử lý danh sách passenger nếu có
        if (passengersArray && passengersArray.length > 0) {
            // Kiểm tra số lượng passenger có khớp với số lượng người đã đăng ký không
            const totalPassengers =
                parseInt(number_adult) +
                parseInt(number_children) +
                parseInt(number_toddler) +
                parseInt(number_newborn);
            if (passengersArray.length !== totalPassengers) {
                return res.status(400).json({
                    message:
                        "Số lượng thông tin hành khách không khớp với số lượng người đã đăng ký!",
                });
            }
            travelTour.current_people +=
                number_adult + number_children + number_toddler;
            if (travelTour.current_people >= travelTour.max_people) {
                travelTour.active = false;
            }
            await travelTour.save();

            // Tạo danh sách passenger
            const passengerPromises = passengersArray.map((passenger) => {
                return Passenger.create({
                    name: passenger.name,
                    birth_date: passenger.birth_date,
                    gender: passenger.gender,
                    phone_number: passenger.phone_number,
                    booking_id: newBooking.id,
                    passport_number: passenger.passport_number,
                    single_room: passenger.single_room,
                });
            });

            await Promise.all(passengerPromises);
        }

        //Gửi email xác nhận
        sendConfirmationEmail(email, {
            name,
            email,
            name_tour: tourDetails.name_tour,
            travelTour,
            total_cost,
            start_day: travelTour.start_day,
            end_day: travelTour.end_day,
            start_time_depart: travelTour.start_time_depart,
            end_time_depart: travelTour.end_time_depart,
            start_time_close: travelTour.start_time_close,
            end_time_close: travelTour.end_time_close,
        });
        // await sendRoleBasedNotification(
        //     ["admin", "staff", "tour_guide"],
        //     {
        //         title: "Có đơn hàng mới!",
        //         type: NOTIFICATION_TYPE.BOOKING,
        //     }
        // );
        if (need_support) {
            const message = "Nguời dùng cần hỗ trợ nhập thông tin";
            const staffOrAdmins = await User.findAll({
                include: {
                    model: Role,
                    as: "role",
                    where: {role_name: {[Op.in]: ["staff", "admin"]}},
                    attributes: [],
                },
                where: {can_consult: true}, // Chỉ lấy user có quyền tư vấn
                attributes: ["email"],
            });
    
            if (!staffOrAdmins || staffOrAdmins.length === 0) {
                return res.status(404).json({
                    message: "Không tìm thấy staff nào có quyền tư vấn!",
                });
            }
            const recipientEmailsForStaff = staffOrAdmins.map((user) => user.email);
            await sendNotificationToUser(
                parseInt(user_id),
                user.fcm_token,
                {
                    title: "Bạn đã đặt tour thành công!",
                    type: NOTIFICATION_TYPE.BOOKING_DETAIL,
                    id: newBooking.id,
                    body: tourDetails.name_tour + ". Ngày khởi hành: " + travelTour.start_day
                }
            )
            const mailOptionsForStaff = {
                from: '"Việt Du Ký" <vietduky.service@gmail.com>',
                to: recipientEmailsForStaff,
                subject: "Yêu cầu hỗ trợ nhập thông tin từ khách hàng",
                html: `
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
                  <h1>Yêu cầu hỗ trợ nhập thông tin</h1>
                  <p>Xin chào,</p>
                  <p>Khách hàng <strong>${name}</strong> đã gửi yêu cầu hỗ trợ nhập thông tin về tour. Dưới đây là thông tin chi tiết:</p>
                  <table class="info-table">
                    <tr>
                      <th>Thông tin</th>
                      <th>Chi tiết</th>
                    </tr>
                    <tr>
                      <td>Họ và tên</td>
                      <td>${name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>${email}</td>
                    </tr>
                    <tr>
                      <td>Số điện thoại</td>
                      <td><a href="tel:{${phone}}">${phone}</a></td>
                    </tr>
                    <tr>
                      <td>Nội dung</td>
                      <td>${message}</td>
                    </tr>
                    <tr>
                      <td>Mã đặt tour</td>
                      <td>${booking_code}</td>
                    </tr>
                    <tr>
                      <td>Tên tour</td>
                      <td>${tourDetails.name_tour}</td>
                    </tr>
                    <tr>
                      <td>Số lượng người lớn</td>
                      <td>${number_adult}</td>
                    </tr>
                    <tr>
                      <td>Số lượng trẻ em</td>
                      <td>${number_children}</td>
                    </tr>
                    <tr>
                      <td>Số lượng trẻ nhỏ</td>
                      <td>${number_toddler}</td>
                    </tr>
                    <tr>
                      <td>Số lượng em bé</td>
                      <td>${number_newborn}</td>
                    </tr>
                    <tr>
                      <td>Ngày khởi hành</td>
                      <td>${travelTour.start_day}</td>
                    </tr>
                    <tr>
                      <td>Ngày kết thúc</td>
                      <td>${travelTour.end_day}</td>
                    </tr>
                    <tr>
                      <td>Ghi chú</td>
                      <td>${note}</td>
                    </tr>
                  </table>
                  <p>Vui lòng liên hệ với khách hàng để hỗ trợ nhập thông tin.</p>
                  <div class="footer">
                    <p>© 2025 Việt Du Ký</p>
                  </div>
                </div>
              </body>
            </html>
          `,
            };
    
            // Gửi email
            transporter.sendMail(mailOptionsForStaff, (error, info) => {
                if (error) {
                    console.error("Lỗi khi gửi email: ", error);
                    return res.status(500).json({message: "Lỗi khi gửi email!", error});
                } else {
                    console.log("Email đã được gửi: " + info.response);
                    return res
                        .status(200)
                        .json({message: "Yêu cầu tư vấn đã được gửi thành công!"});
                }
            });
        }
        res.status(201).json({
            message: "Đặt tour thành công!",
            data: newBooking,
            passengers: passengersArray,
        });
    } catch (error) {
        console.error("Lỗi khi tạo booking:", error);
        res.status(500).json({
            message: "Lỗi khi đặt tour!",
            error: error.message,
        });
    }
};

// Cập nhật thông tin booking
exports.updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const {
            name,
            phone,
            email,
            address,
            total_cost,
            note,
            number_adult,
            number_children,
            number_toddler,
            number_newborn,
            passengers,
        } = req.body;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(404).json({message: "Booking not found!"});
        }
        if (name) booking.name = name;
        if (phone) booking.phone = phone;
        if (email) booking.email = email;
        if (address) booking.address = address;
        if (total_cost) booking.total_cost = total_cost;
        if (number_adult) booking.number_adult = number_adult;
        if (number_children) booking.number_children = number_children;
        if (number_toddler) booking.number_toddler = number_toddler;
        if (number_newborn) booking.number_newborn = number_newborn;
        if (note) booking.note = note;
        if (passengers) {
            const travelTour = await TravelTour.findByPk(booking.travel_tour_id);
            const existingPassengers = await Passenger.findAll({
                where: {booking_id: bookingId},
            });
            if (existingPassengers.length > 0) {
                await Passenger.destroy({
                    where: {booking_id: bookingId},
                });
                travelTour.current_people -= existingPassengers.length;
                await travelTour.save();
            }
            //Kiểm tra số lượng người update có lớn hơn số lượng cũ không?
            //Nếu tính cả case passenger cho phép danh sách rỗng => kéo phần này vào ngoài if

            const current_people = travelTour.current_people + passengers.length;
            if (current_people > travelTour.max_people) {
                return res.status(500).json({
                    message: "Số lượng người đã vượt quá số lượng tối đa của chuyến!",
                });
            }
            travelTour.current_people = current_people;
            await travelTour.save();

            for (let i = 0; i < passengers.length; i++) {
                const newPassenger = await Passenger.create({
                    name: passengers[i].name,
                    birth_date: passengers[i].birth_date,
                    gender: passengers[i].gender,
                    phone_number: passengers[i].phone_number,
                    booking_id: bookingId,
                    passport_number: passengers[i].passport_number,
                    single_room: passengers[i].single_room,
                });
            }
        }

        await booking.save();

        res.status(200).json({
            message: "Cập nhật booking thành công!",
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            message: "Cập nhật booking thất bại!",
            error: error.message,
        });
    }
};

// Cancel booking
exports.deleteBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;

        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(200).json({message: "Không tìm thấy booking!"});
        }
        const travelTour = await TravelTour.findByPk(booking.travel_tour_id);
        const people_update =
            booking.number_adult +
            booking.number_children +
            booking.number_toddler +
            booking.number_newborn;
        travelTour.current_people -= people_update;
        await travelTour.save();
        await booking.destroy();

        res.status(200).json({
            message: "Đã hủy booking thành công!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi hủy booking!",
            error: error.message,
        });
    }
};

// Lấy booking mới nhất
exports.getLatestBooking = async (req, res) => {
    try {
        const latestBooking = await Booking.findOne({
            order: [["id", "DESC"]], // Sắp xếp giảm dần theo ID (mới nhất trước)
            include: [
                {model: User, attributes: ["id", "email", "avatar"]},
                {
                    model: TravelTour,
                    attributes: ["id", "tour_id", "start_day", "end_day", "price_tour"],
                },
                // {
                //     model: RestaurantBooking,
                //     include: [
                //         {
                //             model: Restaurant,
                //             attributes: [
                //                 "id",
                //                 "name_restaurant",
                //                 "address_restaurant",
                //                 "phone_number",
                //             ],
                //         },
                //     ],
                // },
                // {
                //     model: HotelBooking,
                //     include: [
                //         {
                //             model: Hotel,
                //             attributes: ["id", "name_hotel", "address_hotel", "phone_number"],
                //         },
                //     ],
                // },
                {
                    model: VehicleBooking,
                    include: [
                        {
                            model: Vehicle,
                            attributes: ["id", "name_vehicle", "plate_number"],
                        },
                    ],
                },
            ],
        });

        if (!latestBooking) {
            return res.status(200).json({message: "Không tìm thấy booking nào!"});
        }

        res.status(200).json({
            message: "Lấy booking mới nhất thành công!",
            data: latestBooking,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy booking mới nhất!",
            error: error.message,
        });
    }
};

exports.getBookingByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const bookings = await Booking.findAll({
            where: {user_id: userId},
            include: [
                {model: User, attributes: ["id", "email", "avatar"]},
                {
                    model: TravelTour,
                    attributes: ["id", "tour_id", "start_day", "end_day", "status"],
                    include: [
                        {
                            model: Tour,
                            as: "Tour",
                            attributes: ["id", "name_tour", "album"],
                        },
                    ],
                },
            ],
        });

        // Format lại dữ liệu trả về
        const formattedBookings = bookings.map((booking) => {
            const bookingData = booking.get({plain: true});
            return {
                ...bookingData,
                travel_tour: {
                    ...bookingData.TravelTour,
                    tour: bookingData.TravelTour.Tour || null,
                },
            };
        });

        res.status(200).json({
            message: "Lấy booking thành công!",
            data: formattedBookings,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy booking!",
            error: error.message,
        });
    }
};
exports.searchBooking = async (req, res) => {
    try {
        const {keyword, travel_tour_id} = req.query;
        const bookings = await Booking.findAll({
            where: {
                [Op.or]: [
                    {name: {[Op.like]: `%${keyword}%`}},
                    {email: {[Op.like]: `%${keyword}%`}},
                    {phone: {[Op.like]: `%${keyword}%`}},
                    {booking_code: {[Op.like]: `%${keyword}%`}},
                ],
                travel_tour_id: travel_tour_id,
            },
            include: [
                {model: User, attributes: ["id", "email", "avatar"]},
                {model: TravelTour},
            ],
        });

        res.status(200).json({
            message: "Tìm kiếm booking thành công!",
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi tìm kiếm booking!",
            error: error.message,
        });
    }
};
exports.getBookingByTravelTourId = async (req, res) => {
    try {
        const travelTourId = req.params.id;
        const bookings = await Booking.findAll({
            where: {travel_tour_id: travelTourId, status: 2},
        });
        res.status(200).json({
            message: "Lấy booking thành công!",
            data: bookings,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy booking!",
            error: error.message,
        });
    }
};
exports.getBookingByBookingCode = async (req, res) => {
    try {
        const bookingCode = req.body.booking_code;
        const booking = await Booking.findOne({
            where: {booking_code: bookingCode},
        });
        if (!booking) {
            return res.status(200).json({message: "Không tìm thấy booking!"});
        }
        res.status(200).json({
            message: "Lấy booking thành công!",
            data: booking,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy booking!",
            error: error.message,
        });
    }
};
exports.rePayment = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const booking = await Booking.findByPk(bookingId);
        if (!booking) {
            return res.status(200).json({message: "Không tìm thấy booking!"});
        }
        const payments = await Payment.findAll({
            where: {booking_id: bookingId},
        });
        let amount = booking.total_cost;
        if (payments.length > 0) {
            for (let i = 0; i < payments.length; i++) {
                amount -= payments[i].amount;
            }
        }
        if (amount > 0) {
            res.status(200).json({
                message: "Lấy số tiền còn thiếu thành công!",
                data: amount,
            });
        } else {
            res.status(200).json({
                message: "Đã thanh toán hết!",
                data: 0,
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy số tiền còn thiếu!",
            error: error.message,
        });
    }
};
exports.paymentBookingRemind = async (req, res) => {
    try {
        const today = new Date();
        const thirtyDaysFromNow = new Date(today);
        thirtyDaysFromNow.setDate(today.getDate() + 30);

        const bookings = await Booking.findAll({
            where: {
                status: {
                    [Op.in]: [0, 1] // 0: Not Paid, 1: Half Paid
                }
            },
            include: [
                {model: User},
                {
                    model: TravelTour,
                    where: {
                        start_day: {
                            [Op.between]: [today, thirtyDaysFromNow]
                        }
                    },
                    include: [{model: Tour}]
                }
            ]
        });

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({message: "Không có booking nào cần nhắc nhở thanh toán!"});
        }

        for (const booking of bookings) {
            // Lấy thông tin thanh toán
            const payments = await db.Payment.findAll({
                where: {booking_id: booking.id}
            });

            const paidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
            const remainingAmount = booking.total_cost - paidAmount;

            // Lấy danh sách hành khách
            const passengers = await Passenger.findAll({
                where: {booking_id: booking.id}
            });

            // Gửi email thông báo
            sendPaymentReminderEmail(booking.email, {
                name: booking.name,
                name_tour: booking.TravelTour.Tour.name_tour,
                start_day: booking.TravelTour.start_day,
                total_cost: booking.total_cost,
                paid_amount: paidAmount,
                remaining_amount: remainingAmount,
                passengers: passengers
            });
            await sendNotificationToUser(
                parseInt(booking.user_id),
                booking.User.fcm_token,
                {
                    title: "Bạn có đơn hàng cần thanh toán!",
                    type: NOTIFICATION_TYPE.BOOKING_DETAIL,
                    id: booking.id,
                    body: booking.TravelTour.Tour.name_tour + ". Số tiền chưa thanh toán: " + remainingAmount.toLocaleString('vi-VN') + " VNĐ"
                }
            )
        }

        res.status(200).json({
            message: "Đã gửi thông báo thanh toán thành công!",
            count: bookings.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi gửi email thông báo thanh toán booking!",
            error: error.message
        });
    }
};
const sendUpcomingTourEmail = (userEmail, tourDetails) => {
    const {
        name,
        name_tour,
        start_day,
        end_day,
        start_time_depart,
        end_time_depart,
        start_time_close,
        end_time_close,
        passengers
    } = tourDetails;

    // Format ngày tháng
    const formattedStartDate = formatDate(start_day);
    const formattedEndDate = formatDate(end_day);

    // Format thời gian
    const formattedStartTimeDepart = formatTime(start_time_depart);
    const formattedEndTimeDepart = formatTime(end_time_depart);
    const formattedStartTimeClose = formatTime(start_time_close);
    const formattedEndTimeClose = formatTime(end_time_close);

    const mailOptions = {
        from: '"Việt Du Ký" <vietduky.service@gmail.com>',
        to: userEmail,
        subject: "Thông báo: Tour của bạn sắp đến ngày khởi hành",
        html: `
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
                            background-color: #f0f8ff;
                            position: relative;
                        }
                        h1 {
                            color: #1e88e5;
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
                            background-color: #1e88e5;
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
                        <h1>Thông báo: Tour sắp đến ngày khởi hành</h1>
                        <p>Xin chào <strong>${name}</strong>,</p>
                        <p>Chúng tôi xin thông báo rằng tour của bạn sắp đến ngày khởi hành. Dưới đây là thông tin chi tiết:</p>
                        <table class="info-table">
                            <tr>
                                <th>Thông tin tour</th>
                                <th>Chi tiết</th>
                            </tr>
                            <tr>
                                <td>Tour</td>
                                <td>${name_tour}</td>
                            </tr>
                            <tr>
                                <td>Ngày bắt đầu</td>
                                <td>${formattedStartDate}</td>
                            </tr>
                            <tr>
                                <td>Ngày kết thúc</td>
                                <td>${formattedEndDate}</td>
                            </tr>
                        </table>
                        <table class="info-table">
                            <tr>
                                <th>Ngày khởi hành Tour</th>
                                <th>Chi tiết</th>
                            </tr>
                            <tr>
                                <td>Thời gian khởi hành</td>
                                <td>${formattedStartTimeDepart}</td>
                            </tr>
                            <tr>
                                <td>Thời gian kết thúc</td>
                                <td>${formattedEndTimeDepart}</td>
                            </tr>
                        </table>
                        <table class="info-table">
                            <tr>
                                <th>Ngày kết thúc Tour</th>
                                <th>Chi tiết</th>
                            </tr>
                            <tr>
                                <td>Thời gian khởi hành</td>
                                <td>${formattedStartTimeClose}</td>
                            </tr>
                            <tr>
                                <td>Thời gian kết thúc</td>
                                <td>${formattedEndTimeClose}</td>
                            </tr>
                        </table>
                        <p>Vui lòng chuẩn bị đầy đủ giấy tờ và hành lý cần thiết cho chuyến đi.</p>
                        <p>Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email hoặc số điện thoại hỗ trợ.</p>
                        <div class="footer">
                            <p>© 2025 Việt Du Ký. Tất cả các quyền được bảo lưu.</p>
                        </div>
                    </div>
                </body>
            </html>
        `
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Lỗi khi gửi email: ", error);
        } else {
            console.log("Email đã được gửi: " + info.response);
        }
    });
};
exports.remindUpcomingTour = async (req, res) => {
    try {
        const today = new Date();
        const sevenDaysFromNow = new Date(today);
        sevenDaysFromNow.setDate(today.getDate() + 7);

        const bookings = await Booking.findAll({
            where: {
                status: 2 // 2: Paid
            },
            include: [
                {model: User},
                {
                    model: TravelTour,
                    where: {
                        start_day: {
                            [Op.between]: [today, sevenDaysFromNow]
                        }
                    },
                    include: [{model: Tour}]
                }
            ]
        });

        if (!bookings || bookings.length === 0) {
            return res.status(200).json({message: "Không có tour nào sắp đến ngày khởi hành!"});
        }

        for (const booking of bookings) {
            // Lấy danh sách hành khách
            const passengers = await Passenger.findAll({
                where: {booking_id: booking.id}
            });

            // Gửi email thông báo
            sendUpcomingTourEmail(booking.email, {
                name: booking.name,
                name_tour: booking.TravelTour.Tour.name_tour,
                start_day: booking.TravelTour.start_day,
                end_day: booking.TravelTour.end_day,
                start_time_depart: booking.TravelTour.start_time_depart,
                end_time_depart: booking.TravelTour.end_time_depart,
                start_time_close: booking.TravelTour.start_time_close,
                end_time_close: booking.TravelTour.end_time_close,
                passengers: passengers
            });
            await sendNotificationToUser(
                parseInt(booking.user_id),
                booking.User.fcm_token,
                {
                    title: "Tour của bạn sắp đến ngày khởi hành!",
                    type: NOTIFICATION_TYPE.BOOKING_UPCOMING,
                    id: booking.id,
                    body: booking.TravelTour.Tour.name_tour + " của bạn sắp đến ngày khởi hành. Ngày khởi hành: " + booking.TravelTour.start_time_depart + " " + booking.TravelTour.start_day
                }
            )
        }

        res.status(200).json({
            message: "Đã gửi thông báo tour sắp đến thành công!",
            count: bookings.length
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi gửi email thông báo tour sắp đến!",
            error: error.message
        });
    }
};

exports.getDetailBooking = async (req, res) => {
    try {
        const {id} = req.params;
        const booking = await Booking.findByPk(id, {
            include: [
                {model: User},
                {
                    model: TravelTour,
                    include: [
                        {model: Tour},
                        {
                            model: GuideTour,
                            include: [
                                {
                                    model: TravelGuide,
                                    include: [
                                        {model: User, as: 'user'},
                                        {model: User, as: 'staff'}
                                    ],
                                    as: 'travelGuide'
                                }
                            ]
                        }
                    ]
                },
                {
                    model: Passenger,
                    as: 'passengers'
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                message: "Không tìm thấy booking!"
            });
        }

        // Nhóm passenger theo group của GuideTour
        const passengersByGroup = {};
        if (booking.TravelTour && booking.TravelTour.GuideTours) {
            // Tạo các nhóm từ GuideTour
            booking.TravelTour.GuideTours.forEach(guideTour => {
                if (guideTour.group) {
                    passengersByGroup[guideTour.group] = {
                        guide: guideTour.travelGuide,
                        passengers: []
                    };
                }
            });
        }

        // Thêm passenger vào nhóm tương ứng
        if (booking.passengers) {
            booking.passengers.forEach(passenger => {
                if (passenger.group && passengersByGroup[passenger.group]) {
                    passengersByGroup[passenger.group].passengers.push(passenger);
                } else {
                    // Nếu passenger không có group hoặc group không tồn tại
                    if (!passengersByGroup['unassigned']) {
                        passengersByGroup['unassigned'] = {
                            guide: null,
                            passengers: []
                        };
                    }
                    passengersByGroup['unassigned'].passengers.push(passenger);
                }
            });
        }

        // Format lại dữ liệu trả về
        const formattedBooking = {
            ...booking.toJSON(),
            passengersByGroup
        };

        res.status(200).json({
            message: "Lấy thông tin booking thành công!",
            data: formattedBooking
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy thông tin booking!",
            error: error.message
        });
    }
}

// exports.remindExpiredBooking = async (req, res) => {
//     try {
//         const today = new Date();
//         const thirtyDaysFromNow = new Date(today);
//         thirtyDaysFromNow.setDate(today.getDate() + 30);

//         const bookings = await Booking.findAll({
//             where: {
//                 status: {
//                     [Op.in]: [0, 1] // 0: Not Paid, 1: Half Paid
//                 }

//             },
//             include: [
//                 {model: User},
//                 {model: TravelTour, include: [{model: Tour}],
//                     where: {
//                         start_day: {
//                             [Op.between]: [today, thirtyDaysFromNow]
//                         }
//                     }
//                 }
//             ]
//         });

//         if (!bookings || bookings.length === 0) {
//             return res.status(200).json({message: "Không có booking nào sắp hết hạn!"});
//         }

//         for (const booking of bookings) {
//             // Lấy danh sách hành khách
//             const passengers = await Passenger.findAll({
//                 where: {booking_id: booking.id}
//             });

//             // Gửi email thông báo
//             sendExpiredBookingEmail(booking.email, {
//                 name: booking.name,
//                 name_tour: booking.TravelTour.Tour.name_tour,
//                 start_day: booking.TravelTour.start_day,
//                 passengers: passengers
//             });
//             await sendNotificationToUser(
//                 parseInt(booking.user_id),
//                 booking.User.fcm_token,
//                 {
//                     title: "Booking của bạn sắp hết hạn!",
//                     type: NOTIFICATION_TYPE.BOOKING_EXPIRED,
//                     id: booking.id,
//                     body: booking.TravelTour.Tour.name_tour + " của bạn sắp hết hạn. Ngày khởi hành: " + booking.TravelTour.start_day
//                 }
//             )
//         }

//         res.status(200).json({
//             message: "Đã gửi thông báo booking sắp hết hạn thành công!",
//             count: bookings.length
//         });
//     } catch (error) {
//         res.status(500).json({
//             message: "Lỗi khi gửi email thông báo booking sắp hết hạn!",
//             error: error.message
//         });
//     }
// };


