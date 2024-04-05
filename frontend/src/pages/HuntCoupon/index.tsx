import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { couponActions } from '../../redux/slices';
import LuckyWheel from './LuckyWheel'; // Import LuckyWheel component
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
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
  // const [couponIdInfo, setCouponIdInfo] = useState<{ id: number} | null>(null);// State để lưu thông tin id của coupon từ server

  // const [coupons, setCoupons] = useState<any[]>([]);

  useEffect(() => {
    handleGetAllEventCoupon();
  }, []); // Chỉ gọi hàm này khi component được render lần đầu
 
  const handleGetAllEventCoupon = () => {
    dispatch(couponActions.getAllEventCoupon())
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

      // Thực hiện dispatch từ selectedCoupon thông qua hàm createOwnerCoupon
      dispatch(couponActions.createCouponOwner({ coupon_id}))
        .then((action) => {
          // Xử lý kết quả từ dispatch nếu cần
          if (action.payload?.status_code === 200) {
            toast.success(action.payload?.message);
            handleGetAllEventCoupon();
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



