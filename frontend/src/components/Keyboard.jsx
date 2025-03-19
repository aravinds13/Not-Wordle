import React from "react";
import { useState, useEffect } from "react";
import "./Keyboard.css"; // Ensure styles are imported

const Keyboard = (props) => {
    const {onKeyPress, charStatus} = props;
    const [localStatus, setLocalStatus] = useState(charStatus);

    useEffect(() => {
        setLocalStatus(charStatus); // Update local state when reset occurs
    }, [charStatus]);

    const rows = [
        ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
        ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
        ["Enter", "Z", "X", "C", "V", "B", "N", "M", "⌫"]
    ];

    return (
        <div className="keyboard">
        {rows.map((row, rowIndex) => (
            <div className="keyboard-row" key={rowIndex}>
            {row.map((key) => (
                <button
                    key={key}
                    className={`key ${key === "Enter" || key === "⌫" ? "wide-key" : ""}`}
                    onClick={() => onKeyPress(key)}
                    style={{backgroundColor:localStatus[key]}}
                >
                    {key}
                </button>
            ))}
            </div>
        ))}
        </div>
    );
};

export default Keyboard;
