import configs from "../configs";
import multer from "multer";
import path from "path";

//image
const storageAvatar = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs.general.PATH_TO_IMAGES}/avatar`); //mac thì để /, còn windows chắc phải \\
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storageThumbnail = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs.general.PATH_TO_IMAGES}/thumbnail`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storageImageBlog = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs.general.PATH_TO_IMAGES}/blog`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storageCategory = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs.general.PATH_TO_IMAGES}/category`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const storageEvidence = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs.general.PATH_TO_IMAGES}/evidence`);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uploadAvatar = multer({
    storage: storageAvatar,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        } else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        } else if (file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("avatar");
const uploadThumbnail = multer({
    storage: storageThumbnail,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        } else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        } else if (file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("thumbnail");
const uploadImageBlog = multer({
    storage: storageImageBlog,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        } else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        } else if (file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("image_blog");
const uploadCategory = multer({
    storage: storageCategory,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        } else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        } else if (file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("category_image");
const uploadEvidence = multer({
    storage: storageEvidence,
    limits: {
        fileSize: 1024 * 1024 * 4,
    },
    fileFilter(req, file, cb) {
        if (file.mimetype === "image/png") {
            cb(null, true);
        } else if (file.mimetype === "image/jpeg") {
            cb(null, true);
        } else if (file.mimetype === "image/jpg") {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type: Only .png, .jpeg or .jpg is allowed"));
        }
    },
}).single("evidence_image");
//video
const storageVideo = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const uploadVideo = multer({
    storage: storageVideo,
    limits: {
        fileSize: 1024 * 1024 * 100,
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "video/mp4") {
            cb(null, true);
        } else if (file.mimetype === "video/x-matroska") {
            cb(null, true);
        } else if (file.mimetype === "video/mov") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type: Only .mp4, .mkv or .mov is allowed"));
        }
    },
}).single("video");
const storageTrailer = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uploadTrailer = multer({
    storage: storageTrailer,
    limits: {
        fileSize: 1024 * 1024 * 100, // Giới hạn kích thước tệp trailer
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "video/mp4" || file.mimetype === "video/x-matroska" || file.mimetype === "video/mov") {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type: Only .mp4, .mkv or .mov is allowed"));
        }
    },
}).single("trailer");
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = "";
        if (file.fieldname === "thumbnail") {
            uploadPath = configs.general.PATH_TO_IMAGES + "/thumbnail";
        } else if (file.fieldname === "trailer") {
            uploadPath = configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS;
        } else {
            // Xử lý trường hợp khác (nếu có)
            // uploadPath = configs.general.DEFAULT_UPLOAD_PATH;
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const uploadMixFile = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 100, // Giới hạn kích thước file
    },
    fileFilter: (req, file, cb) => {
        // Kiểm tra kiểu file
        if (file.fieldname === "thumbnail" && (file.mimetype === "image/jpeg" || file.mimetype === "image/png")) {
            cb(null, true);
        } else if (
            file.fieldname === "trailer" &&
            (file.mimetype === "video/mp4" || file.mimetype === "video/x-matroska" || file.mimetype === "video/mov")) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"));
        }
    },
}).fields([
    { name: "thumbnail", maxCount: 1 }, // Tên field và số lượng file tối đa cho thumbnail
    { name: "trailer", maxCount: 1 },   // Tên field và số lượng file tối đa cho trailer
]);

export default {
    uploadAvatar,
    uploadCategory,
    uploadThumbnail,
    uploadImageBlog,
    uploadEvidence,
    uploadVideo,
    uploadTrailer,
    uploadMixFile,
};
