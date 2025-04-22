import Icons from "../../components/Icons/Icon";
import LoginForm from "../../components/LoginForm/LoginForm";
export default function LoginPage() {
  return (
    <div className="flex h-screen w-full">
      {/* Left Section - Background Image & Text */}
      <div
        className="hidden lg:flex w-1/2 bg-cover bg-center relative flex-col items-center justify-start pt-10"
        style={{
          backgroundImage: "url('../../public/Image/loginImage.png')",
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-30 lg:bg-opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center justify-center text-white text-center p-10">
          <img
            src="/Image/Logo.png"
            alt="Logo"
            className="w-24 mb-4"
            style={{
              transform: "scale(1.5)",
              transition: "transform 0.3s ease-in-out",
            }}
          />
          <h1
            className="text-3xl font-bold uppercase leading-tight"
            style={{ marginTop: "10px" }}
          >
            RONG CHƠI BỐN PHƯƠNG, <br /> GIÁ VẪN &quot;YÊU THƯƠNG&quot;
          </h1>
        </div>
      </div>

      {/* Right Section - Background Image & Login Form */}
      <div
        className="w-full lg:w-1/2 flex items-center justify-center relative bg-cover bg-center"
      >
        <img src={Icons.Plane} className="absolute right-0 top-10" />
        <div className="relative z-10 w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
