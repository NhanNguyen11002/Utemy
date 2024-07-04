import path from "path";
import configs from "../configs";

const convertFilePath = (filePath: string): string => {
    const publicPath = filePath.split("public")[1];
    const fullPath = path
        .join(configs.general.BACKEND_DOMAIN_NAME as string, publicPath as string)
        .replace(/\\/g, "//");
    return fullPath;
};
// const deConvertFilePath = (filePath: string): string => {
//     const publicPath = filePath.split("3001")[1];
//     const fullPath = path.join(process.cwd(), `//public//${publicPath}`);
//     return fullPath;
// };
const deConvertFilePath = (filePath: string): string => {
    try {
        const url = new URL(filePath);
        const publicPath = url.pathname; // Lấy đường dẫn tương đối từ URL
        const fullPath = path.join(process.cwd(), `public${publicPath}`);
        return fullPath;
    } catch (error) {
        console.error("Invalid URL:", error);
        return '';
    }
};
const convert = { convertFilePath, deConvertFilePath };
export default convert;
