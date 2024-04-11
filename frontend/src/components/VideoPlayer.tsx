import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import "plyr/dist/plyr.min.mjs";
import React, { useEffect, useRef, useState } from "react";

type VideoJSType = {
    sourse: string;
};

export const VideoJS: React.FC<VideoJSType> = (props) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [player, setPlayer] = useState<Plyr | null>(null);
    if (player) {
        // load lại progress video
        player?.on("loadeddata", () => {
            console.log("ready");
            player.currentTime = 10;
        });
        // gọi để update progress video
        player?.on("timeupdate", () => {
            console.log(player.currentTime);
        });
        // gọi update progress khi dừng video, chuyển sang trang khác
        player?.on("pause", () => {
            console.log("pause", player.currentTime);
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
                hls.loadSource(props.sourse);
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
    }, [props.sourse]);

    return (
        <div className="w-full flex-1 shrink-0 text-white">
            <video className="w-full h-[480px]" ref={videoRef} controls={true}></video>
        </div>
    );
};

export default VideoJS;
