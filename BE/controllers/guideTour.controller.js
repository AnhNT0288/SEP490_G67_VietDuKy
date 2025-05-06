const db = require("../models");
const GuideTour = db.GuideTour;
const TravelGuide = db.TravelGuide;
const TravelTour = db.TravelTour;
const Tour = db.Tour;
const Location = db.Location;
const User = db.User;
const Booking = db.Booking;
const Passenger = db.Passenger;
const Role = db.Role;
const nodemailer = require("nodemailer");
const TravelGuideLocation = db.TravelGuideLocation;
const {NOTIFICATION_TYPE} = require("../constants");
const {sendRoleBasedNotification, sendNotificationToUser} = require("../utils/sendNotification");
const {Op} = require("sequelize");

//Cấu hình nodemailer
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Format ngày tháng năm
const formatDate = (date) => {
    return new Intl.DateTimeFormat("vi-VN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).format(new Date(date));
};

// Gửi email cho admin khi có yêu cầu tham gia tour từ TravelGuide
const sendAdminEmailRequestTravelTour = async (travelGuide, travelTour) => {
    const {
        first_name,
        last_name,
        email,
        number_phone,
        gender_guide,
        birth_date,
    } = travelGuide;

    const {start_day, end_day} = travelTour;
    const tour = await Tour.findByPk(travelTour.tour_id); // Lấy thông tin tour từ bảng Tour
    const {name_tour} = tour;

    const formattedStartDate = formatDate(start_day);
    const formattedEndDate = formatDate(end_day);

    try {
        // Lấy danh sách email của admin từ bảng User và Role
        const adminUsers = await User.findAll({
            include: {
                model: Role,
                as: "role",
                where: {role_name: "admin"},
                attributes: [], // Không cần lấy thêm thông tin từ Role
            },
            attributes: ["email"], // Chỉ lấy email
        });

        if (!adminUsers || adminUsers.length === 0) {
            console.error("Không tìm thấy admin nào để gửi email.");
            return;
        }

        // Lấy danh sách email của admin
        const adminEmails = adminUsers.map((admin) => admin.email);

        const mailOptions = {
            from: '"Việt Du Ký" <vietduky.service@gmail.com>',
            to: adminEmails, // Gửi đến tất cả admin
            subject: "Yêu cầu tham gia Tour du lịch mới",
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
              <h1>Yêu cầu tham gia TravelTour</h1>
              <p>Xin chào Admin,</p>
              <p>Hướng dẫn viên <strong>${first_name} ${last_name}</strong> đã gửi yêu cầu tham gia tour <strong>${name_tour}</strong>. Dưới đây là thông tin chi tiết:</p>
              <table class="info-table">
                <tr>
                  <th>Thông tin hướng dẫn viên</th>
                  <th>Chi tiết</th>
                </tr>
                <tr>
                  <td>Họ và tên</td>
                  <td>${first_name} ${last_name}</td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>${email}</td>
                </tr>
                <tr>
                  <td>Số điện thoại</td>
                  <td>${number_phone}</td>
                </tr>
                <tr>
                  <td>Giới tính</td>
                  <td>${gender_guide === "male" ? "Nam" : "Nữ"}</td>
                </tr>
                <tr>
                  <td>Ngày sinh</td>
                  <td>${formatDate(birth_date)}</td>
                </tr>
              </table>
              <table class="info-table">
                <tr>
                  <th>Thông tin tour</th>
                  <th>Chi tiết</th>
                </tr>
                <tr>
                  <td>Tên tour</td>
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
              <p>Vui lòng kiểm tra và xử lý yêu cầu này trong hệ thống quản lý.</p>
              <div class="footer">
                <p>© 2025 Việt Du Ký</p>
              </div>
            </div>
          </body>
        </html>
      `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Lỗi khi gửi email: ", error);
            } else {
                console.log("Email đã được gửi: " + info.response);
            }
        });
    } catch (error) {
        console.error("Lỗi khi gửi email cho admin:", error);
    }
};

// Lấy tất cả các tour mà một hướng dẫn viên tham gia bằng id
exports.getGuideTours = async (req, res) => {
    try {
        const travel_guide_id = req.params.id;

        const travelGuide = await TravelGuide.findByPk(travel_guide_id);
        if (!travelGuide) {
            return res
                .status(200)
                .json({message: "Không tìm thấy hướng dẫn viên!"});
        }

        const guideTours = await GuideTour.findAll({
            where: {travel_guide_id: travel_guide_id},
            include: [
                {
                    model: TravelTour,
                    as: "travelTour",
                },
                {
                    model: TravelGuide,
                    as: "travelGuide",
                },
            ],
        });

        if (guideTours.length === 0) {
            return res
                .status(200)
                .json({message: "Không tìm thấy tour nào cho hướng dẫn viên này!"});
        }

        res.status(200).json({
            message: "Lấy danh sách tour của hướng dẫn viên thành công!",
            data: guideTours,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi lấy danh sách tour của hướng dẫn viên!",
            error: error.message,
        });
    }
};

// Thêm hướng dẫn viên vào một tour
exports.addGuideToTour = async (req, res) => {
    try {
        const {travel_tour_id, travel_guide_id} = req.body;

        // Kiểm tra tour du lịch tồn tại
        const travelTour = await TravelTour.findByPk(travel_tour_id);
        const tour = await Tour.findByPk(travelTour.tour_id);
        if (!travelTour) {
            return res
                .status(200)
                .json({message: "Không tìm thấy lịch khởi hành!"});
        }


        // Kiểm tra hướng dẫn viên đã gửi yêu cầu tham gia tour này chưa
        const existingGuideTour = await GuideTour.findOne({
            where: {
                travel_tour_id: travel_tour_id,
                travel_guide_id: travel_guide_id,
            },
        });

        if (existingGuideTour) {
            return res.status(200).json({
                message:
                    "Hướng dẫn viên đã gửi yêu cầu tham gia tour này rồi! Vui lòng kiểm tra lại",
            });
        }
        const travelGuide = await TravelGuide.findByPk(travel_guide_id);

        // Tạo mới yêu cầu tham gia tour
        const newGuideTour = await GuideTour.create({
            travel_tour_id,
            travel_guide_id,
            status: 0, // Đợi admin xác nhận
        });

        // Gửi email thông báo cho admin
        await sendAdminEmailRequestTravelTour(travelGuide, travelTour);
        await sendRoleBasedNotification(
            ["admin", "staff"],
            {
                title: "Có yêu cầu đi tour mới!",
                type: NOTIFICATION_TYPE.GUIDE_TOUR_REQUEST,
                id: newGuideTour.id,
                body: travelGuide.first_name + " " + travelGuide.last_name + " đã gửi yêu cầu tham gia tour " + tour.name_tour
            }
        );

        res.status(201).json({
            message:
                "Gửi yêu cầu tham gia tour thành công! Vui lòng đợi admin xác nhận.",
            data: newGuideTour,
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi gửi yêu cầu tham gia tour!",
            error: error.message,
        });
    }
};

// Xác nhận yêu cầu tham gia tour của hướng dẫn viên
exports.approveGuideTour = async (req, res) => {
    try {
        const guideTourId = req.params.id;

        // Tìm GuideTour theo ID
        const guideTour = await GuideTour.findByPk(guideTourId);
        if (!guideTour) {
            return res
                .status(200)
                .json({message: "Không tìm thấy hướng dẫn viên trong tour!"});
        }

        // Tìm thông tin TravelGuide
        const travelGuide = await TravelGuide.findByPk(guideTour.travel_guide_id, {
            include: [
                {
                    model: User,
                    as: "user",
                },
            ],
        });
        if (!travelGuide) {
            return res
                .status(200)
                .json({message: "Không tìm thấy hướng dẫn viên!"});
        }

        // Tìm thông tin TravelTour
        const travelTour = await TravelTour.findByPk(guideTour.travel_tour_id, {
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    attributes: ["name_tour"],
                },
            ],
        });
        if (!travelTour) {
            return res
                .status(200)
                .json({message: "Không tìm thấy lịch khởi hành!"});
        }

        // Cập nhật trạng thái GuideTour
        guideTour.status = 1; // Đã được duyệt
        await guideTour.save();

        // Gửi email thông báo cho TravelGuide
        const mailOptions = {
            from: '"Việt Du Ký" <vietduky.service@gmail.com>',
            to: travelGuide.email, // Email của TravelGuide
            subject: "Yêu cầu tham gia Tour du lịch đã được chấp nhận",
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
              <h1>Chúc mừng!</h1>
              <p>Xin chào <strong>${travelGuide.first_name} ${
                travelGuide.last_name
            }</strong>,</p>
              <p>Yêu cầu tham gia tour <strong>${
                travelTour.Tour.name_tour
            }</strong> của bạn đã được chấp nhận. Dưới đây là thông tin chi tiết:</p>
              <table class="info-table">
                <tr>
                  <th>Thông tin tour</th>
                  <th>Chi tiết</th>
                </tr>
                <tr>
                  <td>Tên tour</td>
                  <td>${travelTour.Tour.name_tour}</td>
                </tr>
                <tr>
                  <td>Ngày bắt đầu</td>
                  <td>${formatDate(travelTour.start_day)}</td>
                </tr>
                <tr>
                  <td>Ngày kết thúc</td>
                  <td>${formatDate(travelTour.end_day)}</td>
                </tr>
              </table>
              <p>Vui lòng chuẩn bị và sẵn sàng cho chuyến đi. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
              <div class="footer">
                <p>© 2025 Việt Du Ký</p>
              </div>
            </div>
          </body>
        </html>
      `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Lỗi khi gửi email: ", error);
            } else {
                console.log("Email đã được gửi: " + info.response);
            }
        });
        await sendNotificationToUser(
            parseInt(travelGuide.user_id),
            travelGuide.user.fcm_token,
            {
                title: "Yêu cầu đi tour đã được duyệt!",
                type: NOTIFICATION_TYPE.GUIDE_TOUR_APPROVED,
                id: guideTour.id,
                body: travelTour.Tour.name_tour + ". Ngày khởi hành: " + travelTour.start_day
            }
        )

        res.status(200).json({
            message: "Duyệt hướng dẫn viên thành công và đã gửi email thông báo!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi duyệt hướng dẫn viên!",
            error: error.message,
        });
    }
};

// Từ chối yêu cầu tham gia tour của hướng dẫn viên
exports.rejectGuideTour = async (req, res) => {
    try {
        const guideTourId = req.params.id;

        // Tìm GuideTour theo ID
        const guideTour = await GuideTour.findByPk(guideTourId);
        if (!guideTour) {
            return res
                .status(200)
                .json({message: "Không tìm thấy hướng dẫn viên trong tour!"});
        }

        // Tìm thông tin TravelGuide
        const travelGuide = await TravelGuide.findByPk(guideTour.travel_guide_id);
        if (!travelGuide) {
            return res
                .status(200)
                .json({message: "Không tìm thấy hướng dẫn viên!"});
        }

        // Tìm thông tin TravelTour
        const travelTour = await TravelTour.findByPk(guideTour.travel_tour_id, {
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    attributes: ["name_tour"],
                },
            ],
        });
        if (!travelTour) {
            return res
                .status(200)
                .json({message: "Không tìm thấy lịch khởi hành!"});
        }

        // Cập nhật trạng thái GuideTour
        guideTour.status = 2; // Bị từ chối
        await guideTour.save();

        // Gửi email thông báo cho TravelGuide
        const mailOptions = {
            from: '"Việt Du Ký" <vietduky.service@gmail.com>',
            to: travelGuide.email, // Email của TravelGuide
            subject: "Yêu cầu tham gia Tour du lịch đã bị từ chối",
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
              <h1>Thông báo</h1>
              <p>Xin chào <strong>${travelGuide.first_name} ${
                travelGuide.last_name
            }</strong>,</p>
              <p>Yêu cầu tham gia tour <strong>${
                travelTour.Tour.name_tour
            }</strong> của bạn đã bị từ chối. Dưới đây là thông tin chi tiết:</p>
              <table class="info-table">
                <tr>
                  <th>Thông tin tour</th>
                  <th>Chi tiết</th>
                </tr>
                <tr>
                  <td>Tên tour</td>
                  <td>${travelTour.Tour.name_tour}</td>
                </tr>
                <tr>
                  <td>Ngày bắt đầu</td>
                  <td>${formatDate(travelTour.start_day)}</td>
                </tr>
                <tr>
                  <td>Ngày kết thúc</td>
                  <td>${formatDate(travelTour.end_day)}</td>
                </tr>
                <tr>
                  <td>Địa điểm bắt đầu</td>
                  <td>${travelTour.Tour.start_location}</td>
                </tr>
                <tr>
                  <td>Địa điểm kết thúc</td>
                  <td>${travelTour.Tour.end_location}</td>
                </tr>
              </table>
              <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi để biết thêm chi tiết.</p>
              <div class="footer">
                <p>© 2025 Việt Du Ký</p>
              </div>
            </div>
          </body>
        </html>
      `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Lỗi khi gửi email: ", error);
            } else {
                console.log("Email đã được gửi: " + info.response);
            }
        });

        res.status(200).json({
            message: "Từ chối hướng dẫn viên thành công và đã gửi email thông báo!",
        });
    } catch (error) {
        res.status(500).json({
            message: "Lỗi khi từ chối hướng dẫn viên!",
            error: error.message,
        });
    }
};
exports.getGuideTourByUserId = async (req, res) => {
    try {
        const userId = req.params.id;
        const {
            page = 1,
            limit = 10,
            start_location_id,
            end_location_id,
            name_tour,
            start_day,
            status,
            upcoming,
        } = req.query;
        const travelGuide = await TravelGuide.findOne({
            where: {
                user_id: userId,
            },
        });
        if (!travelGuide) {
            return res
                .status(200)
                .json({message: "Không tìm thấy hướng dẫn viên!"});
        }

        // Tạo điều kiện where cho Tour
        const tourWhereCondition = {};
        if (start_location_id) {
            tourWhereCondition.start_location = start_location_id;
        }
        if (end_location_id) {
            tourWhereCondition.end_location = end_location_id;
        }
        if (name_tour) {
            tourWhereCondition.name_tour = {
                [Op.like]: `%${name_tour}%`,
            };
        }

        // Tạo điều kiện where cho TravelTour
        const travelTourWhereCondition = {};
        if (start_day) {
            travelTourWhereCondition.start_day = {
                [Op.gte]: new Date(start_day),
            };
        }

        // Filter theo status
        if (status) {
            travelTourWhereCondition.status = status;
        }

        // Filter tour sắp diễn ra (trong 7 ngày tới)
        if (upcoming === "true") {
            const now = new Date();
            const sevenDaysLater = new Date(now);
            sevenDaysLater.setDate(now.getDate() + 7);

            travelTourWhereCondition.start_day = {
                [Op.between]: [now, sevenDaysLater],
            };
        }

        const offset = (page - 1) * limit;

        const {count, rows: guideTours} = await GuideTour.findAndCountAll({
            where: {travel_guide_id: travelGuide.id},
            include: [
                {
                    model: TravelTour,
                    as: "travelTour",
                    where: travelTourWhereCondition,
                    include: [
                        {
                            model: Tour,
                            as: "Tour",
                            where: tourWhereCondition,
                            include: [
                                {
                                    model: Location,
                                    as: "startLocation",
                                    attributes: ["id", "name_location"],
                                },
                                {
                                    model: Location,
                                    as: "endLocation",
                                    attributes: ["id", "name_location"],
                                },
                            ],
                        },
                    ],
                },
            ],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [["createdAt", "DESC"]],
        });

        // Format lại dữ liệu trả về
        const formattedGuideTours = guideTours.map((guideTour) => {
            const guideTourData = guideTour.get({plain: true});
            return {
                ...guideTourData,
                travel_tour: {
                    ...guideTourData.travelTour,
                    tour: {
                        ...guideTourData.travelTour.Tour,
                        start_location: guideTourData.travelTour.Tour.startLocation || null,
                        end_location: guideTourData.travelTour.Tour.endLocation || null,
                    },
                },
            };
        });

        res.status(200).json({
            message: "Lấy danh sách tour của hướng dẫn viên thành công!",
            data: {
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: parseInt(page),
                items: formattedGuideTours,
            },
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách tour của hướng dẫn viên!",
            error: error.message,
        });
    }
};
exports.getTravelTourDetailForGuide = async (req, res) => {
    try {
        const {travelTourId} = req.params;
        const {travel_guide_id} = req.query;
        let passengerCountByGuide = {};
        let passengersByGuide = [];
        // Lấy thông tin tour du lịch
        const travelTour = await TravelTour.findOne({
            where: {id: travelTourId},
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    include: [
                        {
                            model: Location,
                            as: "startLocation",
                            attributes: ["id", "name_location"],
                        },
                        {
                            model: Location,
                            as: "endLocation",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
        });

        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy tour du lịch!"});
        }

        // Lấy thông tin hướng dẫn viên của tour
        const guideTours = await GuideTour.findAll({
            where: {travel_tour_id: travelTourId},
            include: [
                {
                    model: TravelGuide,
                    as: "travelGuide",
                    include: [
                        {
                            model: User,
                            as: "user",
                        },
                    ],
                },
            ],
        });
        // Lấy danh sách booking của tour
        const bookings = await Booking.findAll({
            where: {travel_tour_id: travelTourId},
        });
        if (travel_guide_id) {
            const guideTourDetail = await GuideTour.findOne({
                where: {travel_guide_id, travel_tour_id: travelTourId},
            });
            if (guideTourDetail && guideTourDetail.group === 1) {
                
            // Lấy danh sách hành khách đã được gán cho từng TravelGuide
            const passengersByGuide = await Passenger.findAll({
                where: {
                    booking_id: {
                        [Op.in]: bookings.map((booking) => booking.id),
                    },
                    group: guideTourDetail.group,
                },
                include: [
                    {
                        model: Booking,
                        as: "booking",
                        attributes: ["id"],
                    },
                ],
            });

            // Nhóm hành khách theo TravelGuide
            const passengerCountByGuide = passengersByGuide.reduce(
                (acc, passenger) => {
                    const guideId = passenger.travel_guide_id;
                    if (!acc[guideId]) {
                        acc[guideId] = 0;
                    }
                    acc[guideId]++;
                    return acc;
                },
                {}
            );
            } else {
                passengersByGuide = [];
                passengerCountByGuide = {};
            }

        } else {
            // Lấy danh sách hành khách cho tất cả các booking
            const allPassengers = await Passenger.findAll({
                where: {
                    booking_id: {
                        [Op.in]: bookings.map((booking) => booking.id),
                    },
                },
                include: [
                    {
                        model: Booking,
                        as: "booking",
                        attributes: ["id"],
                    },
                ],
            });

            // Nhóm hành khách theo TravelGuide
            passengerCountByGuide = allPassengers.reduce((acc, passenger) => {
                const guideId = passenger.travel_guide_id;
                if (!acc[guideId]) {
                    acc[guideId] = 0;
                }
                acc[guideId]++;
                return acc;
            }, {});

            // Lưu danh sách hành khách
            passengersByGuide = allPassengers;
        }
        const formatedGuideTour = guideTours
            .map((guideTour) => {
                if (!guideTour.travelGuide) {
                    return null;
                }
                return {
                    id: guideTour.travelGuide.id,
                    gender: guideTour.travelGuide.gender_guide,
                    first_name: guideTour.travelGuide.first_name,
                    last_name: guideTour.travelGuide.last_name,
                    email: guideTour.travelGuide.email,
                    phone: guideTour.travelGuide.number_phone,
                    address: guideTour.travelGuide.address,
                    avatar: guideTour.travelGuide.user?.avatar || null,
                    display_name: guideTour.travelGuide.user?.displayName || null,
                    passenger_count: 0, // Sẽ được cập nhật bên dưới
                };
            })
            .filter((guide) => guide !== null);

        // Tính số lượng passenger cho mỗi guideTour
        for (const guide of formatedGuideTour) {
            const guideTour = guideTours.find(gt => gt.travelGuide.id === guide.id);
            if (guideTour && guideTour.group) {
                const passengerCount = await Passenger.count({
                    where: {
                        booking_id: {
                            [Op.in]: bookings.map(booking => booking.id)
                        },
                        group: guideTour.group
                    }
                });
                guide.passenger_count = passengerCount;
            }
        }

        // Format lại dữ liệu trả về
        const formattedTravelTour = {
            id: travelTour.id,
            tour_id: travelTour.tour_id,
            start_day: travelTour.start_day,
            end_day: travelTour.end_day,
            status: travelTour.status,
            active: travelTour.active,
            price_tour: travelTour.price_tour,
            current_people: travelTour.current_people,
            max_people: travelTour.max_people,
            tour: {
                id: travelTour.Tour.id,
                name_tour: travelTour.Tour.name_tour,
                start_location: travelTour.Tour.startLocation,
                end_location: travelTour.Tour.endLocation,
            },
            guides: formatedGuideTour,
            bookings: bookings.map((booking) => ({
                id: booking.id,
                status: booking.status,
                number_children: booking.number_children,
                number_adult: booking.number_adult,
                number_toddler: booking.number_toddler,
                number_newborn: booking.number_newborn,
                booking_date: booking.booking_date,
                total_cost: booking.total_cost,
                name: booking.name,
                email: booking.email,
                phone: booking.phone,
                address: booking.address,
                note: booking.note,
                booking_code: booking.booking_code,
            })),
            passengers: passengersByGuide,
        };

        const message =
            guideTours.length === 0
                ? "Chưa có hướng dẫn viên cho tour này!"
                : "Lấy thông tin tour du lịch thành công!";

        res.json({
            message,
            data: formattedTravelTour,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi lấy thông tin tour du lịch",
            error: error.message,
        });
    }
};

// Gán hành khách cho hướng dẫn viên tự động
exports.assignPassengerToGuideAuto = async (req, res) => {
    try {
        const {number_passenger, travel_tour_id} = req.body;

        // Hàm tính tuổi từ ngày sinh
        const calculateAge = (birth_date) => {
            const birthDate = new Date(birth_date);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (
                monthDiff < 0 ||
                (monthDiff === 0 && today.getDate() < birthDate.getDate())
            ) {
                age--;
            }

            return age;
        };

        // Kiểm tra tour du lịch tồn tại
        const travelTour = await TravelTour.findByPk(travel_tour_id);
        if (!travelTour) {
            return res
                .status(200)
                .json({message: "Không tìm thấy lịch khởi hành!"});
        }
        const tour = await Tour.findByPk(travelTour.tour_id);
        // Lấy danh sách hướng dẫn viên của tour
        const existingGuideTours = await GuideTour.findAll({
            where: {
                travel_tour_id: travel_tour_id,
                status: 1, // Chỉ lấy hướng dẫn viên đã được duyệt
            },
            include: [
                {
                    model: TravelGuide,
                    as: "travelGuide",
                    include: [
                        {
                            model: User,
                            as: "user",
                        },
                    ],
                },
            ],
        });

        const totalBooking = await Booking.findAll({
            where: {
                travel_tour_id: travel_tour_id,
                status: 2,
            },
        });

        const totalPassengers = await Passenger.findAll({
            where: {
                booking_id: {
                    [Op.in]: totalBooking.map((booking) => booking.id),
                },
                birth_date: {
                    [Op.lt]: new Date(new Date().setFullYear(new Date().getFullYear() - 2))
                },
            },
        });
        const needGuides = Math.ceil(totalPassengers.length / number_passenger);
        let needMoreGuides = 0;
        if (needGuides > existingGuideTours.length) {
            needMoreGuides = needGuides - existingGuideTours.length;
        }

        // Nếu cần thêm hướng dẫn viên
        if (needMoreGuides > 0) {
            // Lấy location_id từ tour
            const tour = await Tour.findByPk(travelTour.tour_id, {
                include: [
                    {
                        model: Location,
                        as: "endLocation",
                    },
                ],
            });
            if (!tour) {
                return res.status(404).json({ message: "Không tìm thấy thông tin tour!" });
            }

            // Tìm các travelGuide theo location
            const travelGuideLocations = await TravelGuideLocation.findAll({
                where: {
                    location_id: tour.end_location, // Lấy theo location kết thúc của tour
                },
            });

            // Lấy danh sách travelGuide theo location
            const availableTravelGuides = await TravelGuide.findAll({
                where: {
                    [Op.and]: [
                        {
                            id: {
                                [Op.in]: travelGuideLocations.map(loc => loc.travel_guide_id)
                            }
                        },
                        {
                            id: {
                                [Op.notIn]: existingGuideTours.map(gt => gt.travel_guide_id)
                            }
                        }
                    ]
                },
                include: [
                    {
                        model: User,
                        as: "user",
                    },
                ]
            });

            // Kiểm tra số lượng travelGuide có sẵn
            if (availableTravelGuides.length < needMoreGuides) {
                return res.status(400).json({
                    message: `Không đủ hướng dẫn viên cho ${tour.endLocation.name_location}. Cần thêm ${needMoreGuides} hướng dẫn viên nhưng chỉ có ${availableTravelGuides.length} hướng dẫn viên phù hợp.`
                });
            }

            // Lấy đúng số lượng cần thiết
            const selectedGuides = availableTravelGuides.slice(0, needMoreGuides);

            // Tạo guideTour mới cho các travelGuide tìm được
            for (const travelGuide of selectedGuides) {
                await GuideTour.create({
                    travel_tour_id: travel_tour_id,
                    travel_guide_id: travelGuide.id,
                    status: 1, // Tự động duyệt
                });
                await sendNotificationToUser(
                    parseInt(travelGuide.user_id),
                    travelGuide.user.fcm_token,
                    {
                        title: "Bạn đã được phân công vào tour!",
                        type: NOTIFICATION_TYPE.GUIDE_TOUR_ASSIGNED,
                        id: travelGuide.id,
                        body: tour.name_tour + ". Ngày khởi hành: " + travelTour.start_day
                    }
                )
            }
        }

        const guideTours = await GuideTour.findAll({
            where: {
                travel_tour_id: travel_tour_id,
                status: 1,
            },
            include: [
                {
                    model: TravelGuide,
                    as: "travelGuide",
                    include: [
                        {
                            model: User,
                            as: "user",
                        },
                    ],
                },
            ],
        });
        // Lấy danh sách booking của tour
        const bookings = await Booking.findAll({
            where: {
                travel_tour_id: travel_tour_id,
                status: 2, // Chỉ lấy booking đã thanh toán
            },
        });

        if (!bookings || bookings.length === 0) {
            return res
                .status(500)
                .json({message: "Không tìm thấy booking cho tour này!"});
        }

        // Lấy danh sách hành khách cho từng booking
        const bookingsWithPassengers = await Promise.all(
            bookings.map(async (booking) => {
                const passengers = await Passenger.findAll({
                    where: {booking_id: booking.id},
                });

                // Tính số hành khách trên 2 tuổi
                const countablePassengers = passengers.filter(
                    (p) => calculateAge(p.birth_date) >= 2
                ).length;

                return {
                    ...booking.toJSON(),
                    passenger: passengers,
                    countablePassengers,
                    totalPassengers: passengers.length,
                };
            })
        );

        // Lọc các booking có hành khách
        const validBookings = bookingsWithPassengers.filter(
            (booking) => booking.passenger && booking.passenger.length > 0
        );

        if (validBookings.length === 0) {
            return res
                .status(200)
                .json({message: "Không tìm thấy hành khách hợp lệ cho tour này!"});
        }

        // Tính tổng số hành khách (chỉ tính người từ 2 tuổi trở lên)
        let totalCountablePassengers = validBookings.reduce(
            (sum, booking) => sum + booking.countablePassengers,
            0
        );
        let totalActualPassengers = validBookings.reduce(
            (sum, booking) => sum + booking.totalPassengers,
            0
        );

        // Khởi tạo các nhóm
        let groups = [{currentCount: 0, passengers: [], actualCount: 0}];
        let currentGroupIndex = 0;

        // Sắp xếp booking theo số lượng hành khách tính vào sức chứa (từ lớn đến nhỏ)
        validBookings.sort((a, b) => b.countablePassengers - a.countablePassengers);

        // Phân nhóm hành khách
        for (const booking of validBookings) {
            const countableSize = booking.countablePassengers;
            const allPassengers = booking.passenger;

            // Nếu số hành khách tính vào sức chứa trong booking lớn hơn sức chứa mỗi xe
            if (countableSize > number_passenger) {
                // Tạo các nhóm mới cho booking lớn
                let remainingPassengers = [...allPassengers];
                let currentCountable = remainingPassengers.filter(
                    (p) => calculateAge(p.birth_date) >= 2
                ).length;

                while (remainingPassengers.length > 0) {
                    if (groups[currentGroupIndex].currentCount >= number_passenger) {
                        groups.push({currentCount: 0, passengers: [], actualCount: 0});
                        currentGroupIndex++;
                    }

                    // Tính toán số hành khách có thể thêm vào nhóm hiện tại
                    const spaceLeft =
                        number_passenger - groups[currentGroupIndex].currentCount;
                    let passengersToAdd = [];
                    let countableInGroup = 0;

                    // Thêm hành khách vào nhóm cho đến khi đạt giới hạn số người tính vào sức chứa
                    for (let i = 0; i < remainingPassengers.length; i++) {
                        const passenger = remainingPassengers[i];
                        if (calculateAge(passenger.birth_date) >= 2) {
                            if (countableInGroup >= spaceLeft) break;
                            countableInGroup++;
                        }
                        passengersToAdd.push(passenger);
                    }

                    // Cập nhật remainingPassengers
                    remainingPassengers = remainingPassengers.slice(
                        passengersToAdd.length
                    );

                    // Thêm hành khách vào nhóm
                    groups[currentGroupIndex].passengers.push(...passengersToAdd);
                    groups[currentGroupIndex].currentCount += passengersToAdd.filter(
                        (p) => calculateAge(p.birth_date) >= 2
                    ).length;
                    groups[currentGroupIndex].actualCount += passengersToAdd.length;
                }
            } else {
                // Tìm nhóm phù hợp cho booking
                let foundGroup = false;
                for (let i = 0; i <= currentGroupIndex; i++) {
                    if (groups[i].currentCount + countableSize <= number_passenger) {
                        groups[i].passengers.push(...allPassengers);
                        groups[i].currentCount += countableSize;
                        groups[i].actualCount += allPassengers.length;
                        foundGroup = true;
                        break;
                    }
                }

                // Nếu không tìm được nhóm phù hợp, tạo nhóm mới
                if (!foundGroup) {
                    groups.push({
                        currentCount: countableSize,
                        passengers: [...allPassengers],
                        actualCount: allPassengers.length,
                    });
                    currentGroupIndex++;
                }
            }
        }

        // Kiểm tra số hướng dẫn viên có đủ không
        if (guideTours.length < groups.length) {
            return res.status(200).json({
                message: `Số hướng dẫn viên không đủ! Cần ${groups.length} hướng dẫn viên nhưng chỉ có ${guideTours.length} hướng dẫn viên.`,
            });
        }

        // Cập nhật group cho hướng dẫn viên
        for (let i = 0; i < guideTours.length; i++) {
            await guideTours[i].update({group: i < groups.length ? i + 1 : null});
        }

        // Cập nhật group cho hành khách
        for (let i = 0; i < groups.length; i++) {
            const groupNumber = i + 1;
            for (const passenger of groups[i].passengers) {
                await passenger.update({group: groupNumber});
            }
        }

        // Sau phần cập nhật group cho hành khách và trước phần format thông tin hướng dẫn viên

        // Nhóm passengers theo booking_id
        const passengersByBooking = {};
        for (let i = 0; i < groups.length; i++) {
            const groupNumber = i + 1;
            const guideTour = guideTours[i];
            
            for (const passenger of groups[i].passengers) {
                if (!passengersByBooking[passenger.booking_id]) {
                    passengersByBooking[passenger.booking_id] = [];
                }
                passengersByBooking[passenger.booking_id].push({
                    passenger,
                    groupNumber,
                    guideTour
                });
            }
        }

        // Gửi thông báo cho từng booking
        for (const [bookingId, passengers] of Object.entries(passengersByBooking)) {
            const booking = await Booking.findByPk(bookingId, {
                include: [
                    {
                        model: User,
                        as: "User"
                    }
                ]
            });
            
            if (booking && booking.User) {
                // Nhóm các passengers theo groupNumber
                const passengersByGroup = passengers.reduce((acc, curr) => {
                    const groupNumber = curr.groupNumber;
                    if (!acc[groupNumber]) {
                        acc[groupNumber] = {
                            guideInfo: curr.guideTour.travelGuide,
                            passengers: []
                        };
                    }
                    acc[groupNumber].passengers.push(curr.passenger);
                    return acc;
                }, {});

                // Tạo nội dung thông báo cho từng nhóm
                const groupMessages = Object.entries(passengersByGroup).map(([groupNumber, data]) => {
                    const guideInfo = data.guideInfo;
                    const passengerNames = data.passengers.map(p => p.name).join(", ");
                    return (
                        `Nhóm ${groupNumber}:\n` +
                        `- Hướng dẫn viên: ${guideInfo.first_name} ${guideInfo.last_name}` +
                        (guideInfo.number_phone ? ` (${guideInfo.number_phone}` : "") +
                        (guideInfo.email ? (guideInfo.number_phone ? `, ${guideInfo.email}` : ` (${guideInfo.email}`) : "")
                    );
                });

                // Gửi thông báo
                await sendNotificationToUser(
                    parseInt(booking.user_id),
                    booking.User.fcm_token,
                    {
                        title: "Thông báo phân nhóm tour",
                        type: NOTIFICATION_TYPE.PASSENGER_GROUP_ASSIGNED,
                        id: booking.id,
                        body: `Đơn đặt tour của bạn đã được phân nhóm như sau:\n${groupMessages.join("\n")}. Thông tin chi tiết đã được gửi qua email. Mọi thắc mắc vui lòng liên hệ hướng dẫn viên.`
                    }
                );
                // Tạo nội dung email cho từng nhóm
                const emailGroupMessages = Object.entries(passengersByGroup).map(([groupNumber, data]) => {
                    const guideInfo = data.guideInfo;
                    const passengerRows = data.passengers.map((p, index) => `
                        <tr>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${index + 1}</td>
                            <td style="border: 1px solid #ddd; padding: 8px;">${p.name}</td>
                            <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${p.birth_date ? formatDate(p.birth_date) : "N/A"}</td>
                        </tr>
                    `).join("");

                    return `
                        <h3>Nhóm ${groupNumber}</h3>
                        <p><strong>Hướng dẫn viên:</strong> ${guideInfo.first_name} ${guideInfo.last_name}</p>
                        <p><strong>Số điện thoại:</strong> ${guideInfo.number_phone || "Không có"}</p>
                        <p><strong>Email:</strong> ${guideInfo.email || "Không có"}</p>
                        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                            <thead>
                                <tr style="background-color: #d32f2f; color: #fff;">
                                    <th style="border: 1px solid #ddd; padding: 8px;">STT</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Tên hành khách</th>
                                    <th style="border: 1px solid #ddd; padding: 8px;">Ngày sinh</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${passengerRows}
                            </tbody>
                        </table>
                    `;
                }).join("");

                // Gửi email thông báo
                const mailOptions = {
                    from: '"Việt Du Ký" <vietduky.service@gmail.com>',
                    to: booking.User.email, // Email của người dùng
                    subject: "Thông báo phân công hướng dẫn viên cho tour của bạn",
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
                        <h1>Thông báo phân công hướng dẫn viên</h1>
                        <p>Xin chào <strong>${booking.User.displayName}</strong>,</p>
                        <p>Tour của bạn đã được phân công hướng dẫn viên. Dưới đây là thông tin chi tiết:</p>
                        ${emailGroupMessages}
                        <p>Chúc bạn có một chuyến đi vui vẻ!</p>
                        <div class="footer">
                            <p>© 2025 Việt Du Ký</p>
                        </div>
                        </div>
                    </body>
                    </html>
                    `,
                };

                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Lỗi khi gửi email: ", error);
                    } else {
                        console.log("Email đã được gửi: " + info.response);
                    }
                });
            }
        }

        // Format thông tin hướng dẫn viên
        const formattedGuides = guideTours.map((guideTour) => ({
            id: guideTour.travelGuide.id,
            group: guideTour.group,
            number_phone: guideTour.travelGuide.number_phone,
            gender_guide: guideTour.travelGuide.gender_guide,
            first_name: guideTour.travelGuide.first_name,
            last_name: guideTour.travelGuide.last_name,
            birth_date: guideTour.travelGuide.birth_date,
        }));
        const totalBookings = await Booking.findAll({
            where: {travel_tour_id: travel_tour_id, status: 2}
        })
        const bookingIds = totalBookings.map((booking) => booking.id);
        const passengersNotAssigned = await Passenger.findAll({
            where: {booking_id: bookingIds, group: null}
        });
        if (passengersNotAssigned.length <= 0) {
            const travelTour = await TravelTour.findByPk(travel_tour_id);
            travelTour.status = 1;
            await travelTour.save();
        }
        res.status(200).json({
            message: "Phân công xe tự động thành công!",
            data: {
                totalCountablePassengers,
                totalActualPassengers,
                numberOfGroups: groups.length,
                numberOfGuides: guideTours.length,
                numberOfBookings: validBookings.length,
                guides: formattedGuides,
                groups: groups.map((group, index) => ({
                    groupNumber: index + 1,
                    countablePassengers: group.currentCount,
                    actualPassengers: group.actualCount,
                    passengers: group.passengers.map((p) => ({
                        id: p.id,
                        name: p.name,
                        birth_date: p.birth_date,
                        age: calculateAge(p.birth_date),
                    })),
                })),
            },
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "Lỗi khi phân công xe tự động!",
            error: error.message,
        });
    }
};

// Gán TravelGuide cho TravelTour
exports.assignMoreTravelGuideToTravelTour = async (req, res) => {
    try {
        const {travel_tour_id, travel_guide_id, group_name, isLeader} = req.body;

        // Kiểm tra TravelTour có tồn tại không
        const travelTour = await db.TravelTour.findByPk(travel_tour_id, {
            include: [
                {
                    model: db.Tour,
                    as: "Tour",
                    attributes: ["name_tour", "start_location", "end_location"],
                },
            ],
        });
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy TravelTour!"});
        }

        // Kiểm tra TravelGuide có tồn tại không
        const travelGuide = await db.TravelGuide.findByPk(travel_guide_id);
        if (!travelGuide) {
            return res.status(404).json({message: "Không tìm thấy TravelGuide!"});
        }

        // Kiểm tra xem TravelGuide đã được gán cho TravelTour này chưa
        const existingAssignment = await db.GuideTour.findOne({
            where: {travel_tour_id, travel_guide_id},
        });
        if (existingAssignment) {
            return res.status(400).json({
                message: "TravelGuide đã được gán cho TravelTour này!",
            });
        }

        // Kiểm tra xem TravelGuide có bị trùng lịch với TravelTour khác không
        const overlappingAssignments = await db.GuideTour.findAll({
            where: {
                travel_guide_id,
            },
            include: [
                {
                    model: db.TravelTour,
                    as: "travelTour",
                    where: {
                        [Op.or]: [
                            {
                                start_day: {
                                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                                },
                            },
                            {
                                end_day: {
                                    [Op.between]: [travelTour.start_day, travelTour.end_day],
                                },
                            },
                            {
                                [Op.and]: [
                                    {start_day: {[Op.lte]: travelTour.start_day}},
                                    {end_day: {[Op.gte]: travelTour.end_day}},
                                ],
                            },
                        ],
                    },
                },
            ],
        });

        if (overlappingAssignments.length > 0) {
            return res.status(400).json({
                message:
                    "TravelGuide đã được gán cho một TravelTour khác trong khoảng thời gian này!",
                data: overlappingAssignments.map((assignment) => ({
                    travel_tour_id: assignment.travel_tour_id,
                    start_day: assignment.travelTour.start_day,
                    end_day: assignment.travelTour.end_day,
                })),
            });
        }

        // Kiểm tra nếu số lượng assigned_guides vượt quá required_guides
        const remainingSlots =
            travelTour.required_guides - travelTour.assigned_guides;
        if (remainingSlots <= 0) {
            return res.status(400).json({
                message: `Không thể gán thêm hướng dẫn viên! Số lượng yêu cầu là ${travelTour.required_guides}, đã gán ${travelTour.assigned_guides}.`,
            });
        }

        // Thêm TravelGuide vào nhóm
        const newAssignment = await db.GuideTour.create({
            travel_tour_id,
            travel_guide_id,
            group_name,
            isLeader: isLeader || false,
            status: 1,
        });

        // Nếu isLeader là true, cập nhật các hướng dẫn viên khác trong nhóm không còn là leader
        if (isLeader) {
            await db.GuideTour.update(
                {isLeader: false},
                {
                    where: {
                        travel_tour_id,
                        travel_guide_id: {[Op.ne]: travel_guide_id},
                    },
                }
            );
        }

        // Cập nhật số lượng assigned_guides
        travelTour.assigned_guides += 1;

        // Kiểm tra trạng thái guide_assignment_status
        if (travelTour.assigned_guides === travelTour.required_guides) {
            travelTour.guide_assignment_status = "gan_du";
        } else {
            travelTour.guide_assignment_status = "gan_thieu";
        }

        await travelTour.save();

        // Gửi email thông báo cho TravelGuide
        const mailOptions = {
            from: '"Việt Du Ký" <vietduky.service@gmail.com>',
            to: travelGuide.email, // Email của TravelGuide
            subject: "Thông báo phân công Tour du lịch",
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
              <h1>Thông báo phân công Tour du lịch</h1>
              <p>Xin chào <strong>${travelGuide.first_name} ${
                travelGuide.last_name
            }</strong>,</p>
              <p>Bạn đã được phân công vào tour <strong>${
                travelTour.Tour.name_tour
            }</strong>. Dưới đây là thông tin chi tiết:</p>
              <table class="info-table">
                <tr>
                  <th>Thông tin tour</th>
                  <th>Chi tiết</th>
                </tr>
                <tr>
                  <td>Tên tour</td>
                  <td>${travelTour.Tour.name_tour}</td>
                </tr>
                <tr>
                  <td>Ngày bắt đầu</td>
                  <td>${formatDate(travelTour.start_day)}</td>
                </tr>
                <tr>
                  <td>Ngày kết thúc</td>
                  <td>${formatDate(travelTour.end_day)}</td>
                </tr>
                <tr>
                  <td>Địa điểm bắt đầu</td>
                  <td>${travelTour.Tour.start_location}</td>
                </tr>
                <tr>
                  <td>Địa điểm kết thúc</td>
                  <td>${travelTour.Tour.end_location}</td>
                </tr>
              </table>
              <p>Vui lòng chuẩn bị và sẵn sàng cho chuyến đi. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
              <div class="footer">
                <p>© 2025 Việt Du Ký</p>
              </div>
            </div>
          </body>
        </html>
      `,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Lỗi khi gửi email: ", error);
            } else {
                console.log("Email đã được gửi: " + info.response);
            }
        });

        res.status(201).json({
            message: "Thêm TravelGuide vào nhóm thành công!",
            data: newAssignment,
        });
    } catch (error) {
        console.error("Lỗi khi thêm TravelGuide vào nhóm:", error);
        res.status(500).json({
            message: "Lỗi khi thêm TravelGuide vào nhóm!",
            error: error.message,
        });
    }
};

// Gán nhiều TravelGuide vào một TravelTour
exports.assignTravelGuidesToTravelTour = async (req, res) => {
    try {
        const {travel_tour_id, guides, group_name} = req.body;

        // Kiểm tra TravelTour có tồn tại không
        const travelTour = await db.TravelTour.findByPk(travel_tour_id, {
            include: [
                {
                    model: db.Tour,
                    as: "Tour",
                    attributes: ["name_tour", "start_location", "end_location"],
                },
            ],
        });
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy TravelTour!"});
        }

        // Kiểm tra danh sách guides
        if (!Array.isArray(guides) || guides.length === 0) {
            return res
                .status(400)
                .json({message: "Danh sách guides không hợp lệ!"});
        }

        // Kiểm tra từng guide
        const travelGuideIds = guides.map((guide) => guide.travel_guide_id);
        const travelGuides = await db.TravelGuide.findAll({
            where: {id: travelGuideIds},
            include: [
                {
                    model: db.User,
                    as: "user",
                },
            ],
        });

        if (travelGuides.length !== guides.length) {
            return res.status(400).json({
                message: "Một hoặc nhiều TravelGuide không tồn tại!",
            });
        }

        // Kiểm tra xem TravelGuide đã được gán vào TravelTour chưa
        const existingAssignments = await db.GuideTour.findAll({
            where: {
                travel_tour_id,
                travel_guide_id: travelGuideIds,
            },
        });

        if (existingAssignments.length > 0) {
            const alreadyAssignedIds = existingAssignments.map(
                (assignment) => assignment.travel_guide_id
            );
            const unassignedGuides = guides.filter(
                (guide) => !alreadyAssignedIds.includes(guide.travel_guide_id)
            );

            if (unassignedGuides.length === 0) {
                return res.status(400).json({
                    message: "Tất cả TravelGuide đã được gán vào TravelTour này!",
                });
            }

            // Cập nhật danh sách guides chỉ với những TravelGuide chưa được gán
            guides = unassignedGuides;
        }

        // Kiểm tra nếu số lượng assigned_guides vượt quá required_guides
        // const remainingSlots =
        //   travelTour.required_guides - travelTour.assigned_guides;
        // if (guides.length > remainingSlots) {
        //   return res.status(400).json({
        //     message: `Không thể gán thêm hướng dẫn viên! Số lượng yêu cầu là ${travelTour.required_guides}, đã gán ${travelTour.assigned_guides}, chỉ có thể gán thêm tối đa ${remainingSlots} hướng dẫn viên.`,
        //   });
        // }

        // Kiểm tra xem TravelGuide có bị trùng lịch với TravelTour khác không
        for (const guide of guides) {
            const overlappingAssignments = await db.GuideTour.findAll({
                where: {
                    travel_guide_id: guide.travel_guide_id,
                },
                include: [
                    {
                        model: db.TravelTour,
                        as: "travelTour",
                        where: {
                            [Op.or]: [
                                {
                                    start_day: {
                                        [Op.between]: [travelTour.start_day, travelTour.end_day],
                                    },
                                },
                                {
                                    end_day: {
                                        [Op.between]: [travelTour.start_day, travelTour.end_day],
                                    },
                                },
                                {
                                    [Op.and]: [
                                        {start_day: {[Op.lte]: travelTour.start_day}},
                                        {end_day: {[Op.gte]: travelTour.end_day}},
                                    ],
                                },
                            ],
                        },
                    },
                ],
            });

            if (overlappingAssignments.length > 0) {
                return res.status(400).json({
                    message: `TravelGuide với ID ${guide.travel_guide_id} đã được gán vào một TravelTour khác trong khoảng thời gian này!`,
                    data: overlappingAssignments.map((assignment) => ({
                        travel_tour_id: assignment.travel_tour_id,
                        start_day: assignment.travelTour.start_day,
                        end_day: assignment.travelTour.end_day,
                    })),
                });
            }
        }

        // Gán các TravelGuide vào TravelTour
        const assignments = guides.map((guide) => ({
            travel_tour_id,
            travel_guide_id: guide.travel_guide_id,
            group_name,
            isLeader: guide.isLeader || false,
            status: 1,
        }));

        await db.GuideTour.bulkCreate(assignments);

        // Cập nhật số lượng assigned_guides
        travelTour.assigned_guides += guides.length;

        if (travelTour.assigned_guides === travelTour.required_guides) {
            travelTour.guide_assignment_status = "gan_du";
        } else {
            travelTour.guide_assignment_status = "gan_thieu";
        }

        await travelTour.save();

        // Gửi email thông báo cho từng TravelGuide
        for (const guide of travelGuides) {
            const mailOptions = {
                from: '"Việt Du Ký" <vietduky.service@gmail.com>',
                to: guide.email, // Email của TravelGuide
                subject: "Thông báo phân công Tour du lịch",
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
                <h1>Thông báo phân công Tour du lịch</h1>
                <p>Xin chào <strong>${guide.first_name} ${
                    guide.last_name
                }</strong>,</p>
                <p>Bạn đã được phân công vào tour <strong>${
                    travelTour.Tour.name_tour
                }</strong>. Dưới đây là thông tin chi tiết:</p>
                <table class="info-table">
                  <tr>
                    <th>Thông tin tour</th>
                    <th>Chi tiết</th>
                  </tr>
                  <tr>
                    <td>Tên tour</td>
                    <td>${travelTour.Tour.name_tour}</td>
                  </tr>
                  <tr>
                    <td>Ngày bắt đầu</td>
                    <td>${formatDate(travelTour.start_day)}</td>
                  </tr>
                  <tr>
                    <td>Ngày kết thúc</td>
                    <td>${formatDate(travelTour.end_day)}</td>
                  </tr>
                  <tr>
                    <td>Địa điểm bắt đầu</td>
                    <td>${travelTour.Tour.start_location}</td>
                  </tr>
                  <tr>
                    <td>Địa điểm kết thúc</td>
                    <td>${travelTour.Tour.end_location}</td>
                  </tr>
                  <tr>
                    <td>Số lượng khách tối đa</td>
                    <td>${travelTour.max_people}</td>
                  </tr>
                  <tr>
                    <td>Giá tour</td>
                    <td>${travelTour.price_tour.toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                })}</td>
                  </tr>
                </table>
                <p>Vui lòng chuẩn bị và sẵn sàng cho chuyến đi. Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
                <div class="footer">
                  <p>© 2025 Việt Du Ký</p>
                </div>
              </div>
            </body>
          </html>
        `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Lỗi khi gửi email: ", error);
                } else {
                    console.log("Email đã được gửi: " + info.response);
                }
            });
        await sendNotificationToUser(
            parseInt(guide.user_id),
            guide.user.fcm_token,
            {
                title: "Bạn đã được phân công vào tour!",
                type: NOTIFICATION_TYPE.GUIDE_TOUR_ASSIGNED,
                id: guide.id,
                body: travelTour.Tour.name_tour + ". Ngày khởi hành: " + travelTour.start_day
            }
        )
        }

        res.status(200).json({
            message:
                travelTour.assigned_guides === travelTour.required_guides
                    ? "Phân chia nhóm TravelGuide thành công! Đã gán đủ số lượng yêu cầu."
                    : "Phân chia nhóm TravelGuide thành công! Nhưng chưa đủ số lượng yêu cầu.",
            data: assignments,
        });
    } catch (error) {
        console.error("Lỗi khi phân chia nhóm TravelGuide:", error);
        res.status(500).json({
            message: "Lỗi khi phân chia nhóm TravelGuide!",
            error: error.message,
        });
    }
};

// Xóa nhiều TravelGuide khỏi một TravelTour
exports.unassignTravelGuidesToTravelTour = async (req, res) => {
    try {
        const {travel_tour_id, travel_guide_ids} = req.body;

        // Kiểm tra TravelTour có tồn tại không
        const travelTour = await db.TravelTour.findByPk(travel_tour_id, {
            include: [
                {
                    model: db.Tour,
                    as: "Tour",
                    attributes: ["name_tour", "start_location", "end_location"],
                },
            ],
        });
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy TravelTour!"});
        }

        // Lấy danh sách GuideTour tương ứng
        const guideTours = await db.GuideTour.findAll({
            where: {
                travel_tour_id,
                travel_guide_id: travel_guide_ids,
            },
            include: [
                {
                    model: db.TravelGuide,
                    as: "travelGuide",
                    attributes: ["first_name", "last_name", "email"],
                },
            ],
        });

        if (guideTours.length === 0) {
            return res.status(404).json({
                message: "Không tìm thấy hướng dẫn viên nào trong lịch khởi hành!",
            });
        }

        // Xóa các GuideTour
        const deletedCount = await db.GuideTour.destroy({
            where: {
                travel_tour_id,
                travel_guide_id: travel_guide_ids,
            },
        });

        if (deletedCount === 0) {
            return res.status(400).json({
                message: "Không có hướng dẫn viên nào đủ điều kiện để xóa!",
            });
        }

        // Gửi email thông báo cho từng TravelGuide
        for (const guideTour of guideTours) {
            const {travelGuide} = guideTour;
            const mailOptions = {
                from: '"Việt Du Ký" <vietduky.service@gmail.com>',
                to: travelGuide.email, // Email của TravelGuide
                subject: "Thông báo hủy phân công Tour du lịch",
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
                <h1>Thông báo hủy phân công Tour du lịch</h1>
                <p>Xin chào <strong>${travelGuide.first_name} ${
                    travelGuide.last_name
                }</strong>,</p>
                <p>Bạn đã bị hủy phân công khỏi tour <strong>${
                    travelTour.Tour.name_tour
                }</strong>. Dưới đây là thông tin chi tiết:</p>
                <table class="info-table">
                  <tr>
                    <th>Thông tin tour</th>
                    <th>Chi tiết</th>
                  </tr>
                  <tr>
                    <td>Tên tour</td>
                    <td>${travelTour.Tour.name_tour}</td>
                  </tr>
                  <tr>
                    <td>Ngày bắt đầu</td>
                    <td>${formatDate(travelTour.start_day)}</td>
                  </tr>
                  <tr>
                    <td>Ngày kết thúc</td>
                    <td>${formatDate(travelTour.end_day)}</td>
                  </tr>
                  <tr>
                    <td>Địa điểm bắt đầu</td>
                    <td>${travelTour.Tour.start_location}</td>
                  </tr>
                  <tr>
                    <td>Địa điểm kết thúc</td>
                    <td>${travelTour.Tour.end_location}</td>
                  </tr>
                </table>
                <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi.</p>
                <div class="footer">
                  <p>© 2025 Việt Du Ký</p>
                </div>
              </div>
            </body>
          </html>
        `,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Lỗi khi gửi email: ", error);
                } else {
                    console.log("Email đã được gửi: " + info.response);
                }
            });
        }

        // Cập nhật số lượng assigned_guides
        travelTour.assigned_guides -= deletedCount;

        // Kiểm tra trạng thái guide_assignment_status
        if (travelTour.assigned_guides === 0) {
            travelTour.guide_assignment_status = "chua_gan";
        } else if (travelTour.assigned_guides < travelTour.required_guides) {
            travelTour.guide_assignment_status = "gan_thieu";
        } else {
            travelTour.guide_assignment_status = "gan_du";
        }

        await travelTour.save();

        res.status(200).json({
            message: "Xóa hướng dẫn viên khỏi lịch khởi hành thành công!",
            deletedCount,
        });
    } catch (error) {
        console.error("Lỗi khi xóa hướng dẫn viên khỏi lịch khởi hành:", error);
        res.status(500).json({
            message: "Lỗi khi xóa hướng dẫn viên khỏi lịch khởi hành!",
            error: error.message,
        });
    }
};

// Lấy danh sách TravelGuide có lịch trình trống cho một TravelTour
exports.getAvailableTravelGuidesForTour = async (req, res) => {
    try {
        const {travel_tour_id} = req.params;

        // Kiểm tra TravelTour có tồn tại không
        const travelTour = await TravelTour.findByPk(travel_tour_id);
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy TravelTour!"});
        }

        // Lấy danh sách tất cả TravelGuide
        const allTravelGuides = await TravelGuide.findAll();

        // Lọc các TravelGuide không có lịch trình trùng
        const availableTravelGuides = [];
        for (const guide of allTravelGuides) {
            const overlappingAssignments = await GuideTour.findAll({
                where: {
                    travel_guide_id: guide.id,
                },
                include: [
                    {
                        model: TravelTour,
                        as: "travelTour",
                        where: {
                            [Op.or]: [
                                {
                                    start_day: {
                                        [Op.between]: [travelTour.start_day, travelTour.end_day],
                                    },
                                },
                                {
                                    end_day: {
                                        [Op.between]: [travelTour.start_day, travelTour.end_day],
                                    },
                                },
                                {
                                    [Op.and]: [
                                        {start_day: {[Op.lte]: travelTour.start_day}},
                                        {end_day: {[Op.gte]: travelTour.end_day}},
                                    ],
                                },
                            ],
                        },
                    },
                ],
            });

            if (overlappingAssignments.length === 0) {
                availableTravelGuides.push(guide);
            }
        }

        res.status(200).json({
            message: "Lấy danh sách TravelGuide trống lịch thành công!",
            data: availableTravelGuides,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách TravelGuide trống lịch:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách TravelGuide trống lịch!",
            error: error.message,
        });
    }
};

// Cập nhật thông tin nhóm hướng dẫn viên trong một TravelTour
exports.updateTravelGuideGroup = async (req, res) => {
    try {
        const {travel_tour_id, group_name, guides} = req.body;

        // Kiểm tra TravelTour có tồn tại không
        const travelTour = await db.TravelTour.findByPk(travel_tour_id);
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy TravelTour!"});
        }

        // Kiểm tra danh sách guides
        if (!Array.isArray(guides) || guides.length === 0) {
            return res
                .status(400)
                .json({message: "Danh sách guides không hợp lệ!"});
        }

        // Cập nhật tên nhóm nếu có
        if (group_name) {
            await db.GuideTour.update({group_name}, {where: {travel_tour_id}});
        }

        let hasLeader = false;

        // Xử lý từng guide trong danh sách
        for (const guide of guides) {
            const {travel_guide_id, isLeader} = guide;

            // Kiểm tra GuideTour có tồn tại không
            const guideTour = await db.GuideTour.findOne({
                where: {travel_tour_id, travel_guide_id},
            });

            if (!guideTour) {
                return res.status(404).json({
                    message: `Không tìm thấy hướng dẫn viên với ID ${travel_guide_id} trong nhóm!`,
                });
            }

            // Cập nhật quyền leader
            if (isLeader !== undefined) {
                if (isLeader) {
                    // Xóa quyền leader hiện tại (nếu có)
                    await db.GuideTour.update(
                        {isLeader: false},
                        {where: {travel_tour_id, isLeader: true}}
                    );
                    hasLeader = true;
                }
                guideTour.isLeader = isLeader;
            }

            // Lưu thay đổi
            await guideTour.save();
        }

        // Kiểm tra nếu không có leader nào được chỉ định
        if (!hasLeader) {
            const currentLeader = await db.GuideTour.findOne({
                where: {travel_tour_id, isLeader: true},
            });

            if (!currentLeader) {
                return res.status(400).json({
                    message: "Nhóm phải có ít nhất một leader!",
                });
            }
        }

        res.status(200).json({
            message: "Cập nhật thông tin nhóm thành công!",
        });
    } catch (error) {
        console.error("Lỗi khi cập nhật thông tin nhóm:", error);
        res.status(500).json({
            message: "Lỗi khi cập nhật thông tin nhóm!",
            error: error.message,
        });
    }
};

exports.getAvailableTravelGuidesForTourByLocation = async (req, res) => {
    try {
        const {travel_tour_id} = req.params;
        const {staff_id} = req.query;

        // Kiểm tra TravelTour có tồn tại không
        const travelTour = await TravelTour.findByPk(travel_tour_id, {
            include: [
                {
                    model: Tour,
                    as: "Tour",
                    attributes: ["start_location", "end_location"],
                },
            ],
        });
        if (!travelTour) {
            return res.status(404).json({message: "Không tìm thấy TravelTour!"});
        }

        // Lấy location_id từ TravelTour (start_location hoặc end_location)
        const locationIds = [
            // travelTour.Tour.start_location,
            travelTour.Tour.end_location,
        ];

        // Lấy danh sách tất cả TravelGuide thuộc các location của TravelTour
        let allTravelGuides = await TravelGuide.findAll({
            where: {
                staff_id: staff_id,
            },
            include: [
                {
                    model: db.TravelGuideLocation,
                    as: "TravelGuideLocations",
                    where: {
                        location_id: {[Op.in]: locationIds},
                    },
                    include: [
                        {
                            model: db.Location,
                            as: "location",
                            attributes: ["id", "name_location"],
                        },
                    ],
                },
            ],
        });

        // Lọc các TravelGuide không có lịch trình trùng
        const availableTravelGuides = [];
        for (const guide of allTravelGuides) {
            const overlappingAssignments = await GuideTour.findAll({
                where: {
                    travel_guide_id: guide.id,
                },
                include: [
                    {
                        model: TravelTour,
                        as: "travelTour",
                        where: {
                            [Op.or]: [
                                {
                                    start_day: {
                                        [Op.between]: [travelTour.start_day, travelTour.end_day],
                                    },
                                },
                                {
                                    end_day: {
                                        [Op.between]: [travelTour.start_day, travelTour.end_day],
                                    },
                                },
                                {
                                    [Op.and]: [
                                        {start_day: {[Op.lte]: travelTour.start_day}},
                                        {end_day: {[Op.gte]: travelTour.end_day}},
                                    ],
                                },
                            ],
                        },
                    },
                ],
            });

            if (overlappingAssignments.length === 0) {
                availableTravelGuides.push(guide);
            }
        }

        res.status(200).json({
            message: "Lấy danh sách TravelGuide trống lịch thành công!",
            data: availableTravelGuides,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách TravelGuide trống lịch:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách TravelGuide trống lịch!",
            error: error.message,
        });
    }
};
exports.getGuideTourByTravelTourId = async (req, res) => {
    try {
        const {travel_tour_id} = req.params;
        const guideTour = await GuideTour.findAll({
            where: {travel_tour_id},
            include: [
                {
                    model: TravelGuide,
                    as: "travelGuide",
                },
                {
                    model: TravelTour,
                    as: "travelTour",
                    include: [
                        {
                            model: Tour,
                            as: "Tour",
                        },
                    ],
                },
            ],
        });

        const bookings = await Booking.findAll({
            where: {
                travel_tour_id: travel_tour_id,
            },
            include: [
                {
                    model: Passenger,
                    as: "passengers",
                },
            ],
        });

        // Lấy tất cả passengers từ bookings
        const allPassengers = bookings.reduce((acc, booking) => {
            if (booking.passengers && booking.passengers.length > 0) {
                acc.push(...booking.passengers);
            }
            return acc;
        }, []);

        // Nhóm passenger theo group
        const groupedPassengers = allPassengers.reduce((acc, passenger) => {
            const group = passenger.group || "ungrouped";
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(passenger);
            return acc;
        }, {});

        // Nhóm guideTour theo group
        const groupedGuideTours = guideTour.reduce((acc, guide) => {
            const group = guide.group || "ungrouped";
            if (!acc[group]) {
                acc[group] = [];
            }
            acc[group].push(guide);
            return acc;
        }, {});

        // Kết hợp dữ liệu theo group
        const result = Object.keys({
            ...groupedPassengers,
            ...groupedGuideTours,
        }).map((group) => ({
            group,
            passengers: groupedPassengers[group] || [],
            guides: groupedGuideTours[group] || [],
        }));

        res.status(200).json({
            message: "Lấy danh sách GuideTour và Passenger theo nhóm thành công!",
            data: result,
        });
    } catch (error) {
        console.error("Lỗi khi lấy danh sách GuideTour:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách GuideTour!",
            error: error.message,
        });
    }
};
exports.deleteGuideTour = async (req, res) => {
    try {
        const {travel_guide_id} = req.params;
        const {travel_tour_id} = req.query;
        const guideTour = await GuideTour.findOne({
            where: {travel_guide_id, travel_tour_id},
            include: [
                {
                    model: TravelGuide,
                    as: "travelGuide",
                },
                {
                    model: TravelTour,
                    as: "travelTour",
                },
            ],
        });
        if (!guideTour) {
            return res.status(404).json({message: "Không tìm thấy GuideTour!"});
        }
        if (guideTour.group) {
            const bookings = await Booking.findAll({
                where: {
                    travel_tour_id: guideTour.travel_tour_id,
                },
            });
            const passengers = await Passenger.findAll({
                where: {
                    booking_id: {
                        [Op.in]: bookings.map((booking) => booking.id),
                    },
                    group: guideTour.group,
                },
            });
            if (passengers.length > 0) {
                passengers.forEach(async (passenger) => {
                    passenger.travel_guide_id = null;
                    passenger.group = null;
                    await passenger.save();
                });
            }
        }
        await guideTour.destroy();
        const travelTour = await TravelTour.findOne({
            where: {id: travel_tour_id},
        });
        travelTour.status = 0;
        await travelTour.save();
        res
            .status(200)
            .json({message: "Xóa GuideTour thành công!", data: guideTour});
    } catch (error) {
        console.error("Lỗi khi xóa GuideTour:", error);
        res.status(500).json({
            message: "Lỗi khi xóa GuideTour!",
            error: error.message,
        });
    }
    ;

}
exports.getGuideTourStatistics = async (req, res) => {
    try {
        const {user_id} = req.params;
        const {month} = req.query;
        const travelGuide = await TravelGuide.findOne({
            where: {user_id},
        });
        if (!travelGuide) {
            return res.status(404).json({message: "Không tìm thấy TravelGuide!"});
        }
        const travel_guide_id = travelGuide.id;

        // Xử lý tháng hiện tại và tháng trước
        const currentMonth = month ? parseInt(month) : new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Tính toán tháng trước
        const previousMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const previousYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Lấy tất cả guide tour của tháng hiện tại
        const currentMonthGuideTours = await GuideTour.findAll({
            where: {travel_guide_id: travelGuide.id},
            include: [{
                model: db.TravelTour,
                as: 'travelTour',
                where: {
                    [db.Sequelize.Op.and]: [
                        db.Sequelize.where(
                            db.Sequelize.fn('MONTH', db.Sequelize.col('travelTour.start_day')),
                            currentMonth
                        ),
                        db.Sequelize.where(
                            db.Sequelize.fn('YEAR', db.Sequelize.col('travelTour.start_day')),
                            currentYear
                        )
                    ]
                },
                include: [{
                    model: db.Tour,
                    as: 'Tour'
                }]
            }]
        });

        // Lấy tất cả guide tour của tháng trước
        const previousMonthGuideTours = await GuideTour.findAll({
            where: {travel_guide_id},
            include: [{
                model: db.TravelTour,
                as: 'travelTour',
                where: {
                    [db.Sequelize.Op.and]: [
                        db.Sequelize.where(
                            db.Sequelize.fn('MONTH', db.Sequelize.col('travelTour.start_day')),
                            previousMonth
                        ),
                        db.Sequelize.where(
                            db.Sequelize.fn('YEAR', db.Sequelize.col('travelTour.start_day')),
                            previousYear
                        )
                    ]
                },
                include: [{
                    model: db.Tour,
                    as: 'Tour'
                }]
            }]
        });

        // Hàm tính toán thống kê cho một tháng
        const calculateStatistics = (guideTours) => {
            const stats = {
                ongoing: 0,
                completed: 0,
                pending: 0,
                cancelled: 0,
                totalCustomers: 0
            };

            guideTours.forEach(guideTour => {
                if (guideTour.status === 0) {
                    stats.pending++;
                }

                if (guideTour.travelTour) {
                    switch (guideTour.travelTour.status) {
                        case 0:
                        case 1:
                            stats.ongoing++;
                            break;
                        case 2:
                            stats.completed++;
                            stats.totalCustomers += guideTour.travelTour.current_people || 0;
                            break;
                        case 3:
                            stats.cancelled++;
                            break;
                    }
                }
            });

            return stats;
        };

        // Tính toán thống kê cho cả hai tháng
        const currentStats = calculateStatistics(currentMonthGuideTours);
        const previousStats = calculateStatistics(previousMonthGuideTours);

        // Tính toán sự chênh lệch
        const comparison = {
            ongoingCompare: currentStats.ongoing - previousStats.ongoing,
            completedCompare: currentStats.completed - previousStats.completed,
            pendingCompare: currentStats.pending - previousStats.pending,
            cancelledCompare: currentStats.cancelled - previousStats.cancelled,
            customersCompare: currentStats.totalCustomers - previousStats.totalCustomers
        };

        res.status(200).json({
            message: "Lấy thống kê GuideTour thành công",
            data: {
                currentSchedule: currentStats.ongoing,
                completedSchedule: currentStats.completed,
                pendingSchedule: currentStats.pending,
                cancelledSchedule: currentStats.cancelled,
                totalCustomers: currentStats.totalCustomers,
                // Thêm thông tin so sánh
                comparison: {
                    currentScheduleCompare: comparison.ongoingCompare,
                    completedScheduleCompare: comparison.completedCompare,
                    pendingScheduleCompare: comparison.pendingCompare,
                    cancelledScheduleCompare: comparison.cancelledCompare,
                    totalCustomersCompare: comparison.customersCompare
                },
                // Thêm thông tin tháng
                monthInfo: {
                    currentMonth: currentMonth,
                    currentYear: currentYear,
                    previousMonth: previousMonth,
                    previousYear: previousYear
                }
            }
        });

    } catch (error) {
        console.error("Lỗi khi lấy thống kê GuideTour:", error);
        res.status(500).json({
            message: "Lỗi khi lấy thống kê GuideTour!",
            error: error.message,
        });
    }
};
exports.getPendingGuideTour = async (req, res) => {
    try {
        const pendingGuideTours = await GuideTour.findAll({
            where: {status: 0},
            include: [{
                model: TravelTour,
                as: 'travelTour',
                include: [{
                    model: Tour,
                    as: 'Tour',
                }],
            },
                {
                    model: TravelGuide,
                    as: 'travelGuide',
                }
            ],
        });
        res.status(200).json({message: "Lấy danh sách GuideTour chờ thành công!", data: pendingGuideTours});
    } catch (error) {
        console.error("Lỗi khi lấy danh sách GuideTour chờ:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách GuideTour chờ!",
            error: error.message,
        });
    }
};





