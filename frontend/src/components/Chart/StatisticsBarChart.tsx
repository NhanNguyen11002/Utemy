import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import chartsConfig from "../../config/chartsConfig";
import { color } from "@material-tailwind/react/types/components/alert";
type StatisticBarChartProps = {
    color: string;
    colors: string;
    title: string;
    description: string;
    name: string;
    data: number[];
    categories: any[];
    footer: string;
};
const StatisticsBarChart: React.FC<StatisticBarChartProps> = ({
    color,
    title,
    description,
    colors,
    name,
    data,
    categories,
    footer,
}) => {
    const chart: any = {
        type: "bar",
        height: 300,
        series: [
            {
                name: name,
                data: data,
            },
        ],
        options: {
            ...chartsConfig,
            colors,
            plotOptions: {
                bar: {
                    columnWidth: "10%",
                    borderRadius: 5,
                },
            },
            xaxis: {
                ...chartsConfig.xaxis,
                categories: categories,
            },
        },
    };
    return (
        <Card className="border border-blue-gray-100 shadow-sm">
            <CardHeader variant="gradient" color={color as color} floated={false} shadow={false}>
                <Chart {...chart} />
            </CardHeader>
            <CardBody className="px-6 pt-0">
                <Typography variant="h6" color="blue-gray">
                    {title}
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-600">
                    {description}
                </Typography>
            </CardBody>
            {footer && <CardFooter className="border-t border-blue-gray-50 px-6 py-5">{footer}</CardFooter>}
        </Card>
    );
};

export default StatisticsBarChart;
