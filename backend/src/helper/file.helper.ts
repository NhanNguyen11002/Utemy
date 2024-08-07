import configs from "../configs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import fs from "fs";
import ffmpegpath from "@ffmpeg-installer/ffmpeg";
ffmpeg.setFfmpegPath(ffmpegpath.path);

const bandwidthCalculation = (inputVideo: Express.Multer.File): Promise<number> => {
    return new Promise((resolve, rejects) => {
        ffmpeg.ffprobe(inputVideo.path, (error, metadata) => {
            if (error) {
                rejects(error);
            } else {
                const bandwidth: number = inputVideo.size / (metadata.format.duration as number);
                resolve(bandwidth);
            }
        });
    });
};

const getDuration = (inputVideo: Express.Multer.File): Promise<number> => {
    return new Promise((resolve, rejects) => {
        ffmpeg.ffprobe(inputVideo.path, (error, metadata) => {
            if (error) {
                rejects(error);
            } else {
                const duration: number = metadata.format.duration as number;
                resolve(duration);
            }
        });
    });
};

const createFileM3U8AndTS = async (
    inputFileVideo: Express.Multer.File,
    resolutions: string[],
    outputFolderPath: string,
    uuid: string,
) => {
    try {
        console.log(inputFileVideo.path);
        startVideoConversion(inputFileVideo, resolutions, outputFolderPath, uuid)
            .then(() => {
                console.log("All video conversions completed.");
            })
            .catch((error) => {
                console.error("Video conversion error:", error);
            });
        const duration = await getDuration(inputFileVideo);
        const urlVideo = await createMainM3U8(inputFileVideo, resolutions, outputFolderPath, uuid);

        return { urlVideo, duration };
    } catch (error) {
        console.error("An error occurred during video processing:", error);
        throw error;
    }
};
const startVideoConversion = async (
    inputFileVideo: Express.Multer.File,
    resolutions: string[],
    outputFolderPath: string,
    uuid: string,
) => {
    try {
        const conversionPromises = resolutions.map((resolution) => {
            return new Promise<void>((resolve, reject) => {
                const videoFolderPath = path.join(outputFolderPath, uuid, `video_${resolution}`); //folder path để chứa resolution của 1 video

                if (!fs.existsSync(videoFolderPath)) {
                    fs.mkdirSync(videoFolderPath, { recursive: true });
                }
                // nếu folder trên ko tồn tại thì tạo
                // const videoPath = `${videoFolderPath}\\video_${resolution}.m3u8`; // địa chỉ file m3u8 của mỗi resolution, video path = folder path + tên file - windows

                const videoPath = `${videoFolderPath}/video_${resolution}.m3u8`; // địa chỉ file m3u8 của mỗi resolution, video path = folder path + tên file -macos

                ffmpeg(inputFileVideo.path)
                    .output(videoPath)
                    .outputOptions([
                        `-s ${resolution}`,
                        "-c:v h264",
                        "-c:a aac",
                        "-f hls",
                        "-hls_time 10",
                        "-hls_list_size 0",
                    ])
                    .on("progress", (progress) => {
                        // console.log(`Progress for ${resolution}: ${progress.percent}%`);
                    })
                    .on("end", () => {
                        console.log(`Conversion to m3u8 completed for resolution ${resolution}.`);
                        resolve();
                    })
                    .on("error", (err) => {
                        console.error(`Error in resolution ${resolution}: ${err}`);
                        reject(err);
                    })
                    .run();
            });
        });

        await Promise.all(conversionPromises);
        destroyedFileIfFailed(inputFileVideo.path);
    } catch (error) {
        console.error("An error occurred during video conversion:", error);
        destroyedFileIfFailed(inputFileVideo.path);
        throw error;
    }
};
const createMainM3U8 = async (
    inputFileVideo: Express.Multer.File,
    resolutions: string[],
    outputFolderPath: string,
    uuid: string,
) => {
    // const outputMainM3U8 = `${outputFolderPath}\\${uuid}\\main.m3u8`; //tạo output là path dẫn đến file main.m3u8 - windows
    const outputMainM3U8 = `${outputFolderPath}/${uuid}/main.m3u8`; //mac

    const bandwidth = await bandwidthCalculation(inputFileVideo);
    //với mỗi resolution tạo 1 stream info làm nội dung trong file main.m3u8
    const streamInfoArray = resolutions.map((resolution) => {
        return `#EXT-X-STREAM-INF:BANDWIDTH=${bandwidth},RESOLUTION=${resolution}\nvideo_${resolution}/video_${resolution}.m3u8`;
    });

    //nội dung cuối cùng của file m3u8, gồm streamInfoArray nối với nhau và các chuỗi nối với nhau cách nhau bởi dấu \n
    const mainM3U8Content = "#EXTM3U\n#EXT-X-VERSION:3\n" + streamInfoArray.join("\n");

    //tạo file main và ghi nội dung vào file main
    fs.writeFileSync(outputMainM3U8, mainM3U8Content);

    //trả về url của video là path tơi file main
    const urlVideo = configs.general.PATH_TO_PUBLIC_FOLDER_VIDEOS + `\\${uuid}\\main.m3u8`;
    return urlVideo;
};
const destroyedVideoIfFailed = async (filePath: string): Promise<boolean> => {
    try {
        if (filePath) {
            const folderPath = path.dirname(filePath);
            fs.rmSync(folderPath, { recursive: true });
            return true;
        } else return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};
const destroyedFileIfFailed = async (filePath: string): Promise<boolean> => {
    try {
        if (filePath) {
            fs.unlinkSync(filePath);
            return true;
        }
        return false;
    } catch (error) {
        console.log(error);
        return false;
    }
};
const FileHelper = {
    createFileM3U8AndTS,
    destroyedVideoIfFailed,
    destroyedFileIfFailed,
};
export default FileHelper;
