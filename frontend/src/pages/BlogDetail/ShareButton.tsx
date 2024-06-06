import { Share2Icon } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../../components/ui/hover-card";
import {
    FacebookShareButton,
    FacebookIcon,
    TwitterShareButton,
    TwitterIcon,
    LinkedinShareButton,
    LinkedinIcon,
} from "react-share";

type ShareButtonPropTypes = {
    currentHref?: string;
};

const ShareButton: React.FC<ShareButtonPropTypes> = (props) => {
    const currentURI = encodeURIComponent(window.location.href);
    return (
        <>
            <HoverCard>
                <HoverCardTrigger>
                    <div className="h-fit item-center">
                        <Share2Icon className="w-6 h-6 text-black " />
                    </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-fit">
                    <div className="flex flex-col justify-center gap-2 w-fit h-fit">
                        <FacebookShareButton url={currentURI} hashtag="#utemy #learning #elearning">
                            <FacebookIcon size={32} round={true} />
                        </FacebookShareButton>
                        <TwitterShareButton url={window.location.href} hashtags={"utemy learning elearning".split(" ")}>
                            <TwitterIcon size={32} round={true} />
                        </TwitterShareButton>
                        <LinkedinShareButton url={window.location.href} title="Utemy">
                            <LinkedinIcon size={32} round={true} />
                        </LinkedinShareButton>
                    </div>
                </HoverCardContent>
            </HoverCard>
        </>
    );
};
export default ShareButton;
