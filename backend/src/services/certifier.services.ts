import { IRequestWithId } from "~/types/request";
import configs from "../configs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import constants from "../constants";
import { convertDateForCertifer } from "../utils/helper";

const sendCertifier = async (req: IRequestWithId): Promise<ResponseBase> => {
    const userId = req.user_id;
    const courseId = Number(req.body.course_id);
    const isCourseExist = await configs.db.course.findFirst({
        where: {
            id: courseId,
            is_delete: false,
        },
        include: {
            user: true,
        },
    });
    if (!isCourseExist) return new ResponseError(404, constants.error.ERROR_COURSE_NOT_FOUND, false);
    const isUserExist = await configs.db.user.findFirst({
        where: {
            id: userId,
            is_deleted: false,
        },
    });
    if (!isUserExist) return new ResponseError(404, constants.error.ERROR_USER_NOT_FOUND, false);
    //check enrolled
    const isEnrolled = await configs.db.enrolled.findFirst({
        where: {
            course_id: courseId,
            user_id: userId,
            is_done: false,
        },
    });
    if (!isEnrolled) return new ResponseError(404, constants.error.ERROR_DATA_NOT_FOUND, false);

    const apiCaller = configs.apiCaller;

    const getGroups = await apiCaller("GET", "groups");
    const groupId = getGroups.data.data[0].id;

    const date = convertDateForCertifer(new Date());
    const email = isUserExist.email;
    const name = isUserExist.first_name + " " + isUserExist.last_name;
    const mentor = isCourseExist.user.first_name + " " + isCourseExist.user.last_name;
    const courseName = isCourseExist.title;
    const data = {
        recipient: { name, email },
        issueDate: date.issueDate,
        expiryDate: date.expiryDate,
        customAttributes: { "custom.mentor": mentor, "custom.course_name": courseName },
        groupId,
    };
    const createCertificate = await apiCaller("POST", "credentials", data);
    if (createCertificate.status > 299 || createCertificate.status < 200) {
        console.log("error created", createCertificate.data.error.message);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
    console.log("created data", createCertificate.data);

    const uniqueId = createCertificate.data.id;
    const publicId = createCertificate.data.publicId;
    const publishCertificate = await apiCaller("POST", `credentials/${uniqueId}/issue`);
    if (publishCertificate.status > 299 || publishCertificate.status < 200) {
        console.log("error created", publishCertificate.data.error.message);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }

    const sendCertifier = await apiCaller("POST", `credentials/${uniqueId}/send`, { deliveryMethod: "email" });
    if (sendCertifier.status > 299 || sendCertifier.status < 200) {
        console.log("error created", sendCertifier.data.error.message);
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
    const storeCertificate = await configs.db.certificate.create({
        data: {
            id: uniqueId,
            public_id: publicId,
            recipient_id: userId,
            course_id: courseId,
            group_id: groupId,
            status: "issued",
        },
    });
    const checkDoneEnrolled = await configs.db.enrolled.update({
        where: {
            id: isEnrolled.id,
        },
        data: {
            is_done: true,
        },
    });
    return new ResponseSuccess(200, constants.success.SUCCESS_CREATE_DATA, true, { public_id: publicId });
};

const CertifierServices = {
    sendCertifier,
};
export default CertifierServices;
