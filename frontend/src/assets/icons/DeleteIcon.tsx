import React from "react";

type DeleteIconProps = {
    	color?: string | "#222222"
}

const DeleteIcon: React.FC<DeleteIconProps> = (props) => {
    return (
        <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M20 10H4C3.44772 10 3 9.55228 3 9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10Z"
                    fill={props.color ? props.color: "#222222"}
                />
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.19773 12.7791L6.80236 18.2209C6.91491 19.2337 7.77103 20 8.79013 20H15.21C16.2291 20 17.0852 19.2337 17.1977 18.2209L17.8024 12.7791C17.9149 11.7663 18.771 11 19.7901 11H4.20996C5.22906 11 6.08519 11.7663 6.19773 12.7791ZM11 14C11 13.4477 10.5523 13 10 13C9.44776 13 9.00005 13.4477 9.00005 14V17C9.00005 17.5523 9.44776 18 10 18C10.5523 18 11 17.5523 11 17V14ZM15 14C15 13.4477 14.5523 13 14 13C13.4478 13 13 13.4477 13 14V17C13 17.5523 13.4478 18 14 18C14.5523 18 15 17.5523 15 17V14Z"
                    fill={props.color? props.color: "#222222"}
                />
                <path d="M8 5L6 9M16 5L18 9" stroke={props.color? props.color: "#222222"} strokeWidth="2" strokeLinecap="round" />
            </svg>
        </>
    );
};

export default DeleteIcon;
