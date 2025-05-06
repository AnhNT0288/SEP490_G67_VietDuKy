import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useSearchParams } from "react-router-dom";
import TermsVietDuKy from "./Terms";

export default function AboutPage() {
  const [searchParams] = useSearchParams();
  const tabFromURL = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(tabFromURL || "gioi-thieu");

  const tabs = [
    { id: "gioi-thieu", label: "Giới thiệu" },
    { id: "ho-tro", label: "Hỗ trợ" },
    { id: "dieu-khoan", label: "Điều khoản" },
  ];

  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");

    if (tabs.some((t) => t.id === tab)) {
      setActiveTab(tab);
    }
  }, [location.search]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <div className="flex max-w-7xl mx-auto py-8 px-4">
          {/* Sidebar */}
          <aside className="w-64 pr-6 border-r">
            <ul className="space-y-3">
              {tabs.map((tab) => (
                <li
                  key={tab.id}
                  className={`cursor-pointer text-sm font-medium hover:text-red-600 ${
                    activeTab === tab.id ? "text-red-600" : "text-gray-800"
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </li>
              ))}
            </ul>
          </aside>

          {/* Content */}
          <section className="flex-1 pl-6">
            {activeTab === "gioi-thieu" && (
              <div className="space-y-4 text-gray-800">
                <h1 className="text-3xl font-bold">
                  Giới thiệu về <span className="text-red-600">Việt Du Ký</span>
                </h1>
                <p>
                  Thành lập năm 20xx, <strong>Việt Du Ký</strong> là thành viên
                  của tập đoàn du lịch hàng đầu tại Việt Nam với hơn xx năm kinh
                  nghiệm trong lĩnh vực du lịch – khách sạn.
                  <strong>Việt Du Ký</strong> tiên phong trong việc sáng tạo các
                  sản phẩm du lịch tiện ích cho khách hàng trong nước.
                </p>
                <p>
                  Với mục tiêu mang đến cho khách hàng{" "}
                  <strong>“Trải nghiệm kỳ nghỉ tuyệt vời”</strong>, Việt Du Ký
                  kỳ vọng trở thành nền tảng du lịch nghỉ dưỡng hàng đầu tại
                  Việt Nam.
                </p>
                <p>
                  Sản phẩm chủ lực là <strong>Combo du lịch</strong> — kết hợp
                  phòng khách sạn, vé máy bay, ăn uống, đưa đón... giúp bạn tiết
                  kiệm thời gian và chi phí.
                </p>
                <p>
                  Việt Du Ký luôn áp dụng công nghệ để hiểu nhu cầu của thị
                  trường và mang đến dịch vụ phù hợp nhất với từng khách hàng.
                </p>
                <p className="font-semibold">Vui lòng liên hệ:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Dịch vụ khách hàng: Hotline <strong>1900 1870</strong> –
                    Email:{" "}
                    <a
                      href="mailto:cs@vietduky.com"
                      className="text-blue-600 hover:underline"
                    >
                      vietduky.service@gmail.com
                    </a>
                  </li>
                  {/* <li>
                    Nhà cung cấp:{" "}
                    <a
                      href="mailto:supplier@vietduky.com"
                      className="text-blue-600 hover:underline"
                    >
                      supplier@vietduky.com
                    </a>
                  </li>
                  <li>
                    Marketing:{" "}
                    <a
                      href="mailto:marketing@vietduky.com"
                      className="text-blue-600 hover:underline"
                    >
                      marketing@vietduky.com
                    </a>
                  </li> */}
                </ul>
              </div>
            )}

            {activeTab === "ho-tro" && (
              <div className="space-y-8 text-gray-800">
                <h2 className="text-3xl font-bold">Các câu hỏi thường gặp</h2>

                <div>
                  <h3 className="font-bold text-lg">Giá phòng</h3>
                  <p>
                    <strong>
                      Giá công bố là giá sau khi đã tính tất cả các phí phải
                      không?
                    </strong>
                    <br />
                    Đúng vậy. Giá trên website là giá trọn gói, không phát sinh
                    thêm chi phí ẩn.
                  </p>
                  <p>
                    <strong>
                      Chúng tôi có được giảm giá nếu đặt số lượng phòng nhiều
                      không?
                    </strong>
                    <br />
                    Có. Việt Du Ký có chương trình Ưu đãi nhóm và Thẻ thành
                    viên.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg">Đặt phòng</h3>
                  <p>
                    <strong>Đặt phòng tại Việt Du Ký có ưu đãi không?</strong>
                    <br />
                    Luôn có khuyến mãi và quà tặng cho khách hàng thân thiết.
                  </p>
                  <p>
                    <strong>
                      Tôi muốn đặt phòng cho gia đình 4 người, không biết ở đâu?
                    </strong>
                    <br />
                    Vui lòng gọi <strong>1900 1870</strong>, nhân viên sẽ hỗ trợ
                    bạn tìm phòng phù hợp.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg">Thay đổi thông tin</h3>
                  <p>
                    <strong>
                      Tôi có thể thay đổi tên khách, email, điện thoại không?
                    </strong>
                    <br />
                    Có thể. Vui lòng liên hệ bộ phận CSKH.
                  </p>
                  <p>
                    <strong>Việc hủy có mất phí không?</strong>
                    <br />
                    Phí hủy sẽ tuỳ thuộc vào từng khách sạn và chương trình
                    khuyến mãi.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-lg">Thanh toán</h3>
                  <p>
                    <strong>Tại sao tôi không thanh toán được?</strong>
                    <br />
                    Hãy thử lại bằng thẻ tín dụng hoặc chuyển khoản. Nếu cần hỗ
                    trợ, gọi <strong>1900 1870</strong>.
                  </p>
                  <p>
                    <strong>Tôi có thể trả góp không?</strong>
                    <br />
                    Hiện tại có hỗ trợ trả góp qua một số ngân hàng.
                  </p>
                </div>
              </div>
            )}
            {activeTab === "dieu-khoan" && (
              <div className="space-y-4 text-gray-800">
                <TermsVietDuKy />
              </div>
            )}
          </section>
        </div>
      </main>
      <div className="relative">
        <Footer />
      </div>
    </div>
  );
}
