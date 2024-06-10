import Chart from "react-apexcharts";
import chartsConfig from "../../config/chartsConfig";
type StatisticBarChartProps = {
    color: string;
    colors: string;
    title: string;
    description: string;
    name: string;
    data: number[];
    categories: any[];
    footer: any;
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
        <div className="border border-blue-gray-100 shadow-sm">
            <div>
                <Chart {...chart} />
            </div>
            <div className="px-6 pt-0">
                <p className="text-lg font-semibold ">{title}</p>
                <p className="font-normal text-sm text-blue-gray-600">{description}</p>
            </div>
            {footer && <div className="border-t border-blue-gray-50 px-6 py-5">{footer}</div>}
        </div>
    );
};

export default StatisticsBarChart;
