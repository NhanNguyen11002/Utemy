// import React, { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { couponActions } from '../../redux/slices';
// import LuckyWheel from './LuckyWheel'; // Import LuckyWheel component
// import { AppDispatch } from '@/redux/store';
// import toast from 'react-hot-toast';
// import { ToastContainer } from 'react-toastify';
// import { useAppSelector } from '../../hooks/hooks';
// // import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';

// interface WheelData {
//   option?: string;
//   coupon?: any; // Thêm trường coupon vào đây
//   // Các trường khác...
// }
// const HuntCoupon = () => {
//   const dispatch = useDispatch<AppDispatch>();
//   const [discounts, setDiscounts] = useState<WheelData[]>([]);
//   const [, setResult] = useState<WheelData | null>(null); // State để lưu kết quả của vòng quay
//   // const [hasSpun, setHasSpun] = useState<boolean>(false); // Thêm state để theo dõi xem người dùng đã quay vòng quay cho sự kiện này trước đó chưa

//   // const [couponIdInfo, setCouponIdInfo] = useState<{ id: number} | null>(null);// State để lưu thông tin id của coupon từ server

//   // const [coupons, setCoupons] = useState<any[]>([]);

//   useEffect(() => {
//     handleGetAllEventCouponByEventId();
//   }, []); // Chỉ gọi hàm này khi component được render lần đầu
//   // useEffect(() => {
//   //   // Kiểm tra nếu người dùng đã quay vòng quay cho sự kiện này trước đó
//   //   if (hasSpun) {
//   //     toast.error("Bạn đã quay vòng quay cho sự kiện này rồi!"); // Hiển thị thông báo phù hợp
//   //   }
//   // }, [hasSpun]);
//   const eventForSpin = useAppSelector((state) => state.eventSlice.eventForSpin);

//   const handleGetAllEventCouponByEventId = () => {
//     dispatch(couponActions.getAllEventCouponByEventId(eventForSpin.id))
//       .then((action) => {
//         const response = action.payload;
//         if (response.status_code === 200) {
//           const coupons = response.data || [];
//           const formattedDiscounts: WheelData[] = coupons.map((coupon: any, index: number) => ({
//             option: `${index + 1}`,
//             coupon: coupon // Gán thông tin về coupon vào đây
//           }));
//         //   const receivedCoupons = response.data || [];
//         // setCoupons(receivedCoupons);
//           // Pass discounts to LuckyWheel
//           setDiscounts(formattedDiscounts);
//           console.log('Discounts:', formattedDiscounts);
//         } else {
//           console.error('Error from getAllEventCoupon:', response.message);
//         }
//       })
//       .catch((error) => {
//         console.error('Error from getAllEventCoupon:', error);
//       });
//   };
//   const handleSpinResult = (result: WheelData | null) => {
//     setResult(result);
//     console.log('Spin result:', result);
//     // Tại đây bạn có thể thực hiện các thao tác khác sau khi có kết quả từ vòng quay
//     if (result !== null && result.coupon) {
//       const selectedCoupon = result.coupon;
//       console.log('Selected coupon:', selectedCoupon);
//       const couponMessage = `Chúc mừng bạn đã trúng phiếu giảm giá ${selectedCoupon.discount*100} %!`;
//       toast.success(couponMessage); // Hiển thị pop-up chúc mừng
//       // Thực hiện các thao tác cần thiết với selectedCoupon
//       // Trích xuất dữ liệu coupon_id và quantity từ selectedCoupon
//       const coupon_id = selectedCoupon.id;
//       const event_id = selectedCoupon.event_id;

//       // Thực hiện dispatch từ selectedCoupon thông qua hàm createOwnerCoupon
//       dispatch(couponActions.createCouponOwner({ coupon_id, event_id}))
//         .then((action) => {
//           // Xử lý kết quả từ dispatch nếu cần
//           if (action.payload?.status_code === 200) {
//             // toast.success(action.payload?.message);
//             // setHasSpun(true); // Đặt state hasSpun thành true khi người dùng quay vòng quay
//             handleGetAllEventCouponByEventId();
//         } else {
//             if (action.payload) toast.error(action.payload?.message);
//         }
//         })
//       .catch((error) => {
//         console.error('Error creating owner coupon:', error);
//       });
//     } else {
//       console.error('Invalid result or coupon data.');
//     }
//     // handleGetAllEventCoupon();

//   };

//   return (
//     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//       {/* <button onClick={handleGetAllEventCoupon}>Get All Event Coupon</button> */}
//       <ToastContainer /> {/* Container cho pop-up */}
//       {discounts.length > 0 && <LuckyWheel discounts={discounts} onSpinResult={handleSpinResult} />}
//       {/* {result && <p>Result: {result.option}</p>} */}
//       <div style={{ marginRight: '100px',marginLeft: '100px', fontSize: '2.2rem', fontFamily:'monospace' }}>
//       <h2>Danh sách phần thưởng:</h2>
//       <ul>
//         {discounts.map((discount, index) => (
//           <li key={index}>{`${index + 1}: Phiếu giảm giá ${discount.coupon.discount*100}%`}</li>
//         ))}
//       </ul>
//     </div>
//     </div>
//   );
// };

// export default HuntCoupon;



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

import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { couponActions } from '../../redux/slices';
import LuckyWheel from './LuckyWheel'; // Import LuckyWheel component
import { AppDispatch } from '@/redux/store';
import toast from 'react-hot-toast';
import { ToastContainer } from 'react-toastify';
import { useAppSelector } from '../../hooks/hooks';
import styles from './ribbon.module.css';
import {images} from "../../assets"
// import { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import {
  // ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../../components/ui/resizable";
import { useNavigate } from 'react-router-dom';
interface WheelData {
  option?: string;
  coupon?: any; // Thêm trường coupon vào đây
  optionSize?: number; // Optional

  // Các trường khác...
}
const HuntCoupon = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [discounts, setDiscounts] = useState<WheelData[]>([]);
  const [, setResult] = useState<WheelData | null>(null); // State để lưu kết quả của vòng quay
  // const [hasSpun, setHasSpun] = useState<boolean>(false); // Thêm state để theo dõi xem người dùng đã quay vòng quay cho sự kiện này trước đó chưa

  // const [couponIdInfo, setCouponIdInfo] = useState<{ id: number} | null>(null);// State để lưu thông tin id của coupon từ server

  // const [coupons, setCoupons] = useState<any[]>([]);
  const navigate = useNavigate();

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
          if (response.data.length > 0)
            {
              const coupons = response.data || [];
              const formattedDiscounts: WheelData[] = coupons.map((coupon: any, index: number) => ({
                option: `${index + 1}`,
                coupon: coupon // Gán thông tin về coupon vào đây
              }));
              // Thêm lựa chọn "Chúc bạn may mắn lần sau" vào cuối mảng
              formattedDiscounts.push({ option: `${formattedDiscounts.length + 1}`, coupon: "Chúc bạn may mắn lần sau", optionSize: 1 });
    
              // Cập nhật lại chỉ số của các lựa chọn nếu cần
              formattedDiscounts.forEach((discount, index) => {
                if (discount.option === "Chúc bạn may mắn lần sau") {
                  discount.option = `${formattedDiscounts.length}`;
                }
              });
            //   const receivedCoupons = response.data || [];
            // setCoupons(receivedCoupons);
              // Pass discounts to LuckyWheel
              setDiscounts(formattedDiscounts);
              console.log('Discounts:', formattedDiscounts);
            }
            else {
              navigate("/");
              setTimeout(() => {
                  toast.error("Sự kiện đã kết thúc");
              }, 1000); //
          }
          
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
      if (selectedCoupon !=="Chúc bạn may mắn lần sau")
        {
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
                // toast.success(action.payload?.message);
                // setHasSpun(true); // Đặt state hasSpun thành true khi người dùng quay vòng quay
                handleGetAllEventCouponByEventId();
            } else {
                if (action.payload) toast.error(action.payload?.message);
            }
            })
          .catch((error) => {
            console.error('Error creating owner coupon:', error);
          });
        }
        else
        {
          const event_id = eventForSpin.id;
          toast.error("Thật tiếc quá, chúc bạn may mắn lần sau");
          dispatch(couponActions.createHistoryForGoodLuckNextTime({event_id}))
            .then((action) => {
              // Xử lý kết quả từ dispatch nếu cần
              if (action.payload?.status_code === 200) {
                // toast.success(action.payload?.message);
                // setHasSpun(true); // Đặt state hasSpun thành true khi người dùng quay vòng quay
                handleGetAllEventCouponByEventId();
            } else {
                if (action.payload) toast.error(action.payload?.message);
            }
            })
        }

      
    } else {
      console.error('Invalid result or coupon data.');
    }
    // handleGetAllEventCoupon();

  };
  const lastIndex = discounts.length;

  return (
    <div className="w-screen h-screen flex items-center">
      <ResizablePanelGroup
        direction="vertical"
        className="rounded-lg border w-full h-full"
        style={{ backgroundColor: "#ffffff", backgroundSize: 'contain', backgroundPosition: 'center' }}
      >
        <ResizablePanel defaultSize={15} className="border-red-500">
          <div className={styles.wrapper}>
              {/* Your JSX content here */}
              <h1 className={styles.ribbon}>
                <i></i>
                <u>Welcome to {eventForSpin.name} event!</u>
                <i></i>
              </h1>
            </div>
        </ResizablePanel>
        {/* <ResizableHandle /> */}
        <ResizablePanel defaultSize={85} className="border-red-500">
          <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel defaultSize={30} className="border-red-500" style ={{backgroundImage: `url(${images.QuillLetterReflect})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
          <div className="flex h-full items-center justify-center ">
              <div style={{ marginRight: '300px',marginLeft: '100px', marginTop: '-100px', fontSize: '0.8rem', fontFamily:'monospace' }}>
                {eventForSpin.description}
              </div>              
              </div>
              </ResizablePanel>
            
            <ResizablePanel defaultSize={40} className="border-red-500" >
            <div className="flex h-full items-center justify-center">
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                {/* <button onClick={handleGetAllEventCoupon}>Get All Event Coupon</button> */}
                <ToastContainer /> {/* Container cho pop-up */}
                {discounts.length > 0 && <LuckyWheel discounts={discounts} onSpinResult={handleSpinResult} />}
                {/* {result && <p>Result: {result.option}</p>} */}
              </div>          
            </div>
          </ResizablePanel>
            {/* <ResizableHandle /> */}
            <ResizablePanel defaultSize={30} className="border-red-500" style ={{backgroundImage: `url(${images.QuillLetter})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}>
            <div className="flex h-full items-center justify-center ">
              <div style={{ marginRight: '100px',marginLeft: '300px', marginTop: '-100px', fontSize: '0.8rem', fontFamily:'monospace' }}>
                <h2>Danh sách phần thưởng:</h2>
                <ul>
                  {discounts.map((discount, index) => (
                    <li key={index}>
                      {isNaN(discount.coupon.discount) ?
                        `${lastIndex}: Chúc bạn may mắn lần sau`
                        :
                        `${index + 1}: Phiếu giảm giá ${parseInt((discount.coupon.discount * 100).toString(), 10)}%`
                      }
                    </li>
                  ))}
                </ul>
              </div>              
              </div>

            </ResizablePanel>
            
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );  
}

export default HuntCoupon;



