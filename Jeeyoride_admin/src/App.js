import { Routes, Route } from "react-router-dom";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";

import Dashboard from "./components/Dashboard";
import Login from "./components/login";
import Driver from "./components/Driver_List";
import Pending_Trips from "./components/PendingTrip_List";
import Accept_Trips from "./components/AcceptTrip_List";
import Start_Trips from "./components/StartTrips_List";
import Completed_Trips from "./components/CompletedTrips_List";
import Cancal_Trips from "./components/CancalTrips_List";
import City_Wise_Driver_List from "./components/CityWise_DriverList";
import Driver_Citywiselist from "./components/CitySeperated_Driver_List";
import Send_Notification from "./components/sendNotification";
import User_List from "./components/users_list";
import Driver_Subscripation from "./components/Driver_Subscripation";
import Driver_Transaction from "./components/Driver_Transaction";
import Vehicle_List from "./components/Vehicle_List";
import Payment_Getway from "./components/Payment_Gatway";
import Fares from "./components/Fares_List";
import Site_Setting from "./components/Site_Setting";
import City_List from "./components/City_List";
import Add_city from "./components/Add_City";
import Add_Fare from "./components/Add_Fares";
// import Add_Paymentgatway from './components/Add_PaymentGatway'
import Edit_Subscripation from "./components/Edit_Subscripation";
import Add_Subscripation from "./components/Add_subscripation";
import Edit_Vehicle from "./components/Edit_Vehicle";
import Add_New_Fare from "./components/Add_New_Fare";
import List_Notification from "./components/List_Notification";
import Ads from "./components/Ads";
import Ads_List from "./components/Ads_List";
import Add_Franchise from "./components/add_franchise";
import List_Franchise from "./components/List_Franchise";

function App() {
  return (
    <>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Login />} />
        <Route path="/driver" element={<Driver />} />
        <Route path="/pending_trips" element={<Pending_Trips />} />
        <Route path="/accept_trips" element={<Accept_Trips />} />
        <Route path="/start_trips" element={<Start_Trips />} />
        <Route path="/completed_trips" element={<Completed_Trips />} />
        <Route path="/cancal_trips" element={<Cancal_Trips />} />
        <Route
          path="/city_wise_driver_list"
          element={<City_Wise_Driver_List />}
        />
        <Route path="/driver_citywiselist" element={<Driver_Citywiselist />} />
        <Route path="/sendNotification" element={<Send_Notification />} />
        <Route path="/user_list" element={<User_List />} />
        <Route
          path="/driver_subscripation"
          element={<Driver_Subscripation />}
        />
        <Route path="/driver_transaction" element={<Driver_Transaction />} />
        <Route path="/vehicle_list" element={<Vehicle_List />} />
        <Route path="/payment_getway" element={<Payment_Getway />} />
        <Route path="/fares_list" element={<Fares />} />
        <Route path="/site_setting" element={<Site_Setting />} />
        <Route path="/city_list" element={<City_List />} />
        <Route path="/add_city" element={<Add_city />} />
        <Route path="/add_fare" element={<Add_Fare />} />
        <Route path="/edit_subscripation" element={<Edit_Subscripation />} />
        <Route path="/add_subscripation" element={<Add_Subscripation />} />
        <Route path="/Vehicle" element={<Edit_Vehicle />} />
        <Route path="/add_new_fare" element={<Add_New_Fare />} />
        <Route path="/list_notification" element={<List_Notification />} />
        <Route path="/ads" element={<Ads />} />
        <Route path="/ads_list" element={<Ads_List />} />
        <Route path="/add_franchise" element={<Add_Franchise />} />
        <Route path="/list_franchise" element={<List_Franchise />} />

        {/* <Route path="/add_paymentgatway" element={<Add_Paymentgatway />} /> */}
      </Routes>
    </>
  );
}

export default App;
