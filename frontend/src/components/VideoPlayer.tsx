import { progressActions } from "../redux/slices";
import { useAppSelector, useAppDispatch } from "../hooks/hooks";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "plyr/dist/plyr.min.mjs";
import React, { useEffect, useRef, useState } from "react";
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
    const progress = useAppSelector((state) => state.progressSlice.progress);
    const lectureProgress = progress[props.lectureId];

    useEffect(() => {
        if (player) {
            player.on(
                "timeupdate",
                _.throttle(() => {
                    console.log("update");
                    console.log("progress", lectureProgress);
                    if (player.currentTime > lectureProgress.progress_value) {
                        dispatch(
                            progressActions.updateProgress({
                                progress_value: Math.floor(player.currentTime),
                                lecture_id: props.lectureId,
                            }),
                        ).then((res: any) => {
                            if (res && res.payload && res.payload.data && res.payload.status_code === 200) {
                                dispatch(progressActions.getProgressByCourseSlug(slug));
                            }
                        });
                    } else return;
                }, 20000),
            );
            player.on("ended", () => {
                console.log(lectureProgress);
                if (player.currentTime > lectureProgress.progress_value) {
                    dispatch(
                        progressActions.updateProgress({
                            progress_value: Math.floor(player.currentTime),
                            lecture_id: props.lectureId,
                        }),
                    ).then((res: any) => {
                        if (res && res.payload && res.payload.data && res.payload.status_code === 200) {
                            dispatch(progressActions.getProgressByCourseSlug(slug));
                        }
                    });
                } else return;
            });
            player.on("seeked", () => {
                if (player.currentTime - lectureProgress.progress_value > 60) {
                    toast("Don't skip video, we will have to force you back", {
                        icon: <TriangleAlert className="fill-yellow-400 " />,
                        duration: 4000,
                    });
                    player.currentTime = lectureProgress.progress_value;
                }
            });
        }

        player?.off("seeked", () => {});
        player?.off("timeupdate", () => {});
        player?.off("ended", () => {});
    }, [player]);

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
            videoElement.addEventListener("loadeddata", () => {
                console.log("loaded", lectureProgress.duration);
                videoElement.currentTime =
                    lectureProgress.progress_value >= lectureProgress.duration
                        ? lectureProgress.progress_value * 0.85
                        : lectureProgress.progress_value || 0;
            });
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
                    const player = new Plyr(videoElement, defaultOptions);
                    setPlayer(player);
                });
                hls.attachMedia(videoElement);
            }
        }
        return () => {
            videoElement?.removeEventListener("loadeddata", () => {
                videoElement.currentTime =
                    lectureProgress.progress_value >= lectureProgress.duration
                        ? lectureProgress.progress_value * 0.85
                        : lectureProgress.progress_value || 0;
            });
        };
    }, [props.source]);

    return (
        <div className="w-full flex-1 shrink-0 text-white">
            <video className="w-full h-[480px]" ref={videoRef} controls={true}></video>
        </div>
    );
};

export default VideoJS;
