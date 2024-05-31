import { Navigate, Outlet } from "react-router-dom";
import { HeaderBlog, Footer, BlogNavbar } from "../components";
import { useAppSelector } from "../hooks/hooks";

type HeaderProps = {
    isLogin: boolean;
};

const UserBlogLayout: React.FC<HeaderProps> = ({ isLogin }) => {
    const isAdmin = useAppSelector((state) => state.authSlice.user.is_admin);
    return isAdmin ? (
        <Navigate to={"/admin"} />
    ) : (
        <div className="flex flex-col min-h-screen">
            <HeaderBlog isLogin={isLogin} />
            <BlogNavbar />
            <div className=" w-full h-[170px]"></div>
            <Outlet />
            <Footer />
        </div>
    );
};
export default UserBlogLayout;
