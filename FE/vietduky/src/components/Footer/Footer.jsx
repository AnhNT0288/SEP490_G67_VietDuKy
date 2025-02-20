export default function Footer() {
  return (
    <footer className="bg-red-700 text-white py-8 ">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-3 gap-4">
        <div>
          <h3 className="text-lg font-semibold">Về Việt Du Ký</h3>
          <p className="text-sm mt-2">
            Việt Du Ký là nền tảng trực tuyến tiên phong trong việc sử dụng trí
            tuệ nhân tạo (AI) để tạo ra lịch trình du lịch cá nhân hóa.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Liên hệ</h3>
          <p className="text-sm">📍 Hòa Lạc, Hà Nội</p>
          <p className="text-sm">📞 +84 963 858 005</p>
          <p className="text-sm">✉ vietduky.tour@gmail.com</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Mạng xã hội</h3>
          <div className="flex space-x-4 mt-2">
            <span>📘</span>
            <span>🎵</span>
          </div>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Email"
              className="w-full p-2 rounded-lg text-gray-700"
            />
            <button className="w-full mt-2 p-2 border rounded-lg text-white">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
