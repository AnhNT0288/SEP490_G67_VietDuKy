import { useState } from "react";
import ForgotPassword from "../../components/ForgotPassword/ForgotPassword";
import VerifyOtp from "../../components/ResetPassword/VerifyOTP";
import ChangePassword from "../../components/ResetPassword/ChangePassword";
import SuccessReset from "../../components/ResetPassword/SuccessReset";


export default function ForgotPasswordFlow() {
  const [step, setStep] = useState("forgot");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  return (
    <>
      {step === "forgot" && (
        <ForgotPassword
          onNext={(emailValue) => {
            setEmail(emailValue);
            setStep("verify");
          }}
        />
      )}

      {step === "verify" && (
        <VerifyOtp
          email={email}
          onSuccess={(otpValue) => {
            setOtp(otpValue);
            setStep("reset");
          }}
        />
      )}

      {step === "reset" && (
        <ChangePassword
          email={email}
          resetCode={otp}
          onSuccess={() => setStep("success")}
        />
      )}

      {step === "success" && <SuccessReset />}
    </>
  );
}
