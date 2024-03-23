import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { useAppSelector } from "../hooks/hooks";

type HeaderProps = {
    isLogin: boolean;
};

const UserAppLayoutWithNav: React.FC<HeaderProps> = ({ isLogin }) => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    return isAdmin ? (
        <Navigate to={"/admin"} />
    ) : (
        <div className="flex flex-col min-h-scråeen">
            <Header isLogin={isLogin} />
            <Navbar />
            <div className=" h-[200px] w-full"></div>
            <Outlet />
            <Footer />
        </div>
    );
};
export default UserAppLayoutWithNav;
