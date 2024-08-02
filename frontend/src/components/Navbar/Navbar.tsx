// import React, { useEffect } from "react";
// import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
// import { categoryActions } from "../../redux/slices";
// import { Category } from "../../types/category";
// import { NavLink } from "react-router-dom";

// const Navbar: React.FC = () => {
//     const dispatch = useAppDispatch();
//     const categoriesList: Category[] = useAppSelector((state) => state.categorySlice.top5categories) ?? [];

//     useEffect(() => {
//         dispatch(categoryActions.get5Categories());
//     }, [dispatch]);

//     return (
//         <>
//             <div className="hidden w-full fixed h-[60px] bg-navy top-[70px] laptop:flex z-[5]">
//                 <ul className="min-w-fit px-20 flex justify-center items-center mx-auto">
//                     {categoriesList.length > 0 &&
//                         categoriesList.map((category, index) => {
//                             return (
//                                 <NavLink
//                                     key={category.category_id}
//                                     to={`/all-courses?category=${category.category_id}`}
//                                 >
//                                     <li
//                                         key={category.category_id}
//                                         className="text-white hover:underline text-lg font-Roboto font-semibold text-center cursor-pointer px-6 py-auto min-w-fit"
//                                     >
//                                         {category.title}
//                                     </li>
//                                 </NavLink>
//                             );
//                         })}
//                 </ul>
//             </div>
//         </>
//     );
// };

// export default Navbar;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { eventActions } from "../../redux/slices";
import { useAppSelector } from "../../hooks/hooks";
// import toast from 'react-hot-toast';
import { XCircleIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
    // const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(true);
    // const [, setIsEventActive] = useState(true);
    const isLoggedIn = useAppSelector((state) => state.authSlice.isLogin); // Assuming there's an auth slice with isLoggedIn state
    const ev = useAppSelector((state) => state.eventSlice.eventForSpin);
    // useEffect(() => {
    //     dispatch(eventActions.getActiveEvent()).then((response) => {
    //         if (response.payload.status_code === 200) {
    //             setIsEventActive(true);
    //         } else {
    //             setIsEventActive(false);
    //         }
    //     });
    // }, []);

    const handleLegendClick = () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }
        if (ev) {
            navigate("/hunt-coupon");
        } else {
            // toast.error("Sự kiện đã kết thúc!");
            setIsVisible(false);
        }
    };
    const handleCloseClick = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <>
            {ev.id && (
                <div
                    style={{
                        position: "relative",
                        marginTop: "100px",
                        marginBottom: "-120px",
                        height: "60px",
                        width: "1300px",
                        marginLeft: "auto",
                        marginRight: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        cursor: "pointer",
                        border: "1px solid #ccc",
                        padding: "20px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        borderRadius: "8px",
                        backgroundColor: "#0033FF",
                        fontSize: "20px",
                        fontWeight: "bold",
                        textAlign: "center",
                        color: "white",
                    }}
                    onClick={handleLegendClick}
                >
                    Sự kiện đang diễn ra, hãy nhấn để tham gia ngay
                    <XCircleIcon
                        className="w-6 h-6 shrink-0 text-white"
                        style={{
                            position: "absolute",
                            top: "10px",
                            right: "10px",
                            cursor: "pointer",
                            color: "#333",
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCloseClick();
                        }}
                    />
                </div>
            )}
        </>
    );
};

export default Navbar;
