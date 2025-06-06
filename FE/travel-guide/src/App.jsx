import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./page/LoginPage.jsx";
import RegisterPage from "./page/RegisterPage.jsx";
import PrivateRoute from "./components/PrivateRouter.jsx";
import GoogleAuthCallback from "./components/GoogleAuthCallBack.jsx";
import Dashboard from "./page/Management/Dashboard.jsx";
import TravelGuideTour from "./page/Management/TravelGuideTour.jsx";
import DepartureSchedulePage from "./page/Management/DepartureSchedulePage.jsx";
import TravelTourPendingPage from "./page/Management/TravelTourPendingPage.jsx";
import Profile from "./components/Profile/Profile.jsx";
import ForgotPasswordFlow from "./page/ForgotPasswordFlow.jsx";
import requestPermissionAndSaveToken from "./firebase/requestPermissionAndSaveToken";
import { useEffect } from "react";

Modal.setAppElement("#root");

function App() {
  useEffect(() => {
    requestPermissionAndSaveToken();
  }, []);

  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        <Route path={"/"} element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />

        <Route path={"/register"} element={<RegisterPage />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        <Route path={"/account"} element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path={"/dashboard"} element={<Dashboard />} />
        <Route path={"/travel-guide-tour"} element={<TravelGuideTour />} />
        <Route
          path={"/departure-schedule"}
          element={<DepartureSchedulePage />}
        />
        <Route
          path={"/travel-tour-pending"}
          element={<TravelTourPendingPage />}
        />

        {/*<Route path={'/forgot-password'}/>*/}
      </Routes>
    </BrowserRouter>
  );
}
export default App;
