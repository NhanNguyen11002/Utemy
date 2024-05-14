import { progressActions } from "../redux/slices";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "plyr/dist/plyr.min.mjs";
import React, { useEffect, useMemo, useRef, useState } from "react";
import _ from "lodash";
import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";

type VideoJSType = {
    source: string;
    lectureId: number;
};

export const VideoJS: React.FC<VideoJSType> = (props) => {
    const dispatch = useAppDispatch();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [player, setPlayer] = useState<Plyr | null>(null);
    const slug = useAppSelector((state) => state.courseSlice.courseDetail.slug);
    // const progress = useAppSelector((state) => state.progressSlice.progress) || {}; //new Map<number, any>();
    // const lectureProgress = progress[props.lectureId];
    const progress = useAppSelector((state) => state.progressSlice.progress);
    const lectureProgress = progress[props.lectureId];
    const curr = lectureProgress ? lectureProgress.progress_value : 0;
    const currentProgress = useMemo(() => {
        return curr;
    }, [curr]);
    // useEffect(() => {
    //     if (player) player.currentTime = curr;
    // }, [curr, player]);
    // const current = useMemo(() => {
    //     return curr;
    // }, [curr]);
    // console.log("curr memo", current);
    if (player) {
        // load lại progress video
        player.on("loadeddata", () => {
            player.currentTime = curr || 0;
        });
        // gọi để update progress video
        player.on(
            "timeupdate",
            _.throttle(() => {
                if (player.currentTime > currentProgress && player.currentTime - currentProgress <= 60) {
                    dispatch(
                        progressActions.updateProgress({
                            progress_value: Math.floor(player.currentTime),
                            lecture_id: props.lectureId,
                        }),
                    ).then((res: any) => {
                        if (res && res.payload && res.payload.data && res.payload.status_code === 200) {
                            if (res.payload.data.is_pass) {
                                dispatch(progressActions.getProgressByCourseSlug(slug));
                            } else {
                                dispatch(progressActions.setUpdateProgress(res));
                            }
                        }
                    });
                } else return;
            }, 20000),
        );
        // gọi update progress khi dừng video, chuyển sang trang khác
        // player.on("pause", () => {
        //     console.log("pause", player.currentTime);
        //     if (player.currentTime > current && player.currentTime - current <= 60) {
        //         dispatch(
        //             progressActions.updateProgress({
        //                 progress_value: Math.floor(player.currentTime),
        //                 lecture_id: props.lectureId,
        //             }),
        //         ).then((res: any) => {
        //             if (res && res.payload && res.payload.data && res.payload.status_code === 200) {
        //                 if (res.payload.data.isPass) {
        //                     dispatch(progressActions.getProgressByCourseSlug(slug));
        //                 }
        //             }
        //         });
        //     }
        // });
        player.on("seeked", () => {
            console.log("progress out", currentProgress);
            if (player.currentTime - currentProgress > 60) {
                toast("Don't skip video, we will have to force you back", {
                    icon: <TriangleAlert className="fill-yellow-400 " />,
                    duration: 4000,
                });
                console.log("progress in", currentProgress);
                player.currentTime = currentProgress;
            }
        });
    }
    const updateQuality = (newQuality: any) => {
        if (Hls.isSupported()) {
            window.hls.levels.forEach((level: any, levelIndex: any) => {
                if (level.height === newQuality) {
                    window.hls.currentLevel = levelIndex;
                }
            });
        }
    };

    useEffect(() => {
        const videoElement = videoRef.current;
        if (videoElement) {
            if (Hls.isSupported()) {
                const hls = new Hls();
                hls.loadSource(props.source);
                hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
                    window.hls = hls;
                    const availableQualities = hls.levels.map((l) => l.height);
                    const defaultOptions: Plyr.Options = {
                        controls: [
                            "restart", // Restart playback
                            "rewind", // Rewind by the seek time (default 10 seconds)
                            "play", // Play/pause playback
                            "fast-forward", // Fast forward by the seek time (default 10 seconds)
                            "progress", // The progress bar and scrubber for playback and buffering
                            "current-time", // The current time of playback
                            "duration", // The full duration of the media
                            "mute", // Toggle mute
                            "volume", // Volume control
                            "captions", // Toggle captions
                            "settings", // Settings menu
                            "pip", // Picture-in-picture (currently Safari only)
                            "airplay", // Airplay (currently Safari only)
                            "fullscreen", // Toggle fullscreen
                        ],

                        quality: {
                            default: availableQualities[availableQualities.length - 1],
                            options: availableQualities,
                            forced: true,
                            onChange: (event) => updateQuality(event),
                        },
                    };
                    setPlayer(new Plyr(videoElement, defaultOptions));
                });

                hls.attachMedia(videoElement);
            }
        }
    }, [props.source]);

    return (
        <div className="w-full flex-1 shrink-0 text-white">
            <video className="w-full h-[480px]" ref={videoRef} controls={true}></video>
        </div>
    );
};

export default VideoJS;
