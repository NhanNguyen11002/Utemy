import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { couponActions } from '../../redux/slices';
import LuckyWheel from './LuckyWheel'; // Import LuckyWheel component
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import { useAppSelector } from '../../hooks/hooks';
// import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';

interface WheelData {
  option?: string;
  coupon?: any; // Thêm trường coupon vào đây
  // Các trường khác...
}
const HuntCoupon = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [discounts, setDiscounts] = useState<WheelData[]>([]);
  const [, setResult] = useState<WheelData | null>(null); // State để lưu kết quả của vòng quay
  // const [hasSpun, setHasSpun] = useState<boolean>(false); // Thêm state để theo dõi xem người dùng đã quay vòng quay cho sự kiện này trước đó chưa

  // const [couponIdInfo, setCouponIdInfo] = useState<{ id: number} | null>(null);// State để lưu thông tin id của coupon từ server

  // const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    handleGetAllEventCouponByEventId();
  }, []); // Chỉ gọi hàm này khi component được render lần đầu
  // useEffect(() => {
  //   // Kiểm tra nếu người dùng đã quay vòng quay cho sự kiện này trước đó
  //   if (hasSpun) {
  //     toast.error("Bạn đã quay vòng quay cho sự kiện này rồi!"); // Hiển thị thông báo phù hợp
  //   }
  // }, [hasSpun]);
  const eventForSpin = useAppSelector((state) => state.eventSlice.eventForSpin);

  const handleGetAllEventCouponByEventId = () => {
    dispatch(couponActions.getAllEventCouponByEventId(eventForSpin.id))
      .then((action) => {
        const response = action.payload;
        if (response.status_code === 200) {
          const coupons = response.data || [];
          const formattedDiscounts: WheelData[] = coupons.map((coupon: any) => ({
            option: `${coupon.discount}`,
            coupon: coupon // Gán thông tin về coupon vào đây
          }));
        //   const receivedCoupons = response.data || [];
        // setCoupons(receivedCoupons);
          // Pass discounts to LuckyWheel
          setDiscounts(formattedDiscounts);
          console.log('Discounts:', formattedDiscounts);
        } else {
          console.error('Error from getAllEventCoupon:', response.message);
        }
      })
      .catch((error) => {
        console.error('Error from getAllEventCoupon:', error);
      });
  };
  const handleSpinResult = (result: WheelData | null) => {
    setResult(result);
    console.log('Spin result:', result);
    // Tại đây bạn có thể thực hiện các thao tác khác sau khi có kết quả từ vòng quay
    if (result !== null && result.coupon) {
      const selectedCoupon = result.coupon;
      console.log('Selected coupon:', selectedCoupon);
      const couponMessage = `Chúc mừng bạn đã trúng phiếu giảm giá ${selectedCoupon.discount*100} %!`;
      toast.success(couponMessage); // Hiển thị pop-up chúc mừng
      // Thực hiện các thao tác cần thiết với selectedCoupon
      // Trích xuất dữ liệu coupon_id và quantity từ selectedCoupon
      const coupon_id = selectedCoupon.id;
      const event_id = selectedCoupon.event_id;

      // Thực hiện dispatch từ selectedCoupon thông qua hàm createOwnerCoupon
      dispatch(couponActions.createCouponOwner({ coupon_id, event_id}))
        .then((action) => {
          // Xử lý kết quả từ dispatch nếu cần
          if (action.payload?.status_code === 200) {
            toast.success(action.payload?.message);
            // setHasSpun(true); // Đặt state hasSpun thành true khi người dùng quay vòng quay
            handleGetAllEventCouponByEventId();
        } else {
            if (action.payload) toast.error(action.payload?.message);
        }
        })
      .catch((error) => {
        console.error('Error creating owner coupon:', error);
      });
    } else {
      console.error('Invalid result or coupon data.');
    }
    // handleGetAllEventCoupon();

  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      {/* <button onClick={handleGetAllEventCoupon}>Get All Event Coupon</button> */}
      <ToastContainer /> {/* Container cho pop-up */}
      {discounts.length > 0 && <LuckyWheel discounts={discounts} onSpinResult={handleSpinResult} />}
      {/* {result && <p>Result: {result.option}</p>} */}
    </div>
  );
};

export default HuntCoupon;



// import React, { useState } from 'react';
// import Modal from "react-modal";

// const App = () => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);

//   return (
//     <div>
//       <button onClick={() => setModalIsOpen(true)}>Mở Pop-up</button>
//       <Modal
//         isOpen={modalIsOpen}
//         onRequestClose={() => setModalIsOpen(false)}
//         contentLabel="Example Modal"
//       >
//         <h2>Pop-up Content</h2>
//         <button onClick={() => setModalIsOpen(false)}>Đóng Pop-up</button>
//       </Modal>
//     </div>
//   );
// }

// export default App;










// import React from 'react';
// import { Carousel } from 'react-responsive-carousel';
// import 'react-responsive-carousel/lib/styles/carousel.min.css';

// const EventBannerCarousel = () => {
//   return (
//     <Carousel
//       showArrows={true}
//       infiniteLoop={true}
//       showThumbs={false}
//       showStatus={false}
//       autoPlay={true}
//       interval={5000} // thời gian chuyển đổi slide, tính bằng mili giây
//     >
//       <div>
//         <img src="https://d1j8r0kxyu9tj8.cloudfront.net/files/1652692063uRaoWyVuvwhjPgX.png" alt="Banner 1" />
//         <p className="legend">Legend 1</p>
//       </div>
//       <div>
//         <img src="https://lh4.googleusercontent.com/5VIrOH0TJ2KPXyMFqgU1zkn7DlwjfxsIHxyo_RCdNMNsIMCx942rz4xmyvIlOwV7ubjelNHAV7mxVGAgJ1MjCzu4edvmZqYFDFqtuoVQSrRWMWdwFywwfNyiKWHtQRTeWUh5lynEGhJLtrKocg" alt="Banner 2" />
//         <p className="legend">Legend 2</p>
//       </div>
//       <div>
//         <img src="https://lh4.googleusercontent.com/jVWKMyEq_QMyAep6A2bp8Fdss0pJXxTAB4gWVu9pFjbsN1hbdfjODuUesdFMzZaa18wmMb3BI0fVnLNQA30TX5wpkoR7HQHa8t5TN75BOLhsG79EdqXIUmL3xqbIR3XvpyFwD5-K2jbIQrKWAA" alt="Banner 3" />
//         <p className="legend">Legend 3</p>
//       </div>
//     </Carousel>
//   );
// };

// export default EventBannerCarousel;
