import Icons from "../components/Icons/Icons";
import LoginForm from "../components/LoginForm/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      {/* Top Section on Mobile / Left Section on Desktop */}
      <div
        className="w-full lg:w-1/2 bg-cover bg-center relative flex items-center justify-center pt-10 px-6 lg:px-12"
        style={{
          backgroundImage: "url('/Image/loginImage.png')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 lg:bg-opacity-30"></div>

        <div className="relative z-10 text-white text-center py-8 lg:py-0">
          <img
            src="/Image/Logo.png"
            alt="Logo"
            className="w-20 lg:w-24 mb-4 mx-auto"
          />
          <h1 className="text-2xl lg:text-3xl font-bold uppercase leading-tight">
            RONG CHƠI BỐN PHƯƠNG, <br className="hidden sm:block" /> GIÁ VẪN
            "YÊU THƯƠNG"
          </h1>
        </div>
      </div>

      {/* Right Section - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center relative bg-cover bg-center px-4 sm:px-6 md:px-12">
        <img src={Icons.Plane} className="absolute right-0 top-10" />
        <div className="relative z-10 w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
