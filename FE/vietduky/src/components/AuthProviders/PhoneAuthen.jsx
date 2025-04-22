import React, { useEffect, useState } from "react";
import firebase from "@/services/firebase/firebase";

const PhoneAuthen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  useEffect(() => {
    // setup sau khi component render
    setTimeout(() => {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: (response) => {
              console.log("Recaptcha verified");
            },
            "expired-callback": () => {
              console.warn("Recaptcha expired");
            },
          }
        );

        window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        });
      }
    }, 500); // delay để DOM sẵn sàng
  }, []);

  const handleSendOtp = async () => {
    const appVerifier = window.recaptchaVerifier;

    if (!appVerifier) {
      alert("Recaptcha chưa sẵn sàng");
      return;
    }

    try {
      const confirmationResult = await firebase
        .auth()
        .signInWithPhoneNumber(phoneNumber, appVerifier);

      window.confirmationResult = confirmationResult;
      alert("OTP đã được gửi về điện thoại!");
    } catch (error) {
      console.error("Gửi OTP thất bại", error);
      alert(`Gửi OTP thất bại: ${error.message}`);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const result = await window.confirmationResult.confirm(otp);
      alert("Xác thực thành công!");
      console.log(result.user);
    } catch (error) {
      console.error("OTP không đúng", error);
      alert("Xác thực thất bại");
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="+84xxxxxxxxx"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        className="border p-2"
      />
      <button
        onClick={handleSendOtp}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Gửi OTP
      </button>

      <input
        type="text"
        placeholder="Nhập OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="border p-2"
      />
      <button
        onClick={handleVerifyOtp}
        className="bg-green-500 text-white p-2 rounded"
      >
        Xác nhận OTP
      </button>

      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneAuthen;
