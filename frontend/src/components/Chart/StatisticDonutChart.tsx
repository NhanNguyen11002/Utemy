import { Card, CardHeader, CardBody, CardFooter, Typography } from "@material-tailwind/react";
import Chart from "react-apexcharts";
import { color } from "@material-tailwind/react/types/components/alert";
type StatisticDonutChartProps = {
    color: string;
    title: string;
    description: string;
    name: string;
    data: number[];
    categories: any[];
    footer: any;
};
const StatisticDonutChart: React.FC<StatisticDonutChartProps> = ({
    color,
    title,
    description,
    name,
    data,
    categories,
    footer,
}) => {
    const chart: any = {
        type: "donut",
        height: 300,
        series: data,
        options: {
            title: {
                text: name,
            },
            labels: categories,
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                        },
                    },
                },
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

export default StatisticDonutChart;
