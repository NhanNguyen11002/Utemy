import { useState } from "react";
import { TextEditorWithImage } from "../../components";

// const data: any[] = [
//     {
//         course_id: 27,
//         title: "Khoá học không có tổng quan, yêu cầu, hay mấy cái thông tin lằng nhằng để test",
//         summary:
//             "Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn",
//         description: "<p><br></p>",
//         thumbnail: "http:////////localhost:3001/images/thumbnail/1711867441007.jpeg",
//         average_rating: 0,
//         sections: [
//             {
//                 title: "zzz",
//                 updated_at: "2024-03-31T07:31:31.347Z",
//                 id: 9,
//                 lecture: [
//                     {
//                         lecture_id: 9,
//                         type: "Lesson",
//                         content: {
//                             id: 8,
//                             title: "zzz",
//                             is_delete: false,
//                             url_video:
//                                 "http:////////localhost:3001/videos//9_8483135e-1b9b-4811-84d0-991f617c7fd0//main.m3u8",
//                             duration: "31",
//                             description: "<p>ccxz</p>",
//                             created_at: "2024-03-31T07:31:59.749Z",
//                             updated_at: "2024-03-31T07:31:59.749Z",
//                             lecture_id: 9,
//                         },
//                     },
//                     {
//                         lecture_id: 10,
//                         type: "Test",
//                         content: {
//                             id: 2,
//                             title: "Bài kiểm tra test nhập phút",
//                             is_delete: false,
//                             is_time_limit: true,
//                             duration: "120",
//                             pass_percent: 0.5,
//                             number_of_question: 2,
//                             quiz_group_id: 1,
//                             description: "<p>cxzcx</p>",
//                             created_at: "2024-03-31T07:48:16.976Z",
//                             updated_at: "2024-03-31T07:48:16.976Z",
//                             lecture_id: 10,
//                         },
//                     },
//                 ],
//             },
//         ],
//         status: false,
//         slug: "khoa-hoc-khong-co-tong-quan-yeu-cau-hay-may-cai-thong-tin-lang-nhang-dje-test",
//         requirement: ["yêu cầu"],
//         study: [],
//     },
//     {
//         course_id: 27,
//         title: "Khoá học không có tổng quan, yêu cầu, hay mấy cái thông tin lằng nhằng để test",
//         summary:
//             "Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn Tóm tắt ngắn gọn",
//         description: "<p><br></p>",
//         thumbnail: "http:////////localhost:3001/images/thumbnail/1711867441007.jpeg",
//         average_rating: 0,
//         number_of_rating: 0,
//         number_of_enrolled: 0,
//         author: {
//             first_name: "ten tenten tenten",
//             last_name: "1 ten",
//             id: 3,
//             user_id: 3,
//         },
//         categories: [
//             {
//                 category_id: 3,
//                 title: "Hoá",
//                 url_image: "http:////////localhost:3001/images/category/1711011181029.jpeg",
//             },
//         ],
//         sections: [
//             {
//                 title: "zzz",
//                 updated_at: "2024-03-31T07:31:31.347Z",
//                 id: 9,
//                 lecture: [
//                     {
//                         lecture_id: 9,
//                         type: "Lesson",
//                         content: {
//                             id: 8,
//                             title: "zzz",
//                             is_delete: false,
//                             url_video:
//                                 "http:////////localhost:3001/videos//9_8483135e-1b9b-4811-84d0-991f617c7fd0//main.m3u8",
//                             duration: "31",
//                             description: "<p>ccxz</p>",
//                             created_at: "2024-03-31T07:31:59.749Z",
//                             updated_at: "2024-03-31T07:31:59.749Z",
//                             lecture_id: 9,
//                         },
//                     },
//                     {
//                         lecture_id: 10,
//                         type: "Test",
//                         content: {
//                             id: 2,
//                             title: "Bài kiểm tra test nhập phút",
//                             is_delete: false,
//                             is_time_limit: true,
//                             duration: "120",
//                             pass_percent: 0.5,
//                             number_of_question: 2,
//                             quiz_group_id: 1,
//                             description: "<p>cxzcx</p>",
//                             created_at: "2024-03-31T07:48:16.976Z",
//                             updated_at: "2024-03-31T07:48:16.976Z",
//                             lecture_id: 10,
//                         },
//                     },
//                 ],
//             },
//         ],
//         status: false,
//         price: 120000,
//         sale_price: 120000,
//         sale_until: null,
//         slug: "khoa-hoc-khong-co-tong-quan-yeu-cau-hay-may-cai-thong-tin-lang-nhang-dje-test",
//         requirement: ["yêu cầu"],
//         study: [],
//     },
// ];
const ATestingComponent: React.FC = () => {
    const [content, setContent] = useState("");
    const handleChangeContent = (content: string) => {
        setContent(content);
    };
    console.log(content);

    return (
        <>
            <div className="m-auto w-[full]">
                <div className="w-[400px] h-[400px] block">
                    <TextEditorWithImage
                        content={content}
                        handleChangeContent={(content: string) => handleChangeContent(content)}
                    />
                </div>
            </div>
        </>
    );
};
export default ATestingComponent;
