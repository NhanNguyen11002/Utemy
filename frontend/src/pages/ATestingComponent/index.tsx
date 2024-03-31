import { AccordionSection } from "components";

const data = [
    {
        title: "Chương 1",
        updated_at: "2024-03-22T04:07:19.388Z",
        id: 2,
        // lecture: [
        //     {
        //         lecture_id: 7,
        //         type: "Test",
        //         content: {
        //             id: 1,
        //             title: "Bài kiểm tra 1",
        //             is_delete: false,
        //             is_time_limit: true,
        //             duration: "120",
        //             pass_percent: 0.5,
        //             number_of_question: 2,
        //             quiz_group_id: 1,
        //             description: "<p>Bài kiểm tra 1</p>",
        //             created_at: "2024-03-22T04:07:50.799Z",
        //             updated_at: "2024-03-22T04:07:50.799Z",
        //             lecture_id: 7,
        //         },
        //     },
        //     {
        //         lecture_id: 8,
        //         type: "Lesson",
        //         content: {
        //             id: 7,
        //             title: "Bài học 1",
        //             is_delete: false,
        //             url_video: "http:////////localhost:3001/videos//8_0ebc1af4-2b38-42ee-a791-c2c319934b2e//main.m3u8",
        //             duration: "31",
        //             description: "<p>123456789</p>",
        //             created_at: "2024-03-22T04:26:21.056Z",
        //             updated_at: "2024-03-22T04:26:21.056Z",
        //             lecture_id: 8,
        //         },
        //     },
        // ],
    },
    {
        title: "Chương 2",
        updated_at: "2024-03-22T04:07:19.388Z",
        id: 2,
        lecture: [
            {
                lecture_id: 7,
                type: "Test",
                content: {
                    id: 1,
                    title: "Bài kiểm tra 1",
                    is_delete: false,
                    is_time_limit: true,
                    duration: "120",
                    pass_percent: 0.5,
                    number_of_question: 2,
                    quiz_group_id: 1,
                    description: "<p>Bài kiểm tra 1</p>",
                    created_at: "2024-03-22T04:07:50.799Z",
                    updated_at: "2024-03-22T04:07:50.799Z",
                    lecture_id: 7,
                },
            },
            {
                lecture_id: 8,
                type: "Lesson",
                content: {
                    id: 7,
                    title: "Bài học 1",
                    is_delete: false,
                    url_video: "http:////////localhost:3001/videos//8_0ebc1af4-2b38-42ee-a791-c2c319934b2e//main.m3u8",
                    duration: "31",
                    description: "<p>123456789</p>",
                    created_at: "2024-03-22T04:26:21.056Z",
                    updated_at: "2024-03-22T04:26:21.056Z",
                    lecture_id: 8,
                },
            },
        ],
    },
];
const ATestingComponent: React.FC = () => {
    return (
        <>
            <div className="m-auto w-[500px]">
                {data.map((section, index) => (
                    <AccordionSection key={index} section={section} isDisplayEdit={false} isDisplayProgress={false} />
                ))}
            </div>
        </>
    );
};
export default ATestingComponent;
