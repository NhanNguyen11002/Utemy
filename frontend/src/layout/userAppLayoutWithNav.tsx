import { Navigate, Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";
import Header from "../components/Header/Header";
import Navbar from "../components/Navbar/Navbar";
import { useAppSelector } from "../hooks/hooks";
// import { useEffect, useState } from "react";
// import { eventActions } from "../redux/slices";

type HeaderProps = {
    isLogin: boolean;
};

const UserAppLayoutWithNav: React.FC<HeaderProps> = ({ isLogin }) => {
    // const dispatch = useAppDispatch();
    // const [showNavbar, setShowNavbar] = useState(false);
    // useEffect(() => {
    //     dispatch(eventActions.getActiveEvent()).then((response) => {
    //         if (response.payload.status_code === 200) {
    //             setShowNavbar(true);
    //         } else {
    //             setShowNavbar(false);
    //         }
    //     });
    // }, []);
    // useEffect(() => {
    //     // Thực hiện các tác vụ liên quan đến dữ liệu cần thiết
    //     dispatch(eventActions.getActiveEvent());
    // }, [dispatch]);
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    return isAdmin ? (
        <Navigate to={"/admin"} />
    ) : (
        <div className="flex flex-col min-h-screen">
            <Header isLogin={isLogin} />
            {<Navbar />}
            <div className=" h-[150px] w-full"></div>
            <Outlet />
            <Footer />
        </div>
    );
};
export default UserAppLayoutWithNav;
