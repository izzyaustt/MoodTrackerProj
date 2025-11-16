import React from "react";
import { useNavigate } from "react-router-dom";
import "./WelcomePage.css";
import puppy from "../Images/puppy.png";

function WelcomePage() {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/login");
    };

    return (
        <div className="welcome-container">
            <h1 className="welcome-title">wellness<br />journal</h1>
            <img 
                src={puppy} 
                alt="cute dog" 
                className="welcome-image"
                onClick={handleGetStarted}
                style={{ cursor: "pointer" }}
            />
            <p className="welcome-subtitle">it's the small things that matter 🤍</p>
            <button
                className="button"
                onClick={handleGetStarted}
            >
                Get Started
            </button>
        </div>
    );
}

export default WelcomePage;