import { OpenAIClient, AzureKeyCredential } from "@azure/openai";
import { ResponseBase, ResponseError, ResponseSuccess } from "../common/response";
import { IRequestWithId } from "../types/request";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import constants from "../constants";
import configs from "../configs";
import { DefaultAzureCredential } from "@azure/identity";
import { SearchIndexClient } from "@azure/search-documents";

import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || ""; //Biến môi trg
const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT || ""; //Biến môi trường

const openAIClient = new OpenAIClient(OPENAI_ENDPOINT, new AzureKeyCredential(OPENAI_API_KEY));

const AZURE_SEARCH_ENDPOINT = process.env.AZURE_SEARCH_ENDPOINT || "";
const AZURE_SEARCH_INDEX = process.env.AZURE_SEARCH_INDEX || "";
const AZURE_SEARCH_API_KEY = process.env.AZURE_SEARCH_API_KEY || "";
const AZURE_OPENAI_DEPLOYMENT_ID = process.env.AZURE_OPENAI_DEPLOYMENT_ID || "";

const searchAzure = async (query: string): Promise<string[]> => {
    try {
        const response = await axios.post(
            `${AZURE_SEARCH_ENDPOINT}/indexes/${AZURE_SEARCH_INDEX}/docs/search?api-version=2024-05-01-preview`,
            {
                search: query,
                queryType: "semantic",
                semanticConfiguration: "default",
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "api-key": AZURE_SEARCH_API_KEY,
                },
            },
        );

        const results = response.data.value.map((doc: any) => doc.content);
        console.log(results);
        return results;
    } catch (error) {
        console.error("Error searching Azure Search: ", error);
        throw error;
    }
};

const getResponseWithSearch = async (content: string): Promise<string> => {
    try {
        // Lấy danh sách kết quả từ Azure Search
        const searchResults = await searchAzure(content);

        // Giới hạn độ dài của mỗi kết quả
        const limitedSearchResult = searchResults[0].substring(0, 15000);
        // console.log(limitedSearchResult);
        // Gọi OpenAI để lấy phản hồi cho nội dung từ người dùng
        const response = await openAIClient.getChatCompletions(
            AZURE_OPENAI_DEPLOYMENT_ID,
            [
                {
                    role: "system",
                    content: "Use the following information to assist with the user's query: " + limitedSearchResult,
                },
                { role: "user", content: content },
            ],
            {
                maxTokens: 1000,
                temperature: 0,
                topP: 0,
                frequencyPenalty: 0,
                presencePenalty: 0,
            },
        );

        // Xử lý và trả về nội dung phản hồi từ OpenAI
        if (response.choices && response.choices[0] && response.choices[0].message) {
            return response.choices[0].message.content || "";
        } else {
            console.error("Invalid response structure: ", response);
            return "No valid response received from OpenAI.";
        }
    } catch (error) {
        console.error("Error in getResponseWithSearch: ", error);
        throw error;
    }
};

const client = new SearchIndexClient(AZURE_SEARCH_ENDPOINT, new AzureKeyCredential(AZURE_SEARCH_API_KEY));

// Hàm để kiểm tra tồn tại của chỉ mục
const checkIndexExists = async (indexName: string): Promise<boolean> => {
    try {
        // Gọi phương thức để lấy thông tin về chỉ mục
        const result = await client.getIndex(indexName);
        // Nếu không có lỗi và có dữ liệu trả về, chỉ mục tồn tại
        return !!result;
    } catch (error) {
        console.error("Error checking index existence:", error);
        return false; // Nếu có lỗi, giả sử chỉ mục không tồn tại
    }
};
const submitQuestion = async (req: IRequestWithId): Promise<ResponseBase> => {
    try {
        const { content } = req.body;
        // Check if AZURE_SEARCH_INDEX exists and is not empty
        const azureIndexExists = await checkIndexExists(AZURE_SEARCH_INDEX);
        let result;

        if (!azureIndexExists) {
            // If AZURE_SEARCH_INDEX does not exist or is empty, fallback to OpenAI without Azure Search
            const response = await openAIClient.getChatCompletions(
                "utemyvietnam",
                [{ role: "user", content: content }],
                {
                    maxTokens: 800,
                    temperature: 0.7,
                    topP: 0.95,
                    presencePenalty: 0,
                    frequencyPenalty: 0,
                },
            );
            result = response.choices[0].message?.content || "";
        } else {
            try {
                // If AZURE_SEARCH_INDEX exists, proceed with Azure Search and OpenAI integration
                result = await getResponseWithSearch(content);
            } catch (error) {
                console.error("Error in getResponseWithSearch: ", error);
                // Fallback to OpenAI without Azure Search if getResponseWithSearch fails
                const fallbackResponse = await openAIClient.getChatCompletions(
                    "utemyvietnam",
                    [{ role: "user", content: content }],
                    {
                        maxTokens: 800,
                        temperature: 0.7,
                        topP: 0.95,
                        presencePenalty: 0,
                        frequencyPenalty: 0,
                    },
                );
                result = fallbackResponse.choices[0].message?.content || "";
            }
        }
        const data = {
            answer: result,
        };
        return new ResponseSuccess(200, constants.success.SUCCESS_GET_DATA, true, data);
    } catch (error) {
        console.error(error); // Log the error for debugging
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
