import React from "react";

const CartIcon: React.FC = () => {
    return (
        <>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M3 3C3.83093 3.30467 4.96779 3.54206 5.47948 4.32298C5.83641 4.86771 5.83641 5.59126 5.83641 7.03836V9.76C5.83641 12.7016 5.89705 13.6723 6.72781 14.5862C7.55858 15.5 8.89568 15.5 11.5699 15.5H16.6547C19.3208 15.5 19.8991 14.8985 20.4112 12.3075C20.6346 11.177 20.8608 10.0609 20.9748 8.93442C21.1907 6.79955 20.0025 6.12 18.1092 6.12H5.83641"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M16.5 21C17.3284 21 18 20.3284 18 19.5C18 18.6716 17.3284 18 16.5 18C15.6716 18 15 18.6716 15 19.5C15 20.3284 15.6716 21 16.5 21Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M8.5 21C9.32843 21 10 20.3284 10 19.5C10 18.6716 9.32843 18 8.5 18C7.67157 18 7 18.6716 7 19.5C7 20.3284 7.67157 21 8.5 21Z"
                    stroke="black"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </>
    );
};

export default CartIcon;
