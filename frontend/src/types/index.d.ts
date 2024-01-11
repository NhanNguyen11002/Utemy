import HLS from "hls.js";
import { Chart } from "chart.js";
export {};

declare global {
    interface Window {
        hls: HLS;
        myBar: Chart;
        myLine: Chart;
        google: any;
    }
}
