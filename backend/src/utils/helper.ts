export const generateUniqueSlug = (slug: string): string => {
    const uniqueString = `${Date.now()}${Math.random().toFixed(3).split(".")[1]}`
    return `${slug}-${uniqueString}`;
};

const regexGetPublicId = /\/v\d+\/([^/]+)\.\w{3,4}$/

export const getPublicIdFromUrl = (url: string): string | null => {
    const match = url.match(regexGetPublicId)
    return match ? match[1] : null;
};
