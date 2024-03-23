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
const storageCategory = multer.diskStorage({
    destination: (req, res, cb) => {
        cb(null, `${configs.general.PATH_TO_IMAGES}/category`);
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

export default { uploadAvatar, uploadCategory, uploadThumbnail, uploadVideo };
