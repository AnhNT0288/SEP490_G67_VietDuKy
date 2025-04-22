import Icons from "../Icons/Icon";
import BankTransfer from "../Payment/BankTransfer";
import CreditCardForm from "../Payment/CreditCardForm";
import { useState } from "react";
import { IoMdCheckmark } from "react-icons/io";

const paymentMethods = [
  {
    id: "bank-transfer",
    label: "Chuyển khoản",
    details: <BankTransfer />,
    icon: Icons.BankTransfer,
  },
  {
    id: "credit",
    label: "Thẻ tín dụng",
    details: <CreditCardForm />,
    icon: Icons.CreditCard,
  },
  {
    id: "qrpay",
    label: "Thanh toán QR",
    details: "Quét mã QR để thanh toán...",
    icon: Icons.QrCode,
  },
];

export default function PaymentMethod() {
  const [selectedMethod, setSelectedMethod] = useState(null);

  return (
    <div className="w-full flex flex-col gap-5">
      <h2 className="text-xl font-bold text-neutral-900">
        Các hình thức thanh toán
      </h2>

      {paymentMethods.map((method) => {
        const isSelected = selectedMethod === method.id;

        return (
          <div key={method.id} className="flex flex-col">
            <div
              className={`flex justify-between items-center p-4 rounded border cursor-pointer transition-all ${
                isSelected
                  ? "border-red-500 bg-gray-100 border-b-0 rounded-b-none"
                  : "border-gray-400 bg-gray-100"
              }`}
              onClick={() => setSelectedMethod(isSelected ? null : method.id)}
            >
              <span className="text-base font-bold text-neutral-900 flex gap-3 items-center">
                {method.label}
                <img src={method.icon}/>
              </span>
              <div
                className={`w-6 h-6 rounded-sm border flex items-center justify-center transition-all ${
                  isSelected
                    ? "bg-[#A80F21] border-[#A80F21]"
                    : "bg-white border-gray-600"
                }`}
              >
                {isSelected && <IoMdCheckmark className="text-white text-lg" />}
              </div>
            </div>

            {isSelected && (
              <div className="p-4 border-l border-b border-r border-red-500 bg-gray-100 rounded-b">
                <p className="text-gray-700">{method.details}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
