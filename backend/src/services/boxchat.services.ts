import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { IRequestWithId } from "../types/request";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import constants from "../constants";
import configs from "../configs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""; //Biến môi trg
const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT || ""; //Biến môi trường

const openAIClient = new OpenAIClient(OPENAI_ENDPOINT, new AzureKeyCredential(OPENAI_API_KEY));

const submitQuestion = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { content } = req.body;
        const response = await openAIClient.getChatCompletions("utemyvietnam", [{ role: "user", content: content }], {
            maxTokens: 500,
            temperature: 0.7,
            topP: 0.95,
            presencePenalty: 0,
            frequencyPenalty: 0,
        });
        const result = response.choices[0].message?.content || "";
        const data = {
            answer: result,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        console.error(error); // In ra lỗi để debug
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, {
            answer: "Bạn thao tác quá nhanh, hãy thử lại sau vài giây!!",
        });
    }
};
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const checkValidateComment = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { content } = req.body;

        const response = await openAIClient.getCompletions("utemyvietnam", [content], {
            maxTokens: 500,
            temperature: 0.7,
            topP: 0.95,
            presencePenalty: 0,
            frequencyPenalty: 0,
        });

        if (!response.choices[0].contentFilterResults) {
            console.log("Không có kết quả lọc bình luận được tìm thấy");
            return new ResponseSuccess(400, "Không thể kiểm tra nội dung bình luận. Vui lòng thử lại sau.", false);
        }
        if (response.choices[0].contentFilterResults.error) {
            console.log(
                `Content filter ran into the error ${response.choices[0].contentFilterResults.error.code}: ${response.choices[0].contentFilterResults.error.message}`,
            );
            return new ResponseSuccess(400, "Lỗi xảy ra khi xem xét đánh giá bình luận.", false);
        } else {
            // Lưu trữ kết quả kiểm tra nội dung
            const contentFilterResults = response.choices[0].contentFilterResults;

            // Truy cập các thuộc tính bên trong và kiểm tra
            const { hate, sexual, selfHarm, violence } = contentFilterResults;
            console.log(`Hate category is filtered: ${hate?.filtered} with ${hate?.severity} severity`);
            console.log(`Sexual category is filtered: ${sexual?.filtered} with ${sexual?.severity} severity`);
            console.log(`Self-harm category is filtered: ${selfHarm?.filtered} with ${selfHarm?.severity} severity`);
            console.log(`Violence category is filtered: ${violence?.filtered} with ${violence?.severity} severity`);

            // Kiểm tra nội dung bình luận có hợp lệ không
            const isCommentValid = !hate?.filtered && !sexual?.filtered && !selfHarm?.filtered && !violence?.filtered;

            if (!isCommentValid) {
                console.warn("Bình luận của bạn chứa các nội dung không phù hợp!!");
                return new ResponseSuccess(400, "Bình luận của bạn chứa các nội dung không phù hợp!!", false, {
                    isValid: false,
                });
            }
            // Nếu bình luận hợp lệ, trả về phản hồi thành công
            return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, { isValid: true });
        }
    } catch (error: any) {
        console.error(error); // In ra lỗi để debug
        if (error.code === "content_filter") {
            console.warn("Bình luận của bạn đã bị chặn do chứa nội dung không phù hợp!!");
            console.log("API trả về khi có lỗi:", error);
            return new ResponseSuccess(
                400,
                "Bình luận của bạn đã bị chặn do chứa nội dung không phù hợp, vui lòng kiểm tra lại!!",
                false,
                {
                    isValid: false,
                },
            );
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};

const BoxChatServices = {
    submitQuestion,
    checkValidateComment,
};
export default BoxChatServices;
