import React from "react";
import "./StatusColor.css";

const StatusColor = ({ status }) => {
    const color =
        status == "danger" ? "red" : status == "inProgress" ? "blue" : "green";

    return (
        <div
            className="status-color"
            style={{
                "--color": color,
            }}
        >
            <p>{status}</p>
            <div className="status-circle"></div>
        </div>
    );
};

export default StatusColor;
