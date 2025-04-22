const handleGoogleLogin = () => {
  window.open("http://localhost:3000/api/auth/google", "_self"); // Mở trang Google Login
};

export default function AuthProviders() {
  return (
    <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png"
        alt="Google Logo"
        className="w-5 h-5 mr-2"
      />
      Đăng nhập bằng Google
    </button>
  );
}
