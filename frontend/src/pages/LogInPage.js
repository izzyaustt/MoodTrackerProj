import React from "react";
import "./LogInPage.css";

import paper from "../Images/LogIn_Paper.png";

function LogInPage() {
    return (
        <div className="logIn">
            <h1>this journal belongs to:</h1>
            <div className="paperContainer">
                <img
                    src={paper}
                    alt="ripped texture paper"
                    className="paperInfo"
                />
                <div className="paperText">
                    <p>name______________</p>
                    <p>email______________</p>
                    <p>password___________</p>
                </div>
            </div>
        </div>

    );
}

export default LogInPage;

