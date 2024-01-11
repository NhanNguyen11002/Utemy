import Cookies from "js-cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../hooks/hooks";
// import Sidebar from "../components/Sidebar/Sidebar";
// import FooterAdmin from "../components/Footer/FooterAdmin";
// import { AdminNavbar } from "../components/Navbar/AdminNavbar";

const AdminRoute: React.FC = () => {
    const accessToken = Cookies.get("accessToken");
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    const isLoading = useAppSelector((state) => state.authSlice.isLoading);
    return isAdmin && accessToken && !isLoading ? (
        <>
            {/* <Sidebar />
            <div className="relative bg-background_2">
                <div className="px-4  ml-80">
                    <AdminNavbar /> */}
            <Outlet />
            {/* <FooterAdmin />
                </div>
            </div> */}
        </>
    ) : (
        <Navigate to={"/"} />
    );
};

export default AdminRoute;
