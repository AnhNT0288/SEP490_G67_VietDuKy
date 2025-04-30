import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Modal from "react-modal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManagementTour from "./page/Management/ManagementTour.jsx";
import ManagementLocation from "./page/Management/ManagementLocation.jsx";
import ManagementTravelTour from "./page/Management/ManagementTravelTour.jsx";
import ManagementHotel from "./page/Management/ManagementHotel.jsx";
import ManagementRestaurant from "./page/Management/ManagementRestaurant.jsx";
import ManagementVehicle from "./page/Management/ManagementVehicle.jsx";
import ModalManageTravelTour from "./components/ModalManage/ModalList/ModalManageTravelTour.jsx";
import PrivateRoute from "./components/PrivateRouter.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import ManagementTheme from "./page/Management/ManagementTopic.jsx";
import ManagementDiscount from "./page/Management/ManagementDiscount.jsx";
import ManagementService from "./page/Management/ManagementService.jsx";
import ManagementSaleProgram from "./page/Management/ManagementSaleProgram.jsx";
import ManagementUserRole from "./page/Management/ManagementUser/ManagementUserRole.jsx";
import ManagementArticle from "./page/Management/ManagementArticle.jsx";
import ManagementStaff from "./page/Management/ManagementUser/ManagementStaff.jsx";
import ManagementDirectory from "./page/Management/ManagementDirectory.jsx";
import GoogleAuthCallback from "./components/GoogleAuthCallBack.jsx";
import SidebarStaff from "./components/Sidebar/SidebarStaff.jsx";
import RoleBasedRoute from "./components/RoleBasedRoute.jsx";
import PageAssignedGuides from "./components/Staff/PageAssignedGuides.jsx";
import TourGuideManagement from "./components/Staff/Management/TourGuideManagement.jsx";
import IsBookingTravelToursManagement from "./components/Staff/Management/IsBookingTravelToursManagement.jsx";
import LoginPage from "./page/Authentication/LoginPage.jsx";
import ForgotPasswordFlow from "./page/Authentication/ForgotPasswordFlow.jsx";
import ManagementLastMinuteDeals from "./page/Management/ManagementLastMinuteDeals.jsx";
import Dashboard from "./page/Management/Dashboard.jsx";
import Profile from "./components/Profile/Profile.jsx";
// import RegisterPage from "./page/Authentication/RegisterPage.jsx";

Modal.setAppElement("#root");

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <Routes>
        <Route path={"/"} element={<LoginPage />} />
        {/* <Route path={"/register"} element={<RegisterPage />} /> */}
        <Route path="/forgot-password" element={<ForgotPasswordFlow />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        <Route path={"/account"} element={<PrivateRoute />}>
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path={"/calendar"} element={<Calendar />} />
        {/*<Route path={'/forgot-password'}/>*/}

        <Route element={<RoleBasedRoute allowedRoles={["admin", "staff"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/managementLocation" element={<ManagementLocation />} />
          <Route path="/managementTour" element={<ManagementTour />} />
          <Route path="/managementDiscount" element={<ManagementDiscount />} />
          <Route path="/managementService" element={<ManagementService />} />
          <Route path="/managementStaff" element={<ManagementStaff />} />
          <Route path="/managementPost" element={<ManagementArticle />} />
          <Route path="/managementCategory" element={<ManagementDirectory />} />
          <Route path="/managementTheme" element={<ManagementTheme />} />
          <Route path="/managementSaleProgram" element={<ManagementSaleProgram />}/>
          <Route path="/staff/:id/assigned-guides" element={<PageAssignedGuides />}/>
          <Route path="/managementStaffTourGuide" element={<TourGuideManagement />}/>
          <Route path="/managementTourForStaff" element={<IsBookingTravelToursManagement />}/>
          <Route path="/managementLastMinuteDeals" element={<ManagementLastMinuteDeals />}/>
          <Route path="/managementVehicle" element={<ManagementVehicle />}/>

        </Route>

        {/* Admin-only routes */}
        <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
          <Route
            path="/managementTravelTour"
            element={<ManagementTravelTour />}
          />
          <Route path="/managementHotel" element={<ManagementHotel />} />
          <Route
            path="/managementRestaurant"
            element={<ManagementRestaurant />}
          />
          <Route path="/managementVehicle" element={<ManagementVehicle />} />
          <Route path="/managementUserRole" element={<ManagementUserRole />} />
        </Route>

        <Route path={"/modalL"} element={<ModalManageTravelTour />} />

        <Route path={"/sidebar_staff"} element={<SidebarStaff />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
