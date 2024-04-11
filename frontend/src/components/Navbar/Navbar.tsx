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

import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { images } from "../../assets/";
import { useNavigate } from 'react-router-dom';
import { eventActions } from '../../redux/slices';
import { useAppDispatch} from "../../hooks/hooks";
import toast from 'react-hot-toast';

const EventBannerCarousel = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleLegendClick = (legendText: any) => {
        // Dispatch action here
        dispatch(eventActions.getActiveEvent()).then((response) => {
            if (response.payload.status_code === 200) {
                navigate("/hunt-coupon");
                // Navigate to another page
            }
            else toast.error("Sự kiện đã kết thúc!")
        });
    };
  return (
<div style={{ marginTop: '50px',marginBottom: '10px', height:'40px', width: '1300px', marginLeft: 'auto', marginRight: 'auto' }}>
        <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            autoPlay={true}
            interval={5000} // thời gian chuyển đổi slide, tính bằng mili giây
            centerMode={true} // Hiển thị trung tâm các slide
        >
            <div onClick={() => handleLegendClick('Sự kiện giới hạn')}>
            <img src={images.Event1} alt="Banner 1" style={{ width: '1000px', height: '100%', objectFit: 'cover' }} />
            <p className="legend">Sự kiện giới hạn</p>
            </div>
            <div onClick={() => handleLegendClick('Voucher hấp dẫn')}>
            <img src={images.Event2} alt="Banner 2" style={{ width: '1000px', height: '100%', objectFit: 'cover' }} />
            <p className="legend">Voucher hấp dẫn</p>
            </div>
            <div onClick={() => handleLegendClick('Săn ngay')}>
            <img src={images.Event3} alt="Banner 3" style={{ width: '1000px', height: '100%', objectFit: 'cover' }} />
            <p className="legend">Săn ngay</p>
            </div>
        </Carousel>
    </div>

  );
};

export default EventBannerCarousel;
