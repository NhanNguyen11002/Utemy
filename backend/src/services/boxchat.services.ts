import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { IRequestWithId } from "../types/request";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import constants from "../constants";
import configs from "../configs";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";  //Biến môi trg
const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT || ""; //Biến môi trường

const openAIClient = new OpenAIClient(OPENAI_ENDPOINT, new AzureKeyCredential(OPENAI_API_KEY));

const submitQuestion = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { content } = req.body;
        console.log("hihi",content);
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
        if (typeof error === "object" && error !== null && "code" in error) {
            if (error.code === 429) {
                await delay(1000);
                return submitQuestion(req);
            }
        }
        if (error instanceof PrismaClientKnownRequestError) {
            return new ResponseError(400, constants.error.ERROR_BAD_REQUEST, false);
        }
        return new ResponseError(500, constants.error.ERROR_INTERNAL_SERVER, false);
    }
};
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BoxChatServices = {
    submitQuestion,
};
export default BoxChatServices;
