import { Course } from "../types/course";
import { QuizAnswerType } from "../types/quiz";

export const previewImage = (image: File | null, imageRef: React.RefObject<HTMLImageElement>, imageSource?: string) => {
    if (image && image.type.includes("image/")) {
        var reader = new FileReader();
        reader.onload = function (e) {
            if (imageRef.current) {
                imageRef.current.src = e.target?.result as string;
            }
        };
        reader.readAsDataURL(image);
        return;
    } else {
        if (imageRef.current && imageSource) {
            imageRef.current.src = imageSource;
        } else if (imageRef.current) {
            imageRef.current.src = "";
        }
    }
};

export const convertDateFormat = (inputDate: string) => {
    const date = new Date(inputDate); // Chuyển chuỗi thành đối tượng ngày tháng
    const day = String(date.getDate()).padStart(2, "0"); // Lấy ngày và đảm bảo rằng nó có 2 chữ số
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Lấy tháng (chú ý tháng bắt đầu từ 0) và đảm bảo rằng nó có 2 chữ số
    const year = date.getFullYear(); // Lấy năm

    const formattedDate = `${day}/${month}/${year}`;

    return formattedDate;
};

export const convertStringDate = (date: string) => {
    const array = date.split(" ");
    return array[1] + " " + array[2] + " " + array[3];
};

export const eveluateList = [
    {
        title: "5 stars",
        value: 5,
    },
    {
        title: "4 stars",
        value: 4,
    },
    {
        title: "3 stars",
        value: 3,
    },
    {
        title: "2 stars",
        value: 2,
    },
    {
        title: "1 star",
        value: 1,
    },
];

export const sortingBy = [
    {
        value: "newest",
        title: "Newest",
    },
    {
        value: "oldest",
        title: "Oldest",
    },
    { value: "attendees", title: "Most Attendees" },
    { value: "ascprice", title: "Price: Lowest to Highest" },
    { value: "descprice", title: "Price: Highest to Lowest" },
];
export const calDayRemains = (date: string) => {
    const target = +new Date(date);
    const now = +new Date();
    const gap = target - now;

    const days = Math.floor(gap / (1000 * 60 * 60 * 24));
    const hours = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    return `${days} ngày ${hours} giờ`;
};

const convertSecondToHour = (duration: number) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const remainingSeconds = duration % 60;

    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};
export const getCourseIncludes = (course: Course) => {
    let durationRaw = 0;
    let lessonCount = 0;
    course.sections?.forEach((section) => {
        section.lecture?.forEach((lecture) => {
            lessonCount += 1;
            durationRaw += Number(lecture.content.duration);
        });
    });
    const temp = {
        duration: convertSecondToHour(durationRaw),
        lessonCount,
    };
    return temp;
};

export const secondsToMinutesAndSeconds = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

    return `${formattedMinutes}:${formattedSeconds}`;
};
export const convertSecondsToTimeString = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.ceil((seconds % 3600) / 60); // Làm tròn lên
    let result = "";

    if (hours > 0) {
        result += hours + " giờ ";
    }

    if (minutes > 0 || hours === 0) {
        result += minutes + " phút";
    }

    return result;
};
export const checkAnswerArray = (array: QuizAnswerType[]) => {
    let count = 0;
    array.forEach((answer) => {
        if (answer.is_correct) count += 1;
    });
    return count === 1;
};

export const courseSetupProgress = (course: Course) => {
    let numerator = 0;
    let denominator = 0;
    if (!course.study || course.study.length === 0) {
        denominator++;
    } else {
        numerator++;
        denominator++;
    }
    if (!course.requirement || course.requirement.length === 0) {
        denominator++;
    } else {
        numerator++;
        denominator++;
    }
    if (!course.description) {
        denominator++;
    } else {
        const strippedText = course.description.replace(/<[^>]*>/g, "");
        const characterCount = strippedText.length;
        if (characterCount === 0) {
            denominator++;
        } else {
            numerator++;
            denominator++;
        }
    }
    const ob = getCourseIncludes(course);
    if (ob.lessonCount === 0) {
        denominator++;
    } else {
        numerator++;
        denominator++;
    }
    return (numerator / denominator) * 100;
};
