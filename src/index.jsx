import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/styles.css";
import { SchoolInfoProvider } from "./contexts/SchoolInfoContext";


const root = document.querySelector("#root");
const mainRoot = ReactDOM.createRoot(root);

mainRoot.render(
    <SchoolInfoProvider>
        <App />
    </SchoolInfoProvider>
);