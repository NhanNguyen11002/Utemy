import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import FooterAdmin from "../components/Footer/FooterAdmin";
import { AdminNavbar } from "../components/Navbar/AdminNavbar";

const AdminLayout: React.FC = () => {
    return (
        <>
            <Sidebar />
            <div className="relative bg-background_2">
                <div className="px-4 ml-[60px]">
                    <AdminNavbar />
                    <Outlet />
                    <FooterAdmin />
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
