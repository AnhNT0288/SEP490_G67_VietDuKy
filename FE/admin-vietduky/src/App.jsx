import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/LoginPage.jsx";
import RegisterPage from "./page/RegisterPage.jsx";
import ManagementTour from "./page/Management/ManagementTour.jsx";
import ManagementLocation from "./page/Management/ManagementLocation.jsx";
import ManagementTravelTour from "./page/Management/ManagementTravelTour.jsx";
import ManagementHotel from "./page/Management/ManagementHotel.jsx";
import ManagementRestaurant from "./page/Management/ManagementRestaurant.jsx";
import ManagementVehicle from "./page/Management/ManagementVehicle.jsx";
import ModalManageTravelTour from "./components/ModalManage/ModalList/ModalManageTravelTour.jsx";
import PrivateRoute from "./components/PrivateRouter.jsx";
import Profile from "./components/Profile.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import ManagementTheme from "./page/Management/ManagementTopic.jsx";
import ManagementDiscount from "./page/Management/ManagementDiscount.jsx";
import ManagementService from "./page/Management/ManagementService.jsx";
import ManagementSaleProgram from "./page/Management/ManagementSaleProgram.jsx";
import ManagementUserRole from "./page/Management/ManagementUser/ManagementUserRole.jsx";
import ManagementPost from "./page/Management/ManagementPost.jsx";
import ManagementStaff from "./page/Management/ManagementUser/ManagementStaff.jsx";
import ManagementDirectory from "./page/Management/ManagementDirectory.jsx";
import GoogleAuthCallback from "./components/GoogleAuthCallBack.jsx";
import SidebarStaff from "./components/Sidebar/SidebarStaff.jsx";
import RoleBasedRoute from "./components/RoleBasedRoute.jsx";
import PageAssignedGuides from "./components/Staff/PageAssignedGuides.jsx";

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<LoginPage />} />
          <Route path={"/register"} element={<RegisterPage />} />
          <Route path="/auth/callback" element={<GoogleAuthCallback />} />
          <Route path={"/account"} element={<PrivateRoute />}>
            <Route path="profile" element={<Profile />} />
          </Route>

          <Route path={"/calendar"} element={<Calendar />} />
          {/*<Route path={'/forgot-password'}/>*/}

          <Route element={<RoleBasedRoute allowedRoles={["admin", "staff"]} />}>
            <Route path="/managementLocation" element={<ManagementLocation />} />
            <Route path="/managementTour" element={<ManagementTour />} />
            <Route path="/managementDiscount" element={<ManagementDiscount />} />
            <Route path="/managementService" element={<ManagementService />} />
            <Route path="/managementStaff" element={<ManagementStaff />} />
            <Route path="/managementPost" element={<ManagementPost />} />
            <Route path="/managementCategory" element={<ManagementDirectory />} />
            <Route path="/managementTheme" element={<ManagementTheme />} />
            <Route path="/managementSaleProgram" element={<ManagementSaleProgram />} />
            <Route path="/staff/:id/assigned-guides" element={<PageAssignedGuides />} />
          </Route>

          {/* Admin-only routes */}
          <Route element={<RoleBasedRoute allowedRoles={["admin"]} />}>
            <Route path="/managementTravelTour" element={<ManagementTravelTour />} />
            <Route path="/managementHotel" element={<ManagementHotel />} />
            <Route path="/managementRestaurant" element={<ManagementRestaurant />} />
            <Route path="/managementVehicle" element={<ManagementVehicle />} />
            <Route path="/managementUserRole" element={<ManagementUserRole />} />
          </Route>

          <Route path={"/modalL"} element={<ModalManageTravelTour />} />

          <Route path={"/sidebar_staff"} element={<SidebarStaff/>} />
        </Routes>
      </BrowserRouter>
  );
}
export default App;
