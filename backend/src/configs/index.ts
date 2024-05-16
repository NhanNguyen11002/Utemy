import { db } from "./db.config";
import { general } from "./general.config";
import upload from "./multer.config";
import { apiCaller } from "./apiCaller";
const configs = {
    db: db,
    general: general,
    upload: upload,
    apiCaller,
};
export default configs;
