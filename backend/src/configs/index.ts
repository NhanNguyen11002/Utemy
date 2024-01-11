import { db } from "./db.config";
import { general } from "./general.config";
import upload from "./multer.config";
const configs = {
    db: db,
    general: general,
    upload: upload,
};
export default configs;
