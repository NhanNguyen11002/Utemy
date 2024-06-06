import React from "react";
type StatisticCardProps = {
    color: string;
    icon: React.ElementType;
    title: string;
    value: any;
    footer?: any;
};
const StatisticsCard: React.FC<StatisticCardProps> = ({ color, icon, title, value, footer }) => {
    return (
        <div className="border border-blue-gray-100 flex flex-col justify-center shadow-sm">
            <div className="flex justify-between items-center w-full px-2 ">
                <div className={`h-8 w-8 text-${color}-600`}>
                    {icon && React.createElement(icon, { className: "h-8 w-8 font-semibold " })}
                </div>
                <div className="p-4 text-right">
                    <p className="font-normal text-sm text-blue-gray-600">{title}</p>
                    <p className="font-semibold text-xl">{value}</p>
                </div>
            </div>
            {footer && <div className="border-t border-blue-gray-50 p-4">{footer}</div>}
        </div>
    );
};

export default StatisticsCard;
