import "./App.css";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Calendar from "./components/Calendar/Calendar";
import AuthCallback from "./components/AuthCallback";
import PaymentForm from "./components/Payment/CreditCardForm.jsx";
import ProtectedRoute from "./components/PrivateRouter";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import LayoutLandingPage from "./layouts/LayoutLandingPage.jsx";
import PersonalAIPage from "./layouts/PersonalAIPage.jsx";
import BookingComplete from "./page/Booking/BookingComplete.jsx";
import BookingConfirm from "./page/Booking/BookingConfirm.jsx";
import BookingTour from "./page/Booking/BookingInformation.jsx";
import DealsPage from "./page/DealsPage.jsx";
import DetailTourPage from "./page/DetailTourPage.jsx";
import ListTour from "./page/ListTourPage.jsx";
import ProfileCustomer from "./page/Account/ProfileCustomer";
import TourBookingHistoryPage from "@/page/Account/TourBookingHistoryPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReviewPage from "./page/Account/ReviewPage";
import SettingPage from "./page/Account/SettingPage";
import FavouriteTourPage from "./page/Account/FavouriteTourPage";
import ArticlePage from "./page/ArticlePage/PostArticle/ArticlePage";
import DetailArticlePage from "./page/ArticlePage/PostArticle/DetailArticlePage";
import DetailTourBooking from "./page/DetailTourBooking";
import { useEffect, useState } from "react";
import { DirectoryService } from "./services/API/directory.service";
import DynamicArticlePage from "./page/ArticlePage/PostDynamicArticle/DynamicArticlePage";
import PostExperiencePage from "./page/ArticlePage/PostExperience/PostExperiencePage";
import DetailPostExperience from "./page/ArticlePage/PostExperience/DetailPostExperience";
import PhoneAuthen from "./components/AuthProviders/PhoneAuthen";
import "../src/styles/responsive.css";
import ModalPaymentSuccess from "./components/BookingCheckout/ModalBookingCheckout/ModalPaymentSuccess";
import ModalSuccessPage from "./components/BookingCheckout/ModalBookingCheckout/test";
import DetailDynamicArticle from "./page/ArticlePage/PostDynamicArticle/DetailDynamicArticle";

function App() {
  const [directory, setDirectory] = useState([]);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const response = await DirectoryService.getAllDirectory();
        setDirectory(response.data.data);
      } catch (error) {
        console.error("Error fetching directory:", error);
      }
    };

    fetchDirectory();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
      <Routes>
        <Route path={"/"} element={<LayoutLandingPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<ProfileCustomer />} />
          <Route path={"/booking/:id"} element={<BookingTour />} />
          <Route path={"/bookingConfirm"} element={<BookingConfirm />} />
          <Route path={"/bookingComplete"} element={<BookingComplete />} />
          <Route
            path={"/bookingHistory"}
            element={<TourBookingHistoryPage />}
          />
          <Route path={"/reviews"} element={<ReviewPage />} />
          <Route path={"/favorites"} element={<FavouriteTourPage />} />
          <Route path={"/settings"} element={<SettingPage />} />
          <Route
            path={"/detail-booking-tour/:id"}
            element={<DetailTourBooking />}
          />
        </Route>
        <Route path={"/personalAI"} element={<PersonalAIPage />} />
        <Route path={"/deals"} element={<DealsPage />} />
        <Route path={"/listTour"} element={<ListTour />} />
        <Route path={"/detailTour"} element={<DetailTourPage />} />
        <Route path="/tour/:id" element={<DetailTourPage />} />
        <Route path={"/article/home"} element={<ArticlePage />} />
        <Route
          path={"/article/post-experience"}
          element={<PostExperiencePage />}
        />
        <Route
          path={"/article/post-experience/:id"}
          element={<DetailPostExperience />}
        />
        <Route path={"/article/:alias"} element={<DynamicArticlePage />} />
        <Route path={"/article/:alias/:id"} element={<DetailDynamicArticle />} />

        <Route path={"/calendar"} element={<Calendar />} />
        <Route path="/modalSuccess" element={<ModalSuccessPage />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
