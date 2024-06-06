import Chart from "react-apexcharts";
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
        <div className="border border-blue-gray-100 shadow-sm">
            <div>
                <Chart {...chart} />
            </div>
            <div className="p-6 flex flex-col gap-1">
                <p className="text-lg font-semibold">{title}</p>
                <p className="font-normal text-sm">{description}</p>
            </div>
            {footer && <div className="border-t border-blue-gray-50 px-6 py-5">{footer}</div>}
        </div>
    );
};

export default StatisticDonutChart;
