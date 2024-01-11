import Cookies from "js-cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";

const PrivateRoute: React.FC = () => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    const accessToken = Cookies.get("accessToken");
    return accessToken ? isAdmin ? <Navigate to={"/admin"} /> : <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoute;
