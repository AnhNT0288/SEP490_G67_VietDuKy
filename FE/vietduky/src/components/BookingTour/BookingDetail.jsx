import React from "react";
import ContactInfo from "../BookingCheckout/ContactInfo";
import BookingInfo from "../BookingCheckout/BookingInfo";
import CustomerList from "../BookingCheckout/CustomerList";
import BookingConfirmation from "../BookingCheckout/BookingConfirmation";

const BookingDetails = () => {
  return (
    <div className=" w-full mx-auto p-6 flex gap-8">
      {/* Cột bên trái (Lớn hơn) */}
      <div className="w-3/4 flex flex-col gap-6">
        <div className="bg-white p-6 rounded-lg">
          <ContactInfo />
        </div>

        <div className="bg-white p-6 rounded-lg">
          <BookingInfo />
        </div>

        <div className="bg-white p-6 rounded-lg">
          <CustomerList />
        </div>
      </div>

      {/* Cột bên phải (Nhỏ hơn) */}
      <div className="w-1/4 min-w-[360px] bg-white p-4 rounded-lg shadow-lg">
        <BookingConfirmation />
      </div>
    </div>
  );
};

export default BookingDetails;
