import Chart from "react-apexcharts";
import chartsConfig from "../../config/chartsConfig";
type StatisticLineChartProps = {
    color: string;
    colors: string[];
    title: string;
    description: string;
    name: string;
    data: number[];
    categories: any[];
    footer: any;
};
const StatisticLineChart: React.FC<StatisticLineChartProps> = ({
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
        type: "line",
        height: 300,
        series: [
            {
                name: name,
                data: data,
            },
        ],
        options: {
            ...chartsConfig,
            colors: colors,
            stroke: {
                lineCap: "round",
                curve: "smooth",
            },
            markers: {
                size: 5,
            },
            xaxis: {
                ...chartsConfig.xaxis,
                categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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

export default StatisticLineChart;
