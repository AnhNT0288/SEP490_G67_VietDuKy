import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./page/login/page.jsx";
import LandingPage from "./page/LandingPage.jsx";
import PersonalAIPage from "./page/PersonalAIPage.jsx";
import RegisterPage from "./page/register/page.jsx";
import DealsPage from "./page/DealsPage.jsx";
<<<<<<< Updated upstream

function App() {
  return (
      <BrowserRouter>
        <Routes>
            <Route path={'/'} element={<LandingPage/>}/>
            <Route path={'/login'} element={<LoginPage/>}/>
            <Route path={'/register'} element={<RegisterPage/>}/>
            {/*<Route path={'/forgot-password'}/>*/}
            <Route path={'/personalAI'} element={<PersonalAIPage/>}/>
            <Route path={'/deals'} element={<DealsPage/>}/>
        </Routes>
      </BrowserRouter>
      );
=======
import ListTour from "./page/ListTourPage.jsx";
import DetailTourPage from "./page/DetailTourPage.jsx";
import ManagementTravelTourPage from "./page/ManagementTravelTourPage.jsx";
import AddNewTourPage from "./page/AddNewTourPage.jsx";
import ManagementLocationPage from "./page/ManagementLocationPage.jsx";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path={"/"} element={<LandingPage />} />
          <Route path={"/login"} element={<LoginPage />} />
          <Route path={"/register"} element={<RegisterPage />} />
          {/*<Route path={'/forgot-password'}/>*/}
          <Route path={"/personalAI"} element={<PersonalAIPage />} />
          <Route path={"/deals"} element={<DealsPage />} />
          <Route path={"/listTour"} element={<ListTour />} />
          <Route path={"/detailTour"} element={<DetailTourPage />} />
          <Route path={"/managementTravelTour"} element={<ManagementTravelTourPage/>}/>
          <Route path={"/addNewTour"} element={<AddNewTourPage/>}/>
          <Route path={"/managementLocation"} element={<ManagementLocationPage/>}/>
          <Route path={"/addNewLocation"} element={<AddNewTourPage/>}/>
        </Routes>
    </BrowserRouter>
  );
>>>>>>> Stashed changes
}
export default App;
