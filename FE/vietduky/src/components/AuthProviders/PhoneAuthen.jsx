import React, { useEffect, useState } from "react";
import firebase from "@/services/firebase/firebase";

const PhoneAuthen = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);

  const setupRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        defaultCountry: "VN",
        callback: (response) => {
          console.log("Recaptcha verified", response);
        },
      }
    );
  };

  useEffect(() => {
    setupRecaptcha();
  }, []);

  const handleSendOtp = async () => {
    const appVerifier = window.recaptchaVerifier;
    await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
    .then((confirmationResult) => {
      window.confirmationResult = confirmationResult;
      alert("Đã gửi OTP thành công!");
    })
    .catch((error) => {
      console.error("Gửi OTP thất bại", error.message);
    });
  };

  const handleVerifyOtp = async () => {
    window.confirmationResult
      .confirm(otp)
      .then((result) => {
        const user = result.user;
        console.log("Xác thực thành công", user);
        alert("Xác thực thành công!");
      })
      .catch((error) => {
        console.error("Xác thực thất bại", error.message);
        alert("Xác thực thất bại");
      });
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
