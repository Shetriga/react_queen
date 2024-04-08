import logo from "./logo.svg";
import "./App.css";
import LoginForm from "./components/LoginForm";
import Home from "./components/Home";
import { AuthProvider } from "./Context/AuthContext";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import PrivateRoutes from "./utils/PrivateRoute";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct";
import CustomersList from "./components/CustomerComponents/CustomersList";
import ServicesList from "./components/ServicesComponents/ServicesList";
import ReservationsList from "./components/ReservationComponents/ReservationsList";
import NewReservation from "./components/ReservationComponents/NewReservation";
import SellingProduct from "./components/SellingProduct/SellingProduct";
import SellingService from "./components/ServicesComponents/SellingService";
import SellingProductList from "./components/SellingProduct/SellingProductList";
import SellingServicesList from "./components/ServicesComponents/SellingServicesList";
import IncomeList from "./components/IncomeComponents/IncomeList";
import PurchasesList from "./components/PurchasesComponents/PurchasesList";
import NewPurchase from "./components/PurchasesComponents/NewPurchase";
import Attendance from "./components/AttendanceComponents/Attendance";
import AssetsList from "./components/AssetsComponents/AssetsList";
import NewAsset from "./components/AssetsComponents/NewAsset";

function App() {
  return (
    <Router>
      <div className="App">
        <AuthProvider>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/add/product" element={<AddProduct />} />
              <Route path="/customers" element={<CustomersList />} />
              <Route path="/services" element={<ServicesList />} />
              <Route path="/reservations" element={<ReservationsList />} />
              <Route path="/reservations/add" element={<NewReservation />} />
              <Route path="/selling" element={<SellingProduct />} />
              <Route path="/selling/services" element={<SellingService />} />
              <Route
                path="/sellingproductlist"
                element={<SellingProductList />}
              />
              <Route
                path="/sellingserviceslist"
                element={<SellingServicesList />}
              />
              <Route path="/income" element={<IncomeList />} />
              <Route path="/purchases" element={<PurchasesList />} />
              <Route path="/new/purchase" element={<NewPurchase />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/assets" element={<AssetsList />} />
              <Route path="/new/asset" element={<NewAsset />} />
            </Route>
            <Route path="/" element={<LoginForm />} />
          </Routes>
        </AuthProvider>
      </div>
    </Router>
  );
}

export default App;
