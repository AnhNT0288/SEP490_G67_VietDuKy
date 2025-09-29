# Viet Du Ky Tour Booking System

![Viet Du Ky Logo] 

## 🌟 Tóm tắt Dự án (Project Overview)

**Viet Du Ky** là một **Hệ thống Đặt Tour Du lịch Trực tuyến** toàn diện, được phát triển như một dự án tốt nghiệp (**Capstone Project**) tại **Trường Đại học FPT (FPT University)**.

Hệ thống cung cấp một nền tảng dễ sử dụng, cho phép khách hàng:
* Tìm kiếm, so sánh các tour du lịch đa dạng.
* Xem thông tin chi tiết (lịch trình, dịch vụ, đánh giá).
* Thực hiện đặt chỗ và thanh toán trực tuyến (ví dụ: qua VNPAY, như trong báo cáo) một cách nhanh chóng và an toàn.

Mục tiêu cốt lõi là tối ưu hóa trải nghiệm người dùng trong việc lập kế hoạch chuyến đi và cung cấp công cụ quản lý mạnh mẽ cho Quản trị viên (Admin).

---

## 🛠️ Công nghệ Sử dụng (Tech Stack)

Dự án được xây dựng dựa trên kiến trúc hiện đại để đảm bảo hiệu suất và khả năng mở rộng.

| Thành phần | Công nghệ | Phiên bản (Gợi ý) | Mô tả |
| :--- | :--- | :--- | :--- |
| **Frontend** | React.js | [v18/v14] | Xây dựng giao diện người dùng tương tác, hỗ trợ Responsive Design. |
| **Backend** | Node.js | [v3.x/v7.x] | Xử lý logic nghiệp vụ và cung cấp API RESTful. |
| **Database** | MySQL | [v14+] | Lưu trữ dữ liệu về Tour, Người dùng, Booking, v.v. |
| **Styling** | Tailwind CSS | [v3.x/v5.x] | Thiết kế hiện đại và nhất quán. |

---

## ✨ Tính năng Chính (Key Features)

### 🧑‍🤝‍🧑 Khách hàng (User)
* **Tìm kiếm thông minh:** Lọc tour theo điểm đến, ngày khởi hành, khoảng giá.
* **Đặt tour:** Quy trình đặt chỗ đơn giản, bước 8-11 trong báo cáo.
* **Thanh toán:** Hỗ trợ thanh toán trực tuyến qua **QR Code VNPAY** hoặc Thanh toán sau.
* **Quản lý đơn hàng:** Theo dõi trạng thái đặt tour.

### ⚙️ Quản trị viên (Admin)
* Quản lý danh mục **Tour** (Thêm, Sửa, Xóa, Cập nhật).
* Quản lý **Khách hàng** và **Nhà cung cấp** (Partners).
* Quản lý và xác nhận các **Đơn đặt Tour (Booking)**.
* Hệ thống **Báo cáo và Thống kê** tổng quan về doanh thu, tour bán chạy.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy (Installation Guide)

### Yêu cầu Tiên quyết (Prerequisites)

* `[Ví dụ: Node.js (v18+)]`
* `[Ví dụ: JDK 17+ (cho Spring Boot)]`
* `[Ví dụ: Hệ quản trị CSDL PostgreSQL]`

### Các bước Thực hiện

1.  **Clone Repository:**
    ```bash
    git clone [https://github.com/YourUsername/VietDuKy-TourBookingSystem.git](https://github.com/YourUsername/VietDuKy-TourBookingSystem.git)
    cd VietDuKy-TourBookingSystem
    ```

2.  **Thiết lập Backend:**
    ```bash
    cd backend/
    # Cài đặt Dependencies
    [Lệnh cài đặt, ví dụ: mvn clean install]
    
    # Cấu hình file môi trường
    # Tạo file application.properties hoặc .env và điền thông tin CSDL
    # Ví dụ:
    # spring.datasource.url=jdbc:postgresql://localhost:5432/vietduky_db
    # spring.datasource.username=user
    # spring.datasource.password=password

    # Khởi chạy Backend
    [Lệnh khởi chạy, ví dụ: mvn spring-boot:run]
    ```

3.  **Thiết lập Frontend:**
    ```bash
    cd ../frontend/
    # Cài đặt Dependencies
    npm install # hoặc yarn install
    
    # Khởi chạy Frontend
    npm start # hoặc yarn dev
    ```

4.  **Truy cập Ứng dụng:**
    * Mở trình duyệt và truy cập: `http://localhost:3000` (hoặc cổng được cấu hình).

---

## 👥 Nhóm Thực hiện (Team Members)

Dự án này được thực hiện bởi **Nhóm G67** - Khóa SEP490, Trường Đại học FPT.

| Tên thành viên | Mã sinh viên | Vai trò |
| :--- | :--- | :--- |
| **Nguyễn Tiến Anh** | HE164035 | Leader |
| Phạm Đức Mạnh | HE160198 | Member |
| Nguyễn Tiến Đạt | HE160418 | Member |
| Đặng Mạnh Cường | HE150229 | Member |
| Dương Thế Toàn | HE163175 | Member |

* **Giảng viên Hướng dẫn:** Chu Thị Minh Huệ

---

## ⚖️ Giấy phép (License)

Dự án này được cấp phép dưới Giấy phép **MIT**. Xem tệp [LICENSE](LICENSE) để biết thêm chi tiết.
