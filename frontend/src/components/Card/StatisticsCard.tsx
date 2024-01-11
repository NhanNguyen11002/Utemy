import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import { color } from "@material-tailwind/react/types/components/alert";
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
        <Card className="border border-blue-gray-100 shadow-sm">
            <CardHeader
                variant="gradient"
                color={color as color}
                floated={false}
                shadow={false}
                className="absolute grid h-12 w-12 place-items-center"
            >
                {icon && React.createElement(icon, { className: "h-6 w-6 text-black" })}
            </CardHeader>
            <CardBody className="p-4 text-right">
                <Typography variant="small" className="font-normal text-blue-gray-600">
                    {title}
                </Typography>
                <Typography variant="h4" color="blue-gray">
                    {value}
                </Typography>
            </CardBody>
            {footer && <CardFooter className="border-t border-blue-gray-50 p-4">{footer}</CardFooter>}
        </Card>
    );
};

export default StatisticsCard;
