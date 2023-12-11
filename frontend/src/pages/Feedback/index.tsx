import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { feedbackActions } from "../../redux/slices";
import { images } from "../../assets";
import RatingInPopup from "../CourseDetail/RatingInPopup";
import toast from "react-hot-toast";
import { PhoneIcon, GlobeAsiaAustraliaIcon, BuildingOfficeIcon, EnvelopeIcon } from "@heroicons/react/24/outline";

const Feedback: React.FC = () => {
    const [feedbackContent, setFeedbackContent] = useState<string>("");
    const [ratingValue, setRatingValue] = useState(5); // Default rating value

    const dispatch = useAppDispatch();
    const isLogin = useAppSelector((state) => state.authSlice.isLogin);

    const handleCheck = (event: React.ChangeEvent<HTMLInputElement>) => {
        const rating = parseInt(event.target.id);
        setRatingValue(rating);
    };

    const handleFeedbackSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            event.preventDefault(); // Prevent automatic redirection

            if (!isLogin) {
                console.log("User is not logged in. Feedback not submitted.");
                return;
            }

            // Kiểm tra nếu content hoặc score là undefined
            if (feedbackContent === "" || ratingValue === undefined) {
                toast.error("Feedback content cannot be null!");
                return;
            }

            // Gọi hàm Redux để gửi feedback
            dispatch(feedbackActions.createMyFeedback({ content: feedbackContent, score: ratingValue }));

            // Sau khi gửi feedback, bạn có thể chuyển người dùng đến trang chính hoặc hiển thị một thông báo thành công.
            console.log("Feedback submitted successfully");
            setFeedbackContent("");
            setRatingValue(5);
            toast.success("Submit successfully!");
        } catch (error) {
            // Xử lý lỗi nếu có
            console.error("Error submitting feedback:", error);
            toast.error("An error occurred while submitting feedback. Please try again later.");
        }
    };

    return (
        <div className=" h-full flex items-center flex-col mt-[100px] mb-10 placeholder:space-y-[10px] ">
            <center className="grid grid-cols-2">
                {/* Column 2: Form */}
                <form className="bg-footer p-8 rounded-md border border-gray-500 mx-auto" style={{ marginTop: "50px" }}>
                    <div className="col-span-1">
                        {/* Section 1: Logo and Your Feedback */}
                        <div className="flex justify-between items-center flex-row border-b-2 border-gray-500 pb-4">
                            <div>
                                <img
                                    src={images.FeedbackLogo}
                                    alt="Feedback"
                                    style={{ width: "80px", height: "80px" }}
                                />
                            </div>
                            <div>
                                <span className="text-gray-500 text-4xl block">Phản hồi</span>
                            </div>
                        </div>

                        {/* Section 2: Thank You and Rating */}
                        <div className="mt-6 border-b-2 border-gray-500 pb-4 gap-4">
                            <div>
                                <span className="text-gray-500 text-xl ">
                                    Chúng tôi trân trọng mọi phản hồi của bạn
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-500 text-xl ">
                                    Vui lòng cho biết mức độ hài lòng của bạn
                                </span>
                            </div>
                            <div style={{ fontSize: "40px" /* other styles */ }}>
                                <RatingInPopup score={ratingValue} handleCheck={handleCheck} />
                            </div>{" "}
                        </div>

                        {/* Section 3: Feedback Categories (Buttons) */}

                        {/* Section 4: Text Area and Submit Button */}
                        <div className="mt-4">
                            <textarea
                                rows={10}
                                cols={60}
                                value={feedbackContent}
                                onChange={(e) => setFeedbackContent(e.target.value)}
                                placeholder="Nhập nội dung phản hồi tại đây..."
                                className="border p-2 rounded-md"
                            />
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleFeedbackSubmit}
                                className="btn btn-info text-white p-3 rounded-md hover:bg-blue-700"
                            >
                                Gửi
                            </button>
                        </div>
                    </div>
                </form>

                {/* Column 3: Contact Information */}
                <form
                    className="bg-gray-200 p-8 rounded-md border border-gray-500 mx-auto"
                    style={{ marginTop: "50px" }}
                >
                    <div>
                        <div className="flex justify-between items-center flex-row border-b-2 border-gray-500 pb-4">
                            <div>
                                <img src={images.ContactLogo} alt="Contact" style={{ width: "80px", height: "80px" }} />
                            </div>
                            <div>
                                <h2 className="text-gray-400 text-4xl block">Thông tin liên lạc</h2>
                            </div>
                        </div>
                        <div
                            className="col-span-1 contact-info text-left text-base"
                            style={{
                                marginTop: "100px",
                                marginBottom: "50px",
                                marginLeft: "30px",
                                marginRight: "30px",
                                fontSize: "20px",
                            }}
                        >
                            <ul className="space-y-4" style={{ marginLeft: "50px" }}>
                                <li className="flex items-center gap-2">
                                    <GlobeAsiaAustraliaIcon className="w-4 h-4" />
                                    Website:{" "}
                                    <a
                                        href="https://utemy.vercel.app/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        utemy.com
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <EnvelopeIcon className="w-4 h-4" />
                                    Email: <a href="mailto:utemyvietnam@gmail.com">utemyvietnam@gmail.com</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    {" "}
                                    <PhoneIcon className="w-4 h-4" />
                                    Phone: +84 xxx xxx xxx
                                </li>
                                <li className="flex items-center gap-2">
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 20 20"
                                            className="fill-current"
                                        >
                                            <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
                                        </svg>
                                    </div>
                                    Facebook:{" "}
                                    <a
                                        href="https://web.facebook.com/luvsfakeaf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        utemy
                                    </a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <div>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            x="0px"
                                            y="0px"
                                            width="20"
                                            height="20"
                                            viewBox="0 0 50 50"
                                        >
                                            <path d="M 9 4 C 6.2504839 4 4 6.2504839 4 9 L 4 41 C 4 43.749516 6.2504839 46 9 46 L 41 46 C 43.749516 46 46 43.749516 46 41 L 46 9 C 46 6.2504839 43.749516 4 41 4 L 9 4 z M 9 6 L 15.576172 6 C 12.118043 9.5981082 10 14.323627 10 19.5 C 10 24.861353 12.268148 29.748596 15.949219 33.388672 C 15.815412 33.261195 15.988635 33.48288 16.005859 33.875 C 16.023639 34.279773 15.962689 34.835916 15.798828 35.386719 C 15.471108 36.488324 14.785653 37.503741 13.683594 37.871094 A 1.0001 1.0001 0 0 0 13.804688 39.800781 C 16.564391 40.352722 18.51646 39.521812 19.955078 38.861328 C 21.393696 38.200845 22.171033 37.756375 23.625 38.34375 A 1.0001 1.0001 0 0 0 23.636719 38.347656 C 26.359037 39.41176 29.356235 40 32.5 40 C 36.69732 40 40.631169 38.95117 44 37.123047 L 44 41 C 44 42.668484 42.668484 44 41 44 L 9 44 C 7.3315161 44 6 42.668484 6 41 L 6 9 C 6 7.3315161 7.3315161 6 9 6 z M 18.496094 6 L 41 6 C 42.668484 6 44 7.3315161 44 9 L 44 34.804688 C 40.72689 36.812719 36.774644 38 32.5 38 C 29.610147 38 26.863646 37.459407 24.375 36.488281 C 22.261967 35.634656 20.540725 36.391201 19.121094 37.042969 C 18.352251 37.395952 17.593707 37.689389 16.736328 37.851562 C 17.160501 37.246758 17.523335 36.600775 17.714844 35.957031 C 17.941109 35.196459 18.033096 34.45168 18.003906 33.787109 C 17.974816 33.12484 17.916946 32.518297 17.357422 31.96875 L 17.355469 31.966797 C 14.016928 28.665356 12 24.298743 12 19.5 C 12 14.177406 14.48618 9.3876296 18.496094 6 z M 32.984375 14.986328 A 1.0001 1.0001 0 0 0 32 16 L 32 25 A 1.0001 1.0001 0 1 0 34 25 L 34 16 A 1.0001 1.0001 0 0 0 32.984375 14.986328 z M 18 16 A 1.0001 1.0001 0 1 0 18 18 L 21.197266 18 L 17.152344 24.470703 A 1.0001 1.0001 0 0 0 18 26 L 23 26 A 1.0001 1.0001 0 1 0 23 24 L 19.802734 24 L 23.847656 17.529297 A 1.0001 1.0001 0 0 0 23 16 L 18 16 z M 29.984375 18.986328 A 1.0001 1.0001 0 0 0 29.162109 19.443359 C 28.664523 19.170123 28.103459 19 27.5 19 C 25.578848 19 24 20.578848 24 22.5 C 24 24.421152 25.578848 26 27.5 26 C 28.10285 26 28.662926 25.829365 29.160156 25.556641 A 1.0001 1.0001 0 0 0 31 25 L 31 22.5 L 31 20 A 1.0001 1.0001 0 0 0 29.984375 18.986328 z M 38.5 19 C 36.578848 19 35 20.578848 35 22.5 C 35 24.421152 36.578848 26 38.5 26 C 40.421152 26 42 24.421152 42 22.5 C 42 20.578848 40.421152 19 38.5 19 z M 27.5 21 C 28.340272 21 29 21.659728 29 22.5 C 29 23.340272 28.340272 24 27.5 24 C 26.659728 24 26 23.340272 26 22.5 C 26 21.659728 26.659728 21 27.5 21 z M 38.5 21 C 39.340272 21 40 21.659728 40 22.5 C 40 23.340272 39.340272 24 38.5 24 C 37.659728 24 37 23.340272 37 22.5 C 37 21.659728 37.659728 21 38.5 21 z"></path>
                                        </svg>
                                    </div>
                                    Zalo:{" "}
                                    <a href="https://zalo.me/utemy" target="_blank" rel="noopener noreferrer">
                                        utemy
                                    </a>
                                </li>
                            </ul>
                            <h3 className="my-4 flex items-center gap-2" style={{ marginLeft: "50px" }}>
                                <BuildingOfficeIcon className="h-4 w-4" />
                                Địa chỉ văn phòng:
                            </h3>
                            <p className="mb-4" style={{ marginLeft: "50px" }}>
                                Số 1 Võ Văn Ngân, TP Thủ Đức, TPHCM, Việt Nam
                            </p>
                        </div>
                    </div>
                </form>
            </center>
        </div>
    );
};

export default Feedback;
