export const generateUniqueSlug = (slug: string): string => {
    const uniqueString = `${Date.now()}${Math.random().toFixed(3).split(".")[1]}`;
    return `${slug}-${uniqueString}`;
};

const regexGetPublicId = /\/v\d+\/([^/]+)\.\w{3,4}$/;

export const getPublicIdFromUrl = (url: string): string | null => {
    const match = url.match(regexGetPublicId);
    return match ? match[1] : null;
};

export const convertDateForCertifer = (date: Date): any => {
    //yyyy-mm-dd
    const day = date.getDate();
    const month = date.getMonth() + 1; // Để lấy tháng, bạn phải cộng thêm 1 vì tháng trong JavaScript bắt đầu từ 0
    const strMonth = month < 10 ? `0${month}` : month.toString();
    const year = date.getFullYear();
    const issueDate = `${year}-${strMonth}-${day}`;
    const expiryDate = `${year + 4}-${strMonth}-${day}`;
    return {
        issueDate,
        expiryDate,
    };
};
