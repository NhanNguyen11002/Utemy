import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import { useAppSelector } from "../hooks/hooks";

type HeaderProps = {
    isLogin: boolean;
};

const UserAppLayout: React.FC<HeaderProps> = ({ isLogin }) => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    return isAdmin ? (
        <Navigate to={"/admin"} />
    ) : (
        <div className="flex flex-col min-h-screen">
            <Header isLogin={isLogin} />
            <div className=" w-full h-[100px]"></div>
            <Outlet />
            <Footer />
        </div>
    );
};
export default UserAppLayout;
