import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import Footer from "../components/Footer/Footer";
// import Header from "../components/Header/Header";
import { useAppSelector } from "../hooks/hooks";

const UserWatchVideoLayout: React.FC = () => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    const accessToken = Cookies.get("accessToken");
    return accessToken ? (
        isAdmin ? (
            <Navigate to={"/admin"} />
        ) : (
            <div className="flex flex-col min-h-screen">
                <Outlet />
                <Footer />
            </div>
        )
    ) : (
        <Navigate to={"/"} />
    );
};
export default UserWatchVideoLayout;
