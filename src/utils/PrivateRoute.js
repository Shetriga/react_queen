import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { useEffect } from "react";

const PrivateRoutes = ({ children, ...rest }) => {
  const { authUser, isLoggedIn } = useAuth();

  useEffect(() => {
    // console.log(authUser);
    // console.log("PRIVAYE ROUTES");
  }, [authUser]);

  return localStorage.getItem("token") ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoutes;
