import React, { useState, useEffect } from "react";
import { ArrowUpIcon } from "lucide-react";

const ScrollToTopButton = () => {
    const [visible, setVisible] = useState(false);
    const [hovered, setHovered] = useState(true);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > 300) {
            setVisible(true);
        } else if (scrolled <= 300) {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
    useEffect(() => {
        window.addEventListener("scroll", toggleVisible);
        return () => {
            window.removeEventListener("scroll", toggleVisible);
        };
    }, []);

    return (
        <button
            onClick={scrollToTop}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className={`fixed bottom-10 left-10 transition-all duration-300 z-1 cursor-pointer rounded-full bg-info text-white ${visible ? " h-16 w-16" : " h-0 w-0"}`}
        >
            <ArrowUpIcon
                className={`h-6 w-6 text-white inline transition-all duration-300 ${visible ? "block " : "hidden"} ${hovered ? " -translate-y-1" : ""}`}
            />
        </button>
    );
};

export default ScrollToTopButton;
