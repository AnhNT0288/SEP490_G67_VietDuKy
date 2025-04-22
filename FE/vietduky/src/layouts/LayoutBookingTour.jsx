import BookingStep from "../components/BookingTour/BookingStep";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";

export default function LayoutBookingTour({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Header />
      </div>
      <div className="sticky top-0 bg-white z-10 p-4 shadow">
        <BookingStep />
      </div>
      <div className="flex-grow max-w-16xl mx-20 bg-white p-6 rounded-lg">
        {children}
      </div>
      <div className="mt-4">
        <Footer />
      </div>
    </div>
  );
}