import { Navigate, Outlet, useLocation } from "react-router-dom";
import { HeaderBlog, Footer, BlogNavbar, ScrollToTopButton } from "../components";
import { useAppSelector } from "../hooks/hooks";
import { useEffect } from "react";

type HeaderProps = {
    isLogin: boolean;
};

const UserBlogLayout: React.FC<HeaderProps> = ({ isLogin }) => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "auto",
        });
    }, [pathname]);
    return isAdmin ? (
        <Navigate to={"/admin"} />
    ) : (
        <div className="flex flex-col min-h-screen ">
            <HeaderBlog isLogin={isLogin} />
            <BlogNavbar />
            <div className=" w-full h-[170px]"></div>
            <Outlet />
            <ScrollToTopButton />
            <Footer />
        </div>
    );
};
export default UserBlogLayout;
