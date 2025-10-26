import React from "react";
import "./WelcomePage.css";
import puppy from "../Images/puppy.png";

function WelcomePage() {
    return (
        <div className="welcome-container">
            <h1 className="welcome-title">wellness<br />journal</h1>
            <img src={puppy} alt="cute dog" className="welcome-image" />
            <p className="welcome-subtitle">it's the small things that matter 🤍</p>
        </div>
    );
}

export default WelcomePage;