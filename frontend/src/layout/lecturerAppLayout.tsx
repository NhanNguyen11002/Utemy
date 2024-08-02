import LecturerSidebar from "../components/Sidebar/LecturerSidebar";
import HeaderLecturer from "../components/Header/HeaderLecturer";
import { Outlet } from "react-router-dom";
import Footer from "../components/Footer/Footer";

type HeaderProps = {
    isLogin: boolean;
};

const LecturerAppLayout: React.FC<HeaderProps> = ({ isLogin }) => {
    return (
        <>
            <HeaderLecturer isLogin={isLogin} />
            <LecturerSidebar />
            <div className="relative bg-background">
                <div className="ml-[60px] mb-24 h-fit ">
                    <Outlet />
                </div>
            </div>
            <Footer />
        </>
    );
};

export default LecturerAppLayout;
