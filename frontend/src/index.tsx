import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import store from "./redux/store";
import "./style/global.css";
import katex from "katex";
import "katex/dist/katex.min.css";
window.katex = katex;

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
    <Provider store={store}>
        <App />
    </Provider>,
);
