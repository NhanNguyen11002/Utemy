import { Navigate, Outlet } from "react-router-dom";
import Cookies from "js-cookie";
import Footer from "../components/Footer/Footer";
// import Header from "../components/Header/Header";

const UserWatchVideoLayout: React.FC = () => {
    const accessToken = Cookies.get("accessToken");
    return accessToken ? (
        <div className="flex flex-col min-h-screen">
            <Outlet />
            <Footer />
        </div>
    ) : (
        <Navigate to={"/"} />
    );
};
export default UserWatchVideoLayout;
