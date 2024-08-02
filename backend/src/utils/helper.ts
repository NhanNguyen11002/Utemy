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
    const strDay = day < 10 ? `0${day}` : day.toString();
    const month = date.getMonth() + 1;
    const strMonth = month < 10 ? `0${month}` : month.toString();
    const year = date.getFullYear();
    const issueDate = `${year}-${strMonth}-${strDay}`;
    const expiryDate = `${year + 4}-${strMonth}-${strDay}`;
    return {
        issueDate,
        expiryDate,
    };
};
